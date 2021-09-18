#!/usr/bin/env node

const path = require('path');

const esbuild = require('esbuild');
const childProcess = require('child_process');
childProcess.execSync(`rm -rf ./out`, {
  cwd: __dirname
});

let envPlugin = {
  name: 'env',
  setup(build) {

    build.onResolve({ filter: /^env$/ }, args => {
      console.log(args);
      return {
        path: args.path,
        namespace: 'env-ns'
      }
    });

    build.onLoad({ filter: /.*/, namespace: 'env-ns' }, () => {
      return {
        contents: JSON.stringify(process.env),
        loader: 'json'
      }
    })
  }
}

esbuild.build({
  entryPoints: [path.resolve(__dirname, 'api.ts')],
  bundle: true,
  minify: true,
  // minifyIdentifiers: true,
  // minifyWhitespace: true,
  // minifySyntax: true,
  outdir: path.resolve(__dirname, 'out'),
  sourcemap: false,
  define: {
    'DEFINE_ENV': `"prod"`, DEFINE_INFO: JSON.stringify({
      name: 'infoName'
    })
  },
  // external: ['vue'],
  format: 'iife',
  // inject: [path.resolve(__dirname, './depen/process-shim.ts')],
  loader: {
    '.jpeg': 'dataurl',
    '.svg': 'text',
    '.scss': 'css',
  },
  target: 'es2018',
  sourcemap: true,
  // splitting: true,
  assetNames: 'dist/[name]-[hash]',
  // chunkNames: 'dist/[name]-[hash]',
  entryNames: '[name]-[hash]',
  banner: {
    js: '//I am first line',
    css: '/* haha css */'
  },
  footer: {
    css: '@import "two.css"'
  },
  // pure: ['console.log'],
  metafile: true,
  // globalName: 'myApi.One.Two',
  legalComments: 'linked',
  // outExtension: {
  //   '.js': '.mjs',
  //   '.css': '.scss'
  // },
  sourcesContent: false,
  plugins: [envPlugin],
}).then(res => {
  console.log(res);
}).catch(err => {
  console.error(err);
  process.exit(1);
})

// esbuild.serve({
//   port: 8080,
//   host: 'imdev.yunshanmeicai.com',
//   onRequest: (args) => {
//     console.log(args.remoteAddress, args.method, args.path, args.status, args.timeInMS)
//   },
//   servedir: path.resolve(__dirname, './out')
// }, buildOptions).then(res => {
//   console.log(res);
// })
