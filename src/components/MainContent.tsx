import React, { useState, useEffect } from 'react';
import styles from './MainContent.module.css';

// 定义一篇文章的数据结构，就像定义一个"文章对象"的模板
// TypeScript 的特性，帮助我们规范数据格式
interface Article {
  id: number;
  title: string;
  date: string;
  author: string;
  contentSections: {
    title: string;
    text: string;
    code?: string; // 可选的代码块内容
  }[];
  tags: string[];
}

const MainContent: React.FC = () => {
  // 2. 使用 useState 定义一个状态变量 articles 和它的修改函数 setArticles
  // 初始状态是一个空数组，表示还没有文章数据
  const [articles, setArticles] = useState<Article[]>([]);
  // 为了更好的用户体验，我们可以增加一个 loading 状态
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // 3. 使用 useEffect 来处理"副作用"，比如数据获取
  // 空数组 [] 作为第二个参数，意味着这个 effect 只在组件"挂载"后执行一次
  useEffect(() => {
    // 模拟一个从服务器获取数据的异步操作
    console.log("组件已挂载，开始获取文章数据...");

    // 模拟一个网络请求，2秒后返回数据
    const fetchData = async () => {
      // 这里通常是一个 fetch 或 axios 调用，我们直接用 setTimeout 模拟
      await new Promise(resolve => setTimeout(resolve, 2000));

      // 模拟从服务器返回的数据
      const mockArticles: Article[] = [
        {
          id: 1,
          title: "理解 JavaScript 闭包",
          date: "2030-08-10",
          author: "张三",
          contentSections: [
            { title: "什么是闭包？", text: "闭包是指有权访问另一个函数作用域中的变量的函数..." },
            { title: "实际应用场景", text: "闭包常用于模块化、数据私有化...", code: `function createCounter() {...}` }
          ],
          tags: ["JavaScript", "前端"]
        },
        {
          id: 2,
          title: "CSS Grid 入门",
          date: "2030-08-15",
          author: "张三",
          contentSections: [
            { title: "什么是Grid布局？", text: "Grid 是二维布局系统，可同时处理行和列..." }
          ],
          tags: ["CSS", "布局"]
        }
      ];

      setArticles(mockArticles); // 用获取到的数据更新状态
      setIsLoading(false);       // 数据加载完成，关闭 loading 状态
      console.log("文章数据获取完成！");
    };

    fetchData();

    // 这里可以有一个 return 函数，用于"清理"操作，比如取消请求。
    // 在这个模拟场景中，我们没有实际发请求，所以不需要清理。
    // return () => {
    //   console.log("组件即将卸载，清理操作...");
    // };
  }, []); // 空依赖数组，等同于 componentDidMount

  // 4. 根据 isLoading 状态显示不同的内容
  if (isLoading) {
    return <main className={styles.main}><p>加载文章中...</p></main>;
  }

  return (
    <main className={styles.main}>
      {/* 使用 map 函数遍历 articles 数组，为每篇文章生成一个 <article> 组件 */}
      {articles.map((article) => (
        <article key={article.id} className={styles.article}>
          <header className={styles.articleHeader}>
            {/* 通过 {} 将JavaScript变量插入到JSX中 */}
            <h2>{article.title}</h2>
            <p>发布于 <time dateTime={article.date}>{article.date}</time> by {article.author}</p>
          </header>

          {/* 同样使用 map 来遍历内容章节 */}
          {article.contentSections.map((section, index) => (
            <section key={index} className={styles.section}>
              <h3>{section.title}</h3>
              <p>{section.text}</p>
              {section.code && ( // 条件渲染：如果存在 code 属性，则显示代码块
                <pre className={styles.codeBlock}>
                  {section.code}
                </pre>
              )}
            </section>
          ))}

          <footer className={styles.articleFooter}>
            <p>
              标签:{' '}
              {article.tags.map((tag, tagIndex) => (
                // 为每个标签生成一个链接，用条件判断是否添加逗号
                <span key={tagIndex}>
                  <a href="#">{tag}</a>
                  {tagIndex < article.tags.length - 1 && ', '}
                </span>
              ))}
            </p>
          </footer>
        </article>
      ))}

      {/* 营销高亮 CTA 区域保持不变 */}
      <div className={styles.highlightCta}>
        <p><mark className={styles.mark}>🔥 热门教程：</mark> 想要掌握更多前端技巧？<a href="#">点击这里订阅我的 newsletter</a>，每周推送干货！</p>
      </div>
    </main>
  );
};

export default MainContent;