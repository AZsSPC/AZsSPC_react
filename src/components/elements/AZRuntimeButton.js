import React from 'react';
import { useRuntime } from '../providers/RuntimeProvider';

export default function AZRuntimeButton(props) {
  const { running, toggle } = useRuntime();
  return (
    <button className="az-button az-run-button" onClick={toggle} {...props}>
      {running ? '||' : '|>'}
    </button>
  );
}
