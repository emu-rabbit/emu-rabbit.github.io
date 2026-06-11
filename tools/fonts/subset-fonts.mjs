import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(scriptDir, '../..');
const generatedDir = path.join(scriptDir, 'generated');
const sourceDir = path.join(scriptDir, 'source');
const outputDir = path.join(rootDir, 'public/fonts');

const fontToolsTargets = [
  process.env.FONTTOOLS_PATH,
  path.join(scriptDir, 'python-packages'),
  'C:\\tmp\\codex-fonttools'
].filter(Boolean);
const pythonCandidates = [
  process.env.PYTHON,
  'python',
  'python3',
  path.join(process.env.USERPROFILE ?? '', '.cache/codex-runtimes/codex-primary-runtime/dependencies/python/python.exe')
].filter(Boolean);

const scanRoots = ['index.html', 'src'];
const scanExtensions = new Set(['.html', '.ts', '.css', '.json', '.md']);

function walkFiles(targetPath, files = []) {
  const absolutePath = path.join(rootDir, targetPath);

  if (!existsSync(absolutePath)) {
    return files;
  }

  const stats = statSync(absolutePath);

  if (stats.isFile()) {
    if (scanExtensions.has(path.extname(absolutePath))) {
      files.push(absolutePath);
    }

    return files;
  }

  for (const entry of readdirSync(absolutePath)) {
    walkFiles(path.join(targetPath, entry), files);
  }

  return files;
}

function stripTags(value) {
  return value.replace(/<[^>]*>/g, ' ');
}

function uniqueText(value) {
  const normalized = value.normalize('NFC');
  const seen = new Set();
  const output = [];

  for (const char of normalized) {
    if (char === '\r' || char === '\t') {
      continue;
    }

    if (!seen.has(char)) {
      seen.add(char);
      output.push(char);
    }
  }

  return output.join('');
}

function readProjectText() {
  const files = scanRoots.flatMap((scanRoot) => walkFiles(scanRoot));
  const allTextChunks = [];

  for (const file of files) {
    const content = readFileSync(file, 'utf8');
    allTextChunks.push(content);
  }

  const safelist = readFileSync(path.join(scriptDir, 'safelist.txt'), 'utf8');
  allTextChunks.push(safelist);

  return {
    all: uniqueText(allTextChunks.join('\n'))
  };
}

function buildPythonEnv() {
  const env = { ...process.env };
  const existingTargets = fontToolsTargets.filter((target) => existsSync(target));

  if (existingTargets.length > 0) {
    const targetPath = existingTargets.join(path.delimiter);
    env.PYTHONPATH = env.PYTHONPATH ? `${targetPath}${path.delimiter}${env.PYTHONPATH}` : targetPath;
  }

  return env;
}

function findPython() {
  const env = buildPythonEnv();

  for (const candidate of pythonCandidates) {
    const result = spawnSync(candidate, ['-c', 'import fontTools, brotli'], {
      cwd: rootDir,
      env,
      encoding: 'utf8'
    });

    if (result.status === 0) {
      return { command: candidate, env };
    }
  }

  throw new Error(
    'Unable to find Python with fontTools and brotli. Install them with `python -m pip install --target tools/fonts/python-packages fonttools brotli`, or set PYTHON/FONTTOOLS_PATH.'
  );
}

function runPython(python, args) {
  const result = spawnSync(python.command, args, {
    cwd: rootDir,
    env: python.env,
    encoding: 'utf8',
    stdio: 'inherit'
  });

  if (result.status !== 0) {
    throw new Error(`Python command failed: ${args.join(' ')}`);
  }
}

function prepareAndSubsetFont(python, config) {
  const preparedFont = path.join(generatedDir, `${config.slug}.prepared.ttf`);

  runPython(python, [
    path.join(scriptDir, 'prepare-font.py'),
    path.join(sourceDir, config.source),
    preparedFont,
    '--family',
    config.family,
    '--subfamily',
    'Regular',
    '--full-name',
    `${config.family} Regular`,
    '--postscript-name',
    `${config.family.replaceAll(' ', '')}-Regular`
  ]);

  runPython(python, [
    '-m',
    'fontTools.subset',
    preparedFont,
    `--output-file=${path.join(outputDir, config.output)}`,
    `--text-file=${config.textFile}`,
    '--flavor=woff2',
    '--layout-features=*',
    '--no-hinting',
    '--name-IDs=*',
    '--name-legacy',
    '--name-languages=*',
    '--glyph-names',
    '--symbol-cmap',
    '--legacy-cmap',
    '--recommended-glyphs'
  ]);
}

mkdirSync(generatedDir, { recursive: true });
mkdirSync(outputDir, { recursive: true });

const text = readProjectText();
const allTextFile = path.join(generatedDir, 'emu-huninn-text.txt');
writeFileSync(allTextFile, text.all, 'utf8');

const python = findPython();

prepareAndSubsetFont(python, {
  slug: 'emu-huninn-subset',
  source: 'jf-openhuninn-2.1.ttf',
  family: 'Emu Huninn Subset',
  output: 'emu-huninn-subset.woff2',
  textFile: allTextFile
});

console.log(`Generated font subsets in ${path.relative(rootDir, outputDir)}`);
