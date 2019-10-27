/**
 * address-parse
 * MIT License
 * By www.asseek.com
 */
import AREA from '../area';

function getAreaByCode(code) {
  const pCode = `${code.slice(0, 2)}0000`,
    cCode = `${code.slice(0, 4)}00`;
  return {
    code: code,
    province: AREA.province_list[pCode] || '',
    city: AREA.city_list[cCode] || '',
    area: AREA.county_list[code] || '',
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
function getTargetAreaListByCode(target, code, parent) {
  const result = [];
  let compareNum = target === 'province' ? 2 : target === 'city' ? 4 : 6;
  if (parent) {
    if (target === 'province') {
      let _code = code.slice(0, 2) + '000000'.slice(0, 4);
      result.push({
        code: _code,
        name: AREA.province_list[_code],
      });
    }
    let _code = code.slice(0, 4) + '000000'.slice(0, 2);
    result.push({
      code: _code,
      name: AREA.city_list[_code],
    });
  } else {
    const list = AREA[{
      province: 'province_list',
      city: 'city_list',
      area: 'county_list',
    }[target]] || [];
    code = code.slice(0, compareNum - 2);
    if (code) {
      const tail = code.length === 2 ? '00' : '';
      for (let i = 0; i < 100; i++) {
        const c = `${code}${i < 9 ? '0' : ''}${i}${tail}`;
        if (list[c]) {
          result.push({
            code: c,
            name: list[c],
          });
        }
      }
    } else {
      for (let c in list) {
        result.push({
          code: c,
          name: list[c],
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
function getAreaByAddress({province, city, area}) {
  const {province_list, city_list, county_list} = AREA;
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
              for (let _code_area in county_list) {
                if (_code_area.indexOf(_code_city) === 0) {
                  let _area = county_list[_code_area];
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

const Utils = {
  strLen,
  getAreaByCode,
  getAreaByAddress,
  getTargetAreaListByCode,
};

export default Utils;