import React, { forwardRef } from 'react';
import './AZInstrumentsPanel.css';

const AZInputValue = forwardRef(function AZInputValue(props, ref) {
  const { label, type = 'number', min, max, step, defaultValue, onChange, style, color, ...rest } = props;
  return (
    <label className={`az-input-button ${color ? `color-${color}` : ''}`} style={style}>
      {label && `${label} `}
      <input
        ref={ref}
        type={type}
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

export default AZInputValue;
