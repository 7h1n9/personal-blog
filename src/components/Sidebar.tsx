import React, { useEffect, useMemo, useState } from 'react';
import ScrollReveal from './ScrollReveal';
import TiltCard from './TiltCard';
import styles from './Sidebar.module.css';
import authorPhoto from '../assets/pc.png';

interface SidebarProps {
  onSubscribe?: (email: string) => void;
}

const metricCards = [
  { label: '已发布文章', value: '24 篇' },
  { label: '本周活跃读者', value: '3.2k' },
  { label: '系统在线时长', value: '99.97%' }
];

const links = [
  { name: 'GitHub', href: 'https://github.com/72' },
  { name: '掘金主页', href: 'https://juejin.cn/' },
  { name: '项目仓库', href: 'https://github.com/729?tab=repositories' }
];

const partners = [
  {
    name: '360 安全中心',
    href: 'https://www.360.cn/',
    logo: 'https://p3.ssl.qhimg.com/t011e94f0b9ed8e66b0.webp'
  },
  {
    name: '奇安信',
    href: 'https://www.qianxin.com/',
    logo: 'https://passport.qianxin.com/img/logo.dd2e6edf.svg'
  }
];

const Sidebar: React.FC<SidebarProps> = ({ onSubscribe }) => {
  const [currentTime, setCurrentTime] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      window.clearInterval(timer);
    };
  }, []);

  const timeText = useMemo(
    () =>
      new Intl.DateTimeFormat('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hourCycle: 'h23'
      }).format(currentTime),
    [currentTime]
  );

  const dateText = useMemo(
    () =>
      new Intl.DateTimeFormat('zh-CN', {
        month: 'long',
        day: 'numeric',
        weekday: 'short'
      }).format(currentTime),
    [currentTime]
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = String(formData.get('email') || '').trim();

    if (!email) {
      window.alert('请输入有效邮箱地址。');
      return;
    }

    onSubscribe?.(email);
    event.currentTarget.reset();
  };

  return (
    <aside className={styles.sidebar}>
      <ScrollReveal delay={40}>
        <TiltCard className={styles.widget}>
          <section>
            <h3>实时状态</h3>
            <div className={styles.timePanel}>
              <p className={styles.timeValue}>{timeText}</p>
              <p className={styles.timeDate}>{dateText}</p>
            </div>
            <div className={styles.metricGrid}>
              {metricCards.map((metric) => (
                <article key={metric.label} className={styles.metricCard}>
                  <p>{metric.label}</p>
                  <strong>{metric.value}</strong>
                </article>
              ))}
            </div>
          </section>
        </TiltCard>
      </ScrollReveal>

      <ScrollReveal delay={120}>
        <TiltCard className={styles.widget}>
          <section>
            <h3>作者节点</h3>
            <div className={styles.authorInfo}>
              <img src={authorPhoto} alt="作者头像" className={styles.avatar} />
              <p>专注于网络安全、漏洞分析、攻防演练与安全加固实践。</p>
            </div>
          </section>
        </TiltCard>
      </ScrollReveal>

      <ScrollReveal delay={180}>
        <TiltCard className={styles.widget}>
          <section>
            <h3>订阅通道</h3>
            <p className={styles.widgetText}>每周推送高质量实战拆解和最新实验记录。</p>
            <form className={styles.subscribeForm} onSubmit={handleSubmit}>
              <input type="email" name="email" placeholder="your@email.com" required />
              <button type="submit">开启订阅</button>
            </form>
          </section>
        </TiltCard>
      </ScrollReveal>

      <ScrollReveal delay={240}>
        <TiltCard className={styles.widget}>
          <section>
            <h3>合作伙伴</h3>
            <div className={styles.partnerGrid}>
              {partners.map((partner) => (
                <a
                  key={partner.name}
                  href={partner.href}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.partnerItem}
                >
                  <img src={partner.logo} alt={partner.name} loading="lazy" />
                </a>
              ))}
            </div>
          </section>
        </TiltCard>
      </ScrollReveal>

      <ScrollReveal delay={300}>
        <TiltCard className={styles.widget}>
          <section>
            <h3>外部链接</h3>
            <ul className={styles.links}>
              {links.map((link) => (
                <li key={link.name}>
                  <a href={link.href} target="_blank" rel="noreferrer">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </TiltCard>
      </ScrollReveal>
    </aside>
  );
};

export default Sidebar;
