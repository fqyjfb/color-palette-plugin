import React, { useState, useCallback, useEffect, FC, ChangeEvent, KeyboardEvent, CSSProperties } from 'react';
import {
  hexToRgb, rgbToHsl, rgbToHsv, isValidHex,
  generateAllSchemes, basicColors, popularPalettes,
  RGB, HSL, HSV, ColorScheme
} from './colorUtils';

interface ToastItem {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

const useToast = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((toast: Omit<ToastItem, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString(36).slice(2, 6);
    setToasts((prev: ToastItem[]) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev: ToastItem[]) => prev.filter((t: ToastItem) => t.id !== id));
    }, 3000);
  }, []);

  return { toasts, addToast };
};

const ToastContainer: FC<{ toasts: ToastItem[] }> = ({ toasts }) => {
  if (toasts.length === 0) return null;

  const colorMap: Record<string, string> = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    warning: 'bg-amber-500',
    info: 'bg-blue-600',
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`px-4 py-2 rounded-lg text-white text-sm shadow-lg ${colorMap[toast.type] || colorMap.info}`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
};

const PaletteIcon: FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
    <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
    <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
    <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
    <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
  </svg>
);

const CopyIcon: FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const ClipboardIcon: FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
  </svg>
);

const ToolPanel: FC = () => {
  const { toasts, addToast } = useToast();
  const [hex, setHex] = useState('#845EC2');
  const [inputValue, setInputValue] = useState('#845EC2');
  const [rgb, setRgb] = useState<RGB>({ r: 132, g: 94, b: 194 });
  const [hsl, setHsl] = useState<HSL>({ h: 264, s: 46, l: 56 });
  const [hsv, setHsv] = useState<HSV>({ h: 264, s: 52, v: 76 });
  const [colorSchemes, setColorSchemes] = useState<ColorScheme[]>([]);
  const [activeSchemeId, setActiveSchemeId] = useState<string>('generic-gradient');

  useEffect(() => setColorSchemes(generateAllSchemes(hex)), [hex]);

  const handleCopy = useCallback((text: string) => {
    if (!text) {
      addToast({ message: '没有可复制的内容', type: 'warning' });
      return;
    }
    navigator.clipboard.writeText(text).then(() => {
      addToast({ message: '已复制到剪贴板', type: 'success' });
    }).catch(() => {
      addToast({ message: '复制失败', type: 'error' });
    });
  }, [addToast]);

  const updateColor = useCallback((newHex: string) => {
    const cleanedHex = newHex.trim().replace(/[^0-9a-fA-F#]/g, '');
    if (!isValidHex(cleanedHex)) {
      return;
    }
    const formattedHex = cleanedHex.startsWith('#') ? cleanedHex : `#${cleanedHex}`;
    setHex(formattedHex);
    setInputValue(formattedHex);
    const rgbValue = hexToRgb(formattedHex)!;
    setRgb(rgbValue);
    setHsl(rgbToHsl(rgbValue.r, rgbValue.g, rgbValue.b));
    setHsv(rgbToHsv(rgbValue.r, rgbValue.g, rgbValue.b));
  }, []);

  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const allowed = /^#?[0-9a-fA-F]*$/;
    if (allowed.test(value)) {
      setInputValue(value);
    }
  }, []);

  const handleInputBlur = React.useCallback(() => {
    if (isValidHex(inputValue)) {
      updateColor(inputValue);
    } else if (inputValue.length > 0) {
      setInputValue(hex);
      addToast({ message: '无效的颜色值', type: 'error' });
    }
  }, [inputValue, hex, updateColor, addToast]);

  const handleInputKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleInputBlur();
    }
  }, [handleInputBlur]);

  const handlePaste = React.useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      const cleaned = text.trim().replace(/[^0-9a-fA-F#]/g, '');
      if (isValidHex(cleaned)) {
        updateColor(cleaned);
        addToast({ message: '已粘贴', type: 'success' });
      } else {
        addToast({ message: '无效的颜色值', type: 'error' });
      }
    } catch {
      addToast({ message: '粘贴失败', type: 'error' });
    }
  }, [updateColor, addToast]);

  const handleColorCardClick = React.useCallback((color: string) => {
    handleCopy(color);
  }, [handleCopy]);

  const currentScheme = colorSchemes.find(s => s.id === activeSchemeId);

  return (
    <div className="h-full flex flex-col p-4 overflow-hidden">
      <ToastContainer toasts={toasts} />
      <div className="flex items-center gap-3 mb-4">
        <PaletteIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
        <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">调色板</h2>
      </div>

      <div className="flex-1 flex gap-4 overflow-hidden">
        <div className="w-80 flex-shrink-0 flex flex-col gap-4 overflow-y-auto">
          <div className="rounded-lg overflow-hidden shadow-lg" style={{ backgroundColor: hex }}>
            <div className="p-4">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    onKeyDown={handleInputKeyDown}
                    className="w-full pr-9 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-mono text-sm focus:outline-none focus:border-blue-500"
                    placeholder="#845EC2"
                    maxLength={7}
                  />
                  <button
                    onClick={handlePaste}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    title="粘贴"
                  >
                    <ClipboardIcon className="w-3.5 h-3.5 text-gray-500 dark:text-gray-400" />
                  </button>
                </div>
                <input
                  type="color"
                  value={hex}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateColor(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border-0"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {[
              { label: 'HEX', value: hex },
              { label: 'RGB', value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
              { label: 'HSL', value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
              { label: 'HSV', value: `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)` },
            ].map((item) => (
              <div key={item.label} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 dark:text-gray-400 w-8">{item.label}</span>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={item.value}
                      readOnly
                      className="w-full px-2 py-1.5 bg-white dark:bg-gray-600 rounded text-xs font-mono text-gray-800 dark:text-gray-200 focus:outline-none"
                    />
                    <button
                      onClick={() => handleCopy(item.value)}
                      className="absolute right-1 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors"
                      title="复制"
                    >
                      <CopyIcon className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
            <h3 className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">配色方案</h3>
            <div className="flex flex-wrap gap-1.5">
              {colorSchemes.map((scheme) => (
                <button
                  key={scheme.id}
                  onClick={() => setActiveSchemeId(scheme.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs transition-colors ${
                    activeSchemeId === scheme.id
                      ? 'bg-orange-500 text-white'
                      : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500'
                  }`}
                >
                  {scheme.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-auto p-4">
          {currentScheme && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-base font-medium text-gray-800 dark:text-gray-200">{currentScheme.name}</span>
                <span className="text-xs text-gray-500 dark:text-gray-400">{currentScheme.description}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {currentScheme.colors.map((color, index) => (
                  <button
                    key={`${color}-${index}`}
                    className="w-10 h-10 rounded-lg cursor-pointer border-2 border-gray-200 hover:border-gray-400 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color } as CSSProperties}
                    data-color={color}
                    onClick={() => handleColorCardClick(color)}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">基础颜色</h3>
            <div className="flex flex-wrap gap-2">
              {basicColors.map((color) => (
                <button
                  key={color.hex}
                  className="w-10 h-10 rounded-lg cursor-pointer border-2 border-gray-200 hover:border-gray-400 hover:scale-110 transition-transform"
                  style={{ backgroundColor: color.hex } as CSSProperties}
                  data-color={color.name}
                  onClick={() => updateColor(color.hex)}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">流行配色</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {popularPalettes.map((palette) => (
                <div key={palette.name} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{palette.name}</span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">{palette.description}</div>
                  <div className="flex flex-wrap gap-2">
                    {palette.colors.map((color, index) => (
                      <button
                        key={`${palette.name}-${color}-${index}`}
                        className="w-8 h-8 rounded cursor-pointer border border-gray-300 hover:border-gray-500 hover:scale-110 transition-transform"
                        style={{ backgroundColor: color } as CSSProperties}
                        data-color={color}
                        onClick={() => handleColorCardClick(color)}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ToolPanel;
