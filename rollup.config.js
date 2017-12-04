import os from 'os'
import path from 'path'
import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import vue from 'rollup-plugin-vue'
import uglify from 'rollup-plugin-uglify'
import sass from 'rollup-plugin-sass';
import autoprefixer from 'autoprefixer'
import postcss from 'postcss'
import csso from 'postcss-csso';
import { minify } from 'uglify-es'
import pkg from './package.json';

const PLUGINS = [
  'button',
  'card',
  'checkbox',
  'dialog',
  'drawer',
  'elevation',
  'fab',
  'grid-list',
  'icon-toggle',
  'icon',
  'layout-app',
  'layout-grid',
  'linear-progress',
  'list',
  'menu',
  'radio',
  'ripple',
  'select',
  'slider',
  'snackbar',
  'switch',
  'tabs',
  'textfield',
  'theme',
  'toolbar',
  'typography',
]

const MODULES = ['util', ... PLUGINS]

const BANNER = `/**
* @module vue-mdc-adapter{{module}} {{version}}
* @exports {{name}}
* @copyright (c) 2017-present, Sebastien Tasson
* @license https://opensource.org/licenses/MIT
* @implements {{dependencies}}
* @requires {{peerDependencies}}
* @see https://github.com/stasson/vue-mdc-adapter
*/
`
  .replace('{{version}}', pkg.version)
  .replace('{{dependencies}}', JSON.stringify(pkg.dependencies))
  .replace('{{peerDependencies}}', JSON.stringify(pkg.peerDependencies))


const babelConfig = {
  'compact': false,
  'babelrc': false,
  'presets': [ 
    [
      // env preset https://github.com/babel/babel-preset-env
      'env', 
      // let rollup take care of modules 
      { 'modules': false } 
    ]
  ],
  'plugins': [
    "transform-object-rest-spread",
    // let rollup bundle helpers once
    // see https://github.com/rollup/rollup-plugin-babel#helpers
    'external-helpers'  
  ]
}



// const camelize = (str) => {
//   return str.replace(/[_.-](\w|$)/g, function (_,x) {
//           return x.toUpperCase();
//   });
// }

const capitalize = (str) => {
  return str
    .replace(/\b(\w)/g, function (_,x) {
          return x.toUpperCase();
    })
    .replace(/[_.-]/g,'')
}

function createUmdConfig(module, env, extract) {
  
  const isPlugin = PLUGINS.includes(module) 
  const isProduction = env === `production`
  const isDevelopment = env === `development`
  const dist = isPlugin ? `dist/${module}/${module}` : 'dist/' + module
  const name = isPlugin ? 'VueMDC' + capitalize(module)  : 'VueMDCAdapter'
  const input = 'components/' + ( isPlugin ? module + '/' : '')  + 'entry.js' 
  const output = {
    file: dist + (isDevelopment ? `.js` : `.min.js`),
    format: 'umd',
    name
  }
  
  const banner = BANNER
  .replace('{{module}}', isPlugin ? module : '')
  .replace('{{name}}', name)
  
  const sassConfig = {
    include: [ '**/*.css', '**/*.scss' ],
    options: {includePaths: ['node_modules']},
    processor: css => postcss((isDevelopment
                        ? [autoprefixer()]
                        : [autoprefixer(), csso()]))
                      .process(css)
                      .then(result => result.css)
  }
  
  if (extract) {
    if (isProduction) {
      sassConfig.output = dist + '.min.css'
    } else {
      sassConfig.output = dist + '.css'
    }
  } else {
    sassConfig.insert = true
  }

  const config = {
    input,
    output,
    env,
    banner,
    external: ['vue'],
    plugins: [
      vue ({ autoStyles: false, styleToImports: true }),
      resolve({ jsnext: true, main: true, browser: true }),
      sass(sassConfig),
      babel(babelConfig),
      commonjs(),
    ],
    sourcemap: isDevelopment ? 'inline' : true,
    onwarn
  }

  if (isProduction) {
    config.plugins.push(uglify({
      output: {
        comments: function(node, comment) {
            var text = comment.value;
            var type = comment.type;
            if (type == "comment2") {
                // multiline comment
                return /@preserve|@license|@cc_on/i.test(text);
            }
        }
      }
    }, minify))
  }
  return config
}

function createEsmConfig(module) {
  
  const isModule = MODULES.includes(module) 
  const dist = isModule ? `dist/${module}/index.js` : 'dist/index.js'
  const input = 'components/' + ( isModule ? module + '/' : '')  + 'index.js' 
  const output = { file: dist, format: 'es'}
    
  const banner = BANNER
  .replace('{{module}}', isModule ? module : '')
  .replace('{{name}}', 'default')

  let external = []
  let paths = {}
  let outro = ''

  if (isModule) {
    for (let folder of MODULES) {
      if (folder != module) {
        let id = path.resolve('.', 'components', folder, 'index.js') 
        external.push(id)
        paths[id] = `../${folder}/index.js`
      }
    }
  } else {
    for (let folder of MODULES) {
      if (folder != module) {
        let id = path.resolve('.', 'components', folder, 'index.js') 
        external.push(id)
        paths[id] = `./${folder}/index.js`
      }
    }

    for (let folder of PLUGINS) {
      let exportName = 'VueMDC' + capitalize(folder)
      
      outro +=`export { ${exportName} }` + os.EOL
    }
    outro += os.EOL
    for (let folder of PLUGINS) {
      outro +=`export * from './${folder}/index.js'` + os.EOL
    }
  }


  const config = {
    input,
    output,
    banner,
    outro,
    external,
    paths,
    plugins: [
      vue ({ autoStyles: false, styleToImports: true }),
      resolve({ jsnext: true, main: true, browser: true }),
      babel(babelConfig),
      commonjs(),
    ],
    sourcemap: true,
    onwarn
  }
  return config
}

const configs = []

// build ESM modules
for (let module of MODULES) {
  configs.push(createEsmConfig(module))
} 
configs.push(createEsmConfig('index'))


// a la carte UMD plugins
for (let module of PLUGINS) {
  configs.push(createUmdConfig(module,'development',true))
  configs.push(createUmdConfig(module,'production', true))
} 

// UMD
configs.push(createUmdConfig('vue-mdc-adapter','development',true),)
configs.push(createUmdConfig('vue-mdc-adapter','production',true))
configs.push(createUmdConfig('unpkg','development',false))
configs.push(createUmdConfig('unpkg','production',false))

function onwarn (warning) {

  // skip certain warnings
  if (warning.code == 'NON_EXISTENT_EXPORT') {
    if (warning.name == 'MDCIconToggleAdapter') return;
  } 

  // console.warn everything else
  console.log(warning);
  console.warn(warning.message);
}

export default configs