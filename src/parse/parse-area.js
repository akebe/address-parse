/**
 * address-parse
 * MIT License
 * By www.asseek.com
 */
import AREA from '../area';
import Utils from './utils';

const ProvinceKeys = [
  '特别行政区', '古自治区', '维吾尔自治区', '壮族自治区', '回族自治区', '自治区', '省省直辖', '省', '市'
];

const CityKeys = [
  '布依族苗族自治州', '苗族侗族自治州', '藏族羌族自治州', '哈尼族彝族自治州', '壮族苗族自治州', '傣族景颇族自治州', '蒙古族藏族自治州',
  '傣族自治州', '白族自治州', '藏族自治州', '彝族自治州', '回族自治州', '蒙古自治州', '朝鲜族自治州', '地区', '哈萨克自治州', '盟', '市'
];

const AreaKeys = [
  '满族自治县', '满族蒙古族自治县', '蒙古族自治县', '朝鲜族自治县',
  '回族彝族自治县', '彝族回族苗族自治县', '彝族苗族自治县', '土家族苗族自治县', '布依族苗族自治县', '苗族布依族自治县', '苗族土家族自治县',
  '彝族傣族自治县', '傣族彝族自治县', '仡佬族苗族自治县', '黎族苗族自治县', '苗族侗族自治县', '哈尼族彝族傣族自治县', '哈尼族彝族自治县',
  '彝族哈尼族拉祜族自治县', '傣族拉祜族佤族自治县', '傣族佤族自治县', '拉祜族佤族布朗族傣族自治县', '苗族瑶族傣族自治县', '彝族回族自治县',
  '独龙族怒族自治县', '保安族东乡族撒拉族自治县', '回族土族自治县', '撒拉族自治县', '哈萨克自治县', '塔吉克自治县',
  '回族自治县', '畲族自治县', '土家族自治县', '布依族自治县', '苗族自治县', '瑶族自治县', '侗族自治县', '水族自治县', '傈僳族自治县',
  '仫佬族自治县', '毛南族自治县', '黎族自治县', '羌族自治县', '彝族自治县', '藏族自治县', '纳西族自治县', '裕固族自治县', '哈萨克族自治县',
  '哈尼族自治县', '拉祜族自治县', '佤族自治县',
  '达斡尔族区', '达斡尔族自治旗',
  '左旗', '右旗', '中旗', '后旗', '联合旗', '自治旗', '旗', '自治县',
  '街道办事处',
  '新区', '区', '县', '市'
];

class ParseArea {

  static isInit = false;

  static ProvinceShortList = [];

  static ProvinceShort = {};

  static CityShort = {};

  static AreaShort = {};

  static init() {
    for (const code in AREA.province_list) {
      const province = AREA.province_list[code];
      ParseArea.ProvinceShort[code] = ProvinceKeys.reduce((v, key) => v.replace(key, ''), province);
      ParseArea.ProvinceShortList.push(ParseArea.ProvinceShort[code]);
    }

    for (const code in AREA.city_list) {
      const city = AREA.city_list[code];
      if (city.length > 2) {
        ParseArea.CityShort[code] = CityKeys.reduce((v, key) => v.replace(key, ''), city);
      }
    }
    for (const code in AREA.area_list) {
      let area = AREA.area_list[code];
      if (area === '雨花台区') area = '雨花区';
      if (area === '神农架林区') area = '神农架';
      if (area.length > 2 && area !== '高新区') {
        ParseArea.AreaShort[code] = AreaKeys.reduce((v, key) => {
          if (v.indexOf(key) > 1) v = v.replace(key, '');
          return v;
        }, area);
      }
    }
    ParseArea.isInit = true;
  }

  constructor(address) {
    if (!ParseArea.isInit) {
      ParseArea.init();
    }

    if (address) {
      return this.parse(address);
    }
  }

  /**
   * 开始解析
   * @param address string
   * @param parseAll 是否执行全部解析 默认识别到city终止
   * @returns {Array}
   */
  parse(address, parseAll) {
    this.results = [];

    // 正向解析
    this.results.unshift(...ParseArea.parseByProvince(address));
    if (parseAll || !this.results[0] || !this.results[0].__parse) {
      // 逆向城市解析  通过所有CityShort匹配
      this.results.unshift(...ParseArea.parseByCity(address));
      if (parseAll || !this.results[0] || !this.results[0].__parse) {
        // 逆向地区解析   通过所有AreaShort匹配
        this.results.unshift(...ParseArea.parseByArea(address));
      }
    }

    // __parse结果改为数值类型
    if (this.results.length > 1) {
      for (const result of this.results) {
        let _address = address;
        result.__parse = +result.__parse;
        if (result.__parse && result.province && _address.includes(result.province)) {
          _address = _address.replace(result.province, '');
          result.__parse += 1;
          if (result.city) {
            if (_address.includes(result.city)) {
              if (result.city !== '县' || !_address.indexOf(result.city)) {
                _address = _address.replace(result.city, '');
              }
              result.__parse += 1;
              if (result.area && _address.includes(result.area)) {
                result.__parse += 1;
              }
            } else if (address.includes(result.city)) {
              result.__parse += 0.5;
              if (result.area && _address.includes(result.area)) {
                result.__parse += 1;
              }
            }

            if (result.area && _address.includes(result.area)) {
              result.__parse += 1;
            } else if (result.area && _address.includes(result.area.substr(0, 2))) {
              result.__parse += 0.5;
            }
          }
        }
      }
    }

    // 可信度排序
    this.results.sort((a, b) =>
      !a.__parse && !b.__parse && a.city && !b.city ? -1 :
        !a.__parse && !b.__parse && !a.city && b.city ? 1 :
          a.__parse && !b.__parse ? -1 :
            !a.__parse && b.__parse ? 1 :
              a.__parse && b.__parse && a.__parse > b.__parse ? -1 :
                a.__parse && b.__parse && a.__parse < b.__parse ? 1 :
                  a.__parse && a.__type === 'parseByProvince' ? -1 :
                    b.__parse && b.__type === 'parseByProvince' ? 1 :
                      a.name.length > b.name.length ? 1 : a.name.length < b.name.length ? -1 : 0
    );

    return this.results;
  }

  /**
   * 1.1 提取省份
   */
  static parseByProvince(addressBase) {
    const province_list = AREA.province_list;
    const results = [];
    const result = {
      province: '',
      city: '',
      area: '',
      details: '',
      name: '',
      code: '',
      __type: 'parseByProvince',
      __parse: false
    };
    let address = addressBase;
    for (const code in province_list) {
      const province = province_list[code];
      let index = address.indexOf(province);
      const shortProvince = index > -1 ? '' : ParseArea.ProvinceShort[code];
      const provinceLength = shortProvince ? shortProvince.length : province.length;
      if (shortProvince) {
        index = address.indexOf(shortProvince);
      }
      if (index > -1) {
        // 如果省份不是第一位 在省份之前的字段识别为名称
        if (index > 0) {
          result.name = address.substr(0, index).trim();
          address = address.substr(index).trim();
        }
        result.province = province;
        result.code = code;
        let _address = address.substr(provinceLength);
        if (_address.charAt(0) !== '市' || _address.indexOf(province) > -1) {
          address = _address;
        }
        //如果是用短名匹配的 要替换省关键字
        if (shortProvince) {
          for (let key of ProvinceKeys) {
            if (address.indexOf(ProvinceKeys[key]) === 0) {
              address = address.substr(ProvinceKeys[key].length);
            }
          }
        }
        let __address = ParseArea.parse_city_by_province(address, result);
        if (!result.city) {
          __address = ParseArea.parse_area_by_province(address, result);
        }
        if (result.city) {
          result.__parse = true;
          address = __address;
          // 因为详细地址内包含其他地区数据导致解析失败的解决方案
          // 为避免边界问题 含省份名才触发，如果是伊宁市上海城徐汇苑不触发
          if (index > 4 && ParseArea.ProvinceShortList.some(shortProvince => result.name.includes(shortProvince))) {
            const [_result] = ParseArea.parseByProvince(result.name);
            if (_result.__parse) {
              Object.assign(result, _result);
              address = addressBase.substr(index).trim();
              if (!result.area) {
                address = ParseArea.parse_area_by_city(address, result);
              }
              result.__parse = 3;
            }
          }
          break;
        } else {
          //如果没有识别到地区 缓存本次结果，并重置数据
          results.unshift({...result, details: address.trim()});
          result.province = '';
          result.code = '';
          result.name = '';
          address = addressBase;
        }
      }
    }
    if (result.code) {
      results.unshift({...result, details: address.trim()});
    }
    return results;
  }

  /**
   * 1.2.提取城市
   * @returns {boolean}
   */
  static parse_city_by_province(address, result) {
    const cityList = Utils.getTargetAreaListByCode('city', result.code);
    const _result = {
      city: '',
      code: '',
      index: -1,
      address: '',
      isShort: false
    };
    for (const city of cityList) {
      let index = address.indexOf(city.name);
      const shortCity = index > -1 ? '' : ParseArea.CityShort[city.code];
      const cityLength = shortCity ? shortCity.length : city.name.length;
      if (shortCity) {
        index = address.indexOf(shortCity);
      }
      if (index > -1 && (_result.index === -1 || _result.index > index || (!shortCity && _result.isShort))) {
        _result.city = city.name;
        _result.code = city.code;
        _result.index = index;
        _result.address = address.substr(index + cityLength);
        _result.isShort = !!shortCity;
        //如果是用短名匹配的 要替换市关键字
        if (shortCity) {
          for (const key of CityKeys) {
            if (address.indexOf(key) === 0) {
              //排除几个会导致异常的解析
              if (key !== '市' && !['市北区', '市南区', '市中区', '市辖区'].some(v => address.indexOf(v) === 0)) {
                address = address.substr(key.length);
              }
            }
          }
        }
      }
      if (index > -1 && index < 3) {
        result.city = city.name;
        result.code = city.code;
        _result.address = address.substr(index + cityLength);
        //如果是用短名匹配的 要替换市关键字
        if (shortCity) {
          for (const key of CityKeys) {
            if (_result.address.indexOf(key) === 0) {
              //排除几个会导致异常的解析
              if (key !== '市' && !['市北区', '市南区', '市中区', '市辖区'].some(v => _result.address.indexOf(v) === 0)) {
                _result.address = _result.address.substr(key.length);
              }
            }
          }
        }
      }
    }
    if (_result.index > -1) {
      result.city = _result.city;
      result.code = _result.code;
      address = ParseArea.parse_area_by_city(_result.address, result);
    }
    return address;
  }

  /**
   * 1.3.,2.2 已匹配城市的地址 提取地区
   * @param address string
   * @param result object
   * @returns {string}
   */
  static parse_area_by_city(address, result) {
    const areaList = Utils.getTargetAreaListByCode('area', result.code);
    const _result = {
      area: '',
      code: '',
      index: -1,
      address: '',
      isShort: false
    };
    for (const area of areaList) {
      let index = address.indexOf(area.name);
      let shortArea = index > -1 ? '' : ParseArea.AreaShort[area.code];
      if (shortArea) {
        const {index: _index, matchName} = Utils.shortIndexOf(address, shortArea, area.name);
        index = _index;
        shortArea = matchName;
      }
      const areaLength = shortArea ? shortArea.length : area.name.length;
      if (index > -1 && (_result.index === -1 || _result.index > index || (!shortArea && _result.isShort))) {
        _result.area = area.name;
        _result.code = area.code;
        _result.index = index;
        _result.address = address.substr(index + areaLength);
        _result.isShort = !!shortArea;
        //如果是用短名匹配的 要替换市关键字
        if (shortArea) {
          for (let key of AreaKeys) {
            if (_result.address.indexOf(key) === 0) {
              _result.address = _result.address.substr(key.length);
            }
          }
        }
      }
    }
    if (_result.index > -1) {
      result.area = _result.area;
      result.code = _result.code;
      address = _result.address;
    }
    return address;
  }

  /**
   * 1.4.提取省份但没有提取到城市的地址尝试通过省份下地区匹配
   */
  static parse_area_by_province(address, result) {
    const areaList = Utils.getTargetAreaListByCode('area', result.code);
    for (const area of areaList) {
      let index = address.indexOf(area.name);
      let shortArea = index > -1 ? '' : ParseArea.AreaShort[area.code];
      if (shortArea) {
        const {index: _index, matchName} = Utils.shortIndexOf(address, shortArea, area.name);
        index = _index;
        shortArea = matchName;
      }
      const areaLength = shortArea ? shortArea.length : area.name.length;

      if (index > -1 && index < 6) {
        const [city] = Utils.getTargetAreaListByCode('city', area.code, true);
        result.city = city.name;
        result.area = area.name;
        result.code = area.code;
        address = address.substr(index + areaLength);
        //如果是用短名匹配的 要替换地区关键字
        if (shortArea) {
          for (const key of AreaKeys) {
            if (address.indexOf(key) === 0) {
              address = address.substr(key.length);
            }
          }
        }
        break;
      }
    }
    return address;
  }

  /**
   * 2.1 通过城市识别地址
   * @param addressBase string
   * @returns {Array}
   */
  static parseByCity(addressBase) {
    const city_list = AREA.city_list;
    const results = [];
    const result = {
      province: '',
      city: '',
      area: '',
      details: '',
      name: '',
      code: '',
      __type: 'parseByCity',
      __parse: false
    };
    let address = addressBase;
    for (const code in city_list) {
      const city = city_list[code];
      if (city.length < 2) continue;
      let index = address.indexOf(city);
      const shortCity = index > -1 ? '' : ParseArea.CityShort[code];
      const cityLength = shortCity ? shortCity.length : city.length;
      if (shortCity) {
        index = address.indexOf(shortCity);
      }
      if (index > -1) {
        const [province] = Utils.getTargetAreaListByCode('province', code, true);
        result.province = province.name;
        result.city = city;
        result.code = code;
        // 左侧排除省份名剩下的内容识别为姓名
        let leftAddress = address.substr(0, index);
        let _provinceName = '';
        if (leftAddress) {
          _provinceName = province.name;
          let _index = leftAddress.indexOf(_provinceName);
          if (_index === -1) {
            _provinceName = ParseArea.ProvinceShort[province.code];
            _index = leftAddress.indexOf(_provinceName);
            if (_index === -1) _provinceName = '';
          }
          if (_provinceName) {
            leftAddress = leftAddress.replace(new RegExp(_provinceName, 'g'), '');
          }
          if (leftAddress) {
            result.name = leftAddress;
          }
        }

        address = address.substr(index + cityLength);
        address = ParseArea.parse_area_by_city(address, result);
        if (_provinceName || result.area) {
          result.__parse = true;
          break;
        } else {
          //如果没有识别到省份和地区 缓存本次结果，并重置数据
          results.unshift({...result, details: address.trim()});
          result.name = '';
          result.city = '';
          result.province = '';
          result.code = '';
          address = addressBase;
        }
      }
    }
    if (result.code) {
      results.unshift({...result, details: address.trim()});
    }
    return results;
  }

  /**
   * 3 通过地区识别地址
   * @returns {Array}
   */
  static parseByArea(addressBase) {
    const area_list = AREA.area_list;
    const results = [];
    const result = {
      province: '',
      city: '',
      area: '',
      details: '',
      name: '',
      code: '',
      __type: 'parseByArea',
      __parse: false
    };
    let address = addressBase;
    for (const code in area_list) {
      const area = area_list[code];
      if (area.length < 2) continue;
      let index = address.indexOf(area);
      let shortArea = index > -1 ? '' : ParseArea.AreaShort[code];
      if (shortArea) {
        const {index: _index, matchName} = Utils.shortIndexOf(address, shortArea, area);
        index = _index;
        shortArea = matchName;
      }
      const areaLength = shortArea ? shortArea.length : area.length;
      if (index > -1) {
        const [province, city] = Utils.getTargetAreaListByCode('province', code, true);
        result.province = province.name;
        result.city = city.name;
        result.area = area;
        result.code = code;
        // 左侧排除省份城市名剩下的内容识别为姓名
        let leftAddress = address.substr(0, index);
        let _provinceName = '', _cityName = '';
        if (leftAddress) {
          _provinceName = province.name;
          let _index = leftAddress.indexOf(_provinceName);
          if (_index === -1) {
            _provinceName = ParseArea.ProvinceShort[province.code];
            _index = leftAddress.indexOf(_provinceName);
            if (_index === -1) _provinceName = '';
          }
          if (_provinceName) {
            leftAddress = leftAddress.replace(new RegExp(_provinceName, 'g'), '');
          }

          _cityName = city.name;
          _index = leftAddress.indexOf(_cityName);
          if (_index === -1) {
            _cityName = ParseArea.CityShort[city.code];
            _index = leftAddress.indexOf(_cityName);
            if (_index === -1) _cityName = '';
          }
          if (_cityName) {
            leftAddress = leftAddress.replace(new RegExp(_cityName, 'g'), '');
          }
          if (leftAddress) {
            result.name = leftAddress;
          }
        }

        // 出现同省地区匹配错误处理，广东省惠来县惠城镇 如不经处理匹配到 广东省惠州市惠城区
        if (_provinceName && !_cityName) {
          const [_result] = ParseArea.parseByArea(address.substr(0, index));
          if (_result && _result.__parse) {
            Object.assign(result, _result);
            address = address.substr(index).trim();
            if (!result.area) {
              address = ParseArea.parse_area_by_city(address, result);
            }
            result.__parse = 2;
            break;
          }
        }
        if (shortArea && address.charAt(index + areaLength) === '县') index += 1;
        address = address.substr(index + areaLength);

        if (_provinceName || _cityName) {
          result.__parse = true;
          break;
        } else {
          //如果没有识别到省份和地区 缓存本次结果，并重置数据
          results.unshift({...result, details: address.trim()});
          result.name = '';
          result.city = '';
          result.area = '';
          result.province = '';
          result.code = '';
          address = addressBase;
        }
      }
    }
    if (result.code) {
      results.unshift({...result, details: address.trim()});
    }
    return results;
  }

}

export default ParseArea;
