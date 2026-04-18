import React, { useMemo, useRef } from 'react';
import styles from './TiltCard.module.css';

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
}

const TiltCard: React.FC<TiltCardProps> = ({ children, className = '', maxTilt = 9 }) => {
  const nodeRef = useRef<HTMLDivElement | null>(null);

  const canHover = useMemo(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  }, []);

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!canHover || !nodeRef.current) {
      return;
    }

    const rect = nodeRef.current.getBoundingClientRect();
    const px = ((event.clientX - rect.left) / rect.width) * 100;
    const py = ((event.clientY - rect.top) / rect.height) * 100;

    const rotateY = ((px - 50) / 50) * maxTilt;
    const rotateX = ((50 - py) / 50) * maxTilt;

    nodeRef.current.style.setProperty('--tilt-rotate-x', `${rotateX.toFixed(2)}deg`);
    nodeRef.current.style.setProperty('--tilt-rotate-y', `${rotateY.toFixed(2)}deg`);
    nodeRef.current.style.setProperty('--tilt-light-x', `${px.toFixed(2)}%`);
    nodeRef.current.style.setProperty('--tilt-light-y', `${py.toFixed(2)}%`);
  };

  const handleLeave = () => {
    if (!nodeRef.current) {
      return;
    }

    nodeRef.current.style.setProperty('--tilt-rotate-x', '0deg');
    nodeRef.current.style.setProperty('--tilt-rotate-y', '0deg');
    nodeRef.current.style.setProperty('--tilt-light-x', '50%');
    nodeRef.current.style.setProperty('--tilt-light-y', '50%');
  };

  return (
    <div
      ref={nodeRef}
      className={`${styles.tiltCard} ${className}`.trim()}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <div className={styles.inner}>{children}</div>
      <span className={styles.glare} aria-hidden="true" />
    </div>
  );
};

export default TiltCard;
