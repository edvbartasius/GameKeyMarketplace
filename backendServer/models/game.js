const pool = require('../src/config/database');

class Game {
    // Get all games
    static async getAll(userCountryCode = null) {
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
            gi.image_url,
            CASE
                WHEN $1::text IS NULL THEN TRUE
                WHEN gr.allowed_countries IS NULL OR array_length(gr.allowed_countries, 1) IS NULL THEN TRUE
                ELSE EXISTS (
                    SELECT 1 FROM country c
                    WHERE c.id = ANY(gr.allowed_countries)
                    AND c.code = $1::text
                )
            END AS region_available
        FROM game g
        CROSS JOIN UNNEST(g.platforms) AS p(platform)
        LEFT JOIN game_image gi ON g.game_id = gi.fk_game_id AND gi.image_type = 'thumbnail'::image_type
        LEFT JOIN game_region gr ON g.game_id = gr.fk_game_id
        LEFT JOIN game_key gk ON gr.game_region_id = gk.fk_game_region_id
        LEFT JOIN discount d ON gk.key_id = d.fk_game_key_id AND NOW() BETWEEN d.start_date AND d.end_date
        GROUP BY g.game_id, g.title, g.search_text, p.platform, gr.region, gr.allowed_countries, gi.image_url
        ORDER BY (COUNT(gk.key_code) > 0) DESC, random()
        LIMIT 100;
        `;

        const result = await pool.query(query, [userCountryCode]);
        return result.rows;
    }

    // Search games by query string
    static async search(searchQuery, limit = 10, userCountryCode = null) {
        if (!searchQuery || searchQuery.trim().length === 0) {
            return [];
        }

        const search = searchQuery.toLowerCase().trim();

        const query = `
            WITH search_words AS (
                SELECT LOWER(unnest(string_to_array($1, ' '))) AS word
            ),
            title_words AS (
                SELECT word FROM search_words
                WHERE word NOT IN (
                    SELECT keyword FROM platform_keyword_mapping
                    UNION
                    SELECT keyword FROM region_keyword_mapping
                )
            ),
            platform_filters AS (
                SELECT DISTINCT LOWER(pk.platform_name) AS platform_name
                FROM platform_keyword_mapping pk
                CROSS JOIN search_words sw
                WHERE pk.keyword = sw.word
                   OR pk.keyword LIKE '%' || sw.word || '%'
                   OR pk.keyword % sw.word
                   OR similarity(pk.keyword, sw.word) > 0.3
            ),
            region_filters AS (
                SELECT DISTINCT rkm.region_name
                FROM region_keyword_mapping rkm
                CROSS JOIN search_words sw
                WHERE rkm.keyword = sw.word
                   OR rkm.keyword LIKE '%' || sw.word || '%'
                   OR rkm.keyword % sw.word
                   OR similarity(rkm.keyword, sw.word) > 0.3
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
                CASE
                    WHEN $3::text IS NULL THEN TRUE
                    WHEN gr.allowed_countries IS NULL THEN TRUE
                    ELSE $3::text = ANY(SELECT code FROM country WHERE id = ANY(gr.allowed_countries))
                END AS region_available,
                (
                    COALESCE(
                        SUM(CASE WHEN LOWER(g.title) LIKE '%' || tw.word || '%' THEN 10 ELSE 0 END),
                        0
                    ) +
                    COALESCE(
                        SUM(CASE WHEN LOWER(g.title) % tw.word THEN 5 ELSE 0 END),
                        0
                    ) +
                    similarity(LOWER(g.title), $1) * 8.0 +
                    similarity(g.search_text, $1) * 6.0
                ) AS relevance
            FROM game g
            LEFT JOIN title_words tw ON TRUE
            CROSS JOIN UNNEST(g.platforms) AS p(platform)
            LEFT JOIN game_image gi ON g.game_id = gi.fk_game_id AND gi.image_type = 'thumbnail'::image_type
            LEFT JOIN game_region gr ON g.game_id = gr.fk_game_id
            LEFT JOIN game_key gk ON gr.game_region_id = gk.fk_game_region_id
            LEFT JOIN discount d ON gk.key_id = d.fk_game_key_id AND NOW() BETWEEN d.start_date AND d.end_date
            WHERE (
                NOT EXISTS (SELECT 1 FROM title_words)
                OR LOWER(g.title) LIKE '%' || tw.word || '%'
                OR LOWER(g.title) % tw.word
                OR g.search_text % $1
                OR similarity(LOWER(g.title), $1) > 0.1
            )
            AND (NOT EXISTS (SELECT 1 FROM platform_filters) OR LOWER(p.platform::text) IN (SELECT platform_name FROM platform_filters))
            AND (NOT EXISTS (SELECT 1 FROM region_filters) OR gr.region::text IN (SELECT region_name FROM region_filters))
            GROUP BY g.game_id, g.title, g.search_text, p.platform, gr.region, gr.allowed_countries, gi.image_url
            HAVING (
                CASE
                    WHEN EXISTS(SELECT 1 FROM title_words) THEN
                        (
                            COALESCE(SUM(CASE WHEN LOWER(g.title) LIKE '%' || tw.word || '%' THEN 10 ELSE 0 END), 0) +
                            COALESCE(SUM(CASE WHEN LOWER(g.title) % tw.word THEN 5 ELSE 0 END), 0) +
                            similarity(LOWER(g.title), $1) * 8.0 +
                            similarity(g.search_text, $1) * 6.0
                        ) > 5.0
                    ELSE TRUE
                END
            )
            ORDER BY
                CASE
                    WHEN $3::text IS NOT NULL AND $3::text = ANY(SELECT code FROM country WHERE id = ANY(gr.allowed_countries)) THEN 1
                    WHEN gr.region = 'Global' THEN 2
                    ELSE 3
                END,
                relevance DESC
            LIMIT $2;
        `;

        const result = await pool.query(query, [search, limit, userCountryCode]);
        return result.rows;
    }
}

module.exports = Game;
