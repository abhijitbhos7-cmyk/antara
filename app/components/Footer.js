import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-12 w-full border-t border-gray-200 pt-8 pb-8">
      <div className="flex flex-col justify-between gap-12 xl:flex-row">
        
        
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 xl:w-3/4">
          <div>
            <h3 className="mb-4 text-sm font-bold text-gray-900">Company</h3>
            <ul className="space-y-3 text-sm font-medium text-gray-500">
              <li><Link href="/info/about" className="transition hover:text-[#0b3d33] hover:underline">About</Link></li>
              <li><Link href="/info/jobs" className="transition hover:text-[#0b3d33] hover:underline">Jobs</Link></li>
              <li><Link href="/info/record" className="transition hover:text-[#0b3d33] hover:underline">For the Record</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-bold text-gray-900">Communities</h3>
            <ul className="space-y-3 text-sm font-medium text-gray-500">
              <li><Link href="/info/guides" className="transition hover:text-[#0b3d33] hover:underline">For Guides</Link></li>
              <li><Link href="/info/developers" className="transition hover:text-[#0b3d33] hover:underline">Developers</Link></li>
              <li><Link href="/info/advertising" className="transition hover:text-[#0b3d33] hover:underline">Advertising</Link></li>
              <li><Link href="/info/investors" className="transition hover:text-[#0b3d33] hover:underline">Investors</Link></li>
              <li><Link href="/info/vendors" className="transition hover:text-[#0b3d33] hover:underline">Vendors</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-bold text-gray-900">Useful links</h3>
            <ul className="space-y-3 text-sm font-medium text-gray-500">
              <li><Link href="/info/support" className="transition hover:text-[#0b3d33] hover:underline">Support</Link></li>
              <li><Link href="/info/app" className="transition hover:text-[#0b3d33] hover:underline">Free Mobile App</Link></li>
              <li><Link href="/info/retreats" className="transition hover:text-[#0b3d33] hover:underline">Retreats</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-sm font-bold text-gray-900">Antara Plans</h3>
            <ul className="space-y-3 text-sm font-medium text-gray-500">
              <li><Link href="/info/premium-standard" className="transition hover:text-[#0b3d33] hover:underline">Premium Standard</Link></li>
              <li><Link href="/info/premium-family" className="transition hover:text-[#0b3d33] hover:underline">Premium Family</Link></li>
              <li><Link href="/info/premium-student" className="transition hover:text-[#0b3d33] hover:underline">Premium Student</Link></li>
              <li><Link href="/info/free" className="transition hover:text-[#0b3d33] hover:underline">Antara Free</Link></li>
            </ul>
          </div>
        </div>

        
        <div className="flex gap-4 xl:justify-end">
          <button aria-label="Instagram" className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-700 transition hover:bg-[#0b3d33] hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
          </button>
          <button aria-label="Twitter" className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-700 transition hover:bg-[#0b3d33] hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
          </button>
          <button aria-label="Facebook" className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 text-gray-700 transition hover:bg-[#0b3d33] hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
          </button>
        </div>
      </div>

      
      <div className="mt-8 flex flex-col items-start justify-between gap-4 border-t border-gray-200 pt-4 text-xs font-medium text-gray-500 md:flex-row md:items-center">
        <div className="flex flex-wrap gap-4 md:gap-6">
          <Link href="/info/legal" className="transition hover:text-[#0b3d33]">Legal</Link>
          <Link href="/info/privacy-center" className="transition hover:text-[#0b3d33]">Safety & Privacy Center</Link>
          <Link href="/info/privacy-policy" className="transition hover:text-[#0b3d33]">Privacy Policy</Link>
          <Link href="/info/cookies" className="transition hover:text-[#0b3d33]">Cookies</Link>
          <Link href="/info/ads" className="transition hover:text-[#0b3d33]">About Ads</Link>
          <Link href="/info/accessibility" className="transition hover:text-[#0b3d33]">Accessibility</Link>
        </div>
        <div className="shrink-0">
          &copy; {currentYear} Antara Wellness AB
        </div>
      </div>
    </footer>
  );
}