const pool = require('../src/config/database');

class Game {
    // Get all games
    static async getAll() {
        const query = `
        SELECT
            g.game_id,
            g.title,
            p.platform,
            gr.region,
            (COUNT(gk.key_code) > 0) AS has_keys,
            COALESCE(MIN(gk.price), 0.0) AS from_price,
            (COUNT(d.id) > 0) AS has_discount,
            COALESCE(MAX(d.discount_percentage), 0) AS discount_percentage,
            c.allowed_country_codes,
            gi.image_url
        FROM game g
        CROSS JOIN UNNEST(g.platforms) AS p(platform)
        LEFT JOIN game_image gi ON g.game_id = gi.fk_game_id AND gi.image_type = 'thumbnail'::image_type
        LEFT JOIN game_region gr ON g.game_id = gr.fk_game_id
        LEFT JOIN game_key gk ON gr.game_region_id = gk.fk_game_region_id
        LEFT JOIN discount d ON gk.key_id = d.fk_game_key_id AND NOW() BETWEEN d.start_date AND d.end_date
        LEFT JOIN LATERAL (
            SELECT array_agg(c.code ORDER BY c.code) AS allowed_country_codes
            FROM country c
            WHERE c.id = ANY (gr.allowed_countries)
        ) c ON TRUE
        GROUP BY g.game_id, g.title, g.search_text, p.platform, gr.region, gi.image_url, c.allowed_country_codes
        ORDER BY random()
        LIMIT 50;
        `;

        const result = await pool.query(query);
        return result.rows;
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
                g.game_id,
                g.title,
                p.platform,
                gr.region,
                (COUNT(gk.key_code) > 0) AS has_keys,
                COALESCE(MIN(gk.price), 0.0) AS from_price,
                (COUNT(d.id) > 0) AS has_discount,
                COALESCE(MAX(d.discount_percentage), 0) AS discount_percentage,
                gi.image_url,
                (
                    COUNT(DISTINCT CASE WHEN LOWER(g.title) LIKE '%' || sw.word || '%' THEN sw.word END) * 10.0 +
                    COUNT(DISTINCT CASE WHEN LOWER(g.title) % sw.word THEN sw.word END) * 5.0 +
                    MAX(similarity(LOWER(g.title), $1)) * 8.0 +
                    MAX(similarity(g.search_text, $1)) * 6.0 +
                    COUNT(DISTINCT CASE WHEN gr.region IS NOT NULL AND LOWER(gr.region::text) % sw.word THEN sw.word END) * 2.0 +
                    COUNT(DISTINCT CASE WHEN LOWER(p.platform::text) % sw.word THEN sw.word END) * 2.0 +
                    MAX(similarity(LOWER(COALESCE(gr.region::text, '')), $1)) * 1.0 +
                    MAX(similarity(LOWER(p.platform::text), $1)) * 1.0
                ) as relevance
            FROM game g
            CROSS JOIN search_words sw
            CROSS JOIN UNNEST(g.platforms) AS p(platform)
            LEFT JOIN game_image gi ON g.game_id = gi.fk_game_id AND gi.image_type = 'thumbnail'::image_type
            LEFT JOIN game_region gr ON g.game_id = gr.fk_game_id
            LEFT JOIN game_key gk ON gr.game_region_id = gk.fk_game_region_id
            LEFT JOIN discount d ON gk.key_id = d.fk_game_key_id AND NOW() BETWEEN d.start_date AND d.end_date
            WHERE (
                LOWER(g.title) LIKE '%' || sw.word || '%'
                OR LOWER(g.title) % sw.word
                OR (gr.region IS NOT NULL AND LOWER(gr.region::text) % sw.word)
                OR LOWER(p.platform::text) % sw.word
                OR g.search_text % $1
                OR similarity(LOWER(g.title), $1) > 0.1
            )
            AND (
                NOT EXISTS (SELECT 1 FROM search_words WHERE word IN ('steam', 'epic', 'gog', 'origin', 'uplay', 'xbox', 'playstation', 'ps4', 'ps5', 'switch', 'nintendo'))
                OR p.platform::text ILIKE ANY(SELECT '%' || word || '%' FROM search_words WHERE word IN ('steam', 'epic', 'gog', 'origin', 'uplay', 'xbox', 'playstation', 'ps4', 'ps5', 'switch', 'nintendo'))
            )
            AND (
                NOT EXISTS (SELECT 1 FROM search_words WHERE word IN ('global', 'europe', 'north america', 'asia', 'na', 'eu'))
                OR gr.region::text ILIKE ANY(SELECT '%' || word || '%' FROM search_words WHERE word IN ('global', 'europe', 'north america', 'asia', 'na', 'eu'))
            )
            GROUP BY g.game_id, g.title, g.search_text, p.platform, gr.region, gi.image_url
            HAVING (
                COUNT(DISTINCT CASE WHEN LOWER(g.title) LIKE '%' || sw.word || '%' THEN sw.word END) * 10.0 +
                COUNT(DISTINCT CASE WHEN LOWER(g.title) % sw.word THEN sw.word END) * 5.0 +
                MAX(similarity(LOWER(g.title), $1)) * 8.0 +
                MAX(similarity(g.search_text, $1)) * 6.0 +
                COUNT(DISTINCT CASE WHEN gr.region IS NOT NULL AND LOWER(gr.region::text) % sw.word THEN sw.word END) * 2.0 +
                COUNT(DISTINCT CASE WHEN LOWER(p.platform::text) % sw.word THEN sw.word END) * 2.0 +
                MAX(similarity(LOWER(COALESCE(gr.region::text, '')), $1)) * 1.0 +
                MAX(similarity(LOWER(p.platform::text), $1)) * 1.0
            ) > 5.0
            ORDER BY
                relevance DESC,
                CASE
                    WHEN gr.region = 'Global' THEN 1
                    WHEN gr.region = 'Europe' THEN 2
                    WHEN gr.region = 'North America' THEN 3
                    ELSE 4
                END

            LIMIT $2;
        `;

        const result = await pool.query(query, [search, limit]);
        return result.rows;
    }
}

module.exports = Game;
