import React, { useEffect } from 'react';
import styles from './EntryGate.module.css';

interface EntryGateProps {
  open: boolean;
  onEnter: () => void;
}

const EntryGate: React.FC<EntryGateProps> = ({ open, onEnter }) => {
  useEffect(() => {
    if (!open) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  if (!open) {
    return null;
  }

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="entry-gate-title">
      <div className={styles.backdropGlow} aria-hidden="true" />
      <section className={styles.modal}>
        <p id="entry-gate-title" className={styles.title}>
          Ciallo～(∠・ω&lt; )⌒☆
        </p>
        <h2 className={styles.subtitle}>欢迎来到我的未来安全日记</h2>
        <p className={styles.bodyText}>记录安全攻防，分享技术干货。愿你的未来，安全无虞，Hello World！</p>
        <button type="button" className={styles.enterButton} onClick={onEnter}>
          进入终端 / 开始探索
        </button>
      </section>
    </div>
  );
};

export default EntryGate;
