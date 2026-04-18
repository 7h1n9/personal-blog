import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import ScrollReveal from '../components/ScrollReveal';
import DinoGame from '../components/DinoGame';
import styles from './Pages.module.css';

const NotFoundPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>404 | 页面失联</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <ScrollReveal>
        <div className={`${styles.page} ${styles.notFoundWrap}`}>
          <p className={styles.glitchCode}>404</p>
          <h1 className={styles.pageTitle}>信号中断，页面未找到</h1>
          <p className={styles.pageIntro}>目标地址可能已迁移，或者输入路径不正确。</p>
          <DinoGame />
          <Link to="/" className={styles.backHomeLink}>
            返回首页指挥台
          </Link>
        </div>
      </ScrollReveal>
    </>
  );
};

export default NotFoundPage;
