const base = require('./base')

module.exports = function (body, headers) {
  return base(200, body, headers)
}