const STORAGE_KEYS = {
  LIBRARY: 'localreader_library',
  SETTINGS: 'localreader_settings',
  READING_PROGRESS: 'localreader_progress',
  READING_TIME: 'localreader_reading_time'
};

export const storage = {
  getLibrary: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LIBRARY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Failed to get library:', error);
      return [];
    }
  },

  setLibrary: (library) => {
    try {
      localStorage.setItem(STORAGE_KEYS.LIBRARY, JSON.stringify(library));
    } catch (error) {
      console.error('Failed to save library:', error);
    }
  },

  getSettings: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      const defaultSettings = getDefaultSettings();
      return data ? { ...defaultSettings, ...JSON.parse(data) } : defaultSettings;
    } catch (error) {
      console.error('Failed to get settings:', error);
      return getDefaultSettings();
    }
  },

  setSettings: (settings) => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  },

  getReadingProgress: (bookId) => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.READING_PROGRESS);
      const progress = data ? JSON.parse(data) : {};
      return progress[bookId] || { position: 0, chapterIndex: 0 };
    } catch (error) {
      console.error('Failed to get reading progress:', error);
      return { position: 0, chapterIndex: 0 };
    }
  },

  setReadingProgress: (bookId, progress) => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.READING_PROGRESS);
      const allProgress = data ? JSON.parse(data) : {};
      allProgress[bookId] = progress;
      localStorage.setItem(STORAGE_KEYS.READING_PROGRESS, JSON.stringify(allProgress));
    } catch (error) {
      console.error('Failed to save reading progress:', error);
    }
  },

  getReadingTime: (bookId) => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.READING_TIME);
      const times = data ? JSON.parse(data) : {};
      return times[bookId] || 0;
    } catch (error) {
      console.error('Failed to get reading time:', error);
      return 0;
    }
  },

  addReadingTime: (bookId, seconds) => {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.READING_TIME);
      const times = data ? JSON.parse(data) : {};
      times[bookId] = (times[bookId] || 0) + seconds;
      localStorage.setItem(STORAGE_KEYS.READING_TIME, JSON.stringify(times));
    } catch (error) {
      console.error('Failed to save reading time:', error);
    }
  }
};

export const getDefaultSettings = () => ({
  fontFamily: 'Georgia, serif',
  fontSize: 18,
  lineHeight: 1.8,
  paragraphSpacing: 16,
  pageMargin: 40,
  theme: 'light',
  backgroundColor: '#fefefe',
  textColor: '#333333',
  brightness: 1,
  autoLockTimeout: 0,
  firstLineIndent: 2,
  paragraphSpacingEnabled: true,
  chapterHighlight: true,
  marginLineColor: 'rgba(74, 137, 220, 0.3)',
  controlColor: '#4a89dc'
});

export const THEMES = {
  light: {
    name: '纯白',
    background: '#fefefe',
    text: '#333333'
  },
  sepia: {
    name: '米黄',
    background: '#f4ecd8',
    text: '#5b4636'
  },
  eyeCare: {
    name: '护眼绿',
    background: '#c7edcc',
    text: '#4a5a4a'
  },
  dark: {
    name: '夜间黑',
    background: '#1a1a1a',
    text: '#cccccc'
  }
};