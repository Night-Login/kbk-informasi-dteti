# Backend Data Handoff Protocol

To ensure seamless, automated data ingestion into the database, please follow these formatting and naming rules for all future data drops.

## 1. File Format & Encoding Requirements
* **Format:** All data must be delivered as **CSV files**, with the exception of the static `seed_vocabulary.sql` file.
* **Encoding:** Must be **UTF-8**. (Failure to use UTF-8 will corrupt special characters in lecturer names and publication abstracts).
* **Null Values:** Empty cells in the CSV will be parsed as `NULL`. Do not use placeholder strings like `"N/A"`, `"-"`, or `"NULL"`.
* **JSON Columns:** If a CSV column contains JSON (e.g., `external_ids`), ensure the quotes are properly escaped according to standard CSV rules.

## 2. File Naming Convention
The backend ingestion script dynamically scans the data folder for specific prefixes. Files **must** follow this exact naming pattern:

**`{Prefix}{Source}_{YYYY-MM-DD}.csv`**

* **Prefix:** Must exactly match the expected targets (listed below), including the trailing underscore.
* **Source:** The origin of the data (e.g., `OpenAlex`, `Scopus`).
* **Date:** Must strictly be ISO 8601 format (`YYYY-MM-DD`) to guarantee correct chronological processing.

## 3. Required Data Deliverables

Please provide the following 6 files per update cycle:

### Base Data
1. `seed_vocabulary.sql`
   * **Description:** Raw SQL defining the static dictionaries for research clusters and tags. *(Note: Only needs to be updated if new clusters/tags are introduced).*
2. `Lecturers_Base_{Source}_{Date}.csv`
   * **Description:** Unified base profile data for lecturers (names, IDs, academic titles) **merged with** their fluctuating metrics (h-index, citations, etc.). 
3. `Publications_Base_{Source}_{Date}.csv`
   * **Description:** Core publication data (DOIs, titles, abstracts, year, citation count).

### Relational (Link) Data
*Because the database uses auto-generated UUIDs, we rely on link tables to map human-readable identifiers to database entities.*

4. `Link_Lecturer-Publications_{Source}_{Date}.csv`
   * **Description:** Maps a lecturer's original row reference (e.g., `dosen_source.csv:2`) to the target publication's ID. 
5. `Link_Lecturer-Clusters_{Source}_{Date}.csv`
   * **Description:** Maps a lecturer's `full_name` to their primary `cluster_slug`. (Updates the primary research cluster on the lecturer profile).
6. `Link_Lecturer-Tags_{Source}_{Date}.csv`
   * **Description:** Maps a lecturer's `full_name` to their specific `tag_slug`. (Populates the many-to-many tag relationships).

---
**Example of a valid data drop folder:**
* `seed_vocabulary.sql`
* `Lecturers_Base_OpenAlex_2026-08-01.csv`
* `Publications_Base_OpenAlex_2026-08-01.csv`
* `Link_Lecturer-Publications_OpenAlex_2026-08-01.csv`
* `Link_Lecturer-Clusters_OpenAlex_2026-08-01.csv`
* `Link_Lecturer-Tags_OpenAlex_2026-08-01.csv`