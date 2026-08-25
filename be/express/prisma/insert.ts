import "dotenv/config";
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';
import * as crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==============================================================================
// CONFIGURATION
// Update these paths whenever you receive new data batches.
// ==============================================================================
const candidateDirs = [
  path.join(__dirname, 'seed_data'), // Docker: /app/prisma/seed_data
  path.resolve(__dirname, '../../../seed_data'), // Local dev: root/seed_data from be/express/prisma
  path.resolve(process.cwd(), '../../seed_data'), // Local dev: root/seed_data from be/express CWD
  path.resolve(process.cwd(), 'seed_data'), // Local dev: root/seed_data from root CWD
];
const DATA_DIR = candidateDirs.find(dir => fs.existsSync(dir)) || path.join(__dirname, 'seed_data');

const findFile = (keyword: string, extension: string) => {
  try {
    const files = fs.readdirSync(DATA_DIR);
    // Find file that includes keyword and extension. If multiple, prefer ones with 'Metrics'
    const matchedWithMetrics = files.find(f => f.toLowerCase().includes(keyword.toLowerCase()) && f.toLowerCase().includes('metrics') && f.endsWith(extension));
    if (matchedWithMetrics) return path.join(DATA_DIR, matchedWithMetrics);

    const matched = files.find(f => f.toLowerCase().includes(keyword.toLowerCase()) && f.endsWith(extension));
    return matched ? path.join(DATA_DIR, matched) : path.join(DATA_DIR, `NOT_FOUND_${keyword}${extension}`);
  } catch (e) {
    return path.join(DATA_DIR, `DIR_NOT_FOUND${extension}`);
  }
};

const CONFIG = {
  SQL_CLUSTERS_TAGS: path.join(DATA_DIR, 'seed_vocabulary.sql'),
  CSV_LECTURERS: findFile('Lecturers_Base', '.csv'),
  CSV_PUBLICATIONS: findFile('Publications_Base', '.csv'),
  CSV_PUB_LINKS: findFile('Link_Lecturer-Publications', '.csv'),
  CSV_CLUSTER_LINKS: findFile('Link_Lecturer-Clusters', '.csv'),
  CSV_TAG_LINKS: findFile('Link_Lecturer-Tags', '.csv'),
};
// ==============================================================================

import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DB_URL || process.env.DIRECT_URL || process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DB_URL, DIRECT_URL, or DATABASE_URL must be configured before seeding.");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// --- HELPER FUNCTIONS ---
const generateSlug = (text: string) => {
  if (!text) return `unknown-${crypto.randomBytes(4).toString('hex')}`;
  const base = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 50).replace(/(^-|-$)/g, '');
  return `${base}-${crypto.randomBytes(4).toString('hex')}`;
};

const normalizeStr = (str: string | undefined) => (str ? str.trim().toLowerCase() : '');

async function main() {
  console.log('🌱 Starting database seeding...');

  // ==============================================================================
  // STEP 1: INSERT CLUSTERS & TAGS (VIA SQL)
  // ==============================================================================
  console.log('➡️ Executing SQL for Clusters and Tags...');
  if (fs.existsSync(CONFIG.SQL_CLUSTERS_TAGS)) {
    const sql = fs.readFileSync(CONFIG.SQL_CLUSTERS_TAGS, 'utf8');
    await prisma.$executeRawUnsafe(sql);
    console.log('✅ Clusters and Tags inserted.');
  } else {
    console.warn('⚠️ SQL file not found, skipping cluster/tag generation.');
  }

  // ==============================================================================
  // STEP 2: UPSERT LECTURERS & METRICS
  // ==============================================================================
  console.log('➡️ Processing Lecturers...');
  const lecturersCsv = fs.readFileSync(CONFIG.CSV_LECTURERS, 'utf8');
  const lecturersRaw: any[] = parse(lecturersCsv, { columns: true, skip_empty_lines: true });

  const refToLecturerId = new Map<string, string>();
  const nameToLecturerId = new Map<string, string>();

  for (const row of lecturersRaw) {
    const finalSintaId = row.sinta_id?.trim() || `TMP-${crypto.createHash('md5').update(row.full_name || '').digest('hex').slice(0, 8)}`;
    const fallbackNip = row.sinta_id?.trim() || finalSintaId;
    const slug = generateSlug(row.full_name);

    const lecturer = await prisma.lecturer.upsert({
      where: { sinta_id: finalSintaId },
      update: {
        full_name: row.full_name,
        academic_title: row.academic_title || null,
        scopus_author_id: row.scopus_author_id || null,
        orcid_id: row.orcid_id || null,
        google_scholar_id: row.google_scholar_id || null,
        google_scholar_url: row.google_scholar_url || null,
        openalex_author_id: row.openalex_author_id || null,
        source_csv_row_ref: row.source_csv_row_ref || null,
        metrics: row.metric_h_index ? {
          upsert: {
            update: {
              h_index: parseInt(row.metric_h_index) || 0,
              total_citations: parseInt(row.metric_total_citations) || 0,
              source: row.metric_source || 'OPENALEX',
            },
            create: {
              h_index: parseInt(row.metric_h_index) || 0,
              total_citations: parseInt(row.metric_total_citations) || 0,
              source: row.metric_source || 'OPENALEX',
            }
          }
        } : undefined
      },
      create: {
        full_name: row.full_name,
        slug: slug,
        sinta_id: finalSintaId,
        nip_or_staff_id: fallbackNip,
        academic_title: row.academic_title || null,
        scopus_author_id: row.scopus_author_id || null,
        orcid_id: row.orcid_id || null,
        google_scholar_id: row.google_scholar_id || null,
        google_scholar_url: row.google_scholar_url || null,
        openalex_author_id: row.openalex_author_id || null,
        source_csv_row_ref: row.source_csv_row_ref || null,
        metrics: row.metric_h_index ? {
          create: {
            h_index: parseInt(row.metric_h_index) || 0,
            total_citations: parseInt(row.metric_total_citations) || 0,
            source: row.metric_source || 'OPENALEX',
          }
        } : undefined
      }
    });

    if (lecturer.source_csv_row_ref) {
      refToLecturerId.set(lecturer.source_csv_row_ref, lecturer.id);
    }
    nameToLecturerId.set(normalizeStr(lecturer.full_name), lecturer.id);
  }
  console.log(`✅ Upserted ${lecturersRaw.length} Lecturers.`);

  // ==============================================================================
  // STEP 3: UPSERT PUBLICATIONS
  // ==============================================================================
  console.log('➡️ Processing Publications...');
  const pubsCsv = fs.readFileSync(CONFIG.CSV_PUBLICATIONS, 'utf8');
  const pubsRaw: any[] = parse(pubsCsv, { columns: true, skip_empty_lines: true });
  const legacyPublicationIdToDoi = new Map<string, string>();
  let upsertedPublications = 0;

  for (const row of pubsRaw) {
    const doi = row.doi?.trim();
    if (!doi) {
      console.warn(`⚠️ Missing DOI for publication; skipping: ${row.title || row.id || '(untitled)'}`);
      continue;
    }

    let parsedExternalIds = null;
    try {
      if (row.external_ids) parsedExternalIds = JSON.parse(row.external_ids);
    } catch (e) {
      console.warn(`⚠️ Failed to parse JSON for publication ${doi}`);
    }

    await prisma.publication.upsert({
      where: { doi },
      update: {
        title: row.title,
        year: parseInt(row.year) || new Date().getFullYear(),
        publication_date: row.publication_date || null,
        authors_text: row.authors_text || null,
        venue: row.venue || null,
        publication_type: row.publication_type || null,
        url: row.url || null,
        citation_count: parseInt(row.citation_count) || 0,
        abstract: row.abstract || null,
        source: row.source || 'OPENALEX',
        external_ids: parsedExternalIds,
        verified_status: row.verified_status || 'NEEDS_REVIEW',
        fetch_batch_id: row.fetch_batch_id || null,
        deleted_at: null,
      },
      create: {
        doi,
        title: row.title,
        slug: generateSlug(row.title),
        year: parseInt(row.year) || new Date().getFullYear(),
        publication_date: row.publication_date || null,
        authors_text: row.authors_text || null,
        venue: row.venue || null,
        publication_type: row.publication_type || null,
        url: row.url || null,
        abstract: row.abstract || null,
        citation_count: parseInt(row.citation_count) || 0,
        source: row.source || 'OPENALEX',
        external_ids: parsedExternalIds,
        verified_status: row.verified_status || 'NEEDS_REVIEW',
        fetch_batch_id: row.fetch_batch_id || null,
      }
    });

    const legacyPublicationId = row.id?.trim();
    if (legacyPublicationId) {
      legacyPublicationIdToDoi.set(legacyPublicationId, doi);
    }
    legacyPublicationIdToDoi.set(doi, doi);
    upsertedPublications++;
  }
  console.log(`✅ Upserted ${upsertedPublications} Publications by DOI.`);

  // ==============================================================================
  // STEP 4: LINK LECTURERS TO PUBLICATIONS
  // ==============================================================================
  console.log('➡️ Linking Publications to Lecturers...');
  const pubLinksCsv = fs.readFileSync(CONFIG.CSV_PUB_LINKS, 'utf8');
  const pubLinks: any[] = parse(pubLinksCsv, { columns: true, skip_empty_lines: true });

  const pubLinksToInsert = [];
  for (const link of pubLinks) {
    const actualLecturerId = refToLecturerId.get(link.lecturer_row_ref);
    const directPublicationDoi = link.publication_doi?.trim() || link.doi?.trim();
    const legacyPublicationId = link.publication_id?.trim();
    const publicationDoi = directPublicationDoi ||
      (legacyPublicationId ? legacyPublicationIdToDoi.get(legacyPublicationId) : undefined);

    if (actualLecturerId && publicationDoi) {
      pubLinksToInsert.push({
        lecturer_id: actualLecturerId,
        publication_doi: publicationDoi
      });
    } else if (actualLecturerId) {
      console.warn(`⚠️ Could not resolve publication DOI for lecturer link: ${legacyPublicationId || '(missing publication reference)'}`);
    }
  }

  const pubLinkResult = await prisma.lecturerPublication.createMany({
    data: pubLinksToInsert,
    skipDuplicates: true
  });
  console.log(`✅ Created ${pubLinkResult.count} Publication Links.`);

  // ==============================================================================
  // STEP 5: LINK CLUSTERS & TAGS
  // ==============================================================================
  console.log('➡️ Linking Clusters and Tags...');

  const dbClusters = await prisma.researchCluster.findMany({ select: { id: true, slug: true } });
  const dbTags = await prisma.researchTag.findMany({ select: { id: true, slug: true } });

  const slugToClusterId = new Map(dbClusters.map(c => [c.slug, c.id]));
  const slugToTagId = new Map(dbTags.map(t => [t.slug, t.id]));

  // Process Primary Clusters
  const clusterLinksRaw: any[] = parse(fs.readFileSync(CONFIG.CSV_CLUSTER_LINKS, 'utf8'), { columns: true });
  let clusterUpdates = 0;

  for (const row of clusterLinksRaw) {
    const lecId = nameToLecturerId.get(normalizeStr(row.full_name));
    const clusterId = slugToClusterId.get(row.cluster_slug?.trim() || '');

    if (lecId && clusterId) {
      await prisma.lecturer.update({
        where: { id: lecId },
        data: { primary_research_cluster: { connect: { id: clusterId } } }
      });
      clusterUpdates++;
    }
  }
  console.log(`✅ Updated ${clusterUpdates} Primary Clusters.`);

  // Process Tags
  const tagLinksRaw: any[] = parse(fs.readFileSync(CONFIG.CSV_TAG_LINKS, 'utf8'), { columns: true });
  const tagsToInsert = [];

  for (const row of tagLinksRaw) {
    const lecId = nameToLecturerId.get(normalizeStr(row.full_name));
    const tagId = slugToTagId.get(row.tag_slug?.trim() || '');

    if (lecId && tagId) {
      tagsToInsert.push({ lecturer_id: lecId, tag_id: tagId });
    }
  }

  const tagLinkResult = await prisma.lecturerResearchTag.createMany({
    data: tagsToInsert,
    skipDuplicates: true
  });
  console.log(`✅ Linked ${tagLinkResult.count} Research Tags.`);

  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
