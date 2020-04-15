import * as path from 'path';
import * as fs from 'fs';
import { Compiler } from 'webpack';

function replace(file: string, prName: string) {
  if (fs.existsSync(file)) {
    const template = fs.readFileSync(file, 'utf8');
    const content = template.replace(
      /^\!function\s?\(e,\s?t\)\s?\{/m,
      `!function(e,t){function define(d,k){(typeof document!=='undefined')&&(document.currentScript.app=k.apply(d.map(window.${prName})));}define.amd=!0;`,
    );

    fs.writeFileSync(file, content);
  }
}

export interface PostProcessPluginOptions {
  dir: string;
  file: string;
  prName: string;
}

export class PostProcessPlugin {
  constructor(private options: PostProcessPluginOptions) {}

  apply(compiler: Compiler) {
    const done = (statsData) => {
      if (!statsData.hasErrors()) {
        const { dir, file, prName } = this.options;
        replace(path.resolve(dir, file), prName);
      }
    };

    if (compiler.hooks) {
      compiler.hooks.done.tap('PostProcessPlugin', done);
    } else {
      compiler.plugin('done', done);
    }
  }
}
