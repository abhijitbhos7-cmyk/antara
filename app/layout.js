import { AudioProvider } from "./context/AudioContext";
import { Figtree } from 'next/font/google';
import './globals.css';

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
      <body className={`${figtree.className} antialiased bg-[#F0EDE6] text-gray-900`}>
        <AudioProvider>
          {children}
        </AudioProvider>
      </body>
    </html>
  );
}