import React, { forwardRef } from 'react';

const AZInputValue = forwardRef(function AZInputValue(props, ref) {
  const { label, type = 'number', min, max, step, defaultValue, onChange, color, ...rest } = props;
  return (
    <label className={`az-input-button ${color ? `color-${color}` : ''}`}>
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
