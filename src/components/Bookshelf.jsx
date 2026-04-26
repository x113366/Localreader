import { useState, useRef, useEffect } from 'react';
import { useLibrary } from '../contexts/LibraryContext';
import { useReader } from '../contexts/ReaderContext';
import { storage } from '../utils/storage';
import { formatReadingProgress, formatReadingTime } from '../utils/txtParser';

const BookItem = ({ book, isSelected, onSelect, onOpen, viewMode }) => {
  const progress = storage.getReadingProgress(book.id);
  const readingTime = storage.getReadingTime(book.id);
  const progressPercent = formatReadingProgress(progress.position, book.totalLength);

  if (viewMode === 'grid') {
    return (
      <div
        className={`book-item grid-view ${isSelected ? 'selected' : ''}`}
        onClick={() => onOpen(book)}
        onContextMenu={(e) => {
          e.preventDefault();
          onSelect(book.id);
        }}
      >
        <div className="book-cover">
          <div className="book-icon">📖</div>
          {isSelected && <div className="selected-indicator">✓</div>}
        </div>
        <div className="book-info">
          <h3 className="book-title">{book.title}</h3>
          <div className="book-meta">
            <span className="progress">{progressPercent}</span>
            <span className="reading-time">{formatReadingTime(readingTime)}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`book-item list-view ${isSelected ? 'selected' : ''}`}
      onClick={() => onOpen(book)}
      onContextMenu={(e) => {
        e.preventDefault();
        onSelect(book.id);
      }}
    >
      <div className="book-icon-small">📖</div>
      <div className="book-details">
        <h3 className="book-title">{book.title}</h3>
        <div className="book-stats">
          <span className="progress">{progressPercent}</span>
          <span className="reading-time">{formatReadingTime(readingTime)}</span>
          <span className="import-date">
            {new Date(book.importedAt).toLocaleDateString()}
          </span>
        </div>
      </div>
      {isSelected && <div className="selected-indicator">✓</div>}
    </div>
  );
};

export const Bookshelf = () => {
  const {
    books,
    viewMode,
    setViewMode,
    selectedBooks,
    setSelectedBooks,
    removeBooks,
    importBooks
  } = useLibrary();
  const { openBook } = useReader();
  const fileInputRef = useRef(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [showSidebar, setShowSidebar] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('importedAt');

  const calculateReadingStats = () => {
    let totalReadingTime = 0;
    let totalBooks = books.length;
    let readBooks = 0;

    books.forEach(book => {
      const readingTime = storage.getReadingTime(book.id);
      totalReadingTime += readingTime;
      const progress = storage.getReadingProgress(book.id);
      if (progress.position >= 0.99) {
        readBooks++;
      }
    });

    return {
      totalBooks,
      readBooks,
      totalReadingTime
    };
  };

  const stats = calculateReadingStats();

  const handleImport = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      await importBooks(files);
    }
  };

  const handleSelect = (bookId) => {
    if (selectedBooks.includes(bookId)) {
      setSelectedBooks(selectedBooks.filter((id) => id !== bookId));
    } else {
      setSelectedBooks([...selectedBooks, bookId]);
    }
  };

  const handleDelete = () => {
    if (selectedBooks.length > 0) {
      setShowDeleteConfirm(true);
    }
  };

  const confirmDelete = () => {
    removeBooks(selectedBooks);
    setShowDeleteConfirm(false);
  };

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index) {
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className="bookshelf-layout">
      {/* 侧边栏 */}
      <div className={`sidebar ${showSidebar ? 'expanded' : 'collapsed'}`}>
        <div className="sidebar-header">
          <h1 className="sidebar-title">
            <span className="logo">📚</span>
            {showSidebar && <span className="title-text">书架</span>}
          </h1>
          <button
            className="sidebar-toggle"
            onClick={toggleSidebar}
            title={showSidebar ? '收起侧边栏' : '展开侧边栏'}
          >
            {showSidebar ? '‹' : '›'}
          </button>
        </div>

        <div className="sidebar-actions">
          <button
            className="import-btn sidebar-btn"
            onClick={() => fileInputRef.current?.click()}
          >
            <span className="btn-icon">+</span>
            {showSidebar && <span className="btn-text">导入书籍</span>}
          </button>
          {showSidebar && (
            <button className="new-group-btn sidebar-btn">
              <span className="btn-icon">+</span>
              <span className="btn-text">新建分组</span>
            </button>
          )}
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">
            <button className="nav-item active">
              <span className="nav-icon">📚</span>
              {showSidebar && <span className="nav-text">全部书籍</span>}
            </button>
            <button className="nav-item">
              <span className="nav-icon">🕒</span>
              {showSidebar && <span className="nav-text">最近阅读</span>}
            </button>
          </div>

          {showSidebar && (
            <div className="nav-section">
              <h3 className="nav-section-title">我的分组</h3>
              <button className="nav-item">
                <span className="nav-icon">📁</span>
                <span className="nav-text">未分组</span>
              </button>
            </div>
          )}
        </nav>

        {showSidebar && (
          <div className="sidebar-stats">
            <h3 className="stats-title">阅读统计</h3>
            <div className="stats-grid">
              <div className="stat-item">
                <div className="stat-label">今日</div>
                <div className="stat-value">1分钟</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">本周</div>
                <div className="stat-value">0秒</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">总计</div>
                <div className="stat-value">{formatReadingTime(stats.totalReadingTime)}</div>
              </div>
            </div>
            <div className="stats-footer">
              <span>书籍数量: {stats.totalBooks}</span>
            </div>
          </div>
        )}
      </div>

      {/* 主内容区域 */}
      <main className={`main-content ${showSidebar ? 'sidebar-expanded' : 'sidebar-collapsed'}`}>
        <header className="main-header">
          <div className="header-search">
            <input
              type="text"
              placeholder="搜索书名或作者..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="header-controls">
            <button className="toggle-view-btn">
              切换视图
            </button>
            <select
              className="sort-select"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="importedAt">按导入时间</option>
              <option value="title">按书名</option>
              <option value="readingProgress">按阅读进度</option>
            </select>
            {selectedBooks.length > 0 && (
              <button 
                className="delete-btn"
                onClick={handleDelete}
              >
                删除书籍
              </button>
            )}
          </div>
        </header>

        <input
          ref={fileInputRef}
          type="file"
          accept=".txt"
          multiple
          onChange={handleImport}
          style={{ display: 'none' }}
        />

        {books.length === 0 ? (
          <div className="empty-shelf">
            <div className="empty-icon">📚</div>
            <h2>书架为空</h2>
            <p>点击上方「导入书籍」添加您的小说</p>
            <button onClick={() => fileInputRef.current?.click()}>
              + 导入第一本书
            </button>
          </div>
        ) : (
          <div className={`books-container ${viewMode}`}>
            {books.map((book, index) => (
              <div
                key={book.id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
              >
                <BookItem
                  book={book}
                  isSelected={selectedBooks.includes(book.id)}
                  onSelect={handleSelect}
                  onOpen={openBook}
                  viewMode={viewMode}
                />
              </div>
            ))}
          </div>
        )}

        {showDeleteConfirm && (
          <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
            <div className="modal-content delete-confirm" onClick={(e) => e.stopPropagation()}>
              <h3>确认删除</h3>
              <p>确定要删除选中的 {selectedBooks.length} 本书吗？</p>
              <p className="warning">此操作无法撤销</p>
              <div className="modal-actions">
                <button className="cancel-btn" onClick={() => setShowDeleteConfirm(false)}>
                  取消
                </button>
                <button className="confirm-btn" onClick={confirmDelete}>
                  确认删除
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
