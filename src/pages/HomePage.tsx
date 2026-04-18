import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ScrollReveal from '../components/ScrollReveal';
import TiltCard from '../components/TiltCard';
import styles from './Pages.module.css';
import { getArticles } from '../data/articles';

const PseudoTerminal = React.lazy(() => import('../components/PseudoTerminal'));

const HomePage: React.FC = () => {
  const articles = getArticles();
  const latestArticles = articles.slice(0, 3);
  const tagCount = new Set(articles.flatMap((article) => article.tags)).size;

  const stats = [
    { label: '文章总量', value: String(articles.length) },
    { label: '覆盖主题', value: String(tagCount) },
    { label: '最新更新', value: latestArticles[0]?.date ?? '待更新' }
  ];

  return (
    <>
      <Helmet>
        <title>首页 | NEON STACK BLOG</title>
        <meta name="description" content="赛博风技术博客，记录工程化、性能优化与产品构建实战。" />
      </Helmet>

      <div className={styles.page}>
        <ScrollReveal>
          <section className={styles.homeHero}>
            <span className={styles.homeBadge}>FUTURE FEED v2.6</span>
            <h1 className={styles.pageTitle}>欢迎来到未来感博客指挥台</h1>
            <p className={styles.pageIntro}>
              这里持续输出前端架构、交互设计和性能优化实战，内容以可落地方案为核心，不做空泛概念。
            </p>
            <div className={styles.homeActions}>
              <Link to="/articles" className={styles.primaryButton}>
                浏览文章矩阵
              </Link>
              <Link to="/subscribe" className={styles.secondaryButton}>
                接入订阅通道
              </Link>
            </div>
          </section>
        </ScrollReveal>

        <section className={styles.statGrid}>
          {stats.map((stat, index) => (
            <ScrollReveal key={stat.label} delay={index * 80 + 40}>
              <TiltCard className={styles.statCard}>
                <article>
                  <p>{stat.label}</p>
                  <strong>{stat.value}</strong>
                </article>
              </TiltCard>
            </ScrollReveal>
          ))}
        </section>

        <ScrollReveal delay={180}>
          <h2 className={styles.sectionHeading}>终端控制台</h2>
        </ScrollReveal>

        <ScrollReveal delay={230}>
          <section className={styles.homeTerminalPanel}>
            <Suspense fallback={<p className={styles.terminalLoading}>终端插件加载中...</p>}>
              <PseudoTerminal />
            </Suspense>
          </section>
        </ScrollReveal>

        <ScrollReveal delay={220}>
          <h2 className={styles.sectionHeading}>最新推送</h2>
        </ScrollReveal>

        <section className={styles.featuredGrid}>
          {latestArticles.map((article, index) => (
            <ScrollReveal key={article.id} delay={index * 100 + 260}>
              <TiltCard className={styles.articleCard}>
                <article>
                  <h2>
                    <Link to={`/articles/${article.id}`}>{article.title}</Link>
                  </h2>
                  <div className={styles.meta}>
                    {article.date} | {article.author}
                  </div>
                  <p>{article.summary}</p>
                  <div className={styles.tagRow}>
                    {article.tags.map((tag) => (
                      <span key={tag} className={styles.tagChip}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <Link to={`/articles/${article.id}`} className={styles.readMore}>
                    进入全文
                  </Link>
                </article>
              </TiltCard>
            </ScrollReveal>
          ))}
        </section>
      </div>
    </>
  );
};

export default HomePage;

