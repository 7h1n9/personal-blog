import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './DinoGame.module.css';

type Phase = 'idle' | 'running' | 'over';

interface Obstacle {
  x: number;
  width: number;
  height: number;
  variant: number;
  passed: boolean;
}

interface GameState {
  dinoY: number;
  velocityY: number;
  started: boolean;
  gameOver: boolean;
  obstacles: Obstacle[];
  spawnTicker: number;
  nextSpawn: number;
  speed: number;
  score: number;
  frame: number;
}

const GAME_WIDTH = 920;
const GAME_HEIGHT = 240;
const GROUND_LEVEL = 192;
const DINO_X = 78;
const DINO_WIDTH = 34;
const DINO_HEIGHT = 44;
const GRAVITY = 0.8;
const JUMP_VELOCITY = -14.8;
const BASE_SPEED = 6.6;
const MAX_SPEED = 14.2;
const BEST_SCORE_KEY = 'blog-404-dino-best-score';

const randomBetween = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

const createInitialState = (): GameState => ({
  dinoY: GROUND_LEVEL - DINO_HEIGHT,
  velocityY: 0,
  started: false,
  gameOver: false,
  obstacles: [],
  spawnTicker: 0,
  nextSpawn: 82,
  speed: BASE_SPEED,
  score: 0,
  frame: 0
});

const createObstacle = (): Obstacle => ({
  x: GAME_WIDTH + randomBetween(20, 160),
  width: Math.floor(randomBetween(18, 34)),
  height: Math.floor(randomBetween(30, 76)),
  variant: Math.random() > 0.5 ? 1 : 2,
  passed: false
});

const hasCollision = (dinoY: number, obstacles: Obstacle[]): boolean => {
  const dinoRect = {
    x: DINO_X + 6,
    y: dinoY + 5,
    width: DINO_WIDTH - 11,
    height: DINO_HEIGHT - 9
  };

  return obstacles.some((obstacle) => {
    const obstacleRect = {
      x: obstacle.x + 3,
      y: GROUND_LEVEL - obstacle.height + 3,
      width: obstacle.width - 6,
      height: obstacle.height - 4
    };

    return (
      dinoRect.x < obstacleRect.x + obstacleRect.width &&
      dinoRect.x + dinoRect.width > obstacleRect.x &&
      dinoRect.y < obstacleRect.y + obstacleRect.height &&
      dinoRect.y + dinoRect.height > obstacleRect.y
    );
  });
};

const DinoGame: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const stateRef = useRef<GameState>(createInitialState());
  const scoreRef = useRef(0);

  const initialBestScore =
    typeof window === 'undefined'
      ? 0
      : Number.parseInt(window.localStorage.getItem(BEST_SCORE_KEY) || '0', 10) || 0;

  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(initialBestScore);
  const bestScoreRef = useRef(initialBestScore);
  const [phase, setPhase] = useState<Phase>('idle');

  useEffect(() => {
    bestScoreRef.current = bestScore;
  }, [bestScore]);

  const resetGame = useCallback((startImmediately = false) => {
    const nextState = createInitialState();

    if (startImmediately) {
      nextState.started = true;
      nextState.velocityY = JUMP_VELOCITY;
      setPhase('running');
    } else {
      setPhase('idle');
    }

    stateRef.current = nextState;
    scoreRef.current = 0;
    setScore(0);
  }, []);

  const handleAction = useCallback(() => {
    const gameState = stateRef.current;

    if (gameState.gameOver) {
      resetGame(true);
      return;
    }

    if (!gameState.started) {
      gameState.started = true;
      setPhase('running');
    }

    const onGround = gameState.dinoY >= GROUND_LEVEL - DINO_HEIGHT - 0.2;
    if (onGround) {
      gameState.velocityY = JUMP_VELOCITY;
    }
  }, [resetGame]);

  const updateGame = useCallback(() => {
    const gameState = stateRef.current;

    if (!gameState.started || gameState.gameOver) {
      return;
    }

    gameState.frame += 1;
    gameState.velocityY += GRAVITY;
    gameState.dinoY += gameState.velocityY;

    if (gameState.dinoY >= GROUND_LEVEL - DINO_HEIGHT) {
      gameState.dinoY = GROUND_LEVEL - DINO_HEIGHT;
      gameState.velocityY = 0;
    }

    gameState.spawnTicker += 1;
    if (gameState.spawnTicker >= gameState.nextSpawn) {
      gameState.obstacles.push(createObstacle());
      gameState.spawnTicker = 0;
      gameState.nextSpawn = Math.floor(randomBetween(58, 110));
    }

    for (const obstacle of gameState.obstacles) {
      obstacle.x -= gameState.speed;

      if (!obstacle.passed && obstacle.x + obstacle.width < DINO_X) {
        obstacle.passed = true;
        gameState.score += 24;
      }
    }

    gameState.obstacles = gameState.obstacles.filter((obstacle) => obstacle.x + obstacle.width > -24);

    gameState.speed = Math.min(gameState.speed + 0.0042, MAX_SPEED);
    gameState.score += gameState.speed * 0.24;

    const currentScore = Math.floor(gameState.score);
    if (currentScore !== scoreRef.current) {
      scoreRef.current = currentScore;
      setScore(currentScore);
    }

    if (hasCollision(gameState.dinoY, gameState.obstacles)) {
      gameState.gameOver = true;
      setPhase('over');

      if (currentScore > bestScoreRef.current) {
        bestScoreRef.current = currentScore;
        setBestScore(currentScore);

        if (typeof window !== 'undefined') {
          window.localStorage.setItem(BEST_SCORE_KEY, String(currentScore));
        }
      }
    }
  }, []);

  const drawGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const context = canvas.getContext('2d');
    if (!context) {
      return;
    }

    const gameState = stateRef.current;

    context.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    const backgroundGradient = context.createLinearGradient(0, 0, 0, GAME_HEIGHT);
    backgroundGradient.addColorStop(0, '#02122f');
    backgroundGradient.addColorStop(1, '#060a18');
    context.fillStyle = backgroundGradient;
    context.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    context.strokeStyle = 'rgba(110, 190, 255, 0.15)';
    context.lineWidth = 1;
    for (let x = 0; x < GAME_WIDTH; x += 34) {
      context.beginPath();
      context.moveTo(x, 0);
      context.lineTo(x, GAME_HEIGHT);
      context.stroke();
    }

    context.beginPath();
    context.moveTo(0, GROUND_LEVEL + 0.5);
    context.lineTo(GAME_WIDTH, GROUND_LEVEL + 0.5);
    context.strokeStyle = 'rgba(110, 220, 255, 0.7)';
    context.lineWidth = 2;
    context.stroke();

    context.fillStyle = '#d8ecff';
    context.fillRect(DINO_X, gameState.dinoY, DINO_WIDTH, DINO_HEIGHT);

    context.fillStyle = '#031738';
    context.fillRect(DINO_X + DINO_WIDTH - 12, gameState.dinoY + 10, 5, 5);

    const legShift = gameState.started && !gameState.gameOver ? (Math.floor(gameState.frame / 5) % 2) * 4 : 0;
    context.fillStyle = '#c7e4ff';
    context.fillRect(DINO_X + 6, gameState.dinoY + DINO_HEIGHT - 10 + legShift, 6, 12 - legShift);
    context.fillRect(DINO_X + DINO_WIDTH - 12, gameState.dinoY + DINO_HEIGHT - 10 - legShift, 6, 12 + legShift);

    for (const obstacle of gameState.obstacles) {
      const obstacleBaseY = GROUND_LEVEL - obstacle.height;
      context.fillStyle = '#53f0ff';
      context.fillRect(obstacle.x, obstacleBaseY, obstacle.width, obstacle.height);

      if (obstacle.variant === 1) {
        context.fillRect(obstacle.x - 6, obstacleBaseY + 12, 6, 10);
      } else {
        context.fillRect(obstacle.x + obstacle.width, obstacleBaseY + 16, 6, 12);
      }
    }

    context.fillStyle = 'rgba(229, 245, 255, 0.96)';
    context.font = '15px "JetBrains Mono", monospace';
    context.textAlign = 'left';
    context.fillText(`SCORE ${String(Math.floor(gameState.score)).padStart(5, '0')}`, 16, 24);
    context.fillText(`BEST  ${String(bestScoreRef.current).padStart(5, '0')}`, 16, 44);

    if (!gameState.started) {
      context.textAlign = 'center';
      context.fillStyle = 'rgba(229, 245, 255, 0.85)';
      context.font = '16px "JetBrains Mono", monospace';
      context.fillText('PRESS SPACE / TAP TO START', GAME_WIDTH / 2, GAME_HEIGHT / 2);
    }

    if (gameState.gameOver) {
      context.textAlign = 'center';
      context.fillStyle = 'rgba(255, 100, 120, 0.95)';
      context.font = '18px "JetBrains Mono", monospace';
      context.fillText('GAME OVER', GAME_WIDTH / 2, GAME_HEIGHT / 2 - 16);
      context.fillStyle = 'rgba(229, 245, 255, 0.92)';
      context.font = '14px "JetBrains Mono", monospace';
      context.fillText('PRESS SPACE OR CLICK TO RESTART', GAME_WIDTH / 2, GAME_HEIGHT / 2 + 14);
    }
  }, []);

  useEffect(() => {
    const loop = () => {
      updateGame();
      drawGame();
      animationFrameRef.current = window.requestAnimationFrame(loop);
    };

    animationFrameRef.current = window.requestAnimationFrame(loop);

    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [drawGame, updateGame]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space' || event.code === 'ArrowUp' || event.code === 'KeyW') {
        event.preventDefault();
        handleAction();
      }
    };

    window.addEventListener('keydown', onKeyDown, { passive: false });

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [handleAction]);

  const onPointerStart = (event: React.PointerEvent<HTMLDivElement>) => {
    const target = event.target as HTMLElement;

    if (target.closest('button')) {
      return;
    }

    event.preventDefault();
    handleAction();
  };

  return (
    <section className={styles.gameRoot}>
      <div className={styles.headerRow}>
        <h2>404 Dino Runner</h2>
        <p>空格 / ↑ / 点击屏幕跳跃</p>
      </div>

      <div className={styles.canvasWrap} onPointerDown={onPointerStart}>
        <canvas
          ref={canvasRef}
          width={GAME_WIDTH}
          height={GAME_HEIGHT}
          className={styles.gameCanvas}
          aria-label="404 恐龙小游戏"
        />
      </div>

      <div className={styles.footerRow}>
        <span>当前分数: {score}</span>
        <span>最高分: {bestScore}</span>
        {phase === 'over' ? (
          <button type="button" className={styles.restartButton} onClick={() => resetGame(true)}>
            再来一局
          </button>
        ) : null}
      </div>
    </section>
  );
};

export default DinoGame;
