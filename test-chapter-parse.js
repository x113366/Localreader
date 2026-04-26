import fs from 'fs';

// 章节解析函数
function parseTxtContent(content) {
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

      // 提取章节标题的核心部分
      const chapterTitle = chapterMatch[0];

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
}

// 读取文件内容
const filePath = '/Users/xiaohansong/Downloads/种灵植后我成了神兽团宠.txt';
const content = fs.readFileSync(filePath, 'utf8');

// 解析章节
const chapters = parseTxtContent(content);

// 输出结果
console.log(`共解析出 ${chapters.length} 章：`);
chapters.forEach((chapter, index) => {
  console.log(`${index + 1}. ${chapter.title}`);
});