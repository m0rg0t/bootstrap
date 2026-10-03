'use strict';
const fs = require('node:fs/promises');
const path = require('node:path');
const less = require('less');
const CleanCSS = require('clean-css');
module.exports = async function buildCSS() {
  await fs.mkdir('dist/css', { recursive: true });
  for (const [source, output] of [['bootstrap', 'bootstrap'], ['theme', 'bootstrap-theme']]) {
    const filename = path.resolve('less', source + '.less');
    const result = await less.render(await fs.readFile(filename, 'utf8'), {
      filename, math: 'always', javascriptEnabled: false
    });
    const min = new CleanCSS({ level: 0, compatibility: 'ie8' }).minify(result.css);
    if (min.errors.length) throw new Error(min.errors.join('\n'));
    await fs.writeFile(`dist/css/${output}.css`, result.css);
    await fs.writeFile(`dist/css/${output}.min.css`, min.styles + '\n');
  }
};
