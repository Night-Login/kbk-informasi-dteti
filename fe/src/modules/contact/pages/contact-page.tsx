import WireframePlaceholder from "@/components/global/wireframe-placeholder";
import {
  contactAddress,
  contactCards,
  contactSocialLinks,
} from "@/modules/contact/data/contact.data";

function Field({
  id,
  label,
  placeholder,
  type = "text",
}: {
  id: string;
  label: string;
  placeholder: string;
  type?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-white/90" htmlFor={id}>
      {label}
      <input
        id={id}
        name={id}
        type={type}
        placeholder={placeholder}
        className="min-h-10 border border-white/20 bg-white/18 px-3 text-white outline-none placeholder:text-white/85 focus:border-dteti-yellow"
      />
    </label>
  );
}

export default function ContactPage() {
  const [emailCard, addressCard, socialCard] = contactCards;
  const EmailIcon = emailCard.icon;
  const AddressIcon = addressCard.icon;
  const SocialIcon = socialCard.icon;

  return (
    <main id="main-content" className="bg-white pt-16 text-ink sm:pt-20">
      <section className="page-container pb-10 pt-12">
        <h1 className="text-center text-[clamp(2rem,5vw,3rem)] font-extrabold tracking-[-0.03em] text-ink">
          Contact Us
        </h1>

        <div className="mx-auto mt-10 grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
          <form className="rounded-xl bg-dteti-blue px-6 py-8 text-white sm:px-12">
            <h2 className="text-2xl font-bold">Send us message</h2>

            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              <Field id="name" label="Full name" placeholder="Name" />
              <Field id="email" label="Email" placeholder="Email" type="email" />
            </div>

            <div className="mt-6">
              <Field id="subject" label="Subject" placeholder="Subject" />
            </div>

            <label
              className="mt-6 grid gap-2 text-sm font-medium text-white/90"
              htmlFor="message"
            >
              Message
              <textarea
                id="message"
                name="message"
                placeholder="Message"
                rows={6}
                className="resize-y border border-white/20 bg-white/22 px-3 py-3 text-white outline-none placeholder:text-white/85 focus:border-dteti-yellow"
              />
            </label>

            <div className="mt-8 flex justify-center">
              <button
                type="submit"
                className="min-h-10 rounded-md bg-dteti-yellow px-7 text-sm font-extrabold text-dteti-ink transition-colors hover:bg-dteti-yellow/85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-dteti-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-dteti-blue"
              >
                Submit
              </button>
            </div>
          </form>

          <WireframePlaceholder className="min-h-[22rem] w-full lg:min-h-full" />
        </div>

        <div className="mx-auto mt-8 grid max-w-6xl gap-8 md:grid-cols-3">
          <article className="grid min-h-72 place-items-center bg-dteti-blue p-8 text-center text-white">
            <div>
              <EmailIcon className="mx-auto" size={46} aria-hidden="true" />
              <p className="mt-8 text-lg">{emailCard.value}</p>
            </div>
          </article>

          <article className="grid min-h-72 place-items-center bg-dteti-blue p-8 text-center text-white">
            <div>
              <AddressIcon className="mx-auto" size={46} aria-hidden="true" />
              <h2 className="mt-8 text-lg font-extrabold leading-tight">
                {contactAddress.title}
              </h2>
              {contactAddress.lines.map((line) => (
                <p key={line} className="mx-auto mt-6 max-w-xs text-lg leading-tight">
                  {line}
                </p>
              ))}
            </div>
          </article>

          <article className="grid min-h-72 place-items-center bg-dteti-blue p-8 text-white">
            <div>
              <SocialIcon className="mx-auto" size={46} aria-hidden="true" />
              <ul className="mt-8 space-y-4 text-lg">
                {contactSocialLinks.map(({ label, value, short }) => (
                  <li key={label} className="flex items-center gap-4">
                    <span className="grid size-6 place-items-center rounded-full text-xs font-extrabold">
                      {short}
                    </span>
                    <span>{value}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
