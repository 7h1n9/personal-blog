import React from 'react';
import styles from './MainContent.module.css';

const MainContent: React.FC = () => {
  return (
    <main className={styles.main}>
      {/* 一篇完整的文章，使用 article 包裹 */}
      <article className={styles.article}>
        <header className={styles.articleHeader}>
          <h2>理解 JavaScript 闭包</h2>
          <p>发布于 <time dateTime="2030-08-10">2030年8月10日</time> by 张三</p>
        </header>

        {/* 使用 section 划分章节 */}
        <section className={styles.section}>
          <h3>什么是闭包？</h3>
          <p>闭包是指有权访问另一个函数作用域中的变量的函数。创建闭包的常见方式是在一个函数内部创建另一个函数。</p>
        </section>

        <section className={styles.section}>
          <h3>实际应用场景</h3>
          <p>闭包常用于模块化、数据私有化、函数柯里化等场景。例如，可以使用闭包创建私有变量：</p>
          <pre className={styles.codeBlock}>
            {`function createCounter() {
  let count = 0;
  return function() {
    count++;
    return count;
  };
}`}
          </pre>
        </section>

        <footer className={styles.articleFooter}>
          <p>标签: <a href="#">JavaScript</a>, <a href="#">前端</a></p>
        </footer>
      </article>

      {/* 第二个文章示例（可复用） */}
      <article className={styles.article}>
        <header className={styles.articleHeader}>
          <h2>CSS Grid 入门</h2>
          <p>发布于 <time dateTime="2030-08-15">2030年8月15日</time> by 张三</p>
        </header>
        <section className={styles.section}>
          <p>Grid 是二维布局系统，可同时处理行和列...（省略具体内容）</p>
        </section>
        <footer className={styles.articleFooter}>
          <p>标签: <a href="#">CSS</a>, <a href="#">布局</a></p>
        </footer>
      </article>

      {/* 营销元素：高亮显示的额外 CTA（在文章列表下方） */}
      <div className={styles.highlightCta}>
        <p><mark className={styles.mark}>🔥 热门教程：</mark> 想要掌握更多前端技巧？<a href="#">点击这里订阅我的 newsletter</a>，每周推送干货！</p>
      </div>
    </main>
  );
};

export default MainContent;