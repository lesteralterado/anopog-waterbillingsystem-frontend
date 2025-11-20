// import type { Metadata } from "next";
// import { Geist, Geist_Mono, Inter } from "next/font/google";
// import "./globals.css";
// import { AuthProvider } from '@/context/AuthContext';

// const inter = Inter({ subsets: ['latin'] });

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata: Metadata = {
//   title: 'Water Billing System - Admin',
//   description: 'Admin dashboard for water billing management',
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body
//         className={inter.className}>
//         <AuthProvider>
//           {children}
//         </AuthProvider>
//       </body>
//     </html>
//   );
// }


import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

export const metadata: Metadata = {
  title: 'Water Billing System - Admin',
  description: 'Admin dashboard for water billing management',
  icons: {
    icon: '/anopog.png',
    shortcut: '/anopog.png',
    apple: '/anopog.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}