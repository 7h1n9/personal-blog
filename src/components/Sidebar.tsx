import React, { useState, useEffect } from 'react';
import styles from './Sidebar.module.css';
import reactSvg from '../assets/pc.png';

// 定义 Props 类型，包含一个可选的函数
interface SidebarProps {
  onSubscribe?: (email: string) => void; // 接收一个函数，参数为邮箱，无返回值
}

const Sidebar: React.FC<SidebarProps> = ({ onSubscribe }) => {
  // 定义一个状态来存储当前时间
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    // 3. 组件挂载后，启动一个定时器，每秒更新时间
    console.log("侧边栏组件已挂载，启动计时器...");
    const timerId = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // 4. 组件卸载前，必须清除定时器！这是非常关键的"清理"操作
    return () => {
      console.log("侧边栏组件即将卸载，清除计时器...");
      clearInterval(timerId);
    };
  }, []); // 空依赖数组，仅在挂载和卸载时执行

  // 处理表单提交
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // 阻止表单的默认提交行为，防止页面刷新
    // 使用 FormData 或者通过 ref 获取输入框的值
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email') as string;

    if (email && onSubscribe) {
      onSubscribe(email); // 调用父组件传下来的函数，将数据传出去
      event.currentTarget.reset(); // 清空表单
    } else if (!email) {
      alert('请输入邮箱地址');
    }
  };

  return (
    <aside className={styles.sidebar}>
      {/* 在某个位置显示当前时间，作为演示 */}
      <section className={styles.widget}>
        <h3>当前时间</h3>
        <p>{currentTime.toLocaleTimeString()}</p>
      </section>

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
        <form className={styles.subscribeForm} onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="你的邮箱" required />
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
