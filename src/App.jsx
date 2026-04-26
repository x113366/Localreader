import { LibraryProvider, useLibrary } from './contexts/LibraryContext';
import { ReaderProvider, useReader } from './contexts/ReaderContext';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import { Bookshelf } from './components/Bookshelf';
import { BookReader } from './components/BookReader';
import './App.css';

function AppContent() {
  const { currentBook } = useReader();
  const { settings } = useSettings();

  return (
    <div 
      className="app"
      style={{
        '--control-color': settings.controlColor || '#4a89dc',
        '--control-color-rgb': settings.controlColor ? hexToRgb(settings.controlColor) : '74, 137, 220'
      }}
    >
      {currentBook ? <BookReader /> : <Bookshelf />}
    </div>
  );
}

function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result 
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` 
    : '74, 137, 220';
}

function App() {
  return (
    <SettingsProvider>
      <LibraryProvider>
        <ReaderProvider>
          <AppContent />
        </ReaderProvider>
      </LibraryProvider>
    </SettingsProvider>
  );
}

export default App;