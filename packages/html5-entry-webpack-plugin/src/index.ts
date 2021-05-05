import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import { load } from 'cheerio';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { Compiler, Plugin } from 'webpack';
import { getTemplates, extractParts, setEntries } from './helpers';

export interface Html5EntryWebpackPluginOptions extends Omit<HtmlWebpackPlugin.Options, 'templateContent'> {}

export class Html5EntryWebpackPlugin implements Plugin {
  constructor(private options: Html5EntryWebpackPluginOptions = {}) {}

  apply(compiler: Compiler) {
    const entry = compiler.options.entry;
    const [template] = getTemplates(entry);

    if (template) {
      const src = dirname(template);
      const templateContent = load(readFileSync(template, 'utf8'));
      const entries = extractParts(templateContent).map(entry => join(src, entry));
      compiler.options.plugins.push(
        new HtmlWebpackPlugin({
          ...this.options,
          templateContent: templateContent.html(),
        }),
      );
      setEntries(compiler.options, template, entries);
    }
  }
}
