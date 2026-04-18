import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ScrollReveal from '../components/ScrollReveal';
import TiltCard from '../components/TiltCard';
import styles from './Pages.module.css';
import { getArticleById } from '../data/articles';

type ArticleSegment =
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'keyValue'; key: string; value: string }
  | { type: 'table'; headers: string[]; rows: string[][] };

const TABLE_HEADER_PATTERNS: string[][] = [
  ['攻击类型', '原理说明', '协议/特点'],
  ['特征', '说明'],
  ['工具类别', '代表工具', '主要用途'],
  ['攻击类型', '关键识别点', '防御核心', '考试重点'],
  ['步骤', '内容']
];

const normalizeForCompare = (value: string): string =>
  value
    .replace(/^[\d\s().（）、.\-]+/, '')
    .replace(/\s+/g, '')
    .toLowerCase()
    .trim();

const normalizeSectionText = (text: string): string =>
  text
    .replace(/\r\n/g, '\n')
    .replace(/^[ \t]*[oO](?=\S)/gm, '• ')
    .replace(/^[ \t]*\s*/gm, '• ')
    .trim();

const isBulletLike = (value: string): boolean =>
  /^(?:[-*•]\s*|[✅❌⚠️📌📚🌐💡🔒🔔✍️👉]\s*)/.test(value.trim());

const isOrderedLike = (value: string): boolean =>
  /^(?:\(?\d+\)?|[一二三四五六七八九十]+)[.、)）]\s*/.test(value.trim());

const stripListToken = (value: string): string =>
  value
    .trim()
    .replace(/^(?:[-*•]\s*|[✅❌⚠️📌📚🌐💡🔒🔔✍️👉]\s*|(?:\(?\d+\)?|[一二三四五六七八九十]+)[.、)）]\s*)/, '')
    .trim();

const splitKeyValueInline = (value: string): { key: string; value: string } | null => {
  const line = value.trim();
  const separatorIndex = line.indexOf('：') >= 0 ? line.indexOf('：') : line.indexOf(':');

  if (separatorIndex <= 0 || separatorIndex >= 24 || separatorIndex === line.length - 1) {
    return null;
  }

  const key = line.slice(0, separatorIndex).trim();
  const content = line.slice(separatorIndex + 1).trim();

  if (!key || !content) {
    return null;
  }

  return { key, value: content };
};

const isShortLabel = (value: string): boolean => {
  const line = value.trim();
  return line.length > 0 && line.length <= 24 && !/[。；！？.!?]/.test(line) && !/[:：]/.test(line);
};

const isStandaloneHeading = (value: string): boolean => {
  const line = value.trim();

  if (!line || line.length > 38) {
    return false;
  }

  if (/^第[一二三四五六七八九十\d]+阶段[:：]/.test(line)) {
    return true;
  }

  if (/[:：]$/.test(line) && line.length <= 30) {
    return true;
  }

  if (/^(什么是|常见|总结|攻击步骤分解|攻击事件回顾|三大核心特征|主要方式|典型工具|用途|技术层面|管理层面|监测与响应)/.test(line)) {
    return true;
  }

  if (!/[。；！？.!?]/.test(line) && line.length <= 20) {
    return true;
  }

  return false;
};

const isTableBreakLine = (value: string): boolean => {
  const line = value.trim();
  return (
    isBulletLike(line) ||
    /^第[一二三四五六七八九十\d]+阶段[:：]/.test(line) ||
    (/[:：]$/.test(line) && line.length <= 24) ||
    /^[✅❌⚠️📌📚🌐💡🔒🔔✍️👉]/.test(line)
  );
};

const parseTableSegment = (
  blocks: string[],
  startIndex: number
): { segment: ArticleSegment; nextIndex: number } | null => {
  for (const headers of TABLE_HEADER_PATTERNS) {
    const hasPattern = headers.every(
      (header, offset) => normalizeForCompare(blocks[startIndex + offset] ?? '') === normalizeForCompare(header)
    );

    if (!hasPattern) {
      continue;
    }

    let cursor = startIndex + headers.length;
    const rows: string[][] = [];

    while (cursor + headers.length <= blocks.length) {
      const row = blocks.slice(cursor, cursor + headers.length);

      if (isTableBreakLine(row[0])) {
        break;
      }

      rows.push(row);
      cursor += headers.length;

      if (cursor < blocks.length && isTableBreakLine(blocks[cursor])) {
        break;
      }
    }

    if (!rows.length) {
      return null;
    }

    return {
      segment: { type: 'table', headers, rows },
      nextIndex: cursor
    };
  }

  return null;
};

const parseSectionSegments = (sectionTitle: string, sectionText: string): ArticleSegment[] => {
  const normalizedText = normalizeSectionText(sectionText);
  const blocks = normalizedText
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean);

  if (blocks.length > 0 && normalizeForCompare(blocks[0]) === normalizeForCompare(sectionTitle)) {
    blocks.shift();
  }

  const segments: ArticleSegment[] = [];
  let index = 0;

  while (index < blocks.length) {
    const tableParsed = parseTableSegment(blocks, index);

    if (tableParsed) {
      segments.push(tableParsed.segment);
      index = tableParsed.nextIndex;
      continue;
    }

    const current = blocks[index];

    if (isBulletLike(current) || isOrderedLike(current)) {
      const items: string[] = [];

      while (index < blocks.length && (isBulletLike(blocks[index]) || isOrderedLike(blocks[index]))) {
        const item = stripListToken(blocks[index]);

        if (item) {
          items.push(item);
        }

        index += 1;
      }

      if (items.length > 0) {
        segments.push({ type: 'list', items });
        continue;
      }
    }

    const inlineKeyValue = splitKeyValueInline(current);

    if (inlineKeyValue) {
      segments.push({ type: 'keyValue', key: inlineKeyValue.key, value: inlineKeyValue.value });
      index += 1;
      continue;
    }

    if (
      index + 1 < blocks.length &&
      isShortLabel(current) &&
      !isStandaloneHeading(blocks[index + 1]) &&
      !isBulletLike(blocks[index + 1]) &&
      !isOrderedLike(blocks[index + 1])
    ) {
      segments.push({ type: 'keyValue', key: current, value: blocks[index + 1] });
      index += 2;
      continue;
    }

    if (isStandaloneHeading(current)) {
      segments.push({ type: 'heading', text: current.replace(/[:：]$/, '') });
      index += 1;
      continue;
    }

    segments.push({ type: 'paragraph', text: current });
    index += 1;
  }

  return segments;
};

const normalizeCodeBlock = (rawCode: string): { language: string; code: string } => {
  const normalized = rawCode.replace(/\r\n/g, '\n').trim();
  const lines = normalized.split('\n');
  const firstLine = (lines[0] ?? '').trim().toLowerCase();
  const secondLine = (lines[1] ?? '').trim().toLowerCase();

  if ((firstLine === 'plain text' || firstLine === 'text') && secondLine && /^[a-z][\w-]*$/.test(secondLine)) {
    return {
      language: secondLine,
      code: lines.slice(2).join('\n').trim()
    };
  }

  if (/^[a-z][\w-]*$/.test(firstLine)) {
    return {
      language: firstLine,
      code: lines.slice(1).join('\n').trim()
    };
  }

  return {
    language: 'text',
    code: normalized
  };
};

const renderSegment = (segment: ArticleSegment, key: string) => {
  if (segment.type === 'heading') {
    return (
      <h4 key={key} className={styles.sectionSubheading}>
        {segment.text}
      </h4>
    );
  }

  if (segment.type === 'paragraph') {
    return (
      <p key={key} className={styles.sectionParagraph}>
        {segment.text}
      </p>
    );
  }

  if (segment.type === 'list') {
    return (
      <ul key={key} className={styles.sectionList}>
        {segment.items.map((item, index) => (
          <li key={`${key}-${index}`}>{item}</li>
        ))}
      </ul>
    );
  }

  if (segment.type === 'keyValue') {
    return (
      <div key={key} className={styles.sectionKeyValue}>
        <span className={styles.sectionKey}>{segment.key}</span>
        <span className={styles.sectionValue}>{segment.value}</span>
      </div>
    );
  }

  return (
    <div key={key} className={styles.sectionTableWrap}>
      <div className={styles.sectionTable} style={{ '--table-columns': segment.headers.length } as React.CSSProperties}>
        <div className={styles.sectionTableHeader}>
          {segment.headers.map((header) => (
            <span key={`${key}-${header}`}>{header}</span>
          ))}
        </div>
        {segment.rows.map((row, rowIndex) => (
          <div key={`${key}-row-${rowIndex}`} className={styles.sectionTableRow}>
            {row.map((cell, cellIndex) => (
              <span key={`${key}-row-${rowIndex}-cell-${cellIndex}`}>{cell}</span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

const ArticleDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const article = getArticleById(Number(id));

  if (!article) {
    return <Navigate to="/not-found" replace />;
  }

  return (
    <>
      <Helmet>
        <title>{article.title} | NEON STACK BLOG</title>
        <meta name="description" content={article.summary} />
      </Helmet>

      <article className={`${styles.page} ${styles.articleDetail}`}>
        <ScrollReveal>
          <header className={styles.articleHeader}>
            <h1 className={styles.pageTitle}>{article.title}</h1>
            <div className={styles.meta}>
              {article.date} | {article.author}
            </div>
            <p className={styles.articleLead}>{article.summary}</p>
            <div className={styles.tagRow}>
              {article.tags.map((tag) => (
                <span key={tag} className={styles.tagChip}>
                  {tag}
                </span>
              ))}
            </div>
          </header>
        </ScrollReveal>

        {article.contentSections.map((section, index) => {
          const segments = parseSectionSegments(section.title, section.text);
          const normalizedCode = section.code ? normalizeCodeBlock(section.code) : null;

          return (
            <ScrollReveal key={section.title} delay={index * 90 + 110}>
              <TiltCard className={styles.section}>
                <h3>{section.title}</h3>
                <div className={styles.sectionBody}>
                  {segments.map((segment, segmentIndex) => renderSegment(segment, `${section.title}-${segmentIndex}`))}
                </div>
                {normalizedCode ? (
                  <pre className={styles.codeBlock} data-lang={normalizedCode.language}>
                    <code>{normalizedCode.code}</code>
                  </pre>
                ) : null}
              </TiltCard>
            </ScrollReveal>
          );
        })}

        <ScrollReveal delay={260}>
          <footer className={styles.articleFooter}>
            <p className={styles.meta}>以上内容来自真实项目总结，欢迎在订阅页加入更新列表。</p>
          </footer>
        </ScrollReveal>
      </article>
    </>
  );
};

export default ArticleDetailPage;
