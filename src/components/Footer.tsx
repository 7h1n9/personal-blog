import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <p>© {year} NEON STACK BLOG. Built for speed, clarity and future UI.</p>
      <div className={styles.links}>
        <Link to="/articles">文章矩阵</Link>
        <Link to="/about">作者档案</Link>
        <Link to="/subscribe">订阅通道</Link>
      </div>
    </footer>
  );
};

export default Footer;
