"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { createBrowserClient } from "@supabase/ssr";
import {
  Check,
  ChevronDown,
  Download,
  Headphones,
  Music2,
  Sparkles,
} from "lucide-react";

const fallbackPricing = {
  monthly: 139,
  yearly: 299,
  student: 69,

  standard_name: "Standard",
  standard_desc: "₹139 / month after offer period",
  standard_features: [
    "1 Premium account",
    "Listen to music ad-free",
    "Download to listen offline",
    "Play songs in any order",
  ],

  platinum_name: "Platinum",
  platinum_desc: "₹299 / year after offer period",
  platinum_features: [
    "Up to 3 Premium accounts",
    "High-quality, immersive audio",
    "Your personal AI DJ",
    "Download to listen offline",
  ],

  student_name: "Student",
  student_desc: "₹69 / month after offer period",
  student_features: [
    "1 verified Premium account",
    "Listen to music ad-free",
    "Download to listen offline",
    "Cancel anytime",
  ],
};

const navigation = [
  { name: "Premium", href: "#plans" },
  { name: "Support", href: "#faq" },
  { name: "Download", href: "/" },
];

export default function ExplorePremiumPage() {
  const router = useRouter();

  const [pricing, setPricing] = useState(fallbackPricing);
  const [menuOpen, setMenuOpen] = useState(false);
  
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  useEffect(() => {
    const fetchPricing = async () => {
      const { data } = await supabase
        .from("pricing")
        .select("*")
        .eq("id", 1)
        .single();

      if (!data) return;

      setPricing({
        monthly: data.monthly ?? fallbackPricing.monthly,
        yearly: data.yearly ?? fallbackPricing.yearly,
        student: data.student ?? fallbackPricing.student,
        standard_name: data.standard_name || fallbackPricing.standard_name,
        standard_desc: data.standard_desc || `₹${data.monthly ?? fallbackPricing.monthly} / month after offer period`,
        standard_features: data.standard_features || fallbackPricing.standard_features,
        platinum_name: data.platinum_name || fallbackPricing.platinum_name,
        platinum_desc: data.platinum_desc || `₹${data.yearly ?? fallbackPricing.yearly} / year after offer period`,
        platinum_features: data.platinum_features || fallbackPricing.platinum_features,
        student_name: data.student_name || fallbackPricing.student_name,
        student_desc: data.student_desc || `₹${data.student ?? fallbackPricing.student} / month after offer period`,
        student_features: data.student_features || fallbackPricing.student_features,
      });
    };

    fetchPricing();

    const fetchSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setUser(session.user);
        
        const { data: profile } = await supabase
          .from("profiles")
          .select("is_admin, is_owner")
          .eq("id", session.user.id)
          .single();
          
        if (profile?.is_admin || profile?.is_owner) {
          setIsAdmin(true);
        }
      } else {
        setUser(null);
        setIsAdmin(false);
      }
    };
    
    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        setUser(null);
        setIsAdmin(false);
      } else {
        fetchSession(); 
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const checkout = (plan) => {
    router.push(
      `/premium/checkout?plan=${encodeURIComponent(
        plan.name,
      )}&price=${plan.price}&interval=${plan.interval}`,
    );
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    setMenuOpen(false);
  };

  const plans = [
    {
      name: pricing.standard_name,
      description: pricing.standard_desc,
      price: pricing.monthly,
      interval: "month",
      eyebrow: `₹${pricing.monthly} for 1 month`,
      features: pricing.standard_features,
      button: `Get ${pricing.standard_name}`,
    },
    {
      name: pricing.platinum_name,
      description: pricing.platinum_desc,
      price: pricing.yearly,
      interval: "year",
      eyebrow: `₹${pricing.yearly} for 12 months`,
      features: pricing.platinum_features,
      button: `Get ${pricing.platinum_name}`,
      featured: true,
    },
    {
      name: pricing.student_name,
      description: pricing.student_desc,
      price: pricing.student,
      interval: "month",
      eyebrow: "Student discount",
      features: pricing.student_features,
      button: `Try ${pricing.student_name}`,
    },
  ];

  return (
    <main className="min-h-screen overflow-x-hidden bg-black font-sans text-white selection:bg-[#1ed760] selection:text-black">
      <header className="sticky top-0 z-50 bg-[#0b3d33]">
        <div className="mx-auto flex h-20 max-w-[1200px] items-center justify-between px-5 lg:px-8">
          <Link
            href="/premium"
            className="group flex items-center gap-2.5"
            aria-label="Antara home"
          >
            <img
              src="/antara-logo.svg"
              alt="Antara"
              className="h-8 w-8 brightness-0 invert"
            />
            <span className="text-[1.55rem] font-black tracking-[-0.07em]">
              Antara
            </span>
          </Link>

          <nav className="hidden items-center gap-8 text-[15px] font-bold lg:flex">
            {navigation.map((item) => (
              item.href.startsWith('#') ? (
                <a
                  key={item.name}
                  href={item.href}
                  className="transition-colors hover:text-[#1ed760]"
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  key={item.name}
                  href={item.href}
                  className="transition-colors hover:text-[#1ed760]"
                >
                  {item.name}
                </Link>
              )
            ))}

            <span className="h-4 w-px bg-white" />

            {user ? (
              <>
                <Link 
                  href={isAdmin ? "/admin" : "/dashboard"} 
                  className="transition-colors hover:text-[#1ed760]"
                >
                  {isAdmin ? "Admin Panel" : "My Dashboard"}
                </Link>
                <button onClick={handleLogout} className="transition-colors hover:text-red-400 font-bold">
                  Log out
                </button>
              </>
            ) : (
              <>
                <Link href="/signup" className="transition-colors hover:text-[#1ed760]">
                  Sign up
                </Link>
                <Link href="/login" className="transition-colors hover:text-[#1ed760]">
                  Log in
                </Link>
              </>
            )}
          </nav>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-11 w-11 items-center justify-center rounded-full text-white lg:hidden"
            aria-expanded={menuOpen}
            aria-label="Toggle navigation"
          >
            <span className="flex w-5 flex-col gap-1.5">
              <span className="h-0.5 w-full bg-current" />
              <span className="h-0.5 w-full bg-current" />
              <span className="h-0.5 w-full bg-current" />
            </span>
          </button>
        </div>

        {menuOpen && (
          <nav className="border-t border-white/15 bg-[#0b3d33] px-5 py-5 lg:hidden">
            <div className="mx-auto flex max-w-[1200px] flex-col gap-5 text-lg font-bold">
              {navigation.map((item) => (
                item.href.startsWith('#') ? (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="transition-colors hover:text-[#1ed760]"
                  >
                    {item.name}
                  </a>
                ) : (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="transition-colors hover:text-[#1ed760]"
                  >
                    {item.name}
                  </Link>
                )
              ))}
              
              {user ? (
                <>
                  <Link 
                    href={isAdmin ? "/admin" : "/dashboard"} 
                    onClick={() => setMenuOpen(false)} 
                    className="text-[#1ed760]"
                  >
                    {isAdmin ? "Admin Panel" : "My Dashboard"}
                  </Link>
                  <button onClick={handleLogout} className="text-left text-red-400 w-fit">
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/signup" onClick={() => setMenuOpen(false)}>
                    Sign up
                  </Link>
                  <Link href="/login" onClick={() => setMenuOpen(false)}>
                    Log in
                  </Link>
                </>
              )}
            </div>
          </nav>
        )}
      </header>

      <section className="relative isolate flex min-h-[650px] items-center overflow-hidden bg-black">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        >
          <source src="/meditaton.mp4" type="video/mp4" />
        </video>

        <div className="mx-auto w-full max-w-[1200px] px-5 py-24 lg:px-8 lg:py-32">
          <div className="max-w-[670px]">
            <p className="mb-5 text-sm font-bold uppercase tracking-[0.16em] text-[#d7fbdc] drop-shadow-md">
              Antara Premium
            </p>

            <h1 className="max-w-[650px] text-5xl font-black leading-[0.96] tracking-[-0.055em] drop-shadow-lg sm:text-7xl lg:text-[5.5rem]">
              Focus better.
              <br />
              Feel every moment.
            </h1>

            <p className="mt-7 max-w-[540px] text-lg font-medium leading-7 drop-shadow-md sm:text-xl">
              Unlock uninterrupted soundscapes, offline sessions, and focus
              tools designed around you.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => checkout(plans[1])}
                className="min-h-12 rounded-full bg-[#1ed760] px-8 py-3 text-sm font-black text-black transition-transform hover:scale-[1.04] hover:bg-[#3bea7b] shadow-lg"
              >
                Get 12 months at ₹{pricing.yearly}
              </button>

              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById("plans")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="min-h-12 rounded-full border border-white px-8 py-3 text-sm font-black transition-transform hover:scale-[1.04] hover:bg-white/10 shadow-lg bg-black/20 backdrop-blur-sm"
              >
                View plans
              </button>
            </div>

            <p className="mt-7 text-xs leading-5 text-white underline decoration-white/50 underline-offset-2 drop-shadow-md">
              Limited-time offer. Terms and eligibility apply.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white px-5 py-20 text-black sm:py-28 lg:px-8">
        <div className="mx-auto max-w-[1200px]">
          <div className="mx-auto max-w-[720px] text-center">
            <h2 className="text-4xl font-black tracking-[-0.045em] sm:text-5xl">
              Why go Premium?
            </h2>
            <p className="mt-4 text-lg">
              Get more from every listening and focus session.
            </p>
          </div>

          <div className="mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
            <Benefit
              icon={<Music2 />}
              title="No interruptions"
              text="Keep your attention where it belongs with an ad-free experience."
            />
            <Benefit
              icon={<Headphones />}
              title="Better sound"
              text="Hear every detail in high-quality, immersive audio."
            />
            <Benefit
              icon={<Download />}
              title="Listen offline"
              text="Download sessions and take your focus ritual anywhere."
            />
            <Benefit
              icon={<Sparkles />}
              title="Made for your flow"
              text="Personal tools and recommendations that move with your day."
            />
          </div>
        </div>
      </section>

      <section
        id="plans"
        className="scroll-mt-20 bg-[#f5f5f5] px-5 py-20 text-black sm:py-28 lg:px-8"
      >
        <div className="mx-auto max-w-[1200px]">
          <div className="mx-auto max-w-[760px] text-center">
            <h2 className="text-4xl font-black tracking-[-0.045em] sm:text-5xl">
              Pick the plan that works for you
            </h2>

            <p className="mt-4 text-lg">
              Enjoy your first step into deeper focus. Cancel anytime.
            </p>

            <div className="mt-8 inline-flex items-center gap-2 text-sm font-bold">
              <Check className="h-5 w-5" />
              One-time plans available
            </div>
          </div>

          <div className="mx-auto mt-12 grid max-w-[1080px] gap-5 md:grid-cols-3 md:items-stretch">
            {plans.map((plan) => (
              <article
                key={plan.name}
                className={`relative flex min-h-[520px] flex-col rounded-xl bg-white p-6 shadow-[0_8px_24px_rgba(0,0,0,.10)] sm:p-7 ${
                  plan.featured ? "ring-2 ring-black md:-translate-y-3" : ""
                }`}
              >
                {plan.featured && (
                  <span className="-mx-7 -mt-7 mb-6 rounded-t-xl bg-black px-7 py-3 text-center text-xs font-black uppercase tracking-[.12em] text-[#1ed760]">
                    Most popular
                  </span>
                )}

                <span
                  className="w-fit rounded px-2 py-1 text-xs font-black text-white"
                  style={{
                    backgroundColor: plan.featured ? "#e91429" : "#2563eb",
                  }}
                >
                  {plan.eyebrow}
                </span>

                <div className="mt-5 flex items-center gap-2 text-sm font-bold">
                  <img
                    src="/antara-logo.svg"
                    alt=""
                    className="h-5 w-5"
                  />
                  Antara Premium
                </div>

                <h3 className="mt-4 text-[2rem] font-black leading-none tracking-[-0.04em]">
                  {plan.name}
                </h3>

                <p className="mt-3 min-h-12 text-sm leading-5">
                  {plan.description}
                </p>

                <div className="my-6 border-t border-black" />

                <ul className="flex-1 space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex gap-3 text-sm font-medium leading-5"
                    >
                      <Check className="mt-0.5 h-4 w-4 shrink-0 stroke-[3]" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => checkout(plan)}
                  className="mt-8 min-h-12 rounded-full bg-[#1ed760] px-6 py-3 text-sm font-black text-black transition-transform hover:scale-[1.04] hover:bg-[#3bea7b]"
                >
                  {plan.button}
                </button>

                <p className="mt-5 text-center text-[11px] leading-4 text-black/65 underline">
                  Terms and conditions apply. Offer subject to eligibility.
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="faq" className="scroll-mt-20 bg-black px-5 py-20 sm:py-28 lg:px-8">
        <div className="mx-auto max-w-[820px]">
          <h2 className="text-center text-4xl font-black tracking-[-0.045em] sm:text-5xl">
            Questions?
          </h2>

          <div className="mt-12 divide-y divide-white/25 border-y border-white/25">
            <Faq
              question="How does Antara Premium work?"
              answer="Premium unlocks an uninterrupted listening experience, downloads, better audio quality, and additional focus tools for the plan you select."
            />

            <Faq
              question="Can I cancel my plan?"
              answer="Yes. You can cancel at any time. Your Premium features continue through the end of your current billing period."
            />

            <Faq
              question="Can I use Antara offline?"
              answer="Yes. With an eligible Premium plan, download your selected sessions beforehand and listen without a connection."
            />

            <Faq
              question="How do I change plans?"
              answer="Choose a different plan from your account when you are ready. Any applicable billing changes are shown before you confirm."
            />
          </div>
        </div>
      </section>

      <footer className="bg-black px-5 pb-12 pt-10 text-white lg:px-8">
        <div className="mx-auto max-w-[1200px] border-t border-white/20 pt-12">
          <div className="flex flex-col gap-10 md:flex-row md:justify-between">
            <Link
              href="/premium"
              className="flex h-fit items-center gap-2.5"
            >
              <img
                src="/antara-logo.svg"
                alt="Antara"
                className="h-8 w-8 brightness-0 invert"
              />
              <span className="text-[1.55rem] font-black tracking-[-0.07em]">
                Antara
              </span>
            </Link>

            <div className="grid grid-cols-2 gap-x-12 gap-y-10 sm:grid-cols-4 sm:gap-x-16">
              <FooterColumn
                heading="Company"
                links={["About", "Jobs", "For the Record"]}
              />
              <FooterColumn
                heading="Communities"
                links={["Creators", "Students", "Developers"]}
              />
              <FooterColumn
                heading="Useful links"
                links={["Support", "Mobile app", "Accessibility"]}
              />
              <FooterColumn
                heading="Antara plans"
                links={["Standard", "Platinum", "Student"]}
              />
            </div>
          </div>

          <div className="mt-16 flex flex-col gap-5 border-t border-white/20 pt-8 text-xs text-white/65 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-x-6 gap-y-3">
              <Link href="#">Legal</Link>
              <Link href="#">Privacy policy</Link>
              <Link href="#">Cookies</Link>
              <Link href="#">Accessibility</Link>
            </div>

            <p>© {new Date().getFullYear()} Antara AB</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

function Benefit({ icon, title, text }) {
  return (
    <div className="text-center">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#1ed760] [&>svg]:h-8 [&>svg]:w-8 [&>svg]:stroke-[2.5]">
        {icon}
      </div>

      <h3 className="text-lg font-black">{title}</h3>

      <p className="mx-auto mt-3 max-w-[240px] text-[15px] leading-6">
        {text}
      </p>
    </div>
  );
}

function Faq({ question, answer }) {
  return (
    <details className="group">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-lg font-bold hover:underline">
        <span>{question}</span>
        <ChevronDown className="h-6 w-6 shrink-0 transition-transform group-open:rotate-180" />
      </summary>

      <p className="max-w-2xl pb-6 text-[15px] leading-6 text-white/75">
        {answer}
      </p>
    </details>
  );
}

function FooterColumn({ heading, links }) {
  return (
    <div>
      <h3 className="mb-5 text-xs font-bold uppercase tracking-[.1em] text-white/55">
        {heading}
      </h3>

      <ul className="space-y-4">
        {links.map((link) => (
          <li key={link}>
            <Link
              href="#"
              className="text-sm font-bold transition-colors hover:text-[#1ed760]"
            >
              {link}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}