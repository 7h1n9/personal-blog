import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ScrollReveal from '../components/ScrollReveal';
import TiltCard from '../components/TiltCard';
import styles from './Pages.module.css';
import { getArticles } from '../data/articles';

const ArticlesPage: React.FC = () => {
  const articles = getArticles();

  return (
    <>
      <Helmet>
        <title>文章矩阵 | NEON STACK BLOG</title>
        <meta name="description" content="查看全部技术文章，涵盖前端架构、动画交互、TypeScript 与性能优化。" />
      </Helmet>

      <div className={styles.page}>
        <ScrollReveal>
          <h1 className={styles.pageTitle}>文章矩阵</h1>
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <p className={styles.pageIntro}>按时间线收录全部技术文章，每篇都包含实战背景、方案拆解与可复用代码。</p>
        </ScrollReveal>

        <section className={styles.timeline}>
          {articles.map((article, index) => (
            <ScrollReveal key={article.id} delay={index * 80 + 120}>
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
                    查看详情
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

export default ArticlesPage;
