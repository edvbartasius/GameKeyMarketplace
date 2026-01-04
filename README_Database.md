# Database Structure Guide

## **game**
**Purpose:** Stores core game information.

**Columns:**
- `game_id` - Unique identifier
- `title` - Game name
- `release_date` - When the game was released
- `platforms` - Array of platform enums ([Steam, PSN, Xbox Live])
- `genres` - Array of genre enums ([Action, Adventure])
- `search_text` - Auto-generated searchable text for game search functionality

---

## **game_region**
**Purpose:** Links games to geographic regions and specifies which countries within that region can access the game.

**Columns:**
- `game_region_id` - Unique identifier
- `region` - Geographic region (Global, Europe, North America, Asia, LATAM, ROW)
- `allowed_countries` - Array of country IDs allowed in this region (null for Global region)
- `fk_game_id` - Foreign key to game table

---

## **game_key**
**Purpose:** Stores individual game keys and inventory.

**Columns:**
- `key_id` - Unique identifier
- `key_code` - The actual game key string 
- `status` - Current state (Available, Reserved, Sold, Redeemed, Invalid)
- `platform` - Which platform this key is for (Steam, PSN, etc.)
- `fk_game_region_id` - Foreign key to game_region (determines where this key can be sold)
- `price` - Key price
- `fk_supplier_id` - Foreign key to supplier table

---

## **discount**
**Purpose:** Links to individual game keys with percentage discounts and promotion dates. Allows different keys for the same game to have different promotions.

**Columns:**
- `id` - Unique identifier
- `start_date` - When the discount begins
- `end_date` - When the discount ends
- `discount_percentage` - Percentage off (1-100%)
- `fk_game_key_id` - Foreign key to game_key table

---
## **country**
**Purpose:** Reference table of all countries with their classification.

**Columns:**
- `id` - Unique identifier
- `name` - Country name
- `code` - Two-letter ISO country code ("LT", "US")
- `region` - Regional classification (Europe, North America, Asia, LATAM, ROW)
- `currency` - Three-letter currency code ("EUR", "USD")

---

## **supplier**
**Purpose:** Tracks suppliers who provide game keys.

**Columns:**
- `id` - UUID identifier
- `name` - Supplier company name
- `image_path` - URL to supplier logo/image

---

## **game_image**
**Purpose:** Stores URLs to game images

**Columns:**
- `image_id` - Unique identifier
- `image_url` - URL to the hosted image file
- `image_type` - Type enum (thumbnail or detail)
- `display_order` - Sort order for displaying images (default 0)
- `fk_game_id` - Foreign key to game table

---

## **Key Relationships**

### Relationship Details:
- **game → game_region**: One game has many regions (one-to-many)
- **game_region → game_key**: One region has many keys (one-to-many)
- **game_key → supplier**: Many keys can come from one supplier (many-to-one)
- **game_key → discount**: One key can have one active discount (one-to-one)
- **game → game_image**: One game has many images (one-to-many)
- **country ← game_region**: Countries are referenced in allowed_countries array

---

## **Custom ENUM Types**

### platform
Valid platforms for game keys:
- Steam
- EA APP
- Epic Games
- Origin
- Ubisoft Connect
- GOG
- Nintendo
- Xbox Live
- PSN

### region
Geographic region zones:
- Global
- Europe
- North America
- Asia
- LATAM (Latin America)
- ROW (Rest of World)

### genre
Game genres:
- Action
- Adventure
- RPG
- Strategy
- Simulation
- Sports
- Racing
- Fighting
- Puzzle
- Platformer
- Shooter
- Horror
- Survival
- Sandbox
- Battle Royale
- Roguelike
- Card Game
- Tower Defense
- Stealth
- Tactical
- Casual
- Indie
- Arcade

### key_status
States for game keys:
- Available - Ready for purchase
- Reserved - Reserved during checkout
- Sold - Purchased but not yet redeemed
- Redeemed - Activated by customer
- Invalid - Voided or problematic

### image_type
Image classification:
- thumbnail - For Game card listings and search results
- detail - For product detail pages

---

## **Key Features**

### Automated Search Indexing
- Trigger: `game_search_text_trigger` automatically updates `search_text` on INSERT/UPDATE
- Function: `update_game_search_text()` concatenates title, platforms, and genres
- Index: `game_search_trgm_idx` (GIN index with trigram operators) enables fuzzy search

---

## **Data Flow Example**

### Typical Workflow:
1. **Add Supplier** → Insert into `supplier` table
2. **Add Game** → Insert into `game` table (search_text auto-generated)
3. **Define Regions** → Insert into `game_region` with allowed countries
4. **Upload Images** → Insert into `game_image` with display order
5. **Add Inventory** → Insert keys into `game_key` (status: Available)
6. **Create Promotions** → Insert into `discount` with date ranges
7. **Customer Purchase** → Update key status: Available → Reserved → Sold → Redeemed

### Country ID Ranges by Region:
- Europe: 41-84 (44 countries)
- North America: 2-7 (6 countries)
- LATAM: 8-40 (33 countries)
- Asia: 85-133 (49 countries)
- ROW: 134-200 (67 countries)

---