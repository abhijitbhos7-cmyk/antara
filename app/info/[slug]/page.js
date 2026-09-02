"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";

const pageData = {
  about: {
    title: "About Us",
    mainText: "With Antara, it’s easy to find the right meditation, soundscape, or breathing exercise for every moment—on your phone, your computer, and more.\n\nThere are hundreds of sessions on Antara. So whether you’re behind the wheel, working out, partying or relaxing, the right mindfulness practice is always at your fingertips. Choose what you want to listen to, or let Antara surprise you.\n\nSoundtrack your life with Antara. Subscribe or listen for free.",
    showHQ: true,
  },
  jobs: {
    title: "Jobs at Antara",
    mainText: "Join our team of wellness experts, engineers, and designers. We are on a mission to bring inner rhythm and peace to the world. Check out our open roles and help us build the future of mindfulness.",
    showHQ: false,
  },
  support: {
    title: "Customer Service and Support",
    mainText: "1. Help Site: Check out our help site for answers to your questions and to learn how to get the most out of Antara and your sessions.\n\n2. Community: Get fast support from expert Antara users. If there isn't already an answer there to your question, post it and someone will quickly answer.",
    showHQ: false,
  },
  default: {
    title: "Information",
    mainText: "We are currently updating this page. Please check back soon for more information about Antara's policies, plans, and community resources.",
    showHQ: false,
  }
};

export default function InfoPage() {
  const params = useParams();
  const slug = params?.slug;

  const content = pageData[slug] || pageData.default;

  return (
    <div className="min-h-screen bg-white">


      <header className="flex h-20 items-center bg-[#0b3d33] px-8 text-white shadow-md">
        <Link href="/" className="flex items-center gap-3 transition hover:opacity-80">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white p-2">
            <img src="/antara-logo.svg" alt="Antara" className="h-full w-full object-contain" />
          </div>
          <span className="text-xl font-bold tracking-widest text-white">ANTARA</span>
        </Link>
        <div className="ml-auto hidden items-center gap-8 text-sm font-bold md:flex">
          <Link href="/info/premium-standard" className="hover:text-gray-300">Premium plans</Link>
          <Link href="/info/support" className="hover:text-gray-300">Support</Link>
          <Link href="/" className="hover:text-gray-300">Download</Link>
          <div className="h-6 w-px bg-white/30"></div>
          <Link href="/" className="hover:text-gray-300">Sign up</Link>
          <Link href="/" className="hover:text-gray-300">Log in</Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-8 py-16 md:py-24">

        <Link href="/" className="mb-12 inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#0b3d33] transition">
          <ArrowLeft className="h-4 w-4" /> Back to App
        </Link>

        <div className="grid gap-16 lg:grid-cols-[1fr_350px]">


          <div>
            <h1 className="mb-8 text-5xl font-extrabold text-gray-900 md:text-6xl tracking-tight">
              {content.title}
            </h1>
            <div className="space-y-6 text-lg text-gray-700 leading-relaxed whitespace-pre-wrap">
              {content.mainText}
            </div>
          </div>


          {content.showHQ && (
            <div className="space-y-12 border-t border-gray-200 pt-12 lg:border-t-0 lg:pt-0">

              <div>
                <h2 className="mb-6 text-3xl font-bold text-gray-900 tracking-tight">Antara HQ</h2>
                <div className="text-gray-700 space-y-1">
                  <p className="font-bold text-gray-900">Antara Wellness AB</p>
                  <p>Regeringsgatan 19</p>
                  <p>SE-111 53 Stockholm</p>
                  <p>Sweden</p>
                  <p className="pt-2 text-sm text-gray-500">Reg no: 556703-7485</p>
                  <p className="text-sm text-[#0b3d33] hover:underline cursor-pointer">office@antara.com</p>
                </div>
              </div>

              <div>
                <h2 className="mb-6 text-3xl font-bold text-gray-900 tracking-tight">Antara India</h2>
                <div className="text-gray-700 space-y-1">
                  <p className="font-bold text-gray-900">Antara India LLP</p>
                  <p>Jet Airways - Godrej BKC</p>
                  <p>1st Floor, Unit 1 and 2</p>
                  <p>Bandra East, Mumbai</p>
                  <p>Maharashtra, India</p>
                  <p className="pt-2 text-sm text-[#0b3d33] hover:underline cursor-pointer">india@antara.com</p>
                </div>


              </div>

            </div>
          )}

        </div>
      </main>
    </div>
  );
}