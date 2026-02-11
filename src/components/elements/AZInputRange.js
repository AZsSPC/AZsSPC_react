import React, { forwardRef } from 'react';
import './AZInstrumentsPanel.css';

const AZInputRange = forwardRef(function AZInputRange(props, ref) {
  const { label, min = 0, max = 100, step = 1, defaultValue = 0, onChange, style, color, ...rest } = props;
  return (
    <label className={`az-input-button ${color ? `color-${color}` : ''}`} style={style}>
      {label && `${label} `}
      <input
        ref={ref}
        type="range"
        min={min}
        max={max}
        step={step}
        defaultValue={defaultValue}
        onChange={onChange}
        {...rest}
      />
    </label>
  );
});

export default AZInputRange;
