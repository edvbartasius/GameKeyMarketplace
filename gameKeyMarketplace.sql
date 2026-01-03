--
-- PostgreSQL database dump
--

\restrict OoiKzYW4GSnvAzS4I5BlnanFMbpUR2frGC49edHHYJ1amBOOQWsAqq85Eim3Sqp

-- Dumped from database version 18.1
-- Dumped by pg_dump version 18.1

-- Started on 2026-01-02 20:37:39

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 2 (class 3079 OID 16709)
-- Name: pg_trgm; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS pg_trgm WITH SCHEMA public;


--
-- TOC entry 5161 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION pg_trgm; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION pg_trgm IS 'text similarity measurement and index searching based on trigrams';


--
-- TOC entry 902 (class 1247 OID 16516)
-- Name: genre; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.genre AS ENUM (
    'Action',
    'Adventure',
    'RPG',
    'Strategy',
    'Simulation',
    'Sports',
    'Racing',
    'Fighting',
    'Puzzle',
    'Platformer',
    'Shooter',
    'Horror',
    'Survival',
    'Sandbox',
    'Battle Royale',
    'Roguelike',
    'Card Game',
    'Tower Defense',
    'Stealth',
    'Tactical',
    'Casual',
    'Indie',
    'Arcade'
);


ALTER TYPE public.genre OWNER TO postgres;

--
-- TOC entry 932 (class 1247 OID 16685)
-- Name: image_type; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.image_type AS ENUM (
    'thumbnail',
    'detail'
);


ALTER TYPE public.image_type OWNER TO postgres;

--
-- TOC entry 908 (class 1247 OID 16578)
-- Name: key_status; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.key_status AS ENUM (
    'Available',
    'Reserved',
    'Sold',
    'Redeemed',
    'Invalid'
);


ALTER TYPE public.key_status OWNER TO postgres;

--
-- TOC entry 899 (class 1247 OID 16495)
-- Name: platform; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.platform AS ENUM (
    'Steam',
    'EA APP',
    'Epic Games',
    'Origin',
    'Ubisoft Connect',
    'GOG',
    'Nintendo',
    'Xbox Live',
    'PSN'
);


ALTER TYPE public.platform OWNER TO postgres;

--
-- TOC entry 905 (class 1247 OID 16564)
-- Name: region; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.region AS ENUM (
    'Global',
    'Europe',
    'North America',
    'Asia',
    'LATAM',
    'ROW'
);


ALTER TYPE public.region OWNER TO postgres;

--
-- TOC entry 266 (class 1255 OID 16790)
-- Name: update_game_search_text(); Type: FUNCTION; Schema: public; Owner: postgres
--

CREATE FUNCTION public.update_game_search_text() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.search_text := LOWER(
        COALESCE(NEW.title, '') || ' ' ||
        COALESCE(array_to_string(NEW.platforms, ' '), '') || ' ' ||
        COALESCE(array_to_string(NEW.genres, ' '), '')
    );
    RETURN NEW;
END;
$$;


ALTER FUNCTION public.update_game_search_text() OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 225 (class 1259 OID 16606)
-- Name: country; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.country (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    code character(2) NOT NULL,
    region public.region NOT NULL,
    currency character(3) NOT NULL
);


ALTER TABLE public.country OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16605)
-- Name: country_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.country_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.country_id_seq OWNER TO postgres;

--
-- TOC entry 5162 (class 0 OID 0)
-- Dependencies: 224
-- Name: country_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.country_id_seq OWNED BY public.country.id;


--
-- TOC entry 228 (class 1259 OID 16636)
-- Name: discount; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.discount (
    id integer NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL,
    discount_percentage integer NOT NULL,
    fk_game_key_id integer NOT NULL
);


ALTER TABLE public.discount OWNER TO postgres;

--
-- TOC entry 227 (class 1259 OID 16635)
-- Name: discount_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.discount ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.discount_id_seq
    START WITH 100
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 220 (class 1259 OID 16490)
-- Name: game; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.game (
    title character varying(255) CONSTRAINT "Game_title_not_null" NOT NULL,
    release_date date,
    platforms public.platform[],
    game_id integer CONSTRAINT games_game_id_not_null NOT NULL,
    genres public.genre[],
    search_text text
);


ALTER TABLE public.game OWNER TO postgres;

--
-- TOC entry 231 (class 1259 OID 16678)
-- Name: game_image; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.game_image (
    image_id integer NOT NULL,
    image_url text NOT NULL,
    image_type public.image_type NOT NULL,
    display_order integer DEFAULT 0,
    fk_game_id integer NOT NULL
);


ALTER TABLE public.game_image OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 16677)
-- Name: game_image_image_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.game_image ALTER COLUMN image_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.game_image_image_id_seq
    START WITH 100
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 226 (class 1259 OID 16623)
-- Name: game_key; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.game_key (
    key_id integer NOT NULL,
    key_code character varying(255) NOT NULL,
    status public.key_status NOT NULL,
    platform public.platform NOT NULL,
    fk_game_region_id integer NOT NULL,
    price double precision,
    fk_supplier_id uuid NOT NULL
);


ALTER TABLE public.game_key OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 16703)
-- Name: game_key_key_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.game_key ALTER COLUMN key_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.game_key_key_id_seq
    START WITH 100
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 223 (class 1259 OID 16599)
-- Name: game_region; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.game_region (
    game_region_id integer CONSTRAINT game_regions_game_region_id_not_null NOT NULL,
    region public.region NOT NULL,
    allowed_countries integer[],
    fk_game_id integer NOT NULL
);


ALTER TABLE public.game_region OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16598)
-- Name: game_regions_game_region_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.game_region ALTER COLUMN game_region_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.game_regions_game_region_id_seq
    START WITH 100
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 221 (class 1259 OID 16589)
-- Name: games_game_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.game ALTER COLUMN game_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.games_game_id_seq
    START WITH 100
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 233 (class 1259 OID 16843)
-- Name: platform_keyword_mapping; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.platform_keyword_mapping (
    keyword text NOT NULL,
    platform_name text NOT NULL
);


ALTER TABLE public.platform_keyword_mapping OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 16852)
-- Name: region_keyword_mapping; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.region_keyword_mapping (
    keyword text NOT NULL,
    region_name text NOT NULL
);


ALTER TABLE public.region_keyword_mapping OWNER TO postgres;

--
-- TOC entry 229 (class 1259 OID 16662)
-- Name: supplier; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.supplier (
    id uuid NOT NULL,
    name character varying(100) NOT NULL,
    image_path text
);


ALTER TABLE public.supplier OWNER TO postgres;

--
-- TOC entry 4957 (class 2604 OID 16609)
-- Name: country id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.country ALTER COLUMN id SET DEFAULT nextval('public.country_id_seq'::regclass);


--
-- TOC entry 5146 (class 0 OID 16606)
-- Dependencies: 225
-- Data for Name: country; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.country (id, name, code, region, currency) FROM stdin;
2	United States	US	North America	USD
3	Canada	CA	North America	CAD
4	Mexico	MX	North America	MXN
5	Greenland	GL	North America	DKK
6	Bermuda	BM	North America	BMD
7	Saint Pierre and Miquelon	PM	North America	EUR
8	Brazil	BR	LATAM	BRL
9	Argentina	AR	LATAM	ARS
10	Chile	CL	LATAM	CLP
11	Colombia	CO	LATAM	COP
12	Peru	PE	LATAM	PEN
13	Venezuela	VE	LATAM	VES
14	Ecuador	EC	LATAM	USD
15	Bolivia	BO	LATAM	BOB
16	Paraguay	PY	LATAM	PYG
17	Uruguay	UY	LATAM	UYU
18	Guyana	GY	LATAM	GYD
19	Suriname	SR	LATAM	SRD
20	French Guiana	GF	LATAM	EUR
21	Guatemala	GT	LATAM	GTQ
22	Honduras	HN	LATAM	HNL
23	El Salvador	SV	LATAM	USD
24	Nicaragua	NI	LATAM	NIO
25	Costa Rica	CR	LATAM	CRC
26	Panama	PA	LATAM	PAB
27	Belize	BZ	LATAM	BZD
28	Cuba	CU	LATAM	CUP
29	Haiti	HT	LATAM	HTG
30	Dominican Republic	DO	LATAM	DOP
31	Jamaica	JM	LATAM	JMD
32	Trinidad and Tobago	TT	LATAM	TTD
33	Bahamas	BS	LATAM	BSD
34	Barbados	BB	LATAM	BBD
35	Saint Lucia	LC	LATAM	XCD
36	Grenada	GD	LATAM	XCD
37	Saint Vincent and the Grenadines	VC	LATAM	XCD
38	Antigua and Barbuda	AG	LATAM	XCD
39	Dominica	DM	LATAM	XCD
40	Saint Kitts and Nevis	KN	LATAM	XCD
41	United Kingdom	GB	Europe	GBP
42	Germany	DE	Europe	EUR
43	France	FR	Europe	EUR
44	Italy	IT	Europe	EUR
45	Spain	ES	Europe	EUR
46	Netherlands	NL	Europe	EUR
47	Belgium	BE	Europe	EUR
48	Austria	AT	Europe	EUR
49	Switzerland	CH	Europe	CHF
50	Poland	PL	Europe	PLN
51	Sweden	SE	Europe	SEK
52	Norway	NO	Europe	NOK
53	Denmark	DK	Europe	DKK
54	Finland	FI	Europe	EUR
55	Ireland	IE	Europe	EUR
56	Portugal	PT	Europe	EUR
57	Greece	GR	Europe	EUR
58	Czech Republic	CZ	Europe	CZK
59	Romania	RO	Europe	RON
60	Hungary	HU	Europe	HUF
61	Bulgaria	BG	Europe	BGN
62	Croatia	HR	Europe	EUR
63	Slovakia	SK	Europe	EUR
64	Slovenia	SI	Europe	EUR
65	Lithuania	LT	Europe	EUR
66	Latvia	LV	Europe	EUR
67	Estonia	EE	Europe	EUR
68	Luxembourg	LU	Europe	EUR
69	Malta	MT	Europe	EUR
70	Cyprus	CY	Europe	EUR
71	Iceland	IS	Europe	ISK
72	Albania	AL	Europe	ALL
73	Serbia	RS	Europe	RSD
74	Bosnia and Herzegovina	BA	Europe	BAM
75	North Macedonia	MK	Europe	MKD
76	Montenegro	ME	Europe	EUR
77	Moldova	MD	Europe	MDL
78	Ukraine	UA	Europe	UAH
79	Belarus	BY	Europe	BYN
80	Monaco	MC	Europe	EUR
81	Liechtenstein	LI	Europe	CHF
82	San Marino	SM	Europe	EUR
83	Vatican City	VA	Europe	EUR
84	Andorra	AD	Europe	EUR
85	China	CN	Asia	CNY
86	Japan	JP	Asia	JPY
87	India	IN	Asia	INR
88	South Korea	KR	Asia	KRW
89	Indonesia	ID	Asia	IDR
90	Thailand	TH	Asia	THB
91	Vietnam	VN	Asia	VND
92	Philippines	PH	Asia	PHP
93	Malaysia	MY	Asia	MYR
94	Singapore	SG	Asia	SGD
95	Hong Kong	HK	Asia	HKD
96	Taiwan	TW	Asia	TWD
97	Pakistan	PK	Asia	PKR
98	Bangladesh	BD	Asia	BDT
99	Myanmar	MM	Asia	MMK
100	Cambodia	KH	Asia	KHR
101	Laos	LA	Asia	LAK
102	Nepal	NP	Asia	NPR
103	Sri Lanka	LK	Asia	LKR
104	Maldives	MV	Asia	MVR
105	Bhutan	BT	Asia	BTN
106	Afghanistan	AF	Asia	AFN
107	Kazakhstan	KZ	Asia	KZT
108	Uzbekistan	UZ	Asia	UZS
109	Turkmenistan	TM	Asia	TMT
110	Kyrgyzstan	KG	Asia	KGS
111	Tajikistan	TJ	Asia	TJS
112	Mongolia	MN	Asia	MNT
113	Brunei	BN	Asia	BND
114	Timor-Leste	TL	Asia	USD
115	Macau	MO	Asia	MOP
116	Saudi Arabia	SA	Asia	SAR
117	United Arab Emirates	AE	Asia	AED
118	Israel	IL	Asia	ILS
119	Turkey	TR	Asia	TRY
120	Iran	IR	Asia	IRR
121	Iraq	IQ	Asia	IQD
122	Qatar	QA	Asia	QAR
123	Kuwait	KW	Asia	KWD
124	Bahrain	BH	Asia	BHD
125	Oman	OM	Asia	OMR
126	Jordan	JO	Asia	JOD
127	Lebanon	LB	Asia	LBP
128	Syria	SY	Asia	SYP
129	Yemen	YE	Asia	YER
130	Palestine	PS	Asia	ILS
131	Georgia	GE	Asia	GEL
132	Armenia	AM	Asia	AMD
133	Azerbaijan	AZ	Asia	AZN
134	Russia	RU	ROW	RUB
135	Australia	AU	ROW	AUD
136	New Zealand	NZ	ROW	NZD
137	South Africa	ZA	ROW	ZAR
138	Egypt	EG	ROW	EGP
139	Nigeria	NG	ROW	NGN
140	Kenya	KE	ROW	KES
141	Ethiopia	ET	ROW	ETB
142	Ghana	GH	ROW	GHS
143	Tanzania	TZ	ROW	TZS
144	Uganda	UG	ROW	UGX
145	Morocco	MA	ROW	MAD
146	Algeria	DZ	ROW	DZD
147	Tunisia	TN	ROW	TND
148	Libya	LY	ROW	LYD
149	Sudan	SD	ROW	SDG
150	South Sudan	SS	ROW	SSP
151	Senegal	SN	ROW	XOF
152	Ivory Coast	CI	ROW	XOF
153	Cameroon	CM	ROW	XAF
154	Angola	AO	ROW	AOA
155	Mozambique	MZ	ROW	MZN
156	Madagascar	MG	ROW	MGA
157	Zambia	ZM	ROW	ZMW
158	Zimbabwe	ZW	ROW	ZWL
159	Botswana	BW	ROW	BWP
160	Namibia	NA	ROW	NAD
161	Mauritius	MU	ROW	MUR
162	Rwanda	RW	ROW	RWF
163	Mali	ML	ROW	XOF
164	Burkina Faso	BF	ROW	XOF
165	Niger	NE	ROW	XOF
166	Chad	TD	ROW	XAF
167	Somalia	SO	ROW	SOS
168	Democratic Republic of the Congo	CD	ROW	CDF
169	Republic of the Congo	CG	ROW	XAF
170	Gabon	GA	ROW	XAF
171	Equatorial Guinea	GQ	ROW	XAF
172	Guinea	GN	ROW	GNF
173	Benin	BJ	ROW	XOF
174	Togo	TG	ROW	XOF
175	Sierra Leone	SL	ROW	SLL
176	Liberia	LR	ROW	LRD
177	Mauritania	MR	ROW	MRU
178	Eritrea	ER	ROW	ERN
179	Djibouti	DJ	ROW	DJF
180	Central African Republic	CF	ROW	XAF
181	Malawi	MW	ROW	MWK
182	Lesotho	LS	ROW	LSL
183	Eswatini	SZ	ROW	SZL
184	Burundi	BI	ROW	BIF
185	Comoros	KM	ROW	KMF
186	Seychelles	SC	ROW	SCR
187	Cape Verde	CV	ROW	CVE
188	São Tomé and Príncipe	ST	ROW	STN
189	Papua New Guinea	PG	ROW	PGK
190	Fiji	FJ	ROW	FJD
191	Solomon Islands	SB	ROW	SBD
192	Vanuatu	VU	ROW	VUV
193	Samoa	WS	ROW	WST
194	Tonga	TO	ROW	TOP
195	Kiribati	KI	ROW	AUD
196	Micronesia	FM	ROW	USD
197	Palau	PW	ROW	USD
198	Marshall Islands	MH	ROW	USD
199	Nauru	NR	ROW	AUD
200	Tuvalu	TV	ROW	AUD
\.


--
-- TOC entry 5149 (class 0 OID 16636)
-- Dependencies: 228
-- Data for Name: discount; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.discount (id, start_date, end_date, discount_percentage, fk_game_key_id) FROM stdin;
117	2026-01-02	2026-01-31	25	208
118	2026-01-02	2026-01-31	20	211
119	2026-01-02	2026-01-31	15	212
120	2026-01-02	2026-01-31	30	217
121	2026-01-02	2026-01-31	25	218
122	2026-01-02	2026-01-31	20	222
123	2026-01-02	2026-01-31	15	227
124	2026-01-02	2026-01-31	25	229
125	2026-01-02	2026-01-31	30	232
126	2026-01-02	2026-01-31	20	235
127	2026-01-02	2026-01-31	15	237
128	2026-01-02	2026-01-31	25	239
129	2026-01-02	2026-01-31	30	241
130	2026-01-02	2026-01-31	25	244
131	2026-01-02	2026-01-31	20	245
132	2026-01-02	2026-01-31	35	247
133	2026-01-02	2026-01-31	25	250
134	2026-01-02	2026-01-31	30	251
135	2026-01-02	2026-01-31	20	254
136	2026-01-02	2026-01-31	15	255
137	2026-01-02	2026-01-31	25	258
138	2026-01-02	2026-01-31	30	259
139	2026-01-02	2026-01-31	20	260
140	2026-01-02	2026-01-31	25	263
141	2026-01-02	2026-01-31	35	265
142	2026-01-02	2026-01-31	20	268
143	2026-01-02	2026-01-31	25	269
144	2026-01-02	2026-01-31	15	271
145	2026-01-02	2026-01-31	30	274
146	2026-01-02	2026-01-31	20	275
147	2026-01-02	2026-01-31	25	277
148	2026-01-02	2026-01-31	15	278
149	2026-01-02	2026-01-31	30	282
150	2026-01-02	2026-01-31	25	285
151	2026-01-02	2026-01-31	20	286
152	2026-01-02	2026-01-31	15	289
153	2026-01-02	2026-01-31	25	292
154	2026-01-02	2026-01-31	30	294
\.


--
-- TOC entry 5141 (class 0 OID 16490)
-- Dependencies: 220
-- Data for Name: game; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.game (title, release_date, platforms, game_id, genres, search_text) FROM stdin;
FIFA 23	2022-09-30	{Steam,"EA APP","Epic Games",Origin,"Xbox Live",PSN}	113	{Sports,Simulation}	fifa 23 steam ea app epic games origin xbox live psn sports simulation
Red Dead Redemption 2	2019-11-05	{Steam,"Epic Games","Xbox Live",PSN}	114	{Action,Adventure,Shooter}	red dead redemption 2 steam epic games xbox live psn action adventure shooter
Split Fiction	2024-03-07	{Steam,"Epic Games","EA APP","Xbox Live",PSN}	115	{Adventure,Action,Platformer}	split fiction steam epic games ea app xbox live psn adventure action platformer
\.


--
-- TOC entry 5152 (class 0 OID 16678)
-- Dependencies: 231
-- Data for Name: game_image; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.game_image (image_id, image_url, image_type, display_order, fk_game_id) FROM stdin;
222	games/fifa_2023_thumbnail.jpg	thumbnail	0	113
223	games/fifa_2023_detail_1.jpg	detail	1	113
224	games/fifa_2023_detail_2.jpg	detail	2	113
225	games/red_dead_redemption_2_thumbnail.jpg	thumbnail	0	114
226	games/red_dead_redemption_2_detail_1.jpg	detail	1	114
227	games/red_dead_redemption_2_detail_2.jpg	detail	2	114
228	games/split_fiction_thumbnail.jpg	thumbnail	0	115
229	games/split_fiction_detail_1.jpg	detail	1	115
230	games/split_fiction_detail_2.jpg	detail	2	115
\.


--
-- TOC entry 5147 (class 0 OID 16623)
-- Dependencies: 226
-- Data for Name: game_key; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.game_key (key_id, key_code, status, platform, fk_game_region_id, price, fk_supplier_id) FROM stdin;
208	FIFA23-STEAM-GLB-KEY001	Available	Steam	158	59.99	0c10c4ce-c39c-4b5b-a7f6-7eff472d6c6a
209	FIFA23-STEAM-GLB-KEY002	Available	Steam	158	59.99	0c10c4ce-c39c-4b5b-a7f6-7eff472d6c6a
210	FIFA23-STEAM-EUR-KEY001	Available	Steam	159	54.99	3a18e796-e70b-4607-9fd5-dce3984c94ca
211	FIFA23-STEAM-EUR-KEY002	Available	Steam	159	54.99	3a18e796-e70b-4607-9fd5-dce3984c94ca
212	FIFA23-STEAM-NA-KEY001	Available	Steam	160	59.99	98cd0f82-f1d2-4c29-a867-b1f784e40365
213	FIFA23-STEAM-NA-KEY002	Available	Steam	160	59.99	98cd0f82-f1d2-4c29-a867-b1f784e40365
214	FIFA23-STEAM-ASIA-KEY001	Available	Steam	161	49.99	1b325fb1-3721-4d93-be27-387801aeee0a
215	FIFA23-STEAM-ASIA-KEY002	Available	Steam	161	49.99	1b325fb1-3721-4d93-be27-387801aeee0a
216	FIFA23-EAAPP-GLB-KEY001	Available	EA APP	158	59.99	f68e2419-b0e2-49c7-8fe1-07256f9da944
217	FIFA23-EAAPP-GLB-KEY002	Available	EA APP	158	59.99	f68e2419-b0e2-49c7-8fe1-07256f9da944
218	FIFA23-EAAPP-EUR-KEY001	Available	EA APP	159	54.99	0c10c4ce-c39c-4b5b-a7f6-7eff472d6c6a
219	FIFA23-EAAPP-EUR-KEY002	Available	EA APP	159	54.99	0c10c4ce-c39c-4b5b-a7f6-7eff472d6c6a
220	FIFA23-EAAPP-NA-KEY001	Available	EA APP	160	59.99	3a18e796-e70b-4607-9fd5-dce3984c94ca
221	FIFA23-EAAPP-NA-KEY002	Available	EA APP	160	59.99	3a18e796-e70b-4607-9fd5-dce3984c94ca
222	FIFA23-EPIC-GLB-KEY001	Available	Epic Games	158	59.99	98cd0f82-f1d2-4c29-a867-b1f784e40365
223	FIFA23-EPIC-GLB-KEY002	Available	Epic Games	158	59.99	98cd0f82-f1d2-4c29-a867-b1f784e40365
224	FIFA23-EPIC-EUR-KEY001	Available	Epic Games	159	54.99	1b325fb1-3721-4d93-be27-387801aeee0a
225	FIFA23-EPIC-EUR-KEY002	Available	Epic Games	159	54.99	1b325fb1-3721-4d93-be27-387801aeee0a
226	FIFA23-ORIGIN-GLB-KEY001	Available	Origin	158	59.99	f68e2419-b0e2-49c7-8fe1-07256f9da944
227	FIFA23-ORIGIN-EUR-KEY001	Available	Origin	159	54.99	0c10c4ce-c39c-4b5b-a7f6-7eff472d6c6a
228	FIFA23-ORIGIN-NA-KEY001	Available	Origin	160	59.99	3a18e796-e70b-4607-9fd5-dce3984c94ca
229	FIFA23-ORIGIN-ASIA-KEY001	Available	Origin	161	49.99	98cd0f82-f1d2-4c29-a867-b1f784e40365
230	FIFA23-ORIGIN-LATAM-KEY001	Available	Origin	162	44.99	1b325fb1-3721-4d93-be27-387801aeee0a
231	FIFA23-ORIGIN-ROW-KEY001	Available	Origin	163	39.99	f68e2419-b0e2-49c7-8fe1-07256f9da944
232	FIFA23-XBOX-EUR-KEY001	Available	Xbox Live	159	54.99	0c10c4ce-c39c-4b5b-a7f6-7eff472d6c6a
233	FIFA23-XBOX-EUR-KEY002	Available	Xbox Live	159	54.99	0c10c4ce-c39c-4b5b-a7f6-7eff472d6c6a
234	FIFA23-XBOX-NA-KEY001	Available	Xbox Live	160	59.99	3a18e796-e70b-4607-9fd5-dce3984c94ca
235	FIFA23-XBOX-NA-KEY002	Available	Xbox Live	160	59.99	3a18e796-e70b-4607-9fd5-dce3984c94ca
236	FIFA23-XBOX-ASIA-KEY001	Available	Xbox Live	161	49.99	98cd0f82-f1d2-4c29-a867-b1f784e40365
237	FIFA23-PSN-GLB-KEY001	Available	PSN	158	59.99	1b325fb1-3721-4d93-be27-387801aeee0a
238	FIFA23-PSN-EUR-KEY001	Available	PSN	159	54.99	f68e2419-b0e2-49c7-8fe1-07256f9da944
239	FIFA23-PSN-EUR-KEY002	Available	PSN	159	54.99	f68e2419-b0e2-49c7-8fe1-07256f9da944
240	FIFA23-PSN-NA-KEY001	Available	PSN	160	59.99	0c10c4ce-c39c-4b5b-a7f6-7eff472d6c6a
241	RDR2-STEAM-GLB-KEY001	Available	Steam	164	49.99	3a18e796-e70b-4607-9fd5-dce3984c94ca
242	RDR2-STEAM-GLB-KEY002	Available	Steam	164	49.99	3a18e796-e70b-4607-9fd5-dce3984c94ca
243	RDR2-STEAM-EUR-KEY001	Available	Steam	165	44.99	98cd0f82-f1d2-4c29-a867-b1f784e40365
244	RDR2-STEAM-EUR-KEY002	Available	Steam	165	44.99	98cd0f82-f1d2-4c29-a867-b1f784e40365
245	RDR2-STEAM-NA-KEY001	Available	Steam	166	49.99	1b325fb1-3721-4d93-be27-387801aeee0a
246	RDR2-STEAM-NA-KEY002	Available	Steam	166	49.99	1b325fb1-3721-4d93-be27-387801aeee0a
247	RDR2-STEAM-ASIA-KEY001	Available	Steam	167	39.99	f68e2419-b0e2-49c7-8fe1-07256f9da944
248	RDR2-STEAM-ROW-KEY001	Available	Steam	169	34.99	0c10c4ce-c39c-4b5b-a7f6-7eff472d6c6a
249	RDR2-EPIC-GLB-KEY001	Available	Epic Games	164	49.99	3a18e796-e70b-4607-9fd5-dce3984c94ca
250	RDR2-EPIC-GLB-KEY002	Available	Epic Games	164	49.99	3a18e796-e70b-4607-9fd5-dce3984c94ca
251	RDR2-EPIC-EUR-KEY001	Available	Epic Games	165	44.99	98cd0f82-f1d2-4c29-a867-b1f784e40365
252	RDR2-EPIC-EUR-KEY002	Available	Epic Games	165	44.99	98cd0f82-f1d2-4c29-a867-b1f784e40365
253	RDR2-EPIC-NA-KEY001	Available	Epic Games	166	49.99	1b325fb1-3721-4d93-be27-387801aeee0a
254	RDR2-EPIC-NA-KEY002	Available	Epic Games	166	49.99	1b325fb1-3721-4d93-be27-387801aeee0a
255	RDR2-XBOX-EUR-KEY001	Available	Xbox Live	165	44.99	f68e2419-b0e2-49c7-8fe1-07256f9da944
256	RDR2-XBOX-EUR-KEY002	Available	Xbox Live	165	44.99	f68e2419-b0e2-49c7-8fe1-07256f9da944
257	RDR2-XBOX-NA-KEY001	Available	Xbox Live	166	49.99	0c10c4ce-c39c-4b5b-a7f6-7eff472d6c6a
258	RDR2-XBOX-NA-KEY002	Available	Xbox Live	166	49.99	0c10c4ce-c39c-4b5b-a7f6-7eff472d6c6a
259	RDR2-PSN-GLB-KEY001	Available	PSN	164	49.99	3a18e796-e70b-4607-9fd5-dce3984c94ca
260	RDR2-PSN-EUR-KEY001	Available	PSN	165	44.99	98cd0f82-f1d2-4c29-a867-b1f784e40365
261	RDR2-PSN-EUR-KEY002	Available	PSN	165	44.99	98cd0f82-f1d2-4c29-a867-b1f784e40365
262	RDR2-PSN-NA-KEY001	Available	PSN	166	49.99	1b325fb1-3721-4d93-be27-387801aeee0a
263	RDR2-PSN-NA-KEY002	Available	PSN	166	49.99	1b325fb1-3721-4d93-be27-387801aeee0a
264	RDR2-PSN-ASIA-KEY001	Available	PSN	167	39.99	f68e2419-b0e2-49c7-8fe1-07256f9da944
265	RDR2-PSN-LATAM-KEY001	Available	PSN	168	34.99	0c10c4ce-c39c-4b5b-a7f6-7eff472d6c6a
266	RDR2-PSN-ROW-KEY001	Available	PSN	169	34.99	3a18e796-e70b-4607-9fd5-dce3984c94ca
267	SPLITFIC-STEAM-GLB-KEY001	Available	Steam	170	39.99	98cd0f82-f1d2-4c29-a867-b1f784e40365
268	SPLITFIC-STEAM-GLB-KEY002	Available	Steam	170	39.99	98cd0f82-f1d2-4c29-a867-b1f784e40365
269	SPLITFIC-STEAM-EUR-KEY001	Available	Steam	171	34.99	1b325fb1-3721-4d93-be27-387801aeee0a
270	SPLITFIC-STEAM-EUR-KEY002	Available	Steam	171	34.99	1b325fb1-3721-4d93-be27-387801aeee0a
271	SPLITFIC-STEAM-NA-KEY001	Available	Steam	172	39.99	f68e2419-b0e2-49c7-8fe1-07256f9da944
272	SPLITFIC-STEAM-NA-KEY002	Available	Steam	172	39.99	f68e2419-b0e2-49c7-8fe1-07256f9da944
273	SPLITFIC-STEAM-ASIA-KEY001	Available	Steam	173	34.99	0c10c4ce-c39c-4b5b-a7f6-7eff472d6c6a
274	SPLITFIC-STEAM-ASIA-KEY002	Available	Steam	173	34.99	0c10c4ce-c39c-4b5b-a7f6-7eff472d6c6a
275	SPLITFIC-EPIC-GLB-KEY001	Available	Epic Games	170	39.99	3a18e796-e70b-4607-9fd5-dce3984c94ca
276	SPLITFIC-EPIC-EUR-KEY001	Available	Epic Games	171	34.99	98cd0f82-f1d2-4c29-a867-b1f784e40365
277	SPLITFIC-EPIC-EUR-KEY002	Available	Epic Games	171	34.99	98cd0f82-f1d2-4c29-a867-b1f784e40365
278	SPLITFIC-EPIC-NA-KEY001	Available	Epic Games	172	39.99	1b325fb1-3721-4d93-be27-387801aeee0a
279	SPLITFIC-EPIC-NA-KEY002	Available	Epic Games	172	39.99	1b325fb1-3721-4d93-be27-387801aeee0a
280	SPLITFIC-EPIC-ASIA-KEY001	Available	Epic Games	173	34.99	f68e2419-b0e2-49c7-8fe1-07256f9da944
281	SPLITFIC-EPIC-LATAM-KEY001	Available	Epic Games	174	29.99	0c10c4ce-c39c-4b5b-a7f6-7eff472d6c6a
282	SPLITFIC-EAAPP-GLB-KEY001	Available	EA APP	170	39.99	3a18e796-e70b-4607-9fd5-dce3984c94ca
283	SPLITFIC-EAAPP-GLB-KEY002	Available	EA APP	170	39.99	3a18e796-e70b-4607-9fd5-dce3984c94ca
284	SPLITFIC-EAAPP-EUR-KEY001	Available	EA APP	171	34.99	98cd0f82-f1d2-4c29-a867-b1f784e40365
285	SPLITFIC-EAAPP-EUR-KEY002	Available	EA APP	171	34.99	98cd0f82-f1d2-4c29-a867-b1f784e40365
286	SPLITFIC-XBOX-EUR-KEY001	Available	Xbox Live	171	34.99	1b325fb1-3721-4d93-be27-387801aeee0a
287	SPLITFIC-XBOX-EUR-KEY002	Available	Xbox Live	171	34.99	1b325fb1-3721-4d93-be27-387801aeee0a
288	SPLITFIC-XBOX-NA-KEY001	Available	Xbox Live	172	39.99	f68e2419-b0e2-49c7-8fe1-07256f9da944
289	SPLITFIC-XBOX-NA-KEY002	Available	Xbox Live	172	39.99	f68e2419-b0e2-49c7-8fe1-07256f9da944
290	SPLITFIC-XBOX-ASIA-KEY001	Available	Xbox Live	173	34.99	0c10c4ce-c39c-4b5b-a7f6-7eff472d6c6a
291	SPLITFIC-PSN-GLB-KEY001	Available	PSN	170	39.99	3a18e796-e70b-4607-9fd5-dce3984c94ca
292	SPLITFIC-PSN-EUR-KEY001	Available	PSN	171	34.99	98cd0f82-f1d2-4c29-a867-b1f784e40365
293	SPLITFIC-PSN-EUR-KEY002	Available	PSN	171	34.99	98cd0f82-f1d2-4c29-a867-b1f784e40365
294	SPLITFIC-PSN-NA-KEY001	Available	PSN	172	39.99	1b325fb1-3721-4d93-be27-387801aeee0a
295	SPLITFIC-PSN-NA-KEY002	Available	PSN	172	39.99	1b325fb1-3721-4d93-be27-387801aeee0a
296	SPLITFIC-PSN-LATAM-KEY001	Available	PSN	174	29.99	f68e2419-b0e2-49c7-8fe1-07256f9da944
\.


--
-- TOC entry 5144 (class 0 OID 16599)
-- Dependencies: 223
-- Data for Name: game_region; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.game_region (game_region_id, region, allowed_countries, fk_game_id) FROM stdin;
158	Global	\N	113
159	Europe	{41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84}	113
160	North America	{2,3,4,5,6,7}	113
161	Asia	{85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133}	113
162	LATAM	{8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40}	113
163	ROW	{134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200}	113
164	Global	\N	114
165	Europe	{41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84}	114
166	North America	{2,3,4,5,6,7}	114
167	Asia	{85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133}	114
168	LATAM	{8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40}	114
169	ROW	{134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200}	114
170	Global	\N	115
171	Europe	{41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60,61,62,63,64,65,66,67,68,69,70,71,72,73,74,75,76,77,78,79,80,81,82,83,84}	115
172	North America	{2,3,4,5,6,7}	115
173	Asia	{85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103,104,105,106,107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125,126,127,128,129,130,131,132,133}	115
174	LATAM	{8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40}	115
175	ROW	{134,135,136,137,138,139,140,141,142,143,144,145,146,147,148,149,150,151,152,153,154,155,156,157,158,159,160,161,162,163,164,165,166,167,168,169,170,171,172,173,174,175,176,177,178,179,180,181,182,183,184,185,186,187,188,189,190,191,192,193,194,195,196,197,198,199,200}	115
\.


--
-- TOC entry 5154 (class 0 OID 16843)
-- Dependencies: 233
-- Data for Name: platform_keyword_mapping; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.platform_keyword_mapping (keyword, platform_name) FROM stdin;
steam	Steam
epic	Epic Games
gog	GOG
origin	Origin
ea	EA App
app	EA App
uplay	Ubisoft Connect
ubisoft	Ubisoft Connect
xbox	Xbox Live
xbl	Xbox Live
live	Xbox Live
playstation	PSN
psn	PSN
ps	PSN
ps4	PSN
ps5	PSN
\.


--
-- TOC entry 5155 (class 0 OID 16852)
-- Dependencies: 234
-- Data for Name: region_keyword_mapping; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.region_keyword_mapping (keyword, region_name) FROM stdin;
global	Global
europe	Europe
eu	Europe
north	North America
america	North America
na	North America
asia	Asia
row	ROW
latam	LATAM
\.


--
-- TOC entry 5150 (class 0 OID 16662)
-- Dependencies: 229
-- Data for Name: supplier; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.supplier (id, name, image_path) FROM stdin;
0c10c4ce-c39c-4b5b-a7f6-7eff472d6c6a	GameKeys Direct	https://cdn.example.com/suppliers/gamekeys-direct.png
3a18e796-e70b-4607-9fd5-dce3984c94ca	Digital Distribution Inc	https://cdn.example.com/suppliers/ddi.png
98cd0f82-f1d2-4c29-a867-b1f784e40365	KeyVault Pro	https://cdn.example.com/suppliers/keyvault.png
1b325fb1-3721-4d93-be27-387801aeee0a	Global Game Supply	https://cdn.example.com/suppliers/ggs.png
f68e2419-b0e2-49c7-8fe1-07256f9da944	Steam Keys Wholesale	https://cdn.example.com/suppliers/skw.png
\.


--
-- TOC entry 5163 (class 0 OID 0)
-- Dependencies: 224
-- Name: country_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.country_id_seq', 201, true);


--
-- TOC entry 5164 (class 0 OID 0)
-- Dependencies: 227
-- Name: discount_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.discount_id_seq', 154, true);


--
-- TOC entry 5165 (class 0 OID 0)
-- Dependencies: 230
-- Name: game_image_image_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.game_image_image_id_seq', 230, true);


--
-- TOC entry 5166 (class 0 OID 0)
-- Dependencies: 232
-- Name: game_key_key_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.game_key_key_id_seq', 296, true);


--
-- TOC entry 5167 (class 0 OID 0)
-- Dependencies: 222
-- Name: game_regions_game_region_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.game_regions_game_region_id_seq', 175, true);


--
-- TOC entry 5168 (class 0 OID 0)
-- Dependencies: 221
-- Name: games_game_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.games_game_id_seq', 115, true);


--
-- TOC entry 4960 (class 2606 OID 16701)
-- Name: discount chk_discount_dates; Type: CHECK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE public.discount
    ADD CONSTRAINT chk_discount_dates CHECK ((end_date > start_date)) NOT VALID;


--
-- TOC entry 5169 (class 0 OID 0)
-- Dependencies: 4960
-- Name: CONSTRAINT chk_discount_dates ON discount; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON CONSTRAINT chk_discount_dates ON public.discount IS 'End date is after start date';


--
-- TOC entry 4961 (class 2606 OID 16700)
-- Name: discount chk_percentage; Type: CHECK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE public.discount
    ADD CONSTRAINT chk_percentage CHECK (((discount_percentage > 0) AND (discount_percentage <= 100))) NOT VALID;


--
-- TOC entry 4959 (class 2606 OID 16702)
-- Name: game_key chk_price_positive; Type: CHECK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE public.game_key
    ADD CONSTRAINT chk_price_positive CHECK ((price > (0)::double precision)) NOT VALID;


--
-- TOC entry 4968 (class 2606 OID 16620)
-- Name: country country_code_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.country
    ADD CONSTRAINT country_code_key UNIQUE (code);


--
-- TOC entry 4970 (class 2606 OID 16618)
-- Name: country country_name_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.country
    ADD CONSTRAINT country_name_key UNIQUE (name);


--
-- TOC entry 4972 (class 2606 OID 16616)
-- Name: country country_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.country
    ADD CONSTRAINT country_pkey PRIMARY KEY (id);


--
-- TOC entry 4977 (class 2606 OID 16641)
-- Name: discount discount_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.discount
    ADD CONSTRAINT discount_pkey PRIMARY KEY (id);


--
-- TOC entry 4981 (class 2606 OID 16683)
-- Name: game_image game_image_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.game_image
    ADD CONSTRAINT game_image_pkey PRIMARY KEY (image_id);


--
-- TOC entry 4975 (class 2606 OID 16634)
-- Name: game_key game_key_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.game_key
    ADD CONSTRAINT game_key_pkey PRIMARY KEY (key_id);


--
-- TOC entry 4966 (class 2606 OID 16604)
-- Name: game_region game_regions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.game_region
    ADD CONSTRAINT game_regions_pkey PRIMARY KEY (game_region_id);


--
-- TOC entry 4964 (class 2606 OID 16597)
-- Name: game games_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.game
    ADD CONSTRAINT games_pkey PRIMARY KEY (game_id);


--
-- TOC entry 4984 (class 2606 OID 16851)
-- Name: platform_keyword_mapping platform_keyword_mapping_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.platform_keyword_mapping
    ADD CONSTRAINT platform_keyword_mapping_pkey PRIMARY KEY (keyword);


--
-- TOC entry 4987 (class 2606 OID 16860)
-- Name: region_keyword_mapping region_keyword_mapping_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.region_keyword_mapping
    ADD CONSTRAINT region_keyword_mapping_pkey PRIMARY KEY (keyword);


--
-- TOC entry 4979 (class 2606 OID 16670)
-- Name: supplier supplier_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.supplier
    ADD CONSTRAINT supplier_pkey PRIMARY KEY (id);


--
-- TOC entry 4962 (class 1259 OID 16792)
-- Name: game_search_trgm_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX game_search_trgm_idx ON public.game USING gin (search_text public.gin_trgm_ops);


--
-- TOC entry 4973 (class 1259 OID 16621)
-- Name: idx_country_code; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_country_code ON public.country USING btree (code);


--
-- TOC entry 4982 (class 1259 OID 16861)
-- Name: idx_platform_keyword; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_platform_keyword ON public.platform_keyword_mapping USING btree (keyword);


--
-- TOC entry 4985 (class 1259 OID 16862)
-- Name: idx_region_keyword; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_region_keyword ON public.region_keyword_mapping USING btree (keyword);


--
-- TOC entry 4993 (class 2620 OID 16791)
-- Name: game game_search_text_trigger; Type: TRIGGER; Schema: public; Owner: postgres
--

CREATE TRIGGER game_search_text_trigger BEFORE INSERT OR UPDATE ON public.game FOR EACH ROW EXECUTE FUNCTION public.update_game_search_text();


--
-- TOC entry 4991 (class 2606 OID 16651)
-- Name: discount fk_game_key; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.discount
    ADD CONSTRAINT fk_game_key FOREIGN KEY (fk_game_key_id) REFERENCES public.game_key(key_id) NOT VALID;


--
-- TOC entry 4992 (class 2606 OID 16695)
-- Name: game_image game_image_fk_game_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.game_image
    ADD CONSTRAINT game_image_fk_game_id_fkey FOREIGN KEY (fk_game_id) REFERENCES public.game(game_id) NOT VALID;


--
-- TOC entry 4989 (class 2606 OID 16642)
-- Name: game_key game_key_fk_game_region_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.game_key
    ADD CONSTRAINT game_key_fk_game_region_id_fkey FOREIGN KEY (fk_game_region_id) REFERENCES public.game_region(game_region_id) NOT VALID;


--
-- TOC entry 4990 (class 2606 OID 16672)
-- Name: game_key game_key_fk_supplier_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.game_key
    ADD CONSTRAINT game_key_fk_supplier_id_fkey FOREIGN KEY (fk_supplier_id) REFERENCES public.supplier(id) NOT VALID;


--
-- TOC entry 4988 (class 2606 OID 16657)
-- Name: game_region game_region_fk_game_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.game_region
    ADD CONSTRAINT game_region_fk_game_id_fkey FOREIGN KEY (fk_game_id) REFERENCES public.game(game_id) NOT VALID;


-- Completed on 2026-01-02 20:37:39

--
-- PostgreSQL database dump complete
--

\unrestrict OoiKzYW4GSnvAzS4I5BlnanFMbpUR2frGC49edHHYJ1amBOOQWsAqq85Eim3Sqp

