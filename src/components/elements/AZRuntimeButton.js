import React from 'react';
import { useRuntime } from '../../providers/RuntimeProvider';
import { useNotify } from "../../providers/NotificationProvider";

export default function AZRuntimeButton({ name = 'Runtime', ...props }) {
  const { running, toggle } = useRuntime();
  const notify = useNotify();

  const handleClick = () => {
    toggle();
    notify(running ? `${name} paused` : `${name} running`, { type: 'info' });
  };

  return (
    <button className={`az-button az-button-run ${running ? 'color-red' : 'color-blue'}`} onClick={handleClick}  {...props}>
      {running ? '||' : '|>'}
    </button>
  );
}
