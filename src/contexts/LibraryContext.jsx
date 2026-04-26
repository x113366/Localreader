import { createContext, useContext, useState, useEffect } from 'react';
import { storage } from '../utils/storage';
import { parseTxtContent, extractBookTitle } from '../utils/txtParser';

const LibraryContext = createContext();

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context) {
    throw new Error('useLibrary must be used within LibraryProvider');
  }
  return context;
};

export const LibraryProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [groups, setGroups] = useState([]);
  const [viewMode, setViewMode] = useState('list');
  const [selectedBooks, setSelectedBooks] = useState([]);

  useEffect(() => {
    const savedLibrary = storage.getLibrary();
    setBooks(savedLibrary);
  }, []);

  const addBooks = (newBooks) => {
    const booksWithMetadata = newBooks.map((book) => ({
      id: Date.now() + Math.random(),
      title: book.title,
      content: book.content,
      chapters: book.chapters,
      importedAt: new Date().toISOString(),
      lastReadAt: null,
      group: null,
      totalLength: book.content.length
    }));

    const updatedLibrary = [...books, ...booksWithMetadata];
    setBooks(updatedLibrary);
    storage.setLibrary(updatedLibrary);
  };

  const removeBooks = (bookIds) => {
    const updatedLibrary = books.filter((book) => !bookIds.includes(book.id));
    setBooks(updatedLibrary);
    storage.setLibrary(updatedLibrary);
    setSelectedBooks([]);
  };

  const updateBook = (bookId, updates) => {
    const updatedLibrary = books.map((book) =>
      book.id === bookId ? { ...book, ...updates } : book
    );
    setBooks(updatedLibrary);
    storage.setLibrary(updatedLibrary);
  };

  const reorderBooks = (startIndex, endIndex) => {
    const newBooks = Array.from(books);
    const [removed] = newBooks.splice(startIndex, 1);
    newBooks.splice(endIndex, 0, removed);
    setBooks(newBooks);
    storage.setLibrary(newBooks);
  };

  const createGroup = (name) => {
    const newGroup = {
      id: Date.now(),
      name,
      bookIds: []
    };
    setGroups([...groups, newGroup]);
  };

  const deleteGroup = (groupId) => {
    setGroups(groups.filter((g) => g.id !== groupId));
    books.forEach((book) => {
      if (book.group === groupId) {
        updateBook(book.id, { group: null });
      }
    });
  };

  const addBooksToGroup = (groupId, bookIds) => {
    books.forEach((book) => {
      if (bookIds.includes(book.id)) {
        updateBook(book.id, { group: groupId });
      }
    });
  };

  const importBooks = async (files) => {
    const parsedBooks = [];

    for (const file of files) {
      if (file.name.endsWith('.txt')) {
        const content = await file.text();
        const title = extractBookTitle(file.name);
        const chapters = parseTxtContent(content);

        parsedBooks.push({
          title,
          content,
          chapters
        });
      }
    }

    addBooks(parsedBooks);
    return parsedBooks.length;
  };

  const value = {
    books,
    groups,
    viewMode,
    selectedBooks,
    setViewMode,
    setSelectedBooks,
    addBooks,
    removeBooks,
    updateBook,
    reorderBooks,
    createGroup,
    deleteGroup,
    addBooksToGroup,
    importBooks
  };

  return (
    <LibraryContext.Provider value={value}>
      {children}
    </LibraryContext.Provider>
  );
};