import React from 'react';
import styles from './Nav.module.css';

const Nav: React.FC = () => {
  return (
    <nav className={styles.nav}>
      <ul className={styles.navList}>
        <li><a href="/" className={styles.active}>首页</a></li>
        <li><a href="/articles">文章</a></li>
        <li><a href="/about">关于我</a></li>
        <li><a href="/subscribe">订阅</a></li>   {/* CTA 按钮之一 */}
      </ul>
    </nav>
  );
};

export default Nav;