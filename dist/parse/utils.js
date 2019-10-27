'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _area2 = require('../area');

var _area3 = _interopRequireDefault(_area2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * 通过地区编码返回省市区对象
 * @param code
 * @returns {{code: *, province: (*|string), city: (*|string), area: (*|string)}}
 */
function getAreaByCode(code) {
  var pCode = code.slice(0, 2) + '0000',
      cCode = code.slice(0, 4) + '00';
  return {
    code: code,
    province: _area3.default.province_list[pCode] || '',
    city: _area3.default.city_list[cCode] || '',
    area: _area3.default.area_list[code] || ''
  };
}

/**
 * 根据省市县类型和对应的`code`获取对应列表
 * 只能逐级获取 province->city->area OK  province->area ERROR
 * @param target String province city area
 * @param code
 * @param parent 默认获取子列表 如果要获取的是父对象 传true
 * @returns {*}
 */
/**
 * address-parse
 * MIT License
 * By www.asseek.com
 */
function getTargetAreaListByCode(target, code, parent) {
  var result = [];
  var compareNum = target === 'province' ? 2 : target === 'city' ? 4 : 6;
  if (parent) {
    if (target === 'province') {
      var _code2 = code.slice(0, 2) + '000000'.slice(0, 4);
      result.push({
        code: _code2,
        name: _area3.default.province_list[_code2]
      });
    }
    var _code = code.slice(0, 4) + '000000'.slice(0, 2);
    result.push({
      code: _code,
      name: _area3.default.city_list[_code]
    });
  } else {
    var list = _area3.default[{
      province: 'province_list',
      city: 'city_list',
      area: 'area_list'
    }[target]] || [];
    code = code.slice(0, compareNum - 2);
    if (code) {
      var tail = code.length === 2 ? '00' : '';
      for (var i = 0; i < 100; i++) {
        var c = '' + code + (i < 9 ? '0' : '') + i + tail;
        if (list[c]) {
          result.push({
            code: c,
            name: list[c]
          });
        }
      }
    } else {
      for (var _c in list) {
        result.push({
          code: _c,
          name: list[_c]
        });
      }
    }
  }
  return result;
}

/**
 * 通过省市区非标准字符串准换为标准对象
 * 旧版识别的隐藏省份后缀的对象可通过这个函数转换为新版支持对象
 * @param province
 * @param city
 * @param area
 * @returns {{code: string, province: string, city: string, area: string}}
 */
function getAreaByAddress(_ref) {
  var province = _ref.province,
      city = _ref.city,
      area = _ref.area;
  var province_list = _area3.default.province_list,
      city_list = _area3.default.city_list,
      area_list = _area3.default.area_list;

  var result = {
    code: '',
    province: '',
    city: '',
    area: ''
  };
  for (var _code in province_list) {
    var _province = province_list[_code];
    if (_province.indexOf(province) === 0) {
      result.code = _code;
      result.province = _province;
      _code = _code.substr(0, 2);
      for (var _code_city in city_list) {
        if (_code_city.indexOf(_code) === 0) {
          var _city = city_list[_code_city];
          if (_city.indexOf(city) === 0) {
            result.code = _code_city;
            result.city = _city;
            if (area) {
              _code_city = _code_city.substr(0, 4);
              for (var _code_area in area_list) {
                if (_code_area.indexOf(_code_city) === 0) {
                  var _area = area_list[_code_area];
                  if (_area.indexOf(area) === 0) {
                    result.code = _code_area;
                    result.area = _area;
                    break;
                  }
                }
              }
            }
            break;
          }
        }
      }
      break;
    }
  }
  return result;
}

/**
 * 字符串占位长度
 * @param str
 * @returns {number}
 */
function strLen(str) {
  var l = str.length,
      len = 0;
  for (var i = 0; i < l; i++) {
    len += (str.charCodeAt(i) & 0xff00) !== 0 ? 2 : 1;
  }
  return len;
}

var Utils = {
  strLen: strLen,
  getAreaByCode: getAreaByCode,
  getAreaByAddress: getAreaByAddress,
  getTargetAreaListByCode: getTargetAreaListByCode
};

exports.default = Utils;