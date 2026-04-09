import React from 'react';
import styles from './Header.module.css';
import { useTheme } from '../context/ThemeContext'; // 使用自定义 Hook

// 定义组件接收的 Props 类型
interface HeaderProps {
  title: string; // 接收一个字符串类型的 title
}

// 使用解构赋值从 props 中取出 title
const Header: React.FC<HeaderProps> = ({ title }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className={styles.header}>
      {/* 使用从父组件传来的 title */}
      <h1>{title}</h1>
      <p>分享前端知识和心得</p>
      <button onClick={toggleTheme} className={styles.themeButton}>
        {theme === 'light' ? '🌙 暗黑模式' : '☀️ 明亮模式'}
      </button>
    </header>
  );
};

export default Header;