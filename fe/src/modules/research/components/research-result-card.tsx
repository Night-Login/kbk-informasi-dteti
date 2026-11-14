"use client";

import { getProjectPeople, getPublicationTags, type Project, type Publication, type Lecturer } from "@/lib/api";
import type { ResearchResult, ResearchView } from "@/modules/research/pages/research-page";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { type CSSProperties, useRef } from "react";

const actionClass = "inline-flex min-h-11 w-fit min-w-44 items-center justify-center gap-2 rounded-[8px] border border-white bg-[#1a4872] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#133859]";

export default function ResearchResultCard({ view, item, index = 0 }: { view: ResearchView; item: ResearchResult; index?: number }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const project = view === "Project" ? item as Project : null;
  const publication = view === "Publication" ? item as Publication : null;
  const person = view === "People" ? item as Lecturer : null;
  const tags = project ? project.research_tags?.flatMap((relation) => relation.tag ? [relation.tag] : []) || [] : publication ? getPublicationTags(publication) : person?.research_tags?.flatMap((relation) => relation.tag ? [relation.tag] : []) || [];
  const title = person ? person.full_name : (project || publication)!.title;
  const description = project?.description || publication?.abstract || person?.short_bio || "";
  const people = project ? getProjectPeople(project) : [];
  const period = project ? [project.start_year, project.end_year || (project.status === "ONGOING" ? "Present" : null)].filter(Boolean).join(" – ") : publication?.year;
  const url = publication?.url || (publication?.doi ? `https://doi.org/${publication.doi}` : "");
  return <article style={{ "--card-index": index } as CSSProperties} className="discovery-stagger-card discovery-card-lift grid gap-6 rounded-[8px] bg-white px-6 py-6 sm:px-12 lg:px-16">
    <div><h2 className="text-xl font-bold text-[#1a4872] sm:text-2xl">{title}</h2>{description && <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#151729] sm:text-base">{description}</p>}</div>
    {tags.length > 0 && <ul className="flex flex-wrap gap-3">{tags.map((tag) => <li key={tag.id}><Link className="inline-flex rounded border border-[#1a4872]/30 bg-[#e6ecf2] px-2.5 py-1 text-sm text-[#151729] hover:underline" href={`/tag-research-areas/${tag.slug}`}>{tag.name}</Link></li>)}</ul>}
    <div className="grid gap-2 text-sm text-[#151729] sm:text-base">
      {people.length > 0 && <p className="font-medium text-[#1a4872]">{people.map((lecturer) => lecturer.full_name).join(", ")}</p>}
      {publication?.authors_text && <p className="font-medium text-[#1a4872]">{publication.authors_text}</p>}
      {person?.academic_title && <p>{person.academic_title}</p>}
      {period && <p>{period}</p>}
      {project?.status && <p>Status: {project.status.toLowerCase()}</p>}
    </div>
    {person ? <Link href={`/people/${person.slug}`} className={actionClass}>View Profile<ArrowRight size={18} /></Link> : project ? <button type="button" className={actionClass} onClick={() => dialog.current?.showModal()}>View Project<ArrowRight size={18} /></button> : url ? <a href={url} target="_blank" rel="noopener noreferrer" className={actionClass}>View Publication<ArrowRight size={18} /></a> : <details><summary className={`${actionClass} cursor-pointer`}>View Publication<ArrowRight size={18} /></summary><p className="mt-4 whitespace-pre-line leading-7 text-[#151729]">{publication?.abstract || "Publication details have not been added yet."}</p></details>}
    {project && <dialog ref={dialog} aria-labelledby={`project-${project.id}`} className="m-auto max-h-[85vh] w-[90%] max-w-2xl overflow-y-auto rounded-[8px] bg-white p-6 text-[#151729] backdrop:bg-black/40 sm:p-10" onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
      <h2 id={`project-${project.id}`} className="text-2xl font-bold text-[#1a4872]">{title}</h2><p className="mt-4 whitespace-pre-line leading-7">{project.description || "Project description has not been added yet."}</p>
      <dl className="mt-6 grid gap-3">{[["Status", project.status], ["Period", period], ["Team", people.map((lecturer) => lecturer.full_name).join(", ")], ["Partners", project.partner_names], ["Funding", project.funding_source]].map(([label, value]) => value ? <div key={label}><dt className="font-semibold text-[#1a4872]">{label}</dt><dd>{value}</dd></div> : null)}</dl>
      <button type="button" className={`${actionClass} mt-6`} onClick={() => dialog.current?.close()}>Close</button>
    </dialog>}
  </article>;
}
