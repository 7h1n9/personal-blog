import React from 'react';
import styles from './Header.module.css';
import { useTheme } from '../context/ThemeContext';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  const { theme, toggleTheme } = useTheme();
  const today = new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  }).format(new Date());

  return (
    <header className={styles.header}>
      <div className={styles.titleGroup}>
        <span className={styles.status}>SYSTEM ONLINE</span>
        <h1>{title}</h1>
        <p>记录前端工程、性能调优与产品构建的实时实验日志。</p>
      </div>

      <div className={styles.headerPanel}>
        <p className={styles.dateText}>{today}</p>
        <p className={styles.signalText}>Signal Strength: 98%</p>
        <button onClick={toggleTheme} className={styles.themeButton}>
          {theme === 'light' ? '切换暗色矩阵' : '切换明亮模式'}
        </button>
      </div>
    </header>
  );
};

export default Header;
