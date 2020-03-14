import waitFor from 'p-wait-for';

export interface BotLogger {
  debug: (msg: any, ...args: any[]) => void;
  info: (msg: any, ...args: any[]) => void;
  warn: (msg: any, ...args: any[]) => void;
  error: (msg: any, ...args: any[]) => void;
}


export function waitUntil(func: () => boolean, options?: object): Promise<void> {
  return waitFor(func, Object.assign({ interval: 1000 }, options));
}

