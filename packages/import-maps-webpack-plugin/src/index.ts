import VirtualModulesPlugin from 'webpack-virtual-modules';
import { Plugin, Compiler } from 'webpack';
import { getPackageDir, resolveImportMap, getHashFor, getImportFor } from './helpers';

export class ImportMapsWebpackPlugin implements Plugin {
  apply(compiler: Compiler) {
    const root = process.cwd();
    const dir = getPackageDir(root);
    const map = resolveImportMap(dir);
    const keys = Object.keys((map && map.imports) || {});

    const localImports = keys.map(
      id => `{
  id: ${getHashFor(root, dir, map.imports[id])},
  ref: ${JSON.stringify(id)},
  load: () => ${getImportFor(root, dir, map.imports[id])},
}`,
    );

    const plugin = new VirtualModulesPlugin(
      keys.reduce(
        (prev, id) => {
          prev[id] = `
            module.exports = require('importmap').resolve(${JSON.stringify(id)});
        `;
          return prev;
        },
        {
          'node_modules/importmap.js': `
if (!window.__importMaps) {
  const imports = [];
  window.__importMaps = true;
  window.__resolveImport = function (id) {
    for (const item of imports) {
      if (item.id === id) {
        return item;
      }
    }
    return {};
  };
  window.__registerImports = function (newImports) {
    newImports.forEach(i => {
      if (!imports.some(j => j.id === i.id)) {
        const item = {
          id: i.id,
          data: undefined,
        };
        item.loading = i.load().then(data => (item.data = data), err => console.error(err));
        imports.push(item);
      }
    });
  };
}
const localImports = [${localImports.join(',')}];
window.__registerImports(localImports);
function getId(ref) {
  const [id] = localImports.filter(i => i.ref === ref).map(i => i.id);
  return id;
}
exports.ready = function (ref) {
  const refs = Array.isArray(ref) ? ref : (ref ? [ref] : localImports.map(i => i.ref));
  return Promise.all(refs.map(ref => window.__resolveImport(getId(ref)).loading));
};
exports.resolve = function (ref) {
  return window.__resolveImport(getId(ref)).data;
}
`,
        },
      ),
    );

    plugin.apply(compiler);
  }
}
