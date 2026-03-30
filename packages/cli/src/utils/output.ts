import pc from 'picocolors';

export function success(msg: string): void {
  console.log(pc.green('✓'), msg);
}

export function error(msg: string): void {
  console.error(pc.red('✗'), msg);
}

export function info(msg: string): void {
  console.log(pc.cyan('ℹ'), msg);
}

export function dim(msg: string): string {
  return pc.dim(msg);
}
