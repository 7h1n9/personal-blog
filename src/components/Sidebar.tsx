import React from 'react';
import styles from './Sidebar.module.css';
import reactSvg from '../assets/pc.png';

const Sidebar: React.FC = () => {
  return (
    <aside className={styles.sidebar}>
      {/* 作者简介（社交证明） */}
      <section className={styles.widget}>
        <h3>关于作者</h3>
        <div className={styles.authorInfo}>
          <img
            src={reactSvg}
            alt="7h1n9"
            className={styles.avatar}
          />
          <p>7h1n9，前端开发工程师，热爱分享技术。专注于React、Vue等前端框架的实践和应用。</p>
        </div>
      </section>

      {/* 社交链接（信任元素） */}
      <section className={styles.widget}>
        <h3>关注我</h3>
        <ul className={styles.socialLinks}>
          <li><a href="https://github.com/7h1n9" aria-label="GitHub">GitHub</a></li>
          <li><a href="#" aria-label="Twitter">Twitter</a></li>
          <li><a href="#" aria-label="LinkedIn">LinkedIn</a></li>
        </ul>
      </section>

      {/* 订阅 CTA（行动号召） */}
      <section className={`${styles.widget} ${styles.ctaWidget}`}>
        <h3>订阅更新</h3>
        <p>获取最新的文章和技术干货，每周发送一次，随时退订。</p>
        <form className={styles.subscribeForm}>
          <input type="email" placeholder="你的邮箱" required />
          <button type="submit">订阅</button>
        </form>
      </section>

      {/* 合作伙伴 logo（社交证明） */}
      <section className={styles.widget}>
        <h3>合作伙伴</h3>
        <div className={styles.partners}>
          <img src="https://p3.ssl.qhimg.com/t011e94f0b9ed8e66b0.webp" alt="Partner 1" />
          <img src="https://passport.qianxin.com/img/logo.dd2e6edf.svg" alt="Partner 2" />
        </div>
      </section>
    </aside>
  );
};

export default Sidebar;
