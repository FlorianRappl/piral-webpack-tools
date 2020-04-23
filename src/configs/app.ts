import { resolve } from 'path';
import { fork } from 'child_process';
import { checkAppShellPackage } from 'piral-cli/lib/common/package';

export async function getOrMakeAppDir(shellPkg: any, progress: boolean): Promise<string> {
  const piral = shellPkg.name;
  const packageJson = require.resolve(`${piral}/package.json`);
  const emulator = checkAppShellPackage(shellPkg);
  const cwd = resolve(packageJson, '..');

  // only build if we are in dev mode and apparently have no emulator
  if (!emulator && process.env.NODE_ENV === 'development') {
    return await new Promise((res) => {
      const dbg = resolve(__dirname, 'debug.js');
      const ps = fork(dbg, [], { cwd });
      ps.send({
        type: 'start',
        progress,
      });
      ps.on('message', (msg: any) => {
        switch (msg.type) {
          case 'done':
            return res(msg.outDir);
        }
      });
    });
  }

  return resolve(cwd, 'app');
}
