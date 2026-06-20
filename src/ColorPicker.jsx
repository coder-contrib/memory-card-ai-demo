import React, { useState, useRef, useCallback, useEffect } from 'react';

const ColorPicker = () => {
  const [hue, setHue] = useState(220);
  const [saturation, setSaturation] = useState(80);
  const [lightness, setLightness] = useState(50);
  const [hexInput, setHexInput] = useState('');
  const [recentColors, setRecentColors] = useState([]);
  const [announcement, setAnnouncement] = useState('');

  const satLightCanvasRef = useRef(null);
  const hueSliderRef = useRef(null);
  const isDraggingSatLight = useRef(false);

  // Convert HSL to RGB
  const hslToRgb = (h, s, l) => {
    s /= 100;
    l /= 100;
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = l - c / 2;
    let r, g, b;

    if (h < 60) { r = c; g = x; b = 0; }
    else if (h < 120) { r = x; g = c; b = 0; }
    else if (h < 180) { r = 0; g = c; b = x; }
    else if (h < 240) { r = 0; g = x; b = c; }
    else if (h < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }

    return [
      Math.round((r + m) * 255),
      Math.round((g + m) * 255),
      Math.round((b + m) * 255)
    ];
  };

  // Convert RGB to Hex
  const rgbToHex = (r, g, b) => {
    return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
  };

  // Convert Hex to HSL
  const hexToHsl = (hex) => {
    hex = hex.replace('#', '');
    if (hex.length === 3) {
      hex = hex.split('').map(c => c + c).join('');
    }
    if (hex.length !== 6) return null;

    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
  };

  // Get current color values
  const [r, g, b] = hslToRgb(hue, saturation, lightness);
  const hexColor = rgbToHex(r, g, b);

  // Calculate relative luminance for contrast
  const getRelativeLuminance = (r, g, b) => {
    const [rs, gs, bs] = [r, g, b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
  };

  const luminance = getRelativeLuminance(r, g, b);
  const contrastOnWhite = (1.05) / (luminance + 0.05);
  const contrastOnBlack = (luminance + 0.05) / (0.05);

  const getWCAGRating = (ratio) => {
    if (ratio >= 7) return 'AAA';
    if (ratio >= 4.5) return 'AA';
    if (ratio >= 3) return 'AA Large';
    return 'Fail';
  };

  // Announce color change to screen readers
  const announce = (message) => {
    setAnnouncement(message);
    setTimeout(() => setAnnouncement(''), 1000);
  };

  // Draw saturation/lightness canvas
  useEffect(() => {
    const canvas = satLightCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const s = (x / width) * 100;
        const l = 100 - (y / height) * 100;
        const [cr, cg, cb] = hslToRgb(hue, s, l);
        ctx.fillStyle = `rgb(${cr},${cg},${cb})`;
        ctx.fillRect(x, y, 1, 1);
      }
    }
  }, [hue]);

  // Handle saturation/lightness canvas interaction
  const handleSatLightInteraction = useCallback((e) => {
    const canvas = satLightCanvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
    const y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));
    const newSat = Math.round((x / rect.width) * 100);
    const newLight = Math.round(100 - (y / rect.height) * 100);
    setSaturation(newSat);
    setLightness(newLight);
  }, []);

  const handleCanvasMouseDown = (e) => {
    isDraggingSatLight.current = true;
    handleSatLightInteraction(e);
  };

  const handleCanvasMouseMove = (e) => {
    if (isDraggingSatLight.current) {
      handleSatLightInteraction(e);
    }
  };

  const handleCanvasMouseUp = () => {
    if (isDraggingSatLight.current) {
      isDraggingSatLight.current = false;
      announce(`Color selected: ${hexColor}`);
    }
  };

  useEffect(() => {
    document.addEventListener('mousemove', handleCanvasMouseMove);
    document.addEventListener('mouseup', handleCanvasMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleCanvasMouseMove);
      document.removeEventListener('mouseup', handleCanvasMouseUp);
    };
  }, [handleCanvasMouseMove, handleCanvasMouseUp]);

  // Handle hex input
  const handleHexSubmit = (e) => {
    e.preventDefault();
    const result = hexToHsl(hexInput);
    if (result) {
      const [h, s, l] = result;
      setHue(h);
      setSaturation(s);
      setLightness(l);
      announce(`Color set to ${hexInput}`);
    }
  };

  // Copy to clipboard
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      announce(`Copied ${text} to clipboard`);
    } catch {
      // fallback
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      announce(`Copied ${text} to clipboard`);
    }
  };

  // Save to recent colors
  const saveColor = () => {
    setRecentColors(prev => {
      const newColors = [hexColor, ...prev.filter(c => c !== hexColor)].slice(0, 12);
      return newColors;
    });
    announce(`Saved ${hexColor} to recent colors`);
  };

  // Keyboard handler for canvas
  const handleCanvasKeyDown = (e) => {
    const step = e.shiftKey ? 10 : 1;
    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        setSaturation(s => Math.min(100, s + step));
        break;
      case 'ArrowLeft':
        e.preventDefault();
        setSaturation(s => Math.max(0, s - step));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setLightness(l => Math.min(100, l + step));
        break;
      case 'ArrowDown':
        e.preventDefault();
        setLightness(l => Math.max(0, l - step));
        break;
    }
  };

  const textColor = luminance > 0.5 ? '#000000' : '#ffffff';

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: '#1a1a2e',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      overflow: 'auto',
      color: '#e0e0e0'
    }}>
      {/* Live region for screen reader announcements */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: 'absolute',
          width: '1px',
          height: '1px',
          padding: 0,
          margin: '-1px',
          overflow: 'hidden',
          clip: 'rect(0, 0, 0, 0)',
          whiteSpace: 'nowrap',
          border: 0
        }}
      >
        {announcement}
      </div>

      {/* Header */}
      <header style={{ textAlign: 'center', marginBottom: '24px' }}>
        <h1 style={{
          fontSize: '36px',
          margin: '0 0 8px 0',
          color: '#ffffff',
          fontWeight: 700
        }}>
          Accessible Color Picker
        </h1>
        <p style={{ fontSize: '16px', margin: 0, color: '#a0a0b0' }}>
          Keyboard navigable with WCAG contrast checking
        </p>
      </header>

      <main style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
        maxWidth: '900px',
        width: '100%'
      }}>
        {/* Left Column: Color Selection */}
        <section aria-labelledby="color-selection-heading" style={{
          background: '#16213e',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
        }}>
          <h2 id="color-selection-heading" style={{ fontSize: '20px', margin: '0 0 16px 0', color: '#fff' }}>
            Color Selection
          </h2>

          {/* Saturation/Lightness Canvas */}
          <div style={{ marginBottom: '16px' }}>
            <label
              id="sat-light-label"
              style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}
            >
              Saturation & Lightness
            </label>
            <div style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden' }}>
              <canvas
                ref={satLightCanvasRef}
                width={300}
                height={200}
                style={{
                  width: '100%',
                  height: '200px',
                  cursor: 'crosshair',
                  borderRadius: '8px',
                  border: '2px solid #333'
                }}
                role="slider"
                aria-labelledby="sat-light-label"
                aria-valuetext={`Saturation ${saturation}%, Lightness ${lightness}%`}
                tabIndex={0}
                onMouseDown={handleCanvasMouseDown}
                onKeyDown={handleCanvasKeyDown}
              />
              {/* Position indicator */}
              <div
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  left: `${saturation}%`,
                  top: `${100 - lightness}%`,
                  width: '16px',
                  height: '16px',
                  border: '3px solid white',
                  borderRadius: '50%',
                  transform: 'translate(-50%, -50%)',
                  boxShadow: '0 0 0 2px rgba(0,0,0,0.5)',
                  pointerEvents: 'none'
                }}
              />
            </div>
            <p style={{ fontSize: '12px', color: '#888', margin: '4px 0 0' }}>
              Use arrow keys to adjust. Hold Shift for larger steps.
            </p>
          </div>

          {/* Hue Slider */}
          <div style={{ marginBottom: '16px' }}>
            <label
              htmlFor="hue-slider"
              style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}
            >
              Hue: {hue}°
            </label>
            <input
              id="hue-slider"
              type="range"
              min="0"
              max="359"
              value={hue}
              onChange={(e) => {
                setHue(Number(e.target.value));
                announce(`Hue: ${e.target.value} degrees`);
              }}
              style={{
                width: '100%',
                height: '20px',
                borderRadius: '10px',
                background: 'linear-gradient(to right, #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000)',
                appearance: 'none',
                cursor: 'pointer',
                outline: 'none'
              }}
              aria-valuetext={`${hue} degrees`}
            />
          </div>

          {/* Saturation Slider */}
          <div style={{ marginBottom: '16px' }}>
            <label
              htmlFor="saturation-slider"
              style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}
            >
              Saturation: {saturation}%
            </label>
            <input
              id="saturation-slider"
              type="range"
              min="0"
              max="100"
              value={saturation}
              onChange={(e) => {
                setSaturation(Number(e.target.value));
                announce(`Saturation: ${e.target.value}%`);
              }}
              style={{
                width: '100%',
                height: '12px',
                borderRadius: '6px',
                appearance: 'none',
                cursor: 'pointer',
                background: `linear-gradient(to right, hsl(${hue}, 0%, ${lightness}%), hsl(${hue}, 100%, ${lightness}%))`,
                outline: 'none'
              }}
              aria-valuetext={`${saturation} percent`}
            />
          </div>

          {/* Lightness Slider */}
          <div style={{ marginBottom: '16px' }}>
            <label
              htmlFor="lightness-slider"
              style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 600 }}
            >
              Lightness: {lightness}%
            </label>
            <input
              id="lightness-slider"
              type="range"
              min="0"
              max="100"
              value={lightness}
              onChange={(e) => {
                setLightness(Number(e.target.value));
                announce(`Lightness: ${e.target.value}%`);
              }}
              style={{
                width: '100%',
                height: '12px',
                borderRadius: '6px',
                appearance: 'none',
                cursor: 'pointer',
                background: `linear-gradient(to right, hsl(${hue}, ${saturation}%, 0%), hsl(${hue}, ${saturation}%, 50%), hsl(${hue}, ${saturation}%, 100%))`,
                outline: 'none'
              }}
              aria-valuetext={`${lightness} percent`}
            />
          </div>

          {/* Hex Input */}
          <form onSubmit={handleHexSubmit} style={{ display: 'flex', gap: '8px' }}>
            <label htmlFor="hex-input" className="sr-only" style={{
              position: 'absolute',
              width: '1px',
              height: '1px',
              padding: 0,
              margin: '-1px',
              overflow: 'hidden',
              clip: 'rect(0, 0, 0, 0)',
              whiteSpace: 'nowrap',
              border: 0
            }}>
              Enter hex color
            </label>
            <input
              id="hex-input"
              type="text"
              placeholder="#ff6600"
              value={hexInput}
              onChange={(e) => setHexInput(e.target.value)}
              style={{
                flex: 1,
                padding: '10px 14px',
                fontSize: '14px',
                borderRadius: '8px',
                border: '2px solid #333',
                background: '#0f3460',
                color: '#fff',
                outline: 'none'
              }}
              aria-label="Hex color value"
            />
            <button
              type="submit"
              style={{
                padding: '10px 16px',
                fontSize: '14px',
                borderRadius: '8px',
                border: 'none',
                background: '#533483',
                color: '#fff',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Apply
            </button>
          </form>
        </section>

        {/* Right Column: Preview & Info */}
        <section aria-labelledby="color-info-heading" style={{
          background: '#16213e',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <h2 id="color-info-heading" style={{ fontSize: '20px', margin: 0, color: '#fff' }}>
            Color Preview
          </h2>

          {/* Color Preview Swatch */}
          <div
            role="img"
            aria-label={`Selected color: ${hexColor}`}
            style={{
              width: '100%',
              height: '120px',
              background: hexColor,
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: 700,
              color: textColor,
              border: '2px solid rgba(255,255,255,0.2)',
              boxShadow: `0 4px 20px ${hexColor}44`
            }}
          >
            {hexColor}
          </div>

          {/* Color Values */}
          <div style={{
            background: '#0f3460',
            borderRadius: '10px',
            padding: '16px',
          }}>
            <h3 style={{ fontSize: '14px', margin: '0 0 12px 0', color: '#a0a0b0', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Color Values
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { label: 'HEX', value: hexColor },
                { label: 'RGB', value: `rgb(${r}, ${g}, ${b})` },
                { label: 'HSL', value: `hsl(${hue}, ${saturation}%, ${lightness}%)` }
              ].map(({ label, value }) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '13px', color: '#888', minWidth: '40px' }}>{label}</span>
                  <code style={{ fontSize: '13px', color: '#e0e0e0', flex: 1, marginLeft: '12px' }}>{value}</code>
                  <button
                    onClick={() => copyToClipboard(value)}
                    aria-label={`Copy ${label} value: ${value}`}
                    style={{
                      padding: '4px 10px',
                      fontSize: '12px',
                      borderRadius: '4px',
                      border: '1px solid #444',
                      background: 'transparent',
                      color: '#a0a0b0',
                      cursor: 'pointer',
                      marginLeft: '8px'
                    }}
                  >
                    Copy
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* WCAG Contrast */}
          <div style={{
            background: '#0f3460',
            borderRadius: '10px',
            padding: '16px',
          }}>
            <h3 style={{ fontSize: '14px', margin: '0 0 12px 0', color: '#a0a0b0', textTransform: 'uppercase', letterSpacing: '1px' }}>
              WCAG Contrast Ratios
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px' }}>On White</span>
                <span style={{
                  fontSize: '13px',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  background: getWCAGRating(contrastOnWhite) === 'Fail' ? '#e74c3c' :
                             getWCAGRating(contrastOnWhite) === 'AA Large' ? '#f39c12' : '#27ae60',
                  color: '#fff',
                  fontWeight: 600
                }}>
                  {contrastOnWhite.toFixed(2)}:1 ({getWCAGRating(contrastOnWhite)})
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px' }}>On Black</span>
                <span style={{
                  fontSize: '13px',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  background: getWCAGRating(contrastOnBlack) === 'Fail' ? '#e74c3c' :
                             getWCAGRating(contrastOnBlack) === 'AA Large' ? '#f39c12' : '#27ae60',
                  color: '#fff',
                  fontWeight: 600
                }}>
                  {contrastOnBlack.toFixed(2)}:1 ({getWCAGRating(contrastOnBlack)})
                </span>
              </div>
            </div>
            {/* Visual contrast demo */}
            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
              <div style={{
                flex: 1,
                padding: '8px',
                background: '#ffffff',
                color: hexColor,
                textAlign: 'center',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 600
              }}>
                Text on White
              </div>
              <div style={{
                flex: 1,
                padding: '8px',
                background: '#000000',
                color: hexColor,
                textAlign: 'center',
                borderRadius: '6px',
                fontSize: '13px',
                fontWeight: 600
              }}>
                Text on Black
              </div>
            </div>
          </div>

          {/* Save Button */}
          <button
            onClick={saveColor}
            style={{
              width: '100%',
              padding: '12px',
              fontSize: '16px',
              borderRadius: '8px',
              border: 'none',
              background: 'linear-gradient(135deg, #533483, #0f3460)',
              color: '#fff',
              cursor: 'pointer',
              fontWeight: 600,
              transition: 'opacity 0.2s'
            }}
            aria-label={`Save color ${hexColor} to recent colors`}
          >
            Save Color
          </button>
        </section>
      </main>

      {/* Recent Colors */}
      {recentColors.length > 0 && (
        <section
          aria-labelledby="recent-colors-heading"
          style={{
            maxWidth: '900px',
            width: '100%',
            marginTop: '24px',
            background: '#16213e',
            borderRadius: '16px',
            padding: '20px 24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
          }}
        >
          <h2 id="recent-colors-heading" style={{ fontSize: '18px', margin: '0 0 12px 0', color: '#fff' }}>
            Saved Colors
          </h2>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }} role="list">
            {recentColors.map((color, idx) => (
              <button
                key={`${color}-${idx}`}
                role="listitem"
                onClick={() => {
                  const result = hexToHsl(color);
                  if (result) {
                    const [h, s, l] = result;
                    setHue(h);
                    setSaturation(s);
                    setLightness(l);
                    announce(`Selected saved color: ${color}`);
                  }
                }}
                aria-label={`Select saved color ${color}`}
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '8px',
                  background: color,
                  border: '2px solid rgba(255,255,255,0.3)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                  padding: 0
                }}
                title={color}
              />
            ))}
          </div>
        </section>
      )}

      {/* Keyboard shortcut help */}
      <footer style={{
        maxWidth: '900px',
        width: '100%',
        marginTop: '24px',
        textAlign: 'center',
        color: '#666',
        fontSize: '13px'
      }}>
        <details>
          <summary style={{ cursor: 'pointer', color: '#888' }}>Keyboard Shortcuts</summary>
          <div style={{ marginTop: '8px', textAlign: 'left', padding: '12px', background: '#16213e', borderRadius: '8px' }}>
            <p style={{ margin: '4px 0' }}><kbd style={kbdStyle}>Tab</kbd> — Navigate between controls</p>
            <p style={{ margin: '4px 0' }}><kbd style={kbdStyle}>←</kbd> <kbd style={kbdStyle}>→</kbd> — Adjust saturation in color area</p>
            <p style={{ margin: '4px 0' }}><kbd style={kbdStyle}>↑</kbd> <kbd style={kbdStyle}>↓</kbd> — Adjust lightness in color area</p>
            <p style={{ margin: '4px 0' }}><kbd style={kbdStyle}>Shift</kbd> + Arrow — Adjust in larger steps</p>
          </div>
        </details>
      </footer>
    </div>
  );
};

const kbdStyle = {
  display: 'inline-block',
  padding: '2px 6px',
  fontSize: '12px',
  background: '#0f3460',
  borderRadius: '4px',
  border: '1px solid #444',
  fontFamily: 'monospace',
  color: '#e0e0e0'
};

export default ColorPicker;
