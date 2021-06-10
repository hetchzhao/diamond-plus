module.exports = {
  // presets: [
  //   [
  //     '@babel/preset-env',
  //     { useBuiltIns: 'usage', corejs: 3 }
  //   ]
  // ],
  // plugins: [
  //   // [
  //   //   '@babel/plugin-transform-runtime',
  //   //   {
  //   //     corejs: 3,
  //   //   },
  //   // ],
  //   '@babel/plugin-syntax-dynamic-import',
  //   ['@babel/plugin-proposal-class-properties', {loose: false}],
  //   // '@babel/proposal-class-properties',
  //   // '@babel/proposal-object-rest-spread'
  //   ["@vue/babel-plugin-jsx", { transformOn: true }],
  // ]
  presets: [
    '@vue/cli-plugin-babel/preset'
  ],
  plugins: [
    [
      'component',
      {
        'libraryName': 'element-plus',
        'styleLibraryName': 'theme-chalk'
      }
    ]
  ]
}