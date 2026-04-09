import React, { useState } from 'react';
import Header from './components/Header';
import Nav from './components/Nav';
import MainContent from './components/MainContent';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import styles from './App.module.css';

// 内部组件，用于监听主题并修改 body 类名
const ThemeWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme } = useTheme();

  React.useEffect(() => {
    // 将主题类名添加到 body 上
    document.body.className = theme;
  }, [theme]);

  return <>{children}</>;
};

const App: React.FC = () => {
  // 在顶层组件定义一个状态，管理博客标题
  const [blogTitle] = useState<string>("我的技术博客");

  // 定义接收邮箱的处理函数
  const handleSubscribe = (email: string) => {
    console.log("App 组件收到了订阅邮箱:", email);
    // 这里可以添加发送到后端的逻辑
    alert(`感谢订阅！邮箱 ${email} 已收到。`);
  };

  return (
    <ThemeProvider>
      <ThemeWrapper>
        {/* 使用 Grid 布局构建页面骨架 */}
        <div className={styles.pageLayout}>
          {/* 语义化标签：页眉区域 */}
          {/* 通过自定义属性 title 将数据传递给 Header 组件 */}
          <Header title={blogTitle} />
          {/* 语义化标签：导航区域 */}
          <Nav />
          {/* 语义化标签：主要内容区域 */}
          <MainContent />
          {/* 语义化标签：侧边栏区域（广告/相关链接） */}
          <Sidebar onSubscribe={handleSubscribe} />
          {/* 语义化标签：页脚区域 */}
          <Footer />
        </div>
      </ThemeWrapper>
    </ThemeProvider>
  );
};

export default App;