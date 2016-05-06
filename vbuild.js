export default {
  port: 4038,
  electron: true,
  silent: true,
  disableHtml: true,
  webpack(config, options) {
    config.output.filename = 'bundle.js'
  }
}
