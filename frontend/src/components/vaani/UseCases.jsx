import { motion } from "framer-motion";
import { Reveal, Eyebrow } from "./motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const featured = {
  name: "Restaurants & Cloud Kitchens",
  copy: "Take orders, answer menu questions, handle reservations. Never miss a hungry customer again.",
  image:
    "https://images.unsplash.com/photo-1622023133253-63706c9c3eb4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzMjh8MHwxfHNlYXJjaHwzfHxpbmRpYW4lMjByZXN0YXVyYW50JTIwaW50ZXJpb3IlMjB3YXJtJTIwbGlnaHRpbmd8ZW58MHx8fHwxNzg0MDE5OTM5fDA&ixlib=rb-4.1.0&q=85",
  chat: [
    { from: "user", text: "Do you have anything Jain?" },
    { from: "agent", text: "Absolutely — our Jain Thali is ₹179, no onion or garlic. Shall I reserve a table?" },
  ],
};

const others = [
  {
    name: "Salons & Spas",
    copy: "Book appointments, explain services, share pricing.",
    chat: [
      { from: "user", text: "How much for a haircut and how long will it take?" },
      { from: "agent", text: "A stylist cut is ₹499 and takes about 40 minutes. I have a 5 PM slot today — book it?" },
    ],
  },
  {
    name: "Clinics & Healthcare",
    copy: "Answer patient queries, share clinic hours, handle FAQs.",
    chat: [
      { from: "user", text: "Is the doctor available on Sunday?" },
      { from: "agent", text: "Dr. Rao sees patients 10 AM–1 PM on Sundays. Would you like the next available appointment?" },
    ],
  },
  {
    name: "Hotels & Hospitality",
    copy: "Handle bookings, room service, local recommendations.",
    chat: [
      { from: "user", text: "Do you have a lake-view room for two nights?" },
      { from: "agent", text: "Yes — our Lake View Deluxe is ₹4,200/night, breakfast included. Shall I block it for your dates?" },
    ],
  },
  {
    name: "Tech Support",
    copy: "First-line support, troubleshooting, ticket creation.",
    chat: [
      { from: "user", text: "My router keeps disconnecting." },
      { from: "agent", text: "Let's try a quick power-cycle — unplug for 30 seconds. If it persists, I'll raise ticket #4821 for an engineer visit." },
    ],
  },
];

const MiniChat = ({ chat }) => (
  <div className="space-y-2">
    {chat.map((m, i) => (
      <div key={i} className={`flex ${m.from === "user" ? "justify-end" : "justify-start"}`}>
        <span
          className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-snug ${
            m.from === "user"
              ? "rounded-br-sm bg-vaani-maroon text-vaani-cream"
              : "rounded-bl-sm bg-vaani-sand text-vaani-ink"
          }`}
        >
          {m.text}
        </span>
      </div>
    ))}
  </div>
);

export const UseCases = () => (
  <section id="use-cases" data-testid="use-cases" className="bg-vaani-sand px-6 py-28 md:px-10 md:py-40">
    <div className="mx-auto max-w-[1400px]">
      <Reveal className="mb-20 max-w-2xl">
        <Eyebrow>Built for every business</Eyebrow>
        <h2 className="mt-5 font-serif text-5xl font-light leading-[1.02] tracking-tight text-vaani-ink md:text-7xl">
          One platform. Infinite use cases.
        </h2>
      </Reveal>

      <div className="grid gap-10 lg:grid-cols-2">
        <Reveal>
          <div className="relative rounded-[28px] border border-vaani-gold-soft bg-vaani-white p-4">
            <span className="absolute left-8 top-8 z-10 rounded-full bg-vaani-maroon px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-vaani-cream">
              Most popular
            </span>
            <div className="overflow-hidden rounded-[18px]">
              <motion.img
                src={featured.image}
                alt="Indian restaurant interior"
                initial={{ scale: 1.15 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                className="h-72 w-full object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="font-serif text-3xl font-light text-vaani-maroon">{featured.name}</h3>
              <p className="mt-3 text-vaani-muted">{featured.copy}</p>
              <div className="mt-6 rounded-2xl bg-vaani-sand p-4">
                <MiniChat chat={featured.chat} />
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <Accordion type="single" collapsible defaultValue="item-0" className="w-full">
            {others.map((u, i) => (
              <AccordionItem key={u.name} value={`item-${i}`} className="border-b border-vaani-gold-soft">
                <AccordionTrigger
                  data-testid={`usecase-trigger-${i}`}
                  className="py-7 font-serif text-2xl font-light text-vaani-ink hover:no-underline md:text-3xl [&[data-state=open]]:text-vaani-maroon"
                >
                  {u.name}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="mb-4 text-vaani-muted">{u.copy}</p>
                  <div className="rounded-2xl bg-vaani-white p-4">
                    <MiniChat chat={u.chat} />
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </div>
  </section>
);
