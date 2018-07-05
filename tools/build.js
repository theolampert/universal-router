/**
 * Babel Starter Kit | https://github.com/kriasoft/babel-starter-kit
 * Copyright (c) Konstantin Tarkus <hello@tarkus.me> | The MIT License
 */

import del from 'del';
import fs from './utils/fs';
import { rootDir } from './config';

// Clean output directories
const cleanup = async () => {
  await del(['build/*', 'lib/*', '!build/.git'], { dot: true });
  await fs.makeDir('build');
  await fs.makeDir('lib');
};

// Compile the source code into a distributable format
const src = async () => {
  const babel = require('babel');
  const files = await fs.getFiles('src');

  for (let file of files) {
    let source = await fs.readFile('src/' + file);
    let result = babel.transform(source, { stage: 0 });
    await fs.writeFile('lib/' + file, result.code);
  }
};

// Run all build steps in sequence
(async () => {
  try {
    console.log('clean');
    await cleanup();
    console.log('compile src');
    await src();
  } catch (err) {
    console.error(err.stack);
  }
})();
