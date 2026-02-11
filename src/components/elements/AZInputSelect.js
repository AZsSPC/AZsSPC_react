import React, { forwardRef, useState, useRef, useEffect } from 'react';

const AZInputSelect = forwardRef(function AZInputSelect(props, ref) {
  const { label, value, defaultValue, onChange, color, options = [], style } = props;

  const rootRef = useRef(null);
  const listRef = useRef(null);

  // merge forwarded ref
  function setRef(node) {
    rootRef.current = node;
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
  }

  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState(defaultValue ?? null);
  const [open, setOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(0);

  const currentValue = isControlled ? value : internalValue;

  let normalized = [];

  if (Array.isArray(options)) {
    normalized = options.map(v => ({ value: String(v), label: v }));
  } else if (options && typeof options === 'object') {
    normalized = Object.entries(options).map(([v, l]) => ({ value: v, label: l }));
  }

  const max_length = normalized.reduce((max, item) => {
    const len = String(item.label ?? '').length;
    return len > max ? len : max;
  }, 0);
  const selectedOption = normalized.find(o => o.value === String(currentValue)) ?? null;

  function selectOption(option) {
    if (!isControlled) { setInternalValue(option.value); }
    onChange?.({ target: { value: option.value } });
    setOpen(false);
  }

  function handleKeyDown(e) {
    if (!open && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      setOpen(true);
      return;
    }

    if (open) {
      if (e.key === 'Escape') {
        setOpen(false);
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightIndex(i =>
          Math.min(i + 1, normalized.length - 1)
        );
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightIndex(i =>
          Math.max(i - 1, 0)
        );
      }
      if (e.key === 'Enter') {
        e.preventDefault();
        selectOption(normalized[highlightIndex]);
      }
    }
  }

  useEffect(() => {
    function handleOutside(e) {
      if (!rootRef.current?.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  return (<div
    ref={setRef}
    className={`az-select-button ${color ? `color-${color}` : ''}`}
    style={style}
    tabIndex={0}
    role="combobox"
    aria-expanded={open}
    aria-controls='az-select-listbox'
    aria-haspopup="listbox"
    onClick={() => setOpen(o => !o)}
    onKeyDown={handleKeyDown}
  >
    {label && <span>{label} </span>}

    <span className='az-select-button-selected' style={{ width: `${max_length + 1}ch` }}>
      {selectedOption ? selectedOption.label : '—'}
    </span>

    {open && (
      <ul
        ref={listRef}
        role="listbox"
        className="az-select-dropdown"
      >
        {normalized.map((option, index) => (
          <li
            key={option.value}
            role="option"
            aria-selected={option.value === String(currentValue)}
            className={index === highlightIndex ? 'highlight' : ''}
            onMouseEnter={() => setHighlightIndex(index)}
            onClick={() => selectOption(option)}
          >
            {option.label}
          </li>
        ))}
      </ul>
    )}
  </div>
  );
});

export default AZInputSelect;
