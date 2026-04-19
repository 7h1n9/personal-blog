import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import ScrollReveal from '../components/ScrollReveal';
import TiltCard from '../components/TiltCard';
import styles from './Pages.module.css';

const SubscribePage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribedEmail, setSubscribedEmail] = useState<string | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextEmail = email.trim();

    if (!nextEmail) {
      return;
    }

    setSubscribedEmail(nextEmail);
    setEmail('');
  };

  return (
    <>
      <Helmet>
        <title>订阅通道 | NEON STACK BLOG</title>
        <meta name="description" content="订阅每周技术更新，获取安全工程实战与渗透分析拆解。" />
      </Helmet>

      <div className={styles.page}>
        <ScrollReveal>
          <h1 className={styles.pageTitle}>订阅通道</h1>
        </ScrollReveal>
        <ScrollReveal delay={90}>
          <p className={styles.pageIntro}>每周一封精选技术快报，包含新文章、工具清单和可复制代码段。</p>
        </ScrollReveal>

        {subscribedEmail ? (
          <ScrollReveal delay={200}>
            <TiltCard className={styles.subscribedMessage}>
              <section>
                <p>订阅已激活，确认邮件已发送到 {subscribedEmail}。</p>
                <p className={styles.pageIntro}>欢迎加入更新列表，你将第一时间收到最新发布内容。</p>
              </section>
            </TiltCard>
          </ScrollReveal>
        ) : (
          <ScrollReveal delay={200}>
            <TiltCard className={styles.subscribePanel}>
              <section>
                <form onSubmit={handleSubmit} className={styles.subscribeForm}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="email">邮箱地址</label>
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="your@email.com"
                      required
                      className={styles.emailInput}
                    />
                  </div>

                  <button type="submit" className={styles.submitButton}>
                    加入订阅
                  </button>
                </form>

                <p className={styles.privacyNotice}>我们只发送技术更新，不推送广告，可随时取消订阅。</p>
              </section>
            </TiltCard>
          </ScrollReveal>
        )}
      </div>
    </>
  );
};

export default SubscribePage;
