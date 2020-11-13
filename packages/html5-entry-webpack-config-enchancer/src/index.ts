import * as HtmlWebpackPlugin from 'html-webpack-plugin';
import { load } from 'cheerio';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { Compiler, Plugin } from 'webpack';
import { getTemplates, extractParts, setEntries } from './helpers';

export interface Html5EntryWebpackPluginOptions extends Omit<HtmlWebpackPlugin.Options, 'templateContent'> {}

export const html5EntryWebpackConfigEnchancer = (options: Html5EntryWebpackPluginOptions) => compilerOptions => {
  const entry = compilerOptions.entry;
  const [template] = getTemplates(entry);

  if (template) {
    const src = dirname(template);
    const templateContent = load(readFileSync(template, 'utf8'));
    const entries = extractParts(templateContent).map(entry => join(src, entry));
    const plugins = [
      new HtmlWebpackPlugin({
        ...options,
        templateContent: templateContent.html(),
      }),
    ];

    setEntries(compilerOptions, template, entries);
    // plugins.forEach(plugin => plugin.apply(compiler));
    compilerOptions.plugins = [...compilerOptions.plugins, ...plugins];
  }

  return compilerOptions;
};
