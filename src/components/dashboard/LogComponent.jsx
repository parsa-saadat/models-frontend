import React from 'react';

function LogComponent({ log }) {
  const levelStyles = {
    info: {
      dot: 'bg-[--color-main]',
      text: 'text-[--color-main]',
    },
    warning: {
      dot: 'bg-[--color-warning]',
      text: 'text-[--color-warning]',
    },
    error: {
      dot: 'bg-[--color-danger]',
      text: 'text-[--color-danger]',
    },
    debug: {
      dot: 'bg-purple-500',
      text: 'text-purple-600',
    },
    critical: {
      dot: 'bg-[--color-danger]',
      text: 'text-[--color-danger]',
    },
    system: {
      dot: 'bg-{--color-danger}',
      text: 'text-[--color-danger]',
    },
  };

  const style = levelStyles[log.level] || {
    dot: 'bg-gray-300',
    text: 'text-gray-500',
  };

  return (
    <div className="flex items-center gap-3 border border-gray-100 rounded p-3 hover:bg-[--color-light-gray] transition">
      <div className={`w-2 h-2 rounded-full ${style.dot}`} />
      <span className={`text-sm font-bold ${style.text}`}>{log.level.toUpperCase()}</span>
      <span className="truncate text-sm text-gray-700">{log.message}</span>
    </div>
  );
}

export default LogComponent;
