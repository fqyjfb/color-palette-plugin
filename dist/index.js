(function() {
  "use strict";
  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }
  function rgbToHex(r, g, b) {
    return "#" + [r, g, b].map((x) => Math.round(x).toString(16).padStart(2, "0")).join("");
  }
  function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  }
  function rgbToHsv(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    const d = max - min;
    const s = max === 0 ? 0 : d / max;
    const v = max;
    if (max !== min) {
      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) };
  }
  function hslToRgb(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p2, q2, t) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1 / 6) return p2 + (q2 - p2) * 6 * t;
        if (t < 1 / 2) return q2;
        if (t < 2 / 3) return p2 + (q2 - p2) * (2 / 3 - t) * 6;
        return p2;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1 / 3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1 / 3);
    }
    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
  }
  function isValidHex(hex) {
    return /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.test(hex);
  }
  const toHex = (h, s, l) => {
    const rgb = hslToRgb(h, s, l);
    return rgbToHex(rgb.r, rgb.g, rgb.b);
  };
  const uniqueColors = (colors) => {
    return [...new Set(colors)];
  };
  const getEffectiveHue = (hsl, fallbackHue = 220) => {
    return hsl.s > 5 ? hsl.h : fallbackHue;
  };
  const getEffectiveSaturation = (hsl, defaultSat = 70) => {
    return hsl.s > 5 ? hsl.s : defaultSat;
  };
  const colorSchemeGenerators = {
    "generic-gradient": (hsl) => {
      const steps = [15, 30, 50, 70, 85];
      return uniqueColors(steps.map((l) => toHex(hsl.h, hsl.s, l)));
    },
    "matching-gradient": (hsl) => {
      const baseL = hsl.l;
      const steps = [-35, -18, 0, 18, 35].map((d) => Math.max(10, Math.min(90, baseL + d)));
      return uniqueColors(steps.map((l) => toHex(hsl.h, hsl.s, l)));
    },
    "spot-palette": (hsl) => {
      const h = getEffectiveHue(hsl, 260);
      const s = getEffectiveSaturation(hsl, 75);
      const complementH = (h + 180) % 360;
      return uniqueColors([
        toHex(h, s, hsl.l),
        toHex((h + 30) % 360, s * 0.9, hsl.l),
        toHex((h + 60) % 360, s * 0.8, hsl.l),
        toHex(complementH, s, hsl.l),
        toHex((complementH + 30) % 360, s * 0.9, hsl.l)
      ]);
    },
    "twisted-spot-palette": (hsl) => {
      const h = getEffectiveHue(hsl, 180);
      const s = getEffectiveSaturation(hsl, 70);
      const complementH = (h + 180) % 360;
      return uniqueColors([
        toHex(h, s, hsl.l),
        toHex((h + 45) % 360, s * 0.8, hsl.l + 10),
        toHex((h + 90) % 360, s * 0.6, hsl.l - 10),
        toHex(complementH, s, hsl.l),
        toHex((complementH + 45) % 360, s * 0.8, hsl.l + 15)
      ]);
    },
    "classy-palette": (hsl) => {
      return uniqueColors([
        toHex(hsl.h, hsl.s * 0.5, 25),
        toHex(hsl.h, hsl.s * 0.7, 45),
        toHex(hsl.h, hsl.s, 60),
        toHex(hsl.h, hsl.s * 0.7, 75),
        toHex(hsl.h, hsl.s * 0.5, 90)
      ]);
    },
    "cube-palette": (hsl) => {
      const h = getEffectiveHue(hsl, 210);
      const s = getEffectiveSaturation(hsl, 70);
      const offsets = [0, 60, 120, 180, 240];
      const lightnessVariation = hsl.s < 5 ? [30, 45, 50, 55, 70] : [hsl.l, hsl.l, hsl.l, hsl.l, hsl.l];
      return uniqueColors(offsets.map((offset, i) => toHex((h + offset) % 360, s, lightnessVariation[i])));
    },
    "switch-palette": (hsl) => {
      const complementH = (hsl.h + 180) % 360;
      return uniqueColors([
        toHex(hsl.h, hsl.s, hsl.l),
        toHex(hsl.h, hsl.s, Math.min(85, hsl.l + 25)),
        toHex(complementH, hsl.s, hsl.l),
        toHex(complementH, hsl.s, Math.min(85, hsl.l + 25)),
        toHex(hsl.h, hsl.s * 0.4, 50)
      ]);
    },
    "small-switch-palette": (hsl) => {
      const complementH = (hsl.h + 180) % 360;
      return uniqueColors([
        toHex(hsl.h, hsl.s, hsl.l),
        toHex(complementH, hsl.s, hsl.l),
        toHex(hsl.h, hsl.s * 0.6, hsl.l),
        toHex(complementH, hsl.s * 0.6, hsl.l),
        "#f0f0f0"
      ]);
    },
    "skip-gradient": (hsl) => {
      const steps = [12, 32, 52, 72, 92];
      return uniqueColors(steps.map((l) => toHex(hsl.h, hsl.s, l)));
    },
    "natural-palette": (hsl) => {
      return uniqueColors([
        toHex(hsl.h, hsl.s * 0.6, 28),
        toHex(hsl.h, hsl.s * 0.75, 48),
        toHex(hsl.h, hsl.s, 65),
        toHex((hsl.h + 15) % 360, hsl.s * 0.5, 55),
        toHex((hsl.h - 15 + 360) % 360, hsl.s * 0.5, 55)
      ]);
    },
    "matching-palette": (hsl) => {
      const h = getEffectiveHue(hsl, 200);
      const s = getEffectiveSaturation(hsl, 65);
      const offsets = [0, 30, 60, 180, 210];
      return uniqueColors(offsets.map((offset) => toHex((h + offset) % 360, s, hsl.l)));
    },
    "squash-palette": (hsl) => {
      const steps = [28, 42, 56, 70, 84];
      return uniqueColors(steps.map((l) => toHex(hsl.h, hsl.s * 0.75, l)));
    },
    "grey-friends": (hsl) => {
      return uniqueColors([
        toHex(hsl.h, hsl.s, hsl.l),
        "#1a1a1a",
        "#333333",
        "#666666",
        "#cccccc"
      ]);
    },
    "dotting-palette": (hsl) => {
      const h = getEffectiveHue(hsl, 240);
      const s = getEffectiveSaturation(hsl, 70);
      const offset1 = (h + 60) % 360;
      const offset2 = (h + 120) % 360;
      return uniqueColors([
        toHex(h, s, hsl.l),
        toHex(offset1, s * 0.65, hsl.l),
        toHex(offset2, s * 0.65, hsl.l),
        toHex((h + 180) % 360, s * 0.4, 50),
        "#fafafa"
      ]);
    },
    "skip-shade-gradient": (hsl) => {
      const steps = [8, 28, 48, 68, 88];
      return uniqueColors(steps.map((l) => toHex(hsl.h, hsl.s, l)));
    },
    "threedom": (hsl) => {
      const h = getEffectiveHue(hsl, 240);
      const s = getEffectiveSaturation(hsl, 75);
      if (hsl.s < 5) {
        return uniqueColors([
          toHex(h, s, 60),
          toHex((h + 120) % 360, s, 60),
          toHex((h + 240) % 360, s, 60),
          "#ffffff",
          "#000000"
        ]);
      }
      return uniqueColors([
        toHex(h, s, hsl.l),
        toHex((h + 120) % 360, s, hsl.l),
        toHex((h + 240) % 360, s, hsl.l),
        "#ffffff",
        "#000000"
      ]);
    },
    "highlight-palette": (hsl) => {
      return uniqueColors([
        toHex(hsl.h, hsl.s, hsl.l),
        toHex(hsl.h, hsl.s, Math.min(92, hsl.l + 35)),
        toHex(hsl.h, hsl.s, Math.max(15, hsl.l - 35)),
        toHex((hsl.h + 180) % 360, hsl.s * 0.6, 85),
        "#111111"
      ]);
    },
    "neighbor-palette": (hsl) => {
      const h = getEffectiveHue(hsl, 200);
      const s = getEffectiveSaturation(hsl, 70);
      const offsets = [-30, -15, 0, 15, 30];
      const lightnessVariation = hsl.s < 5 ? [55, 50, hsl.l, 50, 55] : [hsl.l, hsl.l, hsl.l, hsl.l, hsl.l];
      return uniqueColors(offsets.map((offset, i) => toHex((h + offset + 360) % 360, s, lightnessVariation[i])));
    },
    "discreet-palette": (hsl) => {
      return uniqueColors([
        toHex(hsl.h, hsl.s * 0.35, 32),
        toHex(hsl.h, hsl.s * 0.45, 50),
        toHex(hsl.h, hsl.s * 0.55, 68),
        toHex((hsl.h + 180) % 360, hsl.s * 0.25, 45),
        "#f5f5f5"
      ]);
    },
    "dust-palette": (hsl) => {
      return uniqueColors([
        toHex(hsl.h, hsl.s * 0.45, 28),
        toHex(hsl.h, hsl.s * 0.35, 48),
        toHex(hsl.h, hsl.s * 0.25, 68),
        toHex(hsl.h, hsl.s * 0.15, 85),
        "#1a1a1a"
      ]);
    },
    "collective": (hsl) => {
      const h = getEffectiveHue(hsl, 220);
      const s = getEffectiveSaturation(hsl, 70);
      const offsets = [0, 90, 180, 270];
      if (hsl.s < 5) {
        return uniqueColors([
          toHex(h, s, 70),
          toHex((h + 90) % 360, s, 60),
          toHex((h + 180) % 360, s, 50),
          toHex((h + 270) % 360, s, 65),
          "#ffffff"
        ]);
      }
      return uniqueColors([...offsets.map((offset) => toHex((h + offset) % 360, s, hsl.l)), "#ffffff"]);
    },
    "friend-palette": (hsl) => {
      const h = getEffectiveHue(hsl, 180);
      const s = getEffectiveSaturation(hsl, 70);
      const offsets = [0, 45, 90, 135, 180];
      const lightnessVariation = hsl.s < 5 ? [40, 50, 60, 70, 55] : [hsl.l, hsl.l, hsl.l, hsl.l, hsl.l];
      return uniqueColors(offsets.map((offset, i) => toHex((h + offset) % 360, s, lightnessVariation[i])));
    },
    "pin-palette": (hsl) => {
      const complementH = (hsl.h + 180) % 360;
      return uniqueColors([
        toHex(hsl.h, hsl.s, hsl.l),
        toHex(hsl.h, hsl.s, Math.min(88, hsl.l + 20)),
        toHex(hsl.h, hsl.s, Math.max(12, hsl.l - 20)),
        toHex(complementH, hsl.s, 80),
        toHex(complementH, hsl.s, 30)
      ]);
    },
    "shades": (hsl) => {
      const steps = [12, 32, 52, 72, 92];
      return uniqueColors(steps.map((l) => toHex(hsl.h, hsl.s, l)));
    },
    "random-shades": (hsl) => {
      const hue1 = Math.floor(Math.random() * 360);
      const hue2 = (hue1 + 60 + Math.floor(Math.random() * 120)) % 360;
      const hue3 = (hue2 + 60 + Math.floor(Math.random() * 120)) % 360;
      const saturation = hsl.s > 5 ? hsl.s : 60 + Math.floor(Math.random() * 20);
      const colors = [
        toHex(hue1, saturation, 30 + Math.floor(Math.random() * 20)),
        toHex(hue1, saturation * 0.8, 50 + Math.floor(Math.random() * 10)),
        toHex(hue2, saturation, 40 + Math.floor(Math.random() * 20)),
        toHex(hue3, saturation * 0.7, 60 + Math.floor(Math.random() * 20)),
        toHex(hue2, saturation * 0.9, 70 + Math.floor(Math.random() * 20))
      ];
      return uniqueColors(colors);
    }
  };
  const colorSchemeInfo = {
    "generic-gradient": { name: "通用渐变", description: "从深到浅的基础渐变" },
    "matching-gradient": { name: "匹配渐变", description: "以基础色为中心的对称渐变" },
    "spot-palette": { name: "点缀调色板", description: "互补色与邻近色组合" },
    "twisted-spot-palette": { name: "扭曲点缀", description: "带有旋转效果的点缀配色" },
    "classy-palette": { name: "优雅调色板", description: "低饱和度的优雅配色" },
    "cube-palette": { name: "立方体调色板", description: "基于六面体的色彩分布" },
    "switch-palette": { name: "切换调色板", description: "主色与互补色交替" },
    "small-switch-palette": { name: "小切换", description: "简化版切换配色" },
    "skip-gradient": { name: "跳跃渐变", description: "间隔较大的渐变效果" },
    "natural-palette": { name: "自然调色板", description: "自然柔和的配色方案" },
    "matching-palette": { name: "匹配调色板", description: "协调的邻近色组合" },
    "squash-palette": { name: "压缩调色板", description: "压缩的亮度范围" },
    "grey-friends": { name: "灰色伙伴", description: "主色与灰色系搭配" },
    "dotting-palette": { name: "点状调色板", description: "分散的色彩点缀" },
    "skip-shade-gradient": { name: "跳跃阴影", description: "带阴影效果的跳跃渐变" },
    "threedom": { name: "三色自由", description: "均匀分布的三色系" },
    "highlight-palette": { name: "高亮调色板", description: "突出高亮效果" },
    "neighbor-palette": { name: "相邻调色板", description: "紧密相邻的色彩" },
    "discreet-palette": { name: "低调调色板", description: "低饱和度的含蓄配色" },
    "dust-palette": { name: "尘埃调色板", description: "柔和朦胧的配色" },
    "collective": { name: "集合调色板", description: "多种色彩的集合" },
    "friend-palette": { name: "朋友调色板", description: "友好和谐的配色" },
    "pin-palette": { name: "图钉调色板", description: "精准定位的色彩" },
    "shades": { name: "色调渐变", description: "标准的明暗渐变" },
    "random-shades": { name: "随机色调", description: "带随机偏移的渐变" }
  };
  function generateAllSchemes(hex) {
    const rgb = hexToRgb(hex);
    if (!rgb) return [];
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    return Object.entries(colorSchemeGenerators).map(([id, generator]) => {
      var _a, _b;
      return {
        id,
        name: ((_a = colorSchemeInfo[id]) == null ? void 0 : _a.name) || id,
        description: ((_b = colorSchemeInfo[id]) == null ? void 0 : _b.description) || "",
        colors: generator(hsl)
      };
    });
  }
  const basicColors = [
    { name: "红色", hex: "#e11d48" },
    { name: "粉色", hex: "#f472b6" },
    { name: "橙色", hex: "#fb923c" },
    { name: "黄色", hex: "#facc15" },
    { name: "绿色", hex: "#84cc16" },
    { name: "青色", hex: "#10b981" },
    { name: "天蓝", hex: "#0ea5e9" },
    { name: "蓝色", hex: "#3b82f6" },
    { name: "紫色", hex: "#8b5cf6" },
    { name: "淡紫", hex: "#a78bfa" }
  ];
  const popularPalettes = [
    { name: "科技蓝", description: "科技产品、企业网站", colors: ["#0ea5e9", "#0284c7", "#0369a1", "#075985", "#0c4a6e"] },
    { name: "自然绿", description: "环保、健康类应用", colors: ["#22c55e", "#16a34a", "#15803d", "#166534", "#14532d"] },
    { name: "温暖橙", description: "餐饮、娱乐类应用", colors: ["#f97316", "#ea580c", "#c2410c", "#9a3412", "#7c2d12"] },
    { name: "优雅紫", description: "时尚、创意类应用", colors: ["#a855f7", "#9333ea", "#7e22ce", "#6b21a8", "#581c87"] },
    { name: "清新粉", description: "社交、女性向应用", colors: ["#ec4899", "#db2777", "#be185d", "#9d174d", "#831843"] },
    { name: "专业灰", description: "商务、金融类应用", colors: ["#64748b", "#475569", "#334155", "#1e293b", "#0f172a"] }
  ];
  const { React: React$1 } = window;
  const useToast = () => {
    const [toasts, setToasts] = React$1.useState([]);
    const addToast = React$1.useCallback((toast) => {
      const id = Date.now().toString() + Math.random().toString(36).slice(2, 6);
      setToasts((prev) => [...prev, { ...toast, id }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3e3);
    }, []);
    return { toasts, addToast };
  };
  const ToastContainer = ({ toasts }) => {
    if (toasts.length === 0) return null;
    const colorMap = {
      success: "bg-green-600",
      error: "bg-red-600",
      warning: "bg-amber-500",
      info: "bg-blue-600"
    };
    return /* @__PURE__ */ window.React.createElement("div", { className: "fixed top-4 right-4 z-50 flex flex-col gap-2" }, toasts.map((toast) => /* @__PURE__ */ window.React.createElement(
      "div",
      {
        key: toast.id,
        className: `px-4 py-2 rounded-lg text-white text-sm shadow-lg ${colorMap[toast.type] || colorMap.info}`
      },
      toast.message
    )));
  };
  const PaletteIcon = ({ className }) => /* @__PURE__ */ window.React.createElement("svg", { className, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ window.React.createElement("circle", { cx: "13.5", cy: "6.5", r: ".5", fill: "currentColor" }), /* @__PURE__ */ window.React.createElement("circle", { cx: "17.5", cy: "10.5", r: ".5", fill: "currentColor" }), /* @__PURE__ */ window.React.createElement("circle", { cx: "8.5", cy: "7.5", r: ".5", fill: "currentColor" }), /* @__PURE__ */ window.React.createElement("circle", { cx: "6.5", cy: "12.5", r: ".5", fill: "currentColor" }), /* @__PURE__ */ window.React.createElement("path", { d: "M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" }));
  const CopyIcon = ({ className }) => /* @__PURE__ */ window.React.createElement("svg", { className, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ window.React.createElement("rect", { x: "9", y: "9", width: "13", height: "13", rx: "2", ry: "2" }), /* @__PURE__ */ window.React.createElement("path", { d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" }));
  const ClipboardIcon = ({ className }) => /* @__PURE__ */ window.React.createElement("svg", { className, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round" }, /* @__PURE__ */ window.React.createElement("path", { d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" }), /* @__PURE__ */ window.React.createElement("rect", { x: "8", y: "2", width: "8", height: "4", rx: "1", ry: "1" }));
  const ToolPanel = () => {
    const { toasts, addToast } = useToast();
    const [hex, setHex] = React$1.useState("#845EC2");
    const [inputValue, setInputValue] = React$1.useState("#845EC2");
    const [rgb, setRgb] = React$1.useState({ r: 132, g: 94, b: 194 });
    const [hsl, setHsl] = React$1.useState({ h: 264, s: 46, l: 56 });
    const [hsv, setHsv] = React$1.useState({ h: 264, s: 52, v: 76 });
    const [colorSchemes, setColorSchemes] = React$1.useState([]);
    const [activeSchemeId, setActiveSchemeId] = React$1.useState("generic-gradient");
    React$1.useEffect(() => setColorSchemes(generateAllSchemes(hex)), [hex]);
    const handleCopy = React$1.useCallback((text) => {
      if (!text) {
        addToast({ message: "没有可复制的内容", type: "warning" });
        return;
      }
      navigator.clipboard.writeText(text).then(() => {
        addToast({ message: "已复制到剪贴板", type: "success" });
      }).catch(() => {
        addToast({ message: "复制失败", type: "error" });
      });
    }, [addToast]);
    const updateColor = React$1.useCallback((newHex) => {
      const cleanedHex = newHex.trim().replace(/[^0-9a-fA-F#]/g, "");
      if (!isValidHex(cleanedHex)) {
        return;
      }
      const formattedHex = cleanedHex.startsWith("#") ? cleanedHex : `#${cleanedHex}`;
      setHex(formattedHex);
      setInputValue(formattedHex);
      const rgbValue = hexToRgb(formattedHex);
      setRgb(rgbValue);
      setHsl(rgbToHsl(rgbValue.r, rgbValue.g, rgbValue.b));
      setHsv(rgbToHsv(rgbValue.r, rgbValue.g, rgbValue.b));
    }, []);
    const handleInputChange = React$1.useCallback((e) => {
      const value = e.target.value;
      const allowed = /^#?[0-9a-fA-F]*$/;
      if (allowed.test(value)) {
        setInputValue(value);
      }
    }, []);
    const handleInputBlur = React$1.useCallback(() => {
      if (isValidHex(inputValue)) {
        updateColor(inputValue);
      } else if (inputValue.length > 0) {
        setInputValue(hex);
        addToast({ message: "无效的颜色值", type: "error" });
      }
    }, [inputValue, hex, updateColor, addToast]);
    const handleInputKeyDown = React$1.useCallback((e) => {
      if (e.key === "Enter") {
        handleInputBlur();
      }
    }, [handleInputBlur]);
    const handlePaste = React$1.useCallback(async () => {
      try {
        const text = await navigator.clipboard.readText();
        const cleaned = text.trim().replace(/[^0-9a-fA-F#]/g, "");
        if (isValidHex(cleaned)) {
          updateColor(cleaned);
          addToast({ message: "已粘贴", type: "success" });
        } else {
          addToast({ message: "无效的颜色值", type: "error" });
        }
      } catch {
        addToast({ message: "粘贴失败", type: "error" });
      }
    }, [updateColor, addToast]);
    const handleColorCardClick = React$1.useCallback((color) => {
      handleCopy(color);
    }, [handleCopy]);
    const currentScheme = colorSchemes.find((s) => s.id === activeSchemeId);
    return /* @__PURE__ */ window.React.createElement("div", { className: "h-full flex flex-col p-4 overflow-hidden" }, /* @__PURE__ */ window.React.createElement(ToastContainer, { toasts }), /* @__PURE__ */ window.React.createElement("div", { className: "flex items-center gap-3 mb-4" }, /* @__PURE__ */ window.React.createElement(PaletteIcon, { className: "w-6 h-6 text-gray-600 dark:text-gray-400" }), /* @__PURE__ */ window.React.createElement("h2", { className: "text-lg font-semibold text-gray-800 dark:text-gray-200" }, "调色板")), /* @__PURE__ */ window.React.createElement("div", { className: "flex-1 flex gap-4 overflow-hidden" }, /* @__PURE__ */ window.React.createElement("div", { className: "w-80 flex-shrink-0 flex flex-col gap-4 overflow-y-auto" }, /* @__PURE__ */ window.React.createElement("div", { className: "rounded-lg overflow-hidden shadow-lg", style: { backgroundColor: hex } }, /* @__PURE__ */ window.React.createElement("div", { className: "p-4" }, /* @__PURE__ */ window.React.createElement("div", { className: "flex gap-2" }, /* @__PURE__ */ window.React.createElement("div", { className: "flex-1 relative" }, /* @__PURE__ */ window.React.createElement(
      "input",
      {
        type: "text",
        value: inputValue,
        onChange: handleInputChange,
        onBlur: handleInputBlur,
        onKeyDown: handleInputKeyDown,
        className: "w-full pr-9 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-mono text-sm focus:outline-none focus:border-blue-500",
        placeholder: "#845EC2",
        maxLength: 7
      }
    ), /* @__PURE__ */ window.React.createElement(
      "button",
      {
        onClick: handlePaste,
        className: "absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors",
        title: "粘贴"
      },
      /* @__PURE__ */ window.React.createElement(ClipboardIcon, { className: "w-3.5 h-3.5 text-gray-500 dark:text-gray-400" })
    )), /* @__PURE__ */ window.React.createElement(
      "input",
      {
        type: "color",
        value: hex,
        onChange: (e) => updateColor(e.target.value),
        className: "w-10 h-10 rounded-lg cursor-pointer border-0"
      }
    )))), /* @__PURE__ */ window.React.createElement("div", { className: "flex flex-col gap-2" }, [
      { label: "HEX", value: hex },
      { label: "RGB", value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
      { label: "HSL", value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
      { label: "HSV", value: `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)` }
    ].map((item) => /* @__PURE__ */ window.React.createElement("div", { key: item.label, className: "bg-gray-50 dark:bg-gray-700 rounded-lg p-2" }, /* @__PURE__ */ window.React.createElement("div", { className: "flex items-center gap-2" }, /* @__PURE__ */ window.React.createElement("span", { className: "text-xs text-gray-500 dark:text-gray-400 w-8" }, item.label), /* @__PURE__ */ window.React.createElement("div", { className: "flex-1 relative" }, /* @__PURE__ */ window.React.createElement(
      "input",
      {
        type: "text",
        value: item.value,
        readOnly: true,
        className: "w-full px-2 py-1.5 bg-white dark:bg-gray-600 rounded text-xs font-mono text-gray-800 dark:text-gray-200 focus:outline-none"
      }
    ), /* @__PURE__ */ window.React.createElement(
      "button",
      {
        onClick: () => handleCopy(item.value),
        className: "absolute right-1 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors",
        title: "复制"
      },
      /* @__PURE__ */ window.React.createElement(CopyIcon, { className: "w-3 h-3 text-gray-500 dark:text-gray-400" })
    )))))), /* @__PURE__ */ window.React.createElement("div", { className: "bg-gray-50 dark:bg-gray-700 rounded-lg p-3" }, /* @__PURE__ */ window.React.createElement("h3", { className: "text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2" }, "配色方案"), /* @__PURE__ */ window.React.createElement("div", { className: "flex flex-wrap gap-1.5" }, colorSchemes.map((scheme) => /* @__PURE__ */ window.React.createElement(
      "button",
      {
        key: scheme.id,
        onClick: () => setActiveSchemeId(scheme.id),
        className: `px-2.5 py-1 rounded-lg text-xs transition-colors ${activeSchemeId === scheme.id ? "bg-orange-500 text-white" : "bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-500"}`
      },
      scheme.name
    ))))), /* @__PURE__ */ window.React.createElement("div", { className: "flex-1 bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-auto p-4" }, currentScheme && /* @__PURE__ */ window.React.createElement("div", { className: "mb-6" }, /* @__PURE__ */ window.React.createElement("div", { className: "flex items-center justify-between mb-3" }, /* @__PURE__ */ window.React.createElement("span", { className: "text-base font-medium text-gray-800 dark:text-gray-200" }, currentScheme.name), /* @__PURE__ */ window.React.createElement("span", { className: "text-xs text-gray-500 dark:text-gray-400" }, currentScheme.description)), /* @__PURE__ */ window.React.createElement("div", { className: "container-items" }, currentScheme.colors.map((color, index) => /* @__PURE__ */ window.React.createElement(
      "button",
      {
        key: `${color}-${index}`,
        className: "item-color",
        style: { "--color": color },
        "data-color": color,
        onClick: () => handleColorCardClick(color)
      }
    )))), /* @__PURE__ */ window.React.createElement("div", { className: "mb-6" }, /* @__PURE__ */ window.React.createElement("h3", { className: "text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3" }, "基础颜色"), /* @__PURE__ */ window.React.createElement("div", { className: "container-items" }, basicColors.map((color) => /* @__PURE__ */ window.React.createElement(
      "button",
      {
        key: color.hex,
        className: "item-color",
        style: { "--color": color.hex },
        "data-color": color.name,
        onClick: () => updateColor(color.hex)
      }
    )))), /* @__PURE__ */ window.React.createElement("div", null, /* @__PURE__ */ window.React.createElement("h3", { className: "text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3" }, "流行配色"), /* @__PURE__ */ window.React.createElement("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-3" }, popularPalettes.map((palette) => /* @__PURE__ */ window.React.createElement("div", { key: palette.name, className: "bg-gray-50 dark:bg-gray-700 rounded-lg p-3" }, /* @__PURE__ */ window.React.createElement("div", { className: "flex items-center justify-between mb-2" }, /* @__PURE__ */ window.React.createElement("span", { className: "text-sm font-medium text-gray-700 dark:text-gray-300" }, palette.name)), /* @__PURE__ */ window.React.createElement("div", { className: "text-xs text-gray-500 dark:text-gray-400 mb-2" }, palette.description), /* @__PURE__ */ window.React.createElement("div", { className: "container-items" }, palette.colors.map((color, index) => /* @__PURE__ */ window.React.createElement(
      "button",
      {
        key: `${palette.name}-${color}-${index}`,
        className: "item-color",
        style: { "--color": color },
        "data-color": color,
        onClick: () => handleColorCardClick(color)
      }
    ))))))))));
  };
  const { React, ReactDOM } = window;
  const PluginHeader = ({ title }) => {
    const handleMinimize = () => {
      var _a, _b;
      (_b = (_a = window.electron) == null ? void 0 : _a.plugin) == null ? void 0 : _b.minimizeWindow();
    };
    const handleMaximize = () => {
      var _a, _b;
      (_b = (_a = window.electron) == null ? void 0 : _a.plugin) == null ? void 0 : _b.maximizeWindow();
    };
    const handleClose = () => {
      var _a, _b;
      (_b = (_a = window.electron) == null ? void 0 : _a.plugin) == null ? void 0 : _b.closeWindow();
    };
    return React.createElement(
      "div",
      { className: "plugin-header" },
      React.createElement("div", { className: "plugin-header-title" }, title),
      React.createElement(
        "div",
        { className: "plugin-header-controls" },
        React.createElement(
          "button",
          { onClick: handleMinimize },
          React.createElement(
            "svg",
            { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" },
            React.createElement("path", { d: "M5 12h14" })
          )
        ),
        React.createElement(
          "button",
          { onClick: handleMaximize },
          React.createElement(
            "svg",
            { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" },
            React.createElement("rect", { x: "3", y: "3", width: "18", height: "18", rx: "2", ry: "2" })
          )
        ),
        React.createElement(
          "button",
          { onClick: handleClose },
          React.createElement(
            "svg",
            { viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2" },
            React.createElement("path", { d: "M18 6L6 18M6 6l12 12" })
          )
        )
      )
    );
  };
  const PluginApp = () => {
    const pluginData2 = window.__PLUGIN_DATA__;
    const title = (pluginData2 == null ? void 0 : pluginData2.pluginName) || "ToolBox 插件";
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(PluginHeader, { title }),
      React.createElement(
        "div",
        { className: "plugin-content" },
        React.createElement(ToolPanel)
      )
    );
  };
  function renderStandalone() {
    if (!React || !ReactDOM) {
      console.error("React or ReactDOM is not available");
      return;
    }
    const root = document.getElementById("root");
    if (!root) {
      console.error("Root element not found");
      return;
    }
    if (ReactDOM.createRoot) {
      ReactDOM.createRoot(root).render(React.createElement(PluginApp));
    } else {
      ReactDOM.render(React.createElement(PluginApp), root);
    }
  }
  const pluginData = window.__PLUGIN_DATA__;
  if (pluginData) {
    renderStandalone();
  }
})();
