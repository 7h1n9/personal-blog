import React from 'react';
import styles from './Header.module.css';

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <h1>我的技术博客</h1>
      <p>分享前端知识和心得</p>
    </header>
  );
};

export default Header;