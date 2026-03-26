import React from 'react';
import styles from './Footer.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <p>&copy; 2030 我的技术博客. 保留所有权利。</p>
      <p>
        <a href="/privacy">隐私政策</a> | <a href="/terms">使用条款</a>
      </p>
    </footer>
  );
};

export default Footer;