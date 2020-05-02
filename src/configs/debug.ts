import { resolve, dirname, basename } from 'path';
import { buildPiral } from '../commands/build-piral';

async function run(root: string, progress: boolean) {
  await buildPiral(root, 'develop', 'webpack.config.js', progress, true);
  return resolve(root, 'dist', 'develop', 'index.html');
}

process.on('message', async msg => {
  switch (msg.type) {
    case 'start':
      const outPath = await run(process.cwd(), msg.progress);
      process.send({
        type: 'done',
        outDir: dirname(outPath),
        outFile: basename(outPath),
      });
      break;
  }
});
