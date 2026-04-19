import React, { useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Header from './components/Header';
import Nav from './components/Nav';
import Sidebar from './components/Sidebar';
import Footer from './components/Footer';
import EntryGate from './components/EntryGate';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import HomePage from './pages/HomePage';
import ArticlesPage from './pages/ArticlesPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import AboutPage from './pages/AboutPage';
import SubscribePage from './pages/SubscribePage';
import NotFoundPage from './pages/NotFoundPage';
import WhiteoutPage from './pages/WhiteoutPage';
import styles from './App.module.css';

const BLOG_TITLE = 'NEON STACK | 未来安全笔记';

const CODE_STREAMS = [
  { text: 'const signal = sync(ui, performance, motion);', top: '8%', duration: '24s', delay: '-2s' },
  { text: 'useTransition(() => renderRoute(nextLocation));', top: '18%', duration: '30s', delay: '-12s' },
  { text: '<NeonCard depth={3} glow="soft" />', top: '30%', duration: '20s', delay: '-7s' },
  { text: 'requestAnimationFrame(paintFrame);', top: '42%', duration: '26s', delay: '-16s' },
  { text: 'const fps = monitor.frameRate(window.performance);', top: '54%', duration: '28s', delay: '-9s' },
  { text: 'if (entry.isIntersecting) reveal(element);', top: '66%', duration: '22s', delay: '-18s' },
  { text: 'type Theme = "dark" | "light";', top: '78%', duration: '34s', delay: '-4s' },
  { text: 'deploy({ edge: true, cache: "stale-while-revalidate" });', top: '88%', duration: '27s', delay: '-22s' }
];

const EDGE_CODE_STREAMS = [
  {
    text: 'const frame = requestAnimationFrame(loop);',
    left: '8%',
    durationLeft: 7.6,
    durationRight: 3.6,
    delayLeft: -1,
    delayRight: -3
  },
  {
    text: 'if (theme === "dark") injectCodeRain();',
    left: '24%',
    durationLeft: 6.8,
    durationRight: 4.2,
    delayLeft: -4,
    delayRight: -6
  },
  {
    text: 'observer.observe(targetNode);',
    left: '39%',
    durationLeft: 5.8,
    durationRight: 4.8,
    delayLeft: -7,
    delayRight: -9
  },
  {
    text: 'render(<RouteTransition mode="neon" />);',
    left: '56%',
    durationLeft: 4.8,
    durationRight: 5.8,
    delayLeft: -10,
    delayRight: -12
  },
  {
    text: 'latency <= 16ms && fps >= 60',
    left: '71%',
    durationLeft: 4.2,
    durationRight: 6.8,
    delayLeft: -13,
    delayRight: -15
  },
  {
    text: 'const token = motionTokens.medium;',
    left: '86%',
    durationLeft: 3.6,
    durationRight: 7.6,
    delayLeft: -16,
    delayRight: -18
  }
];

const ThemeWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme } = useTheme();

  useEffect(() => {
    document.body.classList.remove('light', 'dark');
    document.body.classList.add(theme);
  }, [theme]);

  return <>{children}</>;
};

const AppShell: React.FC = () => {
  const location = useLocation();
  const [entryGateOpen, setEntryGateOpen] = useState(true);

  if (location.pathname === '/rm-rm') {
    return <WhiteoutPage />;
  }

  const handleSubscribe = (email: string) => {
    window.alert(`订阅成功，已将更新提醒发送到 ${email}`);
  };

  return (
    <>
      <EntryGate open={entryGateOpen} onEnter={() => setEntryGateOpen(false)} />
      <div className={`${styles.sideCodeField} ${styles.sideCodeFieldLeft}`} aria-hidden="true">
        {EDGE_CODE_STREAMS.map((stream, index) => (
          <span
            key={`left-${stream.text}-${index}`}
            className={styles.sideCodeLine}
            style={{
              left: stream.left,
              animationDuration: `${stream.durationLeft}s`,
              animationDelay: `${stream.delayLeft}s`
            }}
          >
            {stream.text}
          </span>
        ))}
      </div>

      <div className={`${styles.sideCodeField} ${styles.sideCodeFieldRight}`} aria-hidden="true">
        {EDGE_CODE_STREAMS.map((stream, index) => (
          <span
            key={`right-${stream.text}-${index}`}
            className={styles.sideCodeLine}
            style={{
              left: stream.left,
              animationDuration: `${stream.durationRight}s`,
              animationDelay: `${stream.delayRight}s`
            }}
          >
            {stream.text}
          </span>
        ))}
      </div>

      <div className={styles.pageLayout}>
        <div className={styles.backdropGrid} aria-hidden="true" />
        <div className={styles.backdropGlowLeft} aria-hidden="true" />
        <div className={styles.backdropGlowRight} aria-hidden="true" />

        <div className={styles.codeStreams} aria-hidden="true">
          {CODE_STREAMS.map((stream, index) => (
            <span
              key={`${stream.text}-${index}`}
              className={styles.codeLine}
              style={{
                top: stream.top,
                animationDuration: stream.duration,
                animationDelay: stream.delay
              }}
            >
              {stream.text}
            </span>
          ))}
        </div>

        <Header title={BLOG_TITLE} />
        <Nav />

        <main className={styles.mainArea}>
          <div className={styles.routeTransition} key={`${location.pathname}${location.search}`}>
            <Routes location={location}>
              <Route path="/" element={<HomePage />} />
              <Route path="/articles" element={<ArticlesPage />} />
              <Route path="/articles/:id" element={<ArticleDetailPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/subscribe" element={<SubscribePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
        </main>

        <Sidebar onSubscribe={handleSubscribe} />
        <Footer />
      </div>
    </>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ThemeWrapper>
        <AppShell />
      </ThemeWrapper>
    </ThemeProvider>
  );
};

export default App;

