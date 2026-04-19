import { writeFileSync, existsSync, mkdirSync, copyFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createJiti } from 'jiti';

// 获取当前文件所在目录（ES模块中需要）
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// 初始化 jiti，支持导入 TypeScript 文件
const jiti = createJiti(__dirname);

// 动态导入 TypeScript 数据模块
const { getArticles } = await jiti.import('./src/data/articles.ts');

// 获取所有文章（包含完整信息）
const articles = getArticles(); // 返回 Article[]

// ========== 配置区域 ==========
// 部署域名
const BASE_URL = 'https://7h1n9.github.io/personal-blog';
// 静态路由列表
const staticRoutes = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/articles', priority: '0.8', changefreq: 'weekly' },
  { path: '/about', priority: '0.8', changefreq: 'weekly' },
];
// ==============================

// 获取当前日期（YYYY-MM-DD）
const today = new Date().toISOString().split('T')[0];

// 收集所有需要生成 sitemap 的条目
const sitemapEntries = [];

// 1. 添加静态路由
staticRoutes.forEach(route => {
  sitemapEntries.push({
    loc: `${BASE_URL}${route.path}`,
    lastmod: today,
    changefreq: route.changefreq,
    priority: route.priority,
  });
});

// 2. 添加动态文章路由（并提取 TDK 信息）
articles.forEach(article => {
  // 标准 sitemap 条目
  sitemapEntries.push({
    loc: `${BASE_URL}/articles/${article.id}`,
    lastmod: today,
    changefreq: 'weekly',
    priority: '0.8',
  });

  // 可选：提取 TDK 信息（标题、描述），可用于生成 seo 数据或额外文件
  const tdkInfo = {
    title: article.title,
    description: article.summary || article.contentSections[0]?.text.slice(0, 150),
    keywords: article.tags.join(', '),
  };
  console.log(`文章 ${article.id} (${article.title}) TDK:`, tdkInfo);
  // 这里可以将 tdkInfo 写入到一个 JSON 文件中供其他用途
  // 例如：fs.writeFileSync(`./public/seo/article-${article.id}.json`, JSON.stringify(tdkInfo));
});

// 生成 sitemap XML
const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries.map(entry => `  <url>
    <loc>${entry.loc}</loc>
    <lastmod>${entry.lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${entry.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

// 确保 dist 目录存在（GitHub Pages 实际部署目录）
const distDir = resolve(process.cwd(), 'dist');
if (!existsSync(distDir)) {
  mkdirSync(distDir, { recursive: true });
}

// 写入 sitemap.xml 到 dist 目录
const sitemapPath = resolve(distDir, 'sitemap.xml');
writeFileSync(sitemapPath, sitemapXml);
console.log('✅ sitemap.xml 已生成:', sitemapPath);

// GitHub Pages SPA 兜底：将 index.html 复制为 404.html
const indexPath = resolve(distDir, 'index.html');
const fallback404Path = resolve(distDir, '404.html');
if (existsSync(indexPath)) {
  copyFileSync(indexPath, fallback404Path);
  console.log('✅ 404.html 已生成（SPA fallback）:', fallback404Path);
}
