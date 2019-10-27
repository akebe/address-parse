'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Utils = exports.AREA = exports.ParseAddress = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * address-parse
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * MIT License
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * By www.asseek.com
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _area = require('../area');

var _area2 = _interopRequireDefault(_area);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

var _parseArea = require('./parse-area');

var _parseArea2 = _interopRequireDefault(_parseArea);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ParseAddress = function () {
  function ParseAddress(address) {
    _classCallCheck(this, ParseAddress);

    if (address) {
      return this.parse(address);
    }
  }

  /**
   * 开始解析
   * @param address string 地址
   * @param parseAll boolean 是否完全解析
   * @returns {Array}
   */


  _createClass(ParseAddress, [{
    key: 'parse',
    value: function parse(address, parseAll) {
      this.result = {
        mobile: '',
        zip_code: '',
        phone: ''
      };

      this.address = address;
      this.replace();
      this.parseMobile();
      this.parsePhone();
      this.parseZipCode();
      this.address = this.address.replace(/ {2,}/, ' ');

      var results = ParseAddress.ParseArea.parse(this.address, parseAll);

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = results[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var result = _step.value;

          Object.assign(result, this.result);
          ParseAddress.parseName(result);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return results;
    }

    /**
     * 替换无效字符
     */

  }, {
    key: 'replace',
    value: function replace() {
      var address = this.address;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = ParseAddress.ExcludeKeys[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var key = _step2.value;

          address = address.replace(new RegExp(key, 'g'), ' ');
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      this.address = address.replace(/\r\n/g, ' ').replace(/\n/g, ' ').replace(/\t/g, ' ').replace(/ {2,}/g, ' ').replace(/(\d{3})-(\d{4})-(\d{4})/g, '$1$2$3').replace(/(\d{3}) (\d{4}) (\d{4})/g, '$1$2$3');
    }

    /**
     * 提取手机号码
     */

  }, {
    key: 'parseMobile',
    value: function parseMobile() {
      var mobile = ParseAddress.Reg.mobile.exec(this.address);
      if (mobile) {
        this.result.mobile = mobile[0];
        this.address = this.address.replace(mobile[0], ' ');
      }
    }

    /**
     * 提取电话号码
     */

  }, {
    key: 'parsePhone',
    value: function parsePhone() {
      var phone = ParseAddress.Reg.phone.exec(this.address);
      if (phone) {
        this.result.phone = phone[0];
        this.address = this.address.replace(phone[0], ' ');
      }
    }

    /**
     * 提取邮编
     */

  }, {
    key: 'parseZipCode',
    value: function parseZipCode() {
      var zip = ParseAddress.Reg.zipCode.exec(this.address);
      if (zip) {
        this.result.zip_code = zip[0];
        this.address = this.address.replace(zip[0], '');
      }
    }

    /**
     * 提取姓名
     * @param result
     * @param maxLen 字符串占位 比这个数值短才识别为姓名 汉字2位英文1位
     */

  }], [{
    key: 'parseName',
    value: function parseName(result) {
      var maxLen = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 11;

      if (!result.name) {
        var list = result.details.split(' ');
        var name = {
          value: '',
          index: -1
        };
        if (list.length > 1) {
          list.forEach(function (v, i) {
            if (v && _utils2.default.strLen(v) < maxLen) {
              if (!name.value || _utils2.default.strLen(name.value) > _utils2.default.strLen(v)) {
                name.value = v;
                name.index = i;
              }
            }
          });
        }
        if (name.value) {
          result.name = name.value;
          list.splice(name.index, 1);
          result.details = list.join(' ');
        }
      }
    }
  }]);

  return ParseAddress;
}();

ParseAddress.ExcludeKeys = ['发件人', '收货地址', '收货人', '收件人', '收货', '手机号码', '邮编', '电话', '所在地区', '详细地址', '地址', '：', ':', '；', ';', '，', ',', '。', '、'];
ParseAddress.ParseArea = new _parseArea2.default();
ParseAddress.Reg = {
  mobile: /(86-[1][0-9]{10})|(86[1][0-9]{10})|([1][0-9]{10})/g,
  phone: /(([0-9]{3,4}-)[0-9]{7,8})|([0-9]{12})|([0-9]{11})|([0-9]{10})|([0-9]{9})|([0-9]{8})|([0-9]{7})/g,
  zipCode: /([0-9]{6})/g
};
exports.ParseAddress = ParseAddress;
exports.AREA = _area2.default;
exports.Utils = _utils2.default;
exports.default = new ParseAddress();