// eslint-disable-next-line import/no-commonjs
const path=require('path')

const config = {
  projectName: 'market',
  date: '2020-6-16',
  designWidth: 750,
  deviceRatio: {
    '640': 2.34 / 2,
    '750': 1,
    '828': 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  babel: {
    sourceMap: true,
    presets: [
      ['env', {
        modules: false
      }]
    ],
    plugins: [
      'transform-decorators-legacy',
      'transform-class-properties',
      'transform-object-rest-spread',
      ['transform-runtime', {
        'helpers': false,
        'polyfill': false,
        'regenerator': true,
        'moduleName': 'babel-runtime'
      }]
    ]
  },
  plugins: [
    '@tarojs/plugin-sass',
    '@tarojs/plugin-uglify'
  ],
  defineConstants: {
  },
//   copy: {
//     patterns: [
//       // 需添加如下配置
//       {
//         from: 'node_modules/taro-echarts/components/ec-canvas/',
//         to: 'dist/npm/taro-echarts/components/ec-canvas',
//         ignore: ['ec-canvas.js', 'wx-canvas.js']
//       }
//     ],
//     options: {
//     }
//   },
  alias: {
    '@':path.resolve(__dirname,'..','src'),
    '@components': path.resolve(__dirname, '..', 'src/components'),
    '@css': path.resolve(__dirname, '..', 'src/css'),
    '@utils': path.resolve(__dirname, '..', 'src/utils'),
    '@images': path.resolve(__dirname, '..', 'src/images'),
    '@actions': path.resolve(__dirname, '..', 'src/actions'),
    '@reducers': path.resolve(__dirname, '..', 'src/reducers'),
    '@constants': path.resolve(__dirname, '..', 'src/constants')
  },
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {}
      },
      url: {
        enable: true,
        config: {
          limit: 10240 // 设定转换尺寸上限
        }
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  },
  h5: {
//       // 需添加如下配置
//   esnextModules: ['taro-echarts'],
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: {
        enable: true,
        config: {
          browsers: [
            'last 3 versions',
            'Android >= 4.1',
            'ios >= 8'
          ]
        }
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: 'module', // 转换模式，取值为 global/module
          generateScopedName: '[name]__[local]___[hash:base64:5]'
        }
      }
    }
  }
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
