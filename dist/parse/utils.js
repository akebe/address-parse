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
 * 通过code取父省市对象
 * @param target province/city/area
 * @param code
 * @returns {Array} [province, city, area]
 */
/**
 * address-parse
 * MIT License
 * By www.asseek.com
 */
function getTargetParentAreaListByCode(target, code) {
  var result = [];
  result.unshift({
    code: code,
    name: _area3.default.area_list[code] || ''
  });
  if (['city', 'province'].includes(target)) {
    code = code.slice(0, 4) + '00';
    result.unshift({
      code: code,
      name: _area3.default.city_list[code] || ''
    });
  }
  if (target === 'province') {
    code = code.slice(0, 2) + '0000';
    result.unshift({
      code: code,
      name: _area3.default.province_list[code] || ''
    });
  }
  return result;
}

/**
 * 根据省市县类型和对应的`code`获取对应列表
 * 只能逐级获取 province->city->area OK  province->area ERROR
 * @param target String province city area
 * @param code
 * @param parent 默认获取子列表 如果要获取的是父对象 传true
 * @returns {*}
 */
function getTargetAreaListByCode(target, code, parent) {
  if (parent) return getTargetParentAreaListByCode(target, code);
  var result = [];
  var list = _area3.default[{
    city: 'city_list',
    area: 'area_list'
  }[target]];
  if (code && list) {
    code = code.toString();
    var provinceCode = code.slice(0, 2);
    var cityCode = code.slice(2, 4);
    if (target === 'area' && cityCode !== '00') {
      code = '' + provinceCode + cityCode;
      for (var j = 0; j < 100; j++) {
        var _code = '' + code + (j < 10 ? '0' : '') + j;
        if (list[_code]) {
          result.push({
            code: _code,
            name: list[_code]
          });
        }
      }
    } else {
      for (var i = 0; i < 91; i++) {
        //最大city编码只到91
        //只有city跟area
        code = '' + provinceCode + (i < 10 ? '0' : '') + i + (target === 'city' ? '00' : '');
        if (target === 'city') {
          if (list[code]) {
            result.push({
              code: code,
              name: list[code]
            });
          }
        } else {
          for (var _j = 0; _j < 100; _j++) {
            var _code2 = '' + code + (_j < 10 ? '0' : '') + _j;
            if (list[_code2]) {
              result.push({
                code: _code2,
                name: list[_code2]
              });
            }
          }
        }
      }
    }
  } else {
    for (var _code3 in list) {
      result.push({
        code: _code3,
        name: list[_code3]
      });
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

var Reg = {
  mobile: /(86-[1][3-9][0-9]{9})|(86[1][3-9][0-9]{9})|([1][3-9][0-9]{9})/g,
  phone: /(([0-9]{3,4}-)[0-9]{7,8})|([0-9]{12})|([0-9]{11})|([0-9]{10})|([0-9]{9})|([0-9]{8})|([0-9]{7})/g,
  zipCode: /([0-9]{6})/g
};

function shortIndexOf(address, shortName, name) {
  var index = address.indexOf(shortName);
  var matchName = shortName;
  if (index > -1) {
    for (var i = shortName.length; i <= name.length; i++) {
      var _name = name.substr(0, i);
      var _index = address.indexOf(_name);
      if (_index > -1) {
        index = _index;
        matchName = _name;
      } else {
        break;
      }
    }
  }
  return { index: index, matchName: matchName };
}

var Utils = {
  shortIndexOf: shortIndexOf,
  strLen: strLen,
  getAreaByCode: getAreaByCode,
  getAreaByAddress: getAreaByAddress,
  getTargetAreaListByCode: getTargetAreaListByCode,
  Reg: Reg
};

exports.default = Utils;