// eslint-disable-next-line import/no-commonjs
const path = require("path");
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// eslint-disable-next-line import/no-commonjs
const config = {
  projectName: "tuanmaiwulian",
  date: "2019-5-13",
  designWidth: 750,
  deviceRatio: {
    "640": 2.34 / 2,
    "750": 1,
    "828": 1.81 / 2
  },
  alias: {
    "@": path.resolve(__dirname, "..", "src/"),
    src: "./src/"
  },
  sourceRoot: "src",
  outputRoot: "dist",
  plugins: {
    babel: {
      sourceMap: true,
      presets: ["env"],
      plugins: [
        "transform-decorators-legacy",
        "transform-class-properties",
        "transform-object-rest-spread"
      ]
    },
    sass: {
      resource: ["app.scss"],
      // OR
      // resource:  ['path/to/global.variable.scss', 'path/to/global.mixin.scss']
      projectDirectory: path.resolve(__dirname, "..")
    }
  },
  defineConstants: {},
  copy: {
    patterns: [],
    options: {}
  },
  weapp: {
    module: {
      postcss: {
        autoprefixer: {
          enable: true,
          config: {
            browsers: ["last 3 versions", "Android >= 4.1", "ios >= 8"]
          }
        },
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
            namingPattern: "module", // 转换模式，取值为 global/module
            generateScopedName: "[name]__[local]___[hash:base64:5]"
          }
        }
      }
    }
  },
  h5: {
    enableExtract: true,
    publicPath: "/",
    staticDirectory: "static",
    esnextModules: ["taro-ui"],
    devServer: {
      // host: 'localhost',
      inline: true,
      port: 8090,
    },
    router: {
      mode: 'browser' // 或者是 'browser'
    },
    output: {
      filename: 'js/[name].[hash:8].js',
      chunkFilename: 'js/[name].[chunkhash:8].js'
    },
    miniCssExtractPluginOption: {
      filename: 'css/[name].[hash:8].css',
      chunkFilename: 'css/[name].[chunkhash:8].css'
    },
    // plugins: [
    //   new MiniCssExtractPlugin({
    //     // 类似 webpackOptions.output里面的配置 可以忽略
    //     filename: '[name].css',
    //     chunkFilename: '[id].css',
    //   }),
    // ],
    //   plugins: [
    //     new ExtractTextPlugin({
    //         filename: './[name]/style_[contenthash:8].css'
    //     })
    // ],
    module: {
      postcss: {
        autoprefixer: {
          enable: true,
          config: {
            browsers: ["last 3 versions", "Android >= 4.1", "ios >= 8"]
          }
        },
        // css modules 功能开关与相关配置
        // cssModules: {
        //   enable: true, // 默认为 false，如需使用 css modules 功能，则设为 true
        //   config: {
        //     namingPattern: 'module', // 转换模式，取值为 global/module，下文详细说明
        //     generateScopedName: '[name]__[local]___[hash:base64:5]'
        //   }
        // }
      },
      rules: [{
        test: /\.scss$/,
        use: [
          "style-loader", // creates style nodes from JS strings
          "css-loader", // translates CSS into CommonJS
          "sass-loader" // compiles Sass to CSS, using Node Sass by default
        ]
      }]
    }
  }
};

module.exports = function (merge) {
  if (process.env.NODE_ENV === "development") {
    return merge({}, config, require("./dev"));
  } else if (process.env.NODE_ENV === "production") {
    return merge({}, config, require("./prod"));
  } else if (process.env.NODE_ENV === "test") {
    return merge({}, config, require("./test"));
  }
};
