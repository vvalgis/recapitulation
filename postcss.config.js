module.exports = {
  parser: 'sugarss',
  map: true,
  plugins: {
    'postcss-import': { path: 'src/libs/css' },
    'postcss-simple-vars': {},
    'postcss-custom-media': {},
    'postcss-nested': {},
    'autoprefixer': {}
  }
}
