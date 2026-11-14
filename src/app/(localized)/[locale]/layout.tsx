import type { Metadata } from 'next';
import '../../globals.css';
export const metadata: Metadata = { title: 'SINNARA | سنارة', description: 'Jobs and application guidance for Sudan. Interactive prototype.', robots: { index: false, follow: false }, icons: { icon: '/favicon.svg' } };
export const dynamicParams = false;
export function generateStaticParams() { return [{ locale: 'en' }, { locale: 'ar' }]; }
export default async function Layout({ children, params }: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
 const { locale } = await params;
 return <html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}><body>{children}</body></html>;
}
