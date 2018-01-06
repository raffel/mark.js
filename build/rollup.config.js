import pkg from '../package.json';
import Handlebars from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

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
  plugins = [
    // for external dependencies (just in case)
    resolve(),
    commonjs()
  ];

export default [{
  input: 'src/vanilla.js',
  output,
  plugins
}, {
  input: 'src/jquery.js',
  output: Object.assign({}, output, {
    file: (() => {
      const spl = pkg.main.split('/');
      spl[spl.length - 1] = `jquery.${spl[spl.length - 1]}`;
      return spl.join('/');
    })(),
    globals: {
      'jquery': 'jQuery'
    }
  }),
  plugins,
  external: ['jquery']
}];