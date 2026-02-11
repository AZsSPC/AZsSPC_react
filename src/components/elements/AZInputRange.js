import React, { forwardRef } from 'react';

const AZInputRange = forwardRef(function AZInputRange(props, ref) {
  const { label, min = 0, max = 100, step = 1, defaultValue = 0, onChange, color, ...rest } = props;
  return (
    <label className={`az-input-button ${color ? `color-${color}` : ''}`}>
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
