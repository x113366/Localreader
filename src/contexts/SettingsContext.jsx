import { createContext, useContext, useState, useEffect } from 'react';
import { storage, getDefaultSettings, THEMES } from '../utils/storage';

const SettingsContext = createContext();

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within SettingsProvider');
  }
  return context;
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(getDefaultSettings());

  useEffect(() => {
    const savedSettings = storage.getSettings();
    setSettings(savedSettings);
  }, []);

  const updateSettings = (newSettings) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    storage.setSettings(updated);
  };

  const setTheme = (themeName) => {
    const theme = THEMES[themeName];
    if (theme) {
      updateSettings({
        theme: themeName,
        backgroundColor: theme.background,
        textColor: theme.text
      });
    }
  };

  const setCustomColors = (backgroundColor, textColor) => {
    updateSettings({
      theme: 'custom',
      backgroundColor,
      textColor
    });
  };

  const resetSettings = () => {
    const defaultSettings = getDefaultSettings();
    setSettings(defaultSettings);
    storage.setSettings(defaultSettings);
  };

  const applySettingsToElement = (element) => {
    if (!element) return;

    element.style.setProperty('--font-family', settings.fontFamily);
    element.style.setProperty('--font-size', `${settings.fontSize}px`);
    element.style.setProperty('--line-height', settings.lineHeight);
    element.style.setProperty('--paragraph-spacing', `${settings.paragraphSpacing}px`);
    element.style.setProperty('--page-margin', `${settings.pageMargin}px`);
    element.style.setProperty('--background-color', settings.backgroundColor);
    element.style.setProperty('--text-color', settings.textColor);
    element.style.setProperty('--brightness', settings.brightness);
  };

  const value = {
    settings,
    updateSettings,
    setTheme,
    setCustomColors,
    resetSettings,
    applySettingsToElement,
    THEMES
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};