import type { Metadata } from 'next';
import '../globals.css';
export const metadata: Metadata = { title: 'SINNARA | سنارة', description: 'Jobs and application guidance for Sudan. Interactive prototype.', robots: { index: false, follow: false }, icons: { icon: '/favicon.svg' } };
export default function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
 return <html lang="en"><body>{children}</body></html>;
}
