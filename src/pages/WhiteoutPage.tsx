import React, { useEffect, useRef } from 'react';

const WhiteoutPage: React.FC = () => {
  const hasAlertedRef = useRef(false);

  useEffect(() => {
    if (hasAlertedRef.current) {
      return;
    }

    hasAlertedRef.current = true;
    window.alert('不说了不说了删库跑路了');
  }, []);

  return (
    <main
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: '#ffffff',
        zIndex: 99999
      }}
      aria-label="rm-rm-whiteout"
    />
  );
};

export default WhiteoutPage;
