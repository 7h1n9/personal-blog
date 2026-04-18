import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Terminal, type ITheme } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import styles from './PseudoTerminal.module.css';

type TerminalPalette = 'green' | 'amber' | 'cyber';

interface PaletteConfig {
  label: string;
  background: string;
  foreground: string;
  cursor: string;
  glow: string;
}

const PALETTES: Record<TerminalPalette, PaletteConfig> = {
  green: {
    label: '经典黑客绿',
    background: '#0d0d0d',
    foreground: '#33ff00',
    cursor: '#b6ff9a',
    glow: 'rgba(51, 255, 0, 0.35)'
  },
  amber: {
    label: '琥珀复古',
    background: '#1a1a1a',
    foreground: '#ffb000',
    cursor: '#ffe09a',
    glow: 'rgba(255, 176, 0, 0.35)'
  },
  cyber: {
    label: '赛博朋克',
    background: '#060b1e',
    foreground: '#19f7ff',
    cursor: '#ff4bd8',
    glow: 'rgba(25, 247, 255, 0.32)'
  }
};

const PROMPT = 'guest@neon-stack:~$ ';

const HACK_STREAM = [
  '[*] boot exploit matrix...',
  '[*] loading stealth packet forge...',
  '[+] probe 10.13.37.0/24: 14 hosts alive',
  '[+] tunnel established => relay-node-04',
  '[*] bypassing mock firewall signatures...',
  '[+] checksum mismatch injected',
  '[*] escalating pseudo privileges...',
  '[+] mirror buffer synced @ 2048kb',
  '[*] exfil simulation channel opened...',
  '[!] intrusion simulator finished (safe mode)'
];

const HELP_LINES = [
  'help               列出可用指令',
  'ls /               查看模拟文件',
  'whoami             显示访客身份',
  'clear              清空屏幕',
  'cat                显示文件内容',
  'env                查看环境变量',
  'sudo               提权尝试',
  'hack               可以试试这个神秘指令',
  'rm -rf /           补药尝试',
  'theme <green|amber|cyber>  切换终端主题'
];

const createTheme = (palette: PaletteConfig): ITheme => ({
  background: palette.background,
  foreground: palette.foreground,
  cursor: palette.cursor,
  cursorAccent: palette.background,
  selectionBackground: 'rgba(255, 255, 255, 0.18)',
  black: '#101010',
  brightBlack: '#3a3a3a',
  green: palette.foreground,
  brightGreen: palette.cursor,
  cyan: '#4ff9ff',
  brightCyan: '#86ffff',
  magenta: '#ff42df',
  brightMagenta: '#ff88f3'
});

const randomHex = (size: number): string => {
  const seed = '0123456789abcdef';
  let output = '';

  for (let index = 0; index < size; index += 1) {
    output += seed[Math.floor(Math.random() * seed.length)];
  }

  return output;
};

const PseudoTerminal: React.FC = () => {
  const navigate = useNavigate();
  const hostRef = useRef<HTMLDivElement | null>(null);
  const terminalRef = useRef<Terminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);
  const inputBufferRef = useRef('');
  const hackingRef = useRef(false);
  const hackTimerRef = useRef<number | null>(null);
  const [palette, setPalette] = useState<TerminalPalette>('green');

  useEffect(() => {
    const terminal = terminalRef.current;

    if (!terminal) {
      return;
    }

    terminal.setOption('theme', createTheme(PALETTES[palette]));
  }, [palette]);

  useEffect(() => {
    const host = hostRef.current;

    if (!host) {
      return;
    }

    const terminal = new Terminal({
      cursorBlink: true,
      cursorStyle: 'block',
      fontFamily: '"Fira Code", "JetBrains Mono", "Courier New", monospace',
      fontSize: 14,
      lineHeight: 1.28,
      letterSpacing: 0.3,
      convertEol: true,
      scrollback: 2500,
      allowTransparency: true,
      theme: createTheme(PALETTES[palette])
    });

    const fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);
    terminal.open(host);
    fitAddon.fit();

    terminalRef.current = terminal;
    fitAddonRef.current = fitAddon;

    const writePrompt = () => {
      terminal.write(PROMPT);
    };

    const runCommand = (rawCommand: string) => {
      const command = rawCommand.trim();
      const normalized = command.toLowerCase();

      if (!command) {
        writePrompt();
        return;
      }

      if (normalized === 'help') {
        HELP_LINES.forEach((line) => {
          terminal.writeln(line);
        });
        writePrompt();
        return;
      }

      if (normalized === 'ls /' || normalized === 'ls') {
        terminal.writeln('resume.pdf  secret_plans.txt  flag.txt  mission.log  tools/');
        writePrompt();
        return;
      }

      if (normalized === 'whoami') {
        terminal.writeln('guest_visitor_007');
        writePrompt();
        return;
      }

      if (normalized === 'clear') {
        terminal.clear();
        writePrompt();
        return;
      }

      if (normalized === 'cat flag.txt') {
        terminal.writeln('flag{S033y_7h1s_1s_F4k3_f1a9}');
        writePrompt();
        return;
      }

      if (normalized === 'sudo') {
        terminal.writeln('nice try, but you are not root.');
        writePrompt();
        return;
      }

      if (normalized === 'env') {
        terminal.writeln('TERM=xterm-neon');
        terminal.writeln('USER=guest_visitor_007');
        terminal.writeln('SHELL=/usr/bin/pseudo-shell');
        terminal.writeln('SESSION=arc-9f4c');
        terminal.writeln('CHAOS_MODE=enabled');
        terminal.writeln('FLAG_CACHE=flag{竟然被你发现了真弗拉格}');
        writePrompt();
        return;
      }

      if (normalized.startsWith('theme ')) {
        const targetPalette = normalized.split(/\s+/)[1] as TerminalPalette;

        if (targetPalette in PALETTES) {
          setPalette(targetPalette);
          terminal.writeln(`theme switched -> ${targetPalette}`);
        } else {
          terminal.writeln('usage: theme <green|amber|cyber>');
        }

        writePrompt();
        return;
      }

      if (normalized === 'hack') {
        if (hackingRef.current) {
          terminal.writeln('hack simulation already running...');
          return;
        }

        hackingRef.current = true;
        terminal.writeln('[*] entering hack simulation mode...');
        let tick = 0;

        hackTimerRef.current = window.setInterval(() => {
          const line = HACK_STREAM[tick];

          if (line) {
            terminal.writeln(line);
          }

          if (tick % 2 === 0) {
            terminal.writeln(`0x${randomHex(28)} :: packet-scramble`);
          }

          tick += 1;

          if (tick > HACK_STREAM.length + 6) {
            if (hackTimerRef.current) {
              window.clearInterval(hackTimerRef.current);
            }

            hackTimerRef.current = null;
            hackingRef.current = false;
            window.alert('嘉豪模式');
            writePrompt();
          }
        }, 92);

        return;
      }

      if (normalized === 'rm -rf /' || normalized === 'rm -rf /') {
        navigate('/rm-rm');
        return;
      }

      terminal.writeln(`command not found: ${command}`);
      terminal.writeln('type "help" to list available commands.');
      writePrompt();
    };

    const dataSubscription = terminal.onData((data) => {
      if (hackingRef.current) {
        return;
      }

      if (data === '\r') {
        terminal.write('\r\n');
        runCommand(inputBufferRef.current);
        inputBufferRef.current = '';
        return;
      }

      if (data === '\u0003') {
        terminal.write('^C\r\n');
        inputBufferRef.current = '';
        writePrompt();
        return;
      }

      if (data === '\u007f') {
        if (!inputBufferRef.current.length) {
          return;
        }

        inputBufferRef.current = inputBufferRef.current.slice(0, -1);
        terminal.write('\b \b');
        return;
      }

      const code = data.charCodeAt(0);
      const isControlCode = code <= 31 || code === 127;

      if (isControlCode) {
        return;
      }

      inputBufferRef.current += data;
      terminal.write(data);
    });

    const handleResize = () => {
      fitAddon.fit();
    };

    window.addEventListener('resize', handleResize);

    if ('ResizeObserver' in window) {
      resizeObserverRef.current = new ResizeObserver(() => {
        fitAddon.fit();
      });
      resizeObserverRef.current.observe(host);
    }

    terminal.writeln('NEON PSEUDO TERMINAL v0.1');
    terminal.writeln('type "help" and press enter');
    writePrompt();
    terminal.focus();

    return () => {
      dataSubscription.dispose();
      window.removeEventListener('resize', handleResize);
      resizeObserverRef.current?.disconnect();

      if (hackTimerRef.current) {
        window.clearInterval(hackTimerRef.current);
      }

      terminal.dispose();
      terminalRef.current = null;
      fitAddonRef.current = null;
      hackTimerRef.current = null;
      hackingRef.current = false;
      inputBufferRef.current = '';
    };
  }, [navigate]);

  return (
    <section
      className={styles.terminalPlugin}
      data-palette={palette}
      style={
        {
          '--term-glow': PALETTES[palette].glow
        } as React.CSSProperties
      }
    >
      <header className={styles.toolbar}>
        <div className={styles.windowButtons} aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <p className={styles.toolbarTitle}>pseudo-shell://home-console</p>
        <div className={styles.paletteButtons}>
          {(Object.keys(PALETTES) as TerminalPalette[]).map((key) => (
            <button
              key={key}
              type="button"
              className={`${styles.paletteButton} ${palette === key ? styles.paletteButtonActive : ''}`.trim()}
              onClick={() => setPalette(key)}
              aria-label={`切换到${PALETTES[key].label}`}
            >
              {PALETTES[key].label}
            </button>
          ))}
        </div>
      </header>

      <div className={styles.terminalFrame}>
        <div ref={hostRef} className={styles.terminalHost} />
        <span className={styles.scanlineLayer} aria-hidden="true" />
        <span className={styles.vignetteLayer} aria-hidden="true" />
      </div>
    </section>
  );
};

export default PseudoTerminal;
