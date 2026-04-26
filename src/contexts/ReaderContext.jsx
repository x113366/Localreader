import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { storage } from '../utils/storage';

const ReaderContext = createContext();

export const useReader = () => {
  const context = useContext(ReaderContext);
  if (!context) {
    throw new Error('useReader must be used within ReaderProvider');
  }
  return context;
};

export const ReaderProvider = ({ children }) => {
  const [currentBook, setCurrentBook] = useState(null);
  const [currentChapter, setCurrentChapter] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showChapterList, setShowChapterList] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef(null);
  const readingStartTime = useRef(null);

  useEffect(() => {
    if (currentBook) {
      const progress = storage.getReadingProgress(currentBook.id);
      setScrollPosition(progress.position);
      setCurrentChapter(progress.chapterIndex);
      readingStartTime.current = Date.now();
    }
  }, [currentBook]);

  // 监听URL变化，支持直接访问带章节号的URL
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      const match = hash.match(/^#\/book\/(\w+)\/(\d+)$/);
      if (match && currentBook && currentBook.id === match[1]) {
        const chapterIndex = parseInt(match[2], 10) - 1;
        if (chapterIndex >= 0 && chapterIndex < currentBook.chapters.length) {
          setCurrentChapter(chapterIndex);
          setScrollPosition(0);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // 初始加载时检查

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [currentBook]);

  useEffect(() => {
    if (currentBook && readingStartTime.current) {
      const elapsedSeconds = (Date.now() - readingStartTime.current) / 1000;
      storage.addReadingTime(currentBook.id, elapsedSeconds);
      readingStartTime.current = Date.now();
    }
  }, [currentBook, scrollPosition]);

  const saveProgress = () => {
    if (currentBook) {
      storage.setReadingProgress(currentBook.id, {
        position: scrollPosition,
        chapterIndex: currentChapter
      });
    }
  };

  const openBook = (book) => {
    setCurrentBook(book);
    const progress = storage.getReadingProgress(book.id);
    setScrollPosition(progress.position);
    setCurrentChapter(progress.chapterIndex);
    readingStartTime.current = Date.now();
    // 更新URL，模拟参考网页的URL结构
    const url = new URL(window.location.href);
    url.hash = `#/book/${book.id}/${progress.chapterIndex + 1}`;
    window.history.pushState({}, '', url.toString());
  };

  const closeBook = () => {
    saveProgress();
    if (currentBook) {
      storage.addReadingTime(currentBook.id, (Date.now() - readingStartTime.current) / 1000);
    }
    setCurrentBook(null);
    setCurrentChapter(0);
    setScrollPosition(0);
  };

  const goToChapter = (chapterIndex) => {
    setIsLoading(true);
    // 模拟页面刷新效果
    setTimeout(() => {
      setCurrentChapter(chapterIndex);
      setScrollPosition(0);
      if (currentBook) {
        // 每一章数据分别储存
        storage.setReadingProgress(currentBook.id, {
          position: 0,
          chapterIndex
        });
        // 更新URL，模拟参考网页的URL结构
        const url = new URL(window.location.href);
        url.hash = `#/book/${currentBook.id}/${chapterIndex + 1}`;
        window.history.pushState({}, '', url.toString());
      }
      setIsLoading(false);
    }, 300);
  };

  const nextChapter = () => {
    if (currentBook && currentChapter < currentBook.chapters.length - 1) {
      goToChapter(currentChapter + 1);
    }
  };

  const prevChapter = () => {
    if (currentBook && currentChapter > 0) {
      goToChapter(currentChapter - 1);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const toggleChapterList = () => {
    setShowChapterList(!showChapterList);
    if (!showChapterList) setShowSettings(false);
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
    if (!showSettings) setShowChapterList(false);
  };

  const toggleLock = () => {
    setIsLocked(!isLocked);
    if (!isLocked) {
      setShowChapterList(false);
      setShowSettings(false);
    }
  };

  const updateScrollPosition = (position) => {
    setScrollPosition(position);
    if (currentBook) {
      const progress = {
        position,
        chapterIndex: currentChapter
      };
      storage.setReadingProgress(currentBook.id, progress);
    }
  };

  const value = {
    currentBook,
    currentChapter,
    scrollPosition,
    isFullscreen,
    showChapterList,
    showSettings,
    isLocked,
    isLoading,
    containerRef,
    openBook,
    closeBook,
    goToChapter,
    nextChapter,
    prevChapter,
    toggleFullscreen,
    toggleChapterList,
    toggleSettings,
    toggleLock,
    updateScrollPosition,
    saveProgress
  };

  return (
    <ReaderContext.Provider value={value}>
      {children}
    </ReaderContext.Provider>
  );
};