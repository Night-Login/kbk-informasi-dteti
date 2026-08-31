import prisma from "../prisma/client.js";

export interface UniversalSearchOptions {
  q: string;
  limit?: number;
  type?: "all" | "lecturers" | "tags" | "publications" | "projects" | "content";
}

export interface UniversalSearchResults {
  lecturers: {
    id: string;
    slug: string;
    full_name: string;
    academic_title: string | null;
    photo_url: string | null;
    supervision_status: string | null;
    primary_cluster: string | null;
    tags: string[];
  }[];
  research_tags: {
    id: string;
    slug: string;
    name: string;
    cluster_name: string | null;
    cluster_slug: string | null;
  }[];
  publications: {
    id: string;
    slug: string;
    title: string;
    year: number;
    authors_text: string | null;
    venue: string | null;
    doi: string | null;
  }[];
  projects: {
    id: string;
    slug: string;
    title: string;
    status: string;
    lead_lecturer: string | null;
    start_year: number | null;
    end_year: number | null;
  }[];
  content: {
    id: string;
    slug: string;
    type: "NEWS" | "EVENT";
    title: string;
    date: Date;
    meta: string | null;
  }[];
  total_matches: number;
}

export class SearchService {
  /**
   * Universal search across all entities concurrently
   */
  async searchUniversal(
    options: UniversalSearchOptions,
  ): Promise<UniversalSearchResults> {
    const query = options.q.trim();
    const limit = Math.min(Math.max(options.limit || 5, 1), 20);
    const type = options.type || "all";

    if (!query) {
      return {
        lecturers: [],
        research_tags: [],
        publications: [],
        projects: [],
        content: [],
        total_matches: 0,
      };
    }

    const shouldFetch = (category: string) =>
      type === "all" || type === category;

    // 1. Search Lecturers
    const lecturersPromise = shouldFetch("lecturers")
      ? prisma.lecturer.findMany({
          where: {
            deleted_at: null,
            is_active: true,
            OR: [
              { full_name: { contains: query, mode: "insensitive" } },
              { email: { contains: query, mode: "insensitive" } },
              { academic_title: { contains: query, mode: "insensitive" } },
              { short_bio: { contains: query, mode: "insensitive" } },
              { nip_or_staff_id: { contains: query, mode: "insensitive" } },
              {
                research_tags: {
                  some: {
                    tag: {
                      name: { contains: query, mode: "insensitive" },
                      deleted_at: null,
                    },
                  },
                },
              },
            ],
          },
          take: limit,
          select: {
            id: true,
            slug: true,
            full_name: true,
            academic_title: true,
            photo_url: true,
            supervision_status: true,
            primary_research_cluster: {
              select: {
                name: true,
              },
            },
            research_tags: {
              where: { tag: { deleted_at: null } },
              select: {
                tag: {
                  select: {
                    name: true,
                    cluster: {
                      select: {
                        name: true,
                      },
                    },
                  },
                },
              },
              take: 3,
            },
          },
          orderBy: { full_name: "asc" },
        })
      : Promise.resolve([]);

    // 2. Search Research Tags
    const tagsPromise = shouldFetch("tags")
      ? prisma.researchTag.findMany({
          where: {
            deleted_at: null,
            is_active: true,
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
              {
                cluster: {
                  name: { contains: query, mode: "insensitive" },
                  deleted_at: null,
                },
              },
            ],
          },
          take: limit,
          select: {
            id: true,
            slug: true,
            name: true,
            cluster: {
              select: {
                name: true,
                slug: true,
              },
            },
          },
          orderBy: { name: "asc" },
        })
      : Promise.resolve([]);

    // 3. Search Publications
    const publicationsPromise = shouldFetch("publications")
      ? prisma.publication.findMany({
          where: {
            deleted_at: null,
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { authors_text: { contains: query, mode: "insensitive" } },
              { venue: { contains: query, mode: "insensitive" } },
              { abstract: { contains: query, mode: "insensitive" } },
              { doi: { contains: query, mode: "insensitive" } },
            ],
          },
          take: limit,
          select: {
            id: true,
            slug: true,
            title: true,
            year: true,
            authors_text: true,
            venue: true,
            doi: true,
          },
          orderBy: { year: "desc" },
        })
      : Promise.resolve([]);

    // 4. Search Projects
    const projectsPromise = shouldFetch("projects")
      ? prisma.project.findMany({
          where: {
            deleted_at: null,
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
              { partner_names: { contains: query, mode: "insensitive" } },
              { funding_source: { contains: query, mode: "insensitive" } },
            ],
          },
          take: limit,
          select: {
            id: true,
            slug: true,
            title: true,
            status: true,
            start_year: true,
            end_year: true,
            lead_lecturer: {
              select: {
                full_name: true,
              },
            },
          },
          orderBy: { created_at: "desc" },
        })
      : Promise.resolve([]);

    // 5. Search News & Events
    const newsPromise = shouldFetch("content")
      ? prisma.newsArticle.findMany({
          where: {
            is_published: true,
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { excerpt: { contains: query, mode: "insensitive" } },
              { body: { contains: query, mode: "insensitive" } },
            ],
          },
          take: limit,
          select: {
            id: true,
            slug: true,
            title: true,
            excerpt: true,
            published_at: true,
          },
          orderBy: { published_at: "desc" },
        })
      : Promise.resolve([]);

    const eventsPromise = shouldFetch("content")
      ? prisma.event.findMany({
          where: {
            is_published: true,
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { description: { contains: query, mode: "insensitive" } },
              { location: { contains: query, mode: "insensitive" } },
            ],
          },
          take: limit,
          select: {
            id: true,
            slug: true,
            title: true,
            location: true,
            starts_at: true,
          },
          orderBy: { starts_at: "desc" },
        })
      : Promise.resolve([]);

    // Execute all queries concurrently
    const [
      rawLecturers,
      rawTags,
      rawPublications,
      rawProjects,
      rawNews,
      rawEvents,
    ] = await Promise.all([
      lecturersPromise,
      tagsPromise,
      publicationsPromise,
      projectsPromise,
      newsPromise,
      eventsPromise,
    ]);

    // Transform results
    const lecturers = rawLecturers.map((l) => ({
      id: l.id,
      slug: l.slug,
      full_name: l.full_name,
      academic_title: l.academic_title,
      photo_url: l.photo_url,
      supervision_status: l.supervision_status,
      primary_cluster:
        l.primary_research_cluster?.name ||
        l.research_tags?.[0]?.tag?.cluster?.name ||
        null,
      tags: l.research_tags.map((rt) => rt.tag.name),
    }));

    const research_tags = rawTags.map((t) => ({
      id: t.id,
      slug: t.slug,
      name: t.name,
      cluster_name: t.cluster?.name || null,
      cluster_slug: t.cluster?.slug || null,
    }));

    const publications = rawPublications.map((p) => ({
      id: p.id,
      slug: p.slug,
      title: p.title,
      year: p.year,
      authors_text: p.authors_text,
      venue: p.venue,
      doi: p.doi,
    }));

    const projects = rawProjects.map((pr) => ({
      id: pr.id,
      slug: pr.slug,
      title: pr.title,
      status: pr.status,
      lead_lecturer: pr.lead_lecturer?.full_name || null,
      start_year: pr.start_year,
      end_year: pr.end_year,
    }));

    const content = [
      ...rawNews.map((n) => ({
        id: n.id,
        slug: n.slug,
        type: "NEWS" as const,
        title: n.title,
        date: n.published_at,
        meta: n.excerpt,
      })),
      ...rawEvents.map((e) => ({
        id: e.id,
        slug: e.slug,
        type: "EVENT" as const,
        title: e.title,
        date: e.starts_at,
        meta: e.location,
      })),
    ]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, limit);

    const total_matches =
      lecturers.length +
      research_tags.length +
      publications.length +
      projects.length +
      content.length;

    return {
      lecturers,
      research_tags,
      publications,
      projects,
      content,
      total_matches,
    };
  }
}

export default new SearchService();
