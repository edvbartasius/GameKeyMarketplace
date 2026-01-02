const pool = require('../src/config/database');

class Game {
    // Get all games with placeholder data
    static async getAll() {
        // Placeholder data for testing
        return [
            { id: 1, title: 'The Witcher 3', platform: 'PC', price: 29.99, genre: 'RPG' },
            { id: 2, title: 'Cyberpunk 2077', platform: 'PC', price: 39.99, genre: 'Action' },
            { id: 3, title: 'Red Dead Redemption 2', platform: 'PC', price: 49.99, genre: 'Adventure' }
        ];
    }

    // Search games by query string
    static async search(searchQuery, limit = 10) {
        if (!searchQuery || searchQuery.trim().length === 0) {
            return [];
        }

        const search = searchQuery.toLowerCase().trim();

        const query = `
            WITH search_words AS (
                SELECT LOWER(unnest(string_to_array($1, ' '))) AS word
            )
            SELECT
                g.title,
                p.platform,
                gr.region,
                (COUNT(gk.key_code) > 0) AS has_keys,
                COALESCE(MIN(gk.price), 0.0) AS from_price,
                (COUNT(d.id) > 0) AS has_discount,
                COALESCE(MAX(d.discount_percentage), 0) AS discount_percentage,
                gi.image_url,
                (
                    COUNT(DISTINCT CASE WHEN LOWER(g.title) % sw.word THEN sw.word END) * 5.0 +
                    COUNT(DISTINCT CASE WHEN gr.region IS NOT NULL AND LOWER(gr.region::text) % sw.word THEN sw.word END) * 3.0 +
                    COUNT(DISTINCT CASE WHEN LOWER(p.platform::text) % sw.word THEN sw.word END) * 3.0 +
                    MAX(similarity(LOWER(g.title), $1)) * 4.0 +
                    MAX(similarity(g.search_text, $1)) * 3.0 +
                    MAX(similarity(LOWER(COALESCE(gr.region::text, '')), $1)) * 2.0 +
                    MAX(similarity(LOWER(p.platform::text), $1)) * 2.0
                ) as relevance
            FROM game g
            CROSS JOIN search_words sw
            CROSS JOIN UNNEST(g.platforms) AS p(platform)
            LEFT JOIN game_image gi ON g.game_id = gi.fk_game_id AND gi.image_type = 'thumbnail'::image_type
            LEFT JOIN game_region gr ON g.game_id = gr.fk_game_id
            LEFT JOIN game_key gk ON gr.game_region_id = gk.fk_game_region_id
            LEFT JOIN discount d ON gk.key_id = d.fk_game_key_id AND NOW() BETWEEN d.start_date AND d.end_date
            WHERE LOWER(g.title) % sw.word
                OR (gr.region IS NOT NULL AND LOWER(gr.region::text) % sw.word)
                OR LOWER(p.platform::text) % sw.word
                OR g.search_text % $1
            GROUP BY g.game_id, g.title, g.search_text, p.platform, gr.region, gi.image_url
            HAVING (
                COUNT(DISTINCT CASE WHEN LOWER(g.title) % sw.word THEN sw.word END) * 5.0 +
                COUNT(DISTINCT CASE WHEN gr.region IS NOT NULL AND LOWER(gr.region::text) % sw.word THEN sw.word END) * 3.0 +
                COUNT(DISTINCT CASE WHEN LOWER(p.platform::text) % sw.word THEN sw.word END) * 3.0 +
                MAX(similarity(LOWER(g.title), $1)) * 4.0 +
                MAX(similarity(g.search_text, $1)) * 3.0 +
                MAX(similarity(LOWER(COALESCE(gr.region::text, '')), $1)) * 2.0 +
                MAX(similarity(LOWER(p.platform::text), $1)) * 2.0
            ) > 3.0
            ORDER BY relevance DESC
            LIMIT $2;
        `;

        const result = await pool.query(query, [search, limit]);
        return result.rows;
    }
}

module.exports = Game;
