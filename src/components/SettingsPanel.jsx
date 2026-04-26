import { useState } from 'react';
import { useSettings } from '../contexts/SettingsContext';

export const SettingsPanel = ({ onClose }) => {
  const { settings, updateSettings, setTheme, setCustomColors, THEMES } = useSettings();
  const [customBgColor, setCustomBgColor] = useState(settings.backgroundColor);
  const [customTextColor, setCustomTextColor] = useState(settings.textColor);

  const handleFontFamilyChange = (e) => {
    updateSettings({ fontFamily: e.target.value });
  };

  const handleFontSizeChange = (e) => {
    updateSettings({ fontSize: parseInt(e.target.value) });
  };

  const handleLineHeightChange = (e) => {
    updateSettings({ lineHeight: parseFloat(e.target.value) });
  };

  const handleParagraphSpacingChange = (e) => {
    updateSettings({ paragraphSpacing: parseInt(e.target.value) });
  };

  const handlePageMarginChange = (e) => {
    updateSettings({ pageMargin: parseInt(e.target.value) });
  };

  const handleBrightnessChange = (e) => {
    updateSettings({ brightness: parseFloat(e.target.value) });
  };

  const handleThemeSelect = (themeName) => {
    setTheme(themeName);
  };

  const handleCustomColorApply = () => {
    setCustomColors(customBgColor, customTextColor);
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
  };

  const fonts = [
    { value: 'Georgia, serif', label: '经典衬线' },
    { value: '"Noto Serif SC", serif', label: '中文衬线' },
    { value: 'Arial, sans-serif', label: '无衬线' },
    { value: '"Microsoft YaHei", sans-serif', label: '微软雅黑' },
    { value: '"SimHei", "Microsoft YaHei", sans-serif', label: '黑体' },
    { value: '"YouYuan", "Microsoft YaHei", sans-serif', label: '圆体' },
    { value: 'Times, serif', label: '时代罗马' },
    { value: 'Courier, monospace', label: '打字机' }
  ];

  return (
    <div className="settings-overlay" onClick={onClose}>
      <div 
        className="settings-panel" 
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
      >
        <header className="settings-header">
          <h2>阅读设置</h2>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
        </header>

        <div className="settings-content">
          <section className="settings-section">
            <h3>字体</h3>
            <div className="setting-item">
              <label>字体样式</label>
              <select value={settings.fontFamily} onChange={handleFontFamilyChange}>
                {fonts.map((font) => (
                  <option key={font.value} value={font.value}>
                    {font.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="setting-item">
              <label>字体大小</label>
              <input
                type="range"
                min="12"
                max="32"
                value={settings.fontSize}
                onChange={handleFontSizeChange}
              />
              <span className="value-display">{settings.fontSize}px</span>
            </div>
          </section>

          <section className="settings-section">
            <h3>布局</h3>
            <div className="setting-item">
              <label>行距</label>
              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={settings.lineHeight}
                onChange={handleLineHeightChange}
              />
              <span className="value-display">{settings.lineHeight}</span>
            </div>
            <div className="setting-item">
              <label>段间距</label>
              <input
                type="range"
                min="0"
                max="40"
                value={settings.paragraphSpacing}
                onChange={handleParagraphSpacingChange}
              />
              <span className="value-display">{settings.paragraphSpacing}px</span>
            </div>
            <div className="setting-item">
              <label>页面边距</label>
              <input
                type="range"
                min="0"
                max="200"
                value={settings.pageMargin}
                onChange={handlePageMarginChange}
              />
              <span className="value-display">{settings.pageMargin}px</span>
            </div>
            <div className="setting-item">
              <label>页边距线条颜色</label>
              <div className="color-input-wrapper">
                <input
                  type="color"
                  value={settings.marginLineColor?.startsWith('rgba') ? '#4a89dc' : settings.marginLineColor || '#4a89dc'}
                  onChange={(e) => updateSettings({ marginLineColor: e.target.value })}
                />
                <input
                  type="text"
                  className="color-text-input"
                  value={settings.marginLineColor || 'rgba(74, 137, 220, 0.3)'}
                  onChange={(e) => updateSettings({ marginLineColor: e.target.value })}
                  placeholder="rgba(74, 137, 220, 0.3)"
                />
              </div>
            </div>
            <div className="setting-item">
              <label>控制元件颜色</label>
              <div className="color-input-wrapper">
                <input
                  type="color"
                  value={settings.controlColor || '#4a89dc'}
                  onChange={(e) => updateSettings({ controlColor: e.target.value })}
                />
                <input
                  type="text"
                  className="color-text-input"
                  value={settings.controlColor || '#4a89dc'}
                  onChange={(e) => updateSettings({ controlColor: e.target.value })}
                  placeholder="#4a89dc"
                />
              </div>
            </div>
          </section>

          <section className="settings-section">
            <h3>文本格式</h3>
            <div className="setting-item">
              <label>首行缩进</label>
              <input
                type="range"
                min="0"
                max="4"
                step="0.25"
                value={settings.firstLineIndent || 0}
                onChange={(e) => updateSettings({ firstLineIndent: parseFloat(e.target.value) })}
              />
              <span className="value-display">{settings.firstLineIndent || 0}em</span>
            </div>
            <div className="setting-item">
              <label>段落间空行</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button
                  className={`theme-btn ${(settings.paragraphSpacingEnabled !== false) ? 'active' : ''}`}
                  onClick={() => updateSettings({ paragraphSpacingEnabled: true })}
                  style={{ flex: 1 }}
                >
                  启用
                </button>
                <button
                  className={`theme-btn ${(settings.paragraphSpacingEnabled === false) ? 'active' : ''}`}
                  onClick={() => updateSettings({ paragraphSpacingEnabled: false })}
                  style={{ flex: 1 }}
                >
                  禁用
                </button>
              </div>
            </div>
            <div className="setting-item">
              <label>章节突出显示</label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <button
                  className={`theme-btn ${(settings.chapterHighlight !== false) ? 'active' : ''}`}
                  onClick={() => updateSettings({ chapterHighlight: true })}
                  style={{ flex: 1 }}
                >
                  启用
                </button>
                <button
                  className={`theme-btn ${(settings.chapterHighlight === false) ? 'active' : ''}`}
                  onClick={() => updateSettings({ chapterHighlight: false })}
                  style={{ flex: 1 }}
                >
                  禁用
                </button>
              </div>
            </div>
          </section>

          <section className="settings-section">
            <h3>主题</h3>
            <div className="theme-grid">
              {Object.entries(THEMES).map(([key, theme]) => (
                <button
                  key={key}
                  className={`theme-btn ${settings.theme === key ? 'active' : ''}`}
                  onClick={() => handleThemeSelect(key)}
                  style={{
                    backgroundColor: theme.background,
                    color: theme.text
                  }}
                >
                  {theme.name}
                </button>
              ))}
            </div>
          </section>

          <section className="settings-section">
            <h3>自定义配色</h3>
            <div className="color-pickers">
              <div className="color-picker-item">
                <label>背景色</label>
                <input
                  type="color"
                  value={customBgColor}
                  onChange={(e) => setCustomBgColor(e.target.value)}
                />
                <input
                  type="text"
                  value={customBgColor}
                  onChange={(e) => setCustomBgColor(e.target.value)}
                />
              </div>
              <div className="color-picker-item">
                <label>文字色</label>
                <input
                  type="color"
                  value={customTextColor}
                  onChange={(e) => setCustomTextColor(e.target.value)}
                />
                <input
                  type="text"
                  value={customTextColor}
                  onChange={(e) => setCustomTextColor(e.target.value)}
                />
              </div>
            </div>
            <button className="apply-colors-btn" onClick={handleCustomColorApply}>
              应用自定义颜色
            </button>
          </section>

          <section className="settings-section">
            <h3>屏幕亮度</h3>
            <div className="setting-item">
              <label>亮度调节</label>
              <input
                type="range"
                min="0.3"
                max="1"
                step="0.05"
                value={settings.brightness}
                onChange={handleBrightnessChange}
              />
              <span className="value-display">{Math.round(settings.brightness * 100)}%</span>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};