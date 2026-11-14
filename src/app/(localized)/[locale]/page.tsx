import { JobExplorer } from '@/components/job-explorer';
export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
 const { locale } = await params;
 return <JobExplorer locale={locale === 'ar' ? 'ar' : 'en'} />;
}
