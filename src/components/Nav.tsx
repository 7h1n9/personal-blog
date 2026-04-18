import React from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Nav.module.css';

const navItems = [
  { to: '/', label: '控制台', code: '00' },
  { to: '/articles', label: '文章矩阵', code: '01' },
  { to: '/about', label: '作者档案', code: '02' },
  { to: '/subscribe', label: '订阅通道', code: '03' }
];

const Nav: React.FC = () => {
  return (
    <nav className={styles.nav} aria-label="主导航">
      <ul className={styles.navList}>
        {navItems.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`.trim()}
            >
              <span className={styles.code}>{item.code}</span>
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Nav;
