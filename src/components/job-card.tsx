import { cities, fields, type Job, type Locale } from '@/lib/jobs';
import { Icon } from './icons';
type Props = { job: Job; locale: Locale; saved: boolean; onSave: () => void; href: string; onOpen: (event: React.MouseEvent<HTMLAnchorElement>) => void };
export function JobCard({ job, locale, saved, onSave, href, onOpen }: Props) {
 const ar = locale === 'ar';
 return <article className="job-card" data-testid="job-card">
  <div className="card-top"><div className={'employer-mark mark-' + job.field} aria-hidden="true">{job.initials}</div><div className="employer"><span>{job.employer[locale]}</span><span className="small">{ar ? 'جهة عمل افتراضية' : 'Fictional employer'}</span></div>
  <button className={'icon-button save-button ' + (saved ? 'is-saved' : '')} aria-pressed={saved} aria-label={(saved ? (ar ? 'إزالة من المحفوظات: ' : 'Unsave: ') : (ar ? 'حفظ: ' : 'Save: ')) + job.title[locale]} onClick={onSave}><Icon name="bookmark"/></button></div>
  <h3><a href={href} onClick={onOpen}>{job.title[locale]}</a></h3>
  <p className="job-location"><Icon name="pin"/>{cities[job.city][locale]}<span className="dot" aria-hidden="true">·</span>{job.experience === 0 ? (ar ? 'بداية المسار المهني' : 'Early career') : (ar ? job.experience + '+ سنوات خبرة' : job.experience + '+ years')}</p>
  <div className="tags"><span>{fields[job.field][locale]}</span><span>{job.work[locale]}</span></div>
  <div className="card-bottom"><span className={job.closed ? 'closed-label' : 'small'}>{job.closed ? (ar ? 'أُغلق التقديم' : 'Applications closed') : (ar ? 'الراتب غير محدد في المثال' : 'Salary not specified in example')}</span><span className="card-arrow" aria-hidden="true"><Icon name="arrow"/></span></div>
 </article>;
}
