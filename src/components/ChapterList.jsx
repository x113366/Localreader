import { useState } from 'react';
import { useReader } from '../contexts/ReaderContext';

export const ChapterList = ({ onClose }) => {
  const { currentBook, currentChapter, goToChapter } = useReader();
  const [isReverse, setIsReverse] = useState(false);

  const handleChapterClick = (index) => {
    goToChapter(index);
    onClose();
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
  };

  const toggleReverse = () => {
    setIsReverse(!isReverse);
  };

  if (!currentBook) return null;

  const chapters = isReverse 
    ? [...currentBook.chapters].reverse() 
    : currentBook.chapters;

  return (
    <div className="chapter-list-overlay" onClick={onClose}>
      <div 
        className="chapter-list" 
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        <header className="chapter-list-header">
          <h2>目录</h2>
          <div className="header-actions">
            <button 
              className="reverse-btn"
              onClick={toggleReverse}
            >
              {isReverse ? '↑正序' : '↓倒序'}
            </button>
            <button className="close-btn" onClick={onClose}>
              ×
            </button>
          </div>
        </header>
        <div className="chapter-list-content">
          {chapters.map((chapter, index) => {
            const actualIndex = isReverse ? currentBook.chapters.length - 1 - index : index;
            return (
              <div
                key={actualIndex}
                className={`chapter-item ${actualIndex === currentChapter ? 'current' : ''}`}
                onClick={() => handleChapterClick(actualIndex)}
              >
                <span className="chapter-number">{actualIndex + 1}</span>
                <span className="chapter-title">{chapter.title}</span>
                {actualIndex === currentChapter && <span className="current-indicator">▶</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};