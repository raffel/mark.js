import pkg from '../package.json';
import Handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';

// Shared config
const output = {
    name: 'window',
    file: pkg.main,
    format: 'umd',
    extend: true,
    banner: Handlebars.compile(fs.readFileSync(path.join(
      __dirname, 'templates/copyright.hbs'
    ), 'utf8'))({
      name: pkg.name.split('/').pop(),
      version: `v${pkg.version}`,
      homepage: pkg.homepage,
      author: pkg.author.name,
      license: pkg.license,
      year: (() => {
        const startYear = 2014,
          year = new Date().getFullYear();
        return year > startYear ? `${startYear}–${year}` : year;
      })()
    })
  },
  outputJquery = Object.assign({}, output, {
    file: (() => {
      const spl = pkg.main.split('/');
      spl[spl.length - 1] = `jquery.${spl[spl.length - 1]}`;
      return spl.join('/');
    })(),
    globals: {
      'jquery': 'jQuery'
    }
  }),
  externalJquery = ['jquery'],
  plugins = [
    // for external dependencies (just in case)
    resolve(),
    commonjs()
  ],
  pluginsES5 = (() => {
    const newPlugins = plugins.slice();
    newPlugins.push(babel({
      exclude: 'node_modules/**',
      'presets': [
        ['env', {
          'modules': false
        }]
      ],
      'plugins': [
        'external-helpers',
        'transform-object-assign'
      ]
    }));
    return newPlugins;
  })();

// Actual config export
export default [{
  input: 'src/vanilla.js',
  output: Object.assign({}, output, {
    file: output.file.replace('.js', '.es6.js')
  }),
  plugins
}, {
  input: 'src/jquery.js',
  output: Object.assign({}, outputJquery, {
    file: outputJquery.file.replace('.js', '.es6.js')
  }),
  plugins,
  external: externalJquery
}, {
  input: 'src/vanilla.js',
  output,
  plugins: pluginsES5
}, {
  input: 'src/jquery.js',
  output: outputJquery,
  plugins: pluginsES5,
  external: externalJquery
}];