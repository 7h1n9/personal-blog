import React, { createContext, useContext, useState, type ReactNode } from 'react';

// 定义主题类型
type Theme = 'light' | 'dark';

// 定义 Context 中提供的数据结构
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// 创建 Context（初始值为 undefined，便于检查是否被正确使用）
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// 自定义 Hook，方便消费
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Provider 组件，包裹需要共享主题的组件树
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};