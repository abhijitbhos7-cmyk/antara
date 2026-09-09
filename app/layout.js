import { Figtree } from 'next/font/google';
import './globals.css';

// Configure the perfect Spotify-style font alternative
const figtree = Figtree({ 
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

export const metadata = {
  title: 'Antara - Music That Connects',
  description: 'Premium meditation and wellness application',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* 
        1. figtree.className applies the new font globally.
        2. 'antialiased' makes the text render perfectly smooth and crisp, exactly like desktop apps.
      */}
      <body className={`${figtree.className} antialiased bg-[#F0EDE6] text-gray-900`}>
        {children}
      </body>
    </html>
  );
}