'use strict';

var _parse = require('./parse');

var _parse2 = _interopRequireDefault(_parse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

if (window) {
  window.AddressParse = _parse2.default;
}

_parse2.default.Utils = _parse.Utils;
_parse2.default.AREA = _parse.AREA;
_parse2.default.ParseAddress = _parse.ParseAddress;