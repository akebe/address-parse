/**
 * address-parse
 * MIT License
 * By www.asseek.com
 */
import AREA from '../area';

/**
 * 通过地区编码返回省市区对象
 * @param code
 * @returns {{code: *, province: (*|string), city: (*|string), area: (*|string)}}
 */
function getAreaByCode(code) {
  const pCode = `${code.slice(0, 2)}0000`,
    cCode = `${code.slice(0, 4)}00`;
  return {
    code: code,
    province: AREA.province_list[pCode] || '',
    city: AREA.city_list[cCode] || '',
    area: AREA.area_list[code] || '',
  };
}

/**
 * 通过code取父省市对象
 * @param target province/city/area
 * @param code
 * @returns {Array} [province, city, area]
 */
function getTargetParentAreaListByCode(target, code) {
  const result = [];
  result.unshift({
    code,
    name: AREA.area_list[code] || '',
  });
  if (['city', 'province'].includes(target)) {
    code = code.slice(0, 4) + '00';
    result.unshift({
      code,
      name: AREA.city_list[code] || '',
    });
  }
  if (target === 'province') {
    code = code.slice(0, 2) + '0000';
    result.unshift({
      code,
      name: AREA.province_list[code] || '',
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
  let result = [];
  let list = AREA[{
    city: 'city_list',
    area: 'area_list',
  }[target]];
  if (code && list) {
    code = code.toString();
    let provinceCode = code.slice(0, 2);
    let cityCode = code.slice(2, 4);
    if (target === 'area' && cityCode !== '00') {
      code = `${provinceCode}${cityCode}`;
      for (let j = 0; j < 100; j++) {
        let _code = `${code}${j < 10 ? '0' : ''}${j}`;
        if (list[_code]) {
          result.push({
            code: _code,
            name: list[_code],
          });
        }
      }
    } else {
      for (let i = 0; i < 91; i++) {  //最大city编码只到91
        //只有city跟area
        code = `${provinceCode}${i < 10 ? '0' : ''}${i}${target === 'city' ? '00' : ''}`;
        if (target === 'city') {
          if (list[code]) {
            result.push({
              code,
              name: list[code],
            });
          }
        } else {
          for (let j = 0; j < 100; j++) {
            let _code = `${code}${j < 10 ? '0' : ''}${j}`;
            if (list[_code]) {
              result.push({
                code: _code,
                name: list[_code],
              });
            }
          }
        }
      }
    }
  } else {
    for (let code in list) {
      result.push({
        code,
        name: list[code],
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
function getAreaByAddress({province, city, area}) {
  const {province_list, city_list, area_list} = AREA;
  const result = {
    code: '',
    province: '',
    city: '',
    area: '',
  };
  for (let _code in province_list) {
    let _province = province_list[_code];
    if (_province.indexOf(province) === 0) {
      result.code = _code;
      result.province = _province;
      _code = _code.substr(0, 2);
      for (let _code_city in city_list) {
        if (_code_city.indexOf(_code) === 0) {
          let _city = city_list[_code_city];
          if (_city.indexOf(city) === 0) {
            result.code = _code_city;
            result.city = _city;
            if (area) {
              _code_city = _code_city.substr(0, 4);
              for (let _code_area in area_list) {
                if (_code_area.indexOf(_code_city) === 0) {
                  let _area = area_list[_code_area];
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
  let l = str.length, len = 0;
  for (let i = 0; i < l; i++) {
    len += (str.charCodeAt(i) & 0xff00) !== 0 ? 2 : 1;
  }
  return len;
}

const Reg = {
  mobile: /(86-[1][3-9][0-9]{9})|(86[1][3-9][0-9]{9})|([1][3-9][0-9]{9})/g,
  phone: /(([0-9]{3,4}-)[0-9]{7,8})|([0-9]{12})|([0-9]{11})|([0-9]{10})|([0-9]{9})|([0-9]{8})|([0-9]{7})/g,
  zipCode: /([0-9]{6})/g,
};

function shortIndexOf(address, shortName, name) {
  let index = address.indexOf(shortName);
  let matchName = shortName;
  if (index > -1) {
    for (let i = shortName.length; i <= name.length; i++) {
      const _name = name.substr(0, i);
      const _index = address.indexOf(_name);
      if (_index > -1) {
        index = _index;
        matchName = _name;
      } else {
        break;
      }
    }
  }
  return {index, matchName};
}

const Utils = {
  shortIndexOf,
  strLen,
  getAreaByCode,
  getAreaByAddress,
  getTargetAreaListByCode,
  Reg,
};

export default Utils;
