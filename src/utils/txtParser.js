export const parseTxtContent = (content) => {
  const chapters = [];
  const lines = content.split('\n');
  let currentChapter = {
    title: '第一章',
    content: [],
    startLine: 0
  };

  const emptyLinePattern = /^\s*$/;

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();

    // 检查是否包含章节关键词，支持各种空格格式
    const chapterMatch = trimmedLine.match(/第\s*[一二三四五六七八九十百千万\d]+\s*[章节部回卷]/);
    if (chapterMatch) {
      if (currentChapter.content.length > 0) {
        chapters.push({
          ...currentChapter,
          content: currentChapter.content.join('\n')
        });
      }

      // 使用整行作为章节标题
      const chapterTitle = trimmedLine;

      currentChapter = {
        title: chapterTitle,
        content: [],
        startLine: index
      };
    } else if (emptyLinePattern.test(trimmedLine) && currentChapter.content.length > 0) {
      if (currentChapter.content[currentChapter.content.length - 1] !== '') {
        currentChapter.content.push('');
        currentChapter.content.push('');
      }
    } else if (!emptyLinePattern.test(trimmedLine)) {
      currentChapter.content.push(trimmedLine);
    }
  });

  if (currentChapter.content.length > 0) {
    chapters.push({
      ...currentChapter,
      content: currentChapter.content.join('\n')
    });
  }

  if (chapters.length === 0 && lines.length > 0) {
    chapters.push({
      title: '全文',
      content: content.trim(),
      startLine: 0
    });
  }

  return chapters;
};

export const extractBookTitle = (filename) => {
  return filename.replace(/\.txt$/i, '').trim();
};

export const formatReadingProgress = (currentPosition, totalLength) => {
  if (totalLength === 0) return '0%';
  return Math.round((currentPosition / totalLength) * 100) + '%';
};

export const formatReadingTime = (seconds) => {
  if (seconds < 60) return `${Math.round(seconds)}秒`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}分钟`;
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.round((seconds % 3600) / 60);
  return `${hours}小时${minutes}分钟`;
};