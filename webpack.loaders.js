const loader = (name) => {
  return {
    exclude: /node_modules/,
    use: {
      loader: `${name}-loader`
    }
  }
}

const jsLoader = { test: /\.(?:jsx|js)$/, ...loader('babel') }
const htmlLoader = { test: /\.html$/, ...loader('html') }

export default [
  jsLoader,
  htmlLoader
]
