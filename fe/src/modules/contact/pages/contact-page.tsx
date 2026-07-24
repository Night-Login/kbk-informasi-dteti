import WireframePlaceholder from "@/components/global/wireframe-placeholder";

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
        className="min-h-10 border border-white/40 bg-dteti-blue px-3 text-white outline-none placeholder:text-white focus:border-dteti-yellow"
      />
    </label>
  );
}

export default function ContactPage() {
  return (
    <main id="main-content" className="bg-white pt-16 text-ink sm:pt-20">
      <section className="page-container pb-10 pt-12">
        <h1 className="text-center text-[clamp(2rem,5vw,3rem)] font-extrabold tracking-[-0.03em] text-dteti-blue">
          Contact Us
        </h1>

        <div className="mx-auto mt-10 grid max-w-6xl gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">
          <form className="brand-gradient rounded-xl px-6 py-8 text-white sm:px-12">
            <h2 className="text-2xl font-bold">Send us a message</h2>

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
                className="resize-y border border-white/40 bg-dteti-blue px-3 py-3 text-white outline-none placeholder:text-white focus:border-dteti-yellow"
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
      </section>
    </main>
  );
}
