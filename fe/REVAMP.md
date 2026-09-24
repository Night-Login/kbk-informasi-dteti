# Landing and events revamp

The user-supplied wireframes govern the grayscale landing page and events archive. Checkerboard areas are solid gray placeholders. Other page styles remain unchanged.

## Local Docker runtime

The existing database was started and its schema verified against all 11 migrations. No reseeding/import was run against the populated volume.

```powershell
docker compose up -d --no-deps database
docker compose build frontend backend database_init
docker compose run --rm --no-deps database_init npx prisma migrate status
docker compose up -d --no-deps backend frontend nginx backup
```

Application: http://localhost/
Events: http://localhost/events
Full layout fixtures: http://localhost/?preview=1 and http://localhost/events?preview=1

These restart commands assume the existing initialized database. The default database_init command also imports CSV data and is not needed merely to restart this populated installation.

## Verified 2026-09-17

- Frontend and backend Docker builds pass.
- Database is healthy; 11 migrations up to date.
- Home and events APIs respond successfully. Existing database has 1 news and 1 event.
- Browser page title: KBK Informasi - Information Engineering Research Group UGM.
- Changed frontend files pass ESLint. Repository-wide ESLint has a pre-existing no-explicit-any error in admin/components/SlugInput.tsx and two unrelated unused-variable warnings.
- Keyboard Article -> Events navigation works; hero search opens one dialog and Ctrl+K closes it without duplication.
- Preview event filters: 8 total, 4 upcoming, 1 matching Kiro under upcoming; unmatched query shows empty state and Clear filters restores 8.
- Desktop event grid has 4 columns; 390px mobile has 1 column and no document horizontal overflow.
- Independent code reviewer verified fixes for shared search ownership, cluster anchors and event end-time preservation. Visual checks performed by the main agent.

## Remaining content decisions

Article and News use the existing news model. Separate editorial authors, comments, likes and view counts need a defined data model; no fake social counters were added. Preview fixtures are explicitly labeled and never used as an automatic API fallback.

The documentation agent could not run due to its usage limit; the scoped design documentation was written directly from the implementation.

## English UI and simplified search (2026-09-24)

All static interface copy, accessibility labels, preview fixtures, metadata descriptions and date locale use English. KBK Informasi and Universitas Gadjah Mada remain official proper names. Custom database-authored editorial content retains its source text; the known legacy footer default is translated at display time.

Shared search is now a native dialog with one input, close control and a compact list of titles with plain content-type labels. No popular-topic chips, photos, badges or multi-panel result cards. It supports keyboard navigation, focus restoration, cancellation of outdated searches, and explicit loading/error/empty states. The hero topic rotation and cluster marquee remain adaptations of the supplied references, not frame-for-frame copies.

Hero interaction correction: a dedicated HeroSearch input now searches inline and displays up to six results below the field. It does not dispatch the header modal event. Keyboard navigation, Escape, clear, loading, retry and no-results states are supported.

Navigation/footer refinement: social links now render icons; visible pause/resume controls are removed. The navigation drawer opens and closes from the right, supports Escape, restores focus, and respects reduced motion.

Scroll correction: removed the navigation drawer and desktop hamburger. The fixed header now transitions at 80px scroll from transparent/spacious to white/compact and back; original mobile navigation is retained.
