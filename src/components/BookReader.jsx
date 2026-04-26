import { useEffect, useRef, useState } from 'react';
import { useReader } from '../contexts/ReaderContext';
import { useSettings } from '../contexts/SettingsContext';
import { ChapterList } from './ChapterList';
import { SettingsPanel } from './SettingsPanel';

export const BookReader = () => {
  const {
    currentBook,
    currentChapter,
    showChapterList,
    showSettings,
    isLocked,
    isLoading,
    closeBook,
    nextChapter,
    prevChapter,
    toggleFullscreen,
    toggleChapterList,
    toggleSettings,
    toggleLock,
    updateScrollPosition
  } = useReader();

  const { settings, applySettingsToElement } = useSettings();
  const [loadedChapters, setLoadedChapters] = useState([currentChapter]);
  const contentRef = useRef(null);
  const scrollRef = useRef(null);
  const [showControls, setShowControls] = useState(true);
  const [showChapterIndicator, setShowChapterIndicator] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      applySettingsToElement(contentRef.current);
    }
  }, [settings, applySettingsToElement]);

  // 方向键控制章节切换
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isLocked) return;
      
      switch (e.key) {
        case 'ArrowLeft':
          // 左方向键，上一章
          prevChapter();
          break;
        case 'ArrowRight':
          // 右方向键，下一章
          nextChapter();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLocked, prevChapter, nextChapter]);

  // 当章节变化时，滚动到章节开头
  useEffect(() => {
    // 使用requestAnimationFrame确保内容渲染完成后再设置滚动位置
    const timer = setTimeout(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop = 0;
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [currentChapter]);

  // 当章节变化时，更新已加载章节列表
  useEffect(() => {
    setLoadedChapters([currentChapter]);
  }, [currentChapter]);

  // 滚动事件监听器，用于显示章节指示器
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = scrollRef.current?.scrollTop || 0;
      setScrollY(currentScrollY);
      
      // 当滚动到页面顶部100px以内时显示章节指示器
      setShowChapterIndicator(currentScrollY < 100);
    };

    const scrollArea = scrollRef.current;
    if (scrollArea) {
      scrollArea.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (scrollArea) {
        scrollArea.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  // 移除鼠标移动显示控制元素的功能，减少误触
  // 只有在初始时和点击专门按钮后才会显示控制元素

  const isSwitchingChapter = useRef(false);

  const handleContentScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const position = scrollTop / (scrollHeight - clientHeight);
    updateScrollPosition(position);

    // 模式2：当距离章节结尾还有2页时，自动加载下一章
    if (settings.chapterLoadMode === 2 && currentBook) {
      const pageHeight = clientHeight;
      const twoPagesHeight = pageHeight * 2;
      const distanceToBottom = scrollHeight - scrollTop - clientHeight;

      // 当距离底部还有2页高度，且当前章节不是最后一章，且下一章还未加载
      if (distanceToBottom < twoPagesHeight && 
          currentChapter < currentBook.chapters.length - 1 && 
          !loadedChapters.includes(currentChapter + 1)) {
        // 加载下一章
        setLoadedChapters(prev => [...prev, currentChapter + 1]);
      }
    }
  };

  const clickRef = useRef({ count: 0, timer: null });

  const handleContentClick = (e) => {
    if (isLocked) return;

    const { clientX, clientY } = e;
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (clientX < width * 0.3) {
      // 点击左侧，上一章
      prevChapter();
    } else if (clientX > width * 0.7) {
      // 点击右侧，下一章
      nextChapter();
    } else {
      // 处理双击逻辑
      clickRef.current.count += 1;
      
      if (clickRef.current.timer) {
        clearTimeout(clickRef.current.timer);
      }
      
      clickRef.current.timer = setTimeout(() => {
        if (clickRef.current.count === 2) {
          // 双击，切换控制元素显示
          toggleControls();
        }
        clickRef.current.count = 0;
      }, 300);
    }
  };

  const toggleControls = () => {
    setShowControls(!showControls);
  };

  if (!currentBook) return null;

  const chapter = currentBook.chapters[currentChapter];

  return (
    <div className="reader-layout">
      {/* 加载指示器 */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
          <p>加载中...</p>
        </div>
      )}

      {/* 头部控制栏 */}
      {showControls && !isLocked && !isLoading && (
        <header className="reader-header" onClick={(e) => e.stopPropagation()}>
          <button className="back-btn" onClick={closeBook}>
            ← 返回
          </button>
          <h2 className="book-title">{currentBook.title}</h2>
          <div className="header-actions">
            <button onClick={toggleChapterList} title="目录">
              目录
            </button>
            <button onClick={toggleLock} title="锁定屏幕">
              {isLocked ? '🔓' : '🔒'}
            </button>
            <button onClick={toggleSettings} title="设置">
              ⚙
            </button>
            <button onClick={toggleFullscreen} title="全屏">
              ⛶
            </button>
          </div>
        </header>
      )}

      {/* 独立的可滚动内容区域 */}
      <main 
        ref={scrollRef}
        className="reader-scroll-area"
        onScroll={handleContentScroll}
        style={{
          backgroundColor: settings.backgroundColor,
          filter: `brightness(${settings.brightness})`,
          paddingTop: showControls ? '80px' : '20px',
          paddingBottom: showControls ? '80px' : '20px',
          borderLeft: settings.pageMargin > 0 ? `2px solid ${settings.marginLineColor || 'rgba(74, 137, 220, 0.3)'}` : 'none',
          borderRight: settings.pageMargin > 0 ? `2px solid ${settings.marginLineColor || 'rgba(74, 137, 220, 0.3)'}` : 'none'
        }}
      >
        <div
          ref={contentRef}
          className="reader-content"
          onClick={handleContentClick}
          style={{
            fontFamily: settings.fontFamily,
            fontSize: `${settings.fontSize}px`,
            lineHeight: settings.lineHeight,
            color: settings.textColor,
            padding: `0 ${settings.pageMargin}px`,
            transition: 'opacity 0.3s'
          }}
        >
          {chapter && (
            <>
              {/* 章节标题 - 与正文一起显示，字号大两号 */}
              <h1 
                className="chapter-title"
                style={{
                  fontSize: `${parseFloat(settings.fontSize) + 6}px`,
                  marginBottom: '40px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  color: settings.textColor
                }}
              >
                {chapter.title}
              </h1>
              <div className="chapter-content">
                {chapter.content
                  .split('\n')
                  .filter(line => line.trim() !== '')
                  .map((paragraph, index) => (
                    <p
                      key={index}
                      style={{
                        marginBottom: (settings.paragraphSpacingEnabled !== false) ? settings.paragraphSpacing : 0,
                        textIndent: (settings.firstLineIndent || 2) > 0 ? `${settings.firstLineIndent || 2}em` : '0'
                      }}
                    >
                      {paragraph}
                    </p>
                  ))}
                
                {/* 换章处显示下一章章节名 */}
                {currentChapter < currentBook.chapters.length - 1 && (
                  <div className="next-chapter-indicator">
                    <div className="next-chapter-content">
                      <span>下一章：{currentBook.chapters[currentChapter + 1].title}</span>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>

      {/* 底部控制栏 */}
      {showControls && !isLocked && !isLoading && (
        <footer className="reader-footer" onClick={(e) => e.stopPropagation()}>
          <button onClick={prevChapter} disabled={currentChapter === 0}>
            上一章
          </button>
          <button onClick={toggleChapterList}>
            目录
          </button>
          <button
            onClick={nextChapter}
            disabled={currentChapter >= currentBook.chapters.length - 1}
          >
            下一章
          </button>
        </footer>
      )}

      {/* 锁定指示器 */}
      {isLocked && !isLoading && (
        <div className="lock-indicator" onClick={toggleLock}>
          <span>🔒 点击解锁</span>
        </div>
      )}

      {/* 右下角章节进度指示器 */}
      {!isLocked && !isLoading && (
        <div className={`chapter-progress-indicator ${showControls ? 'with-controls' : ''}`}>
          <div className="progress-content">
            <span className="chapter-info">第 {currentChapter + 1} 章</span>
            <span className="progress-percentage">{Math.round((currentChapter / (currentBook.chapters.length - 1)) * 100) || 0}%</span>
          </div>
        </div>
      )}





      {/* 侧边栏模块 - 独立于滚动区域 */}
      {showChapterList && !isLocked && (
        <div className="sidebar-overlay" onClick={toggleChapterList}>
          <div className="sidebar-container" onClick={(e) => e.stopPropagation()}>
            <ChapterList onClose={toggleChapterList} />
          </div>
        </div>
      )}

      {showSettings && !isLocked && (
        <div className="sidebar-overlay" onClick={toggleSettings}>
          <div className="sidebar-container" onClick={(e) => e.stopPropagation()}>
            <SettingsPanel onClose={toggleSettings} />
          </div>
        </div>
      )}
    </div>
  );
};
