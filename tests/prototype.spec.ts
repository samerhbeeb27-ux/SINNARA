import { test, expect } from '@playwright/test';
test('English browse, Arabic search and location filters', async ({page}) => {
 await page.goto('/en/');
 await expect(page.getByTestId('job-card')).toHaveCount(5);
 await page.getByRole('searchbox').fill('مبيعات');
 await expect(page.getByTestId('job-card')).toHaveCount(1);
 await page.getByRole('button',{name:'Clear filters'}).click();
 await page.getByRole('combobox',{name:'Location',exact:true}).selectOption('port-sudan');
 await expect(page.getByTestId('job-card')).toHaveCount(2);
 await page.getByRole('button',{name:'Procurement',exact:true}).click();
 await expect(page.getByTestId('job-card')).toHaveCount(1);
 await expect(page).toHaveURL(/field=procurement/);
 await page.reload();
 await expect(page.getByTestId('job-card')).toHaveCount(1);
});
test('empty results can be recovered', async ({page}) => {
 await page.goto('/en/?q=no-such-position');
 await expect(page.getByRole('heading',{name:'No samples match these filters.'})).toBeVisible();
 await page.getByRole('button',{name:'Clear filters',exact:true}).last().click();
 await expect(page.getByTestId('job-card')).toHaveCount(5);
});
test('saved jobs survive reload and can be cleared', async ({page}) => {
 await page.goto('/en/');
 await page.getByRole('button',{name:'Save: Sales Representative',exact:true}).click();
 await page.getByRole('link',{name:'Saved jobs',exact:false}).click();
 await expect(page.getByTestId('job-card')).toHaveCount(1);
 await page.reload();
 await expect(page.getByTestId('job-card')).toHaveCount(1);
 await page.getByRole('button',{name:'Clear saved jobs',exact:true}).click();
 await expect(page.getByRole('heading',{name:'No saved jobs yet.'})).toBeVisible();
 await page.reload();
 await expect(page.getByTestId('job-card')).toHaveCount(0);
});
test('details, application preview and browser back preserve results', async ({page}) => {
 await page.goto('/en/?city=port-sudan');
 await page.getByRole('link',{name:'Warehouse Coordinator',exact:true}).click();
 await expect(page.getByRole('heading',{name:'What you would need'})).toBeVisible();
 await page.getByRole('button',{name:'Preview application step'}).click();
 await expect(page.getByText('In the live service, this step would open the employer’s original application channel. Nothing has been sent.')).toBeVisible();
 await page.goBack();
 await expect(page.getByTestId('job-card')).toHaveCount(2);
});
test('closed vacancies cannot accept applications', async ({page}) => {
 await page.goto('/en/');
 await page.getByRole('checkbox',{name:'Show closed'}).check();
 await page.getByRole('link',{name:'Sales Supervisor',exact:true}).click();
 await expect(page.getByRole('button',{name:'Applications closed'})).toBeDisabled();
});
test('profile filters and transparent skills comparison', async ({page}) => {
 await page.goto('/en/?view=profile');
 await page.getByRole('combobox',{name:'Preferred field'}).selectOption('finance');
 await page.getByRole('checkbox',{name:'Excel',exact:true}).check();
 await page.getByRole('button',{name:'Use sample profile'}).click();
 await page.getByRole('link',{name:'Browse with these preferences'}).click();
 await expect(page.getByTestId('job-card')).toHaveCount(2);
 await page.getByRole('link',{name:'Accounts Assistant',exact:true}).click();
 await expect(page.getByText('This is a direct comparison of selected skills, not an AI assessment or hiring recommendation.')).toBeVisible();
 await page.reload();
 await expect(page.getByRole('link',{name:'Try a sample profile'})).toBeVisible();
});
test('Arabic is RTL and handles alef variants', async ({page}) => {
 await page.goto('/ar/');
 await expect(page.locator('html')).toHaveAttribute('lang','ar');
 await expect(page.locator('html')).toHaveAttribute('dir','rtl');
 await page.getByRole('searchbox').fill('مساعد حسابات');
 await expect(page.getByTestId('job-card')).toHaveCount(1);
 await page.getByRole('link',{name:'English',exact:true}).click();
 await expect(page.getByRole('searchbox')).toHaveValue('مساعد حسابات');
 await expect(page.getByTestId('job-card')).toHaveCount(1);
});
test('error, loading, invalid vacancy and offline states', async ({page,context}) => {
 await page.goto('/en/?state=error');
 await expect(page.getByRole('alert')).toContainText('couldn’t load');
 await page.getByRole('button',{name:'Try again'}).click();
 await expect(page.getByTestId('job-card')).toHaveCount(5);
 await page.goto('/en/?state=loading');
 await expect(page.locator('[aria-busy=true]')).toBeVisible();
 await page.getByRole('button',{name:'Finish loading preview'}).click();
 await expect(page.getByTestId('job-card')).toHaveCount(5);
 await page.goto('/en/?job=unknown');
 await expect(page.getByRole('heading',{name:'Vacancy not found'})).toBeVisible();
 await page.getByRole('button',{name:'Browse jobs',exact:true}).click();
 await context.setOffline(true);
 await expect(page.getByText('You’re offline.',{exact:false})).toBeVisible();
 await page.getByRole('link',{name:'Sales Representative',exact:true}).click();
 await expect(page.getByRole('heading',{name:'Sales Representative',exact:true})).toBeVisible();
 await context.setOffline(false);
});
test('malformed browser storage and denied storage do not break browsing', async ({page}) => {
 await page.addInitScript(() => localStorage.setItem('sinnara-demo-saved-v1','{"invalid":true}'));
 await page.goto('/en/');
 await expect(page.getByTestId('job-card')).toHaveCount(5);
 await page.evaluate(() => { Storage.prototype.setItem = () => { throw new Error('blocked'); }; });
 await page.getByRole('button',{name:'Save: Sales Representative',exact:true}).click();
 await expect(page.getByText('Saved for this visit only.',{exact:false})).toBeVisible();
});
test('keyboard navigation exposes skip link and save state', async ({page}) => {
 await page.goto('/en/');
 await page.keyboard.press('Tab');
 await expect(page.getByRole('link',{name:'Skip to content'})).toBeFocused();
 await page.keyboard.press('Enter');
 await expect(page.locator('#main')).toBeFocused();
 const save = page.getByRole('button',{name:'Save: Sales Representative',exact:true});
 await save.focus(); await page.keyboard.press('Space');
 await expect(page.getByRole('button',{name:'Unsave: Sales Representative',exact:true})).toHaveAttribute('aria-pressed','true');
});
for (const locale of ['en','ar']) {
 test(locale + ' mobile fits 360px and produces review image', async ({page}) => {
  const errors: string[] = []; page.on('pageerror',e=>errors.push(e.message));
  await page.setViewportSize({width:360,height:800});
  await page.goto('/'+locale+'/');
  await expect(page.getByTestId('job-card')).toHaveCount(5);
  const overflow = await page.evaluate(()=>document.documentElement.scrollWidth > innerWidth);
  expect(overflow).toBe(false);
  await page.emulateMedia({reducedMotion:'reduce'});
  const shot = await page.screenshot({type:'jpeg',quality:50,fullPage:false});
  console.log('REVIEW_IMAGE_'+locale.toUpperCase()+'='+shot.toString('base64'));
  await page.getByTestId('job-card').first().getByRole('heading').getByRole('link').click();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth > innerWidth)).toBe(false);
  await page.goto('/'+locale+'/?view=profile');
  expect(await page.evaluate(()=>document.documentElement.scrollWidth > innerWidth)).toBe(false);
  expect(errors).toEqual([]);
 });
}
test('desktop review and compressed initial script budget', async ({page}) => {
 await page.goto('/en/');
 await expect(page.getByTestId('job-card')).toHaveCount(5);
 const shot=await page.screenshot({type:'jpeg',quality:55,fullPage:false});
 console.log('REVIEW_IMAGE_DESKTOP='+shot.toString('base64'));
 const scripts=await page.locator('script[src]').evaluateAll(nodes=>nodes.map(n=>(n as HTMLScriptElement).src));
 const {gzipSync}=await import('node:zlib');
 let bytes=0;
 for(const src of new Set(scripts)){const response=await page.request.get(src);expect(response.ok()).toBe(true);bytes+=gzipSync(await response.body()).length;}
 console.log('INITIAL_SCRIPT_GZIP_BYTES='+bytes);
 expect(bytes).toBeLessThan(500*1024);
});

test('automated accessibility checks on both languages and main views', async ({page}) => {
 const {default:AxeBuilder}=await import('@axe-core/playwright');
 for(const locale of ['en','ar']) for(const suffix of ['', '?job=sales-01', '?view=profile', '?view=saved']) {
  await page.goto('/'+locale+'/'+suffix);
  await expect(page.locator('.demo-banner')).toBeVisible();
  await expect(page.locator('[aria-busy=true]')).toHaveCount(0);
  const results=await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21aa']).analyze();
  expect(results.violations,locale+suffix).toEqual([]);
 }
});
