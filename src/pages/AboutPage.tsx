import React from 'react';
import { Helmet } from 'react-helmet-async';
import ScrollReveal from '../components/ScrollReveal';
import TiltCard from '../components/TiltCard';
import enfpImage from '../assets/profile/enfp.svg';
import yorushikaImage from '../assets/profile/yorushika.svg';
import yoasobiImage from '../assets/profile/yoasobi.svg';
import davidTaoImage from '../assets/profile/david-tao.svg';
import styles from './Pages.module.css';

const personalTags = [
  '网络安全',
  '赛博保安',
  '漏洞分析',
  '安全研究写作',
  '夜间学习型选手',
  '二刺螈',
  '男搞轻舟已过万重山'
];

const favoriteSingers = [
  {
    name: 'yorushika',
    image:
      'https://bkimg.cdn.bcebos.com/pic/562c11dfa9ec8a13632747d61b57868fa0ec08fa6af2?x-bce-process=image/format,f_auto/watermark,image_d2F0ZXIvYmFpa2UyNzI,g_7,xp_5,yp_5,P_20/resize,m_lfit,limit_1,h_1080',
    fallback: yorushikaImage
  },
  {
    name: 'yoasobi',
    image:
      'https://bkimg.cdn.bcebos.com/pic/a8ec8a13632762d0f703b75b4dbd1ffa513d2797688f?x-bce-process=image/format,f_auto/watermark,image_d2F0ZXIvYmFpa2UyNzI,g_7,xp_5,yp_5,P_20/resize,m_lfit,limit_1,h_1080',
    fallback: yoasobiImage
  },
  {
    name: 'david tao',
    image:
      'https://bkimg.cdn.bcebos.com/pic/9a504fc2d5628535e5dd7ad241b761c6a7efcf1bc5b5?x-bce-process=image/format,f_auto/watermark,image_d2F0ZXIvYmFpa2UyNzI,g_7,xp_5,yp_5,P_20/resize,m_lfit,limit_1,h_1080',
    fallback: davidTaoImage
  }
];

const mbtiImage = {
  remote:
    'https://bkimg.cdn.bcebos.com/pic/5d6034a85edf8db1cb13a7819e71ca54564e9358de81?x-bce-process=image/format,f_auto/watermark,image_d2F0ZXIvYmFpa2UyNzI,g_7,xp_5,yp_5,P_20/resize,m_lfit,limit_1,h_1080',
  fallback: enfpImage
};

const aboutPanels = [
  {
    key: 'mbti',
    title: '人格与风格',
    gridClassName: styles.aboutGridFullRow,
    content: (
      <div className={styles.profileMeta}>
        <div className={styles.profileMetaText}>
          <p>
            <strong>MBTI:</strong> ENFP
          </p>
          <p className={styles.mbtiLead}>思路发散、行动迅速，喜欢把复杂安全问题拆成可复现的小步骤。</p>
          <ul className={styles.mbtiTraitList}>
            <li>偏好在真实业务场景里定位风险点，而不是只讲概念。</li>
            <li>习惯把攻击链拆成可验证步骤，并同步给出修复建议。</li>
            <li>写作目标是让每篇内容都能直接转成实战清单。</li>
          </ul>
        </div>
        <div className={styles.profileMetaVisual}>
          <img
            src={mbtiImage.remote}
            alt="MBTI ENFP"
            className={styles.mbtiImage}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={(event) => {
              event.currentTarget.src = mbtiImage.fallback;
            }}
          />
        </div>
      </div>
    )
  },
  {
    key: 'focus',
    title: '核心方向',
    content: <p>网络安全研究、漏洞分析、攻防演练与安全加固实践。</p>
  },
  {
    key: 'principles',
    title: '输出原则',
    content: (
      <ul>
        <li>只写真实场景中的安全问题与解决方案。</li>
        <li>强调可复现流程，避免“玄学安全”。</li>
        <li>优先关注风险闭环与落地修复。</li>
      </ul>
    )
  },
  {
    key: 'tools',
    title: '常用工具',
    content: <p>Burp Suite、Wireshark、Nmap、Python、Linux 安全工具链。</p>
  },
  {
    key: 'singers',
    title: '喜爱歌手',
    content: (
      <div className={styles.singerCards}>
        {favoriteSingers.map((singer) => (
          <article key={singer.name} className={styles.singerCard}>
            <img
              src={singer.image}
              alt={singer.name}
              className={styles.singerImage}
              loading="lazy"
              referrerPolicy="no-referrer"
              onError={(event) => {
                event.currentTarget.src = singer.fallback;
              }}
            />
            <p className={styles.singerName}>{singer.name}</p>
          </article>
        ))}
      </div>
    )
  },
  {
    key: 'tags',
    title: '个人标签',
    content: (
      <div className={styles.personalTags}>
        {personalTags.map((tag) => (
          <span key={tag} className={styles.personalTag}>
            {tag}
          </span>
        ))}
      </div>
    )
  },
  {
    key: 'contact',
    title: '联系通道',
    content: (
      <>
        <p>mail: XXX@example.com</p>
        <p>github: github.com/XXXX</p>
      </>
    )
  }
];

const AboutPage: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>作者档案 | NEON STACK BLOG</title>
        <meta name="description" content="了解作者在网络安全方向的研究重点、方法与实践输出。" />
      </Helmet>

      <div className={styles.page}>
        <ScrollReveal>
          <h1 className={styles.pageTitle}>作者档案</h1>
        </ScrollReveal>
        <ScrollReveal delay={100}>
          <p className={styles.pageIntro}>这不是简历页，而是一份持续更新的网络安全研究日志。</p>
        </ScrollReveal>

        <section className={styles.aboutGrid}>
          {aboutPanels.map((panel, index) => (
            <ScrollReveal key={panel.key} delay={index * 90 + 140} className={panel.gridClassName}>
              <TiltCard className={styles.aboutPanel}>
                <article>
                  <h3>{panel.title}</h3>
                  {panel.content}
                </article>
              </TiltCard>
            </ScrollReveal>
          ))}
        </section>

        <ScrollReveal delay={420}>
          <p className={styles.aboutHighlight}>
            虽然是只会点鼠标的猴子，但会认真把每一次点击都变成可复现的安全实践。
          </p>
        </ScrollReveal>
      </div>
    </>
  );
};

export default AboutPage;
