/**
 * address-parse
 * MIT License
 * By www.asseek.com
 */
import AREA from '../area';
import Utils from './utils';

const ProvinceKeys = [
  '特别行政区', '古自治区', '维吾尔自治区', '壮族自治区', '回族自治区', '自治区', '省省直辖', '省', '市',
];

const CityKeys = [
  '布依族苗族自治州', '苗族侗族自治州', '藏族羌族自治州', '哈尼族彝族自治州', '壮族苗族自治州', '傣族景颇族自治州', '蒙古族藏族自治州',
  '傣族自治州', '白族自治州', '藏族自治州', '彝族自治州', '回族自治州', '蒙古自治州', '朝鲜族自治州', '地区', '哈萨克自治州', '盟', '市',
];

const AreaKeys = [
  '满族自治县', '满族蒙古族自治县', '蒙古族自治县', '朝鲜族自治县',
  '回族彝族自治县', '彝族回族苗族自治县', '彝族苗族自治县', '土家族苗族自治县', '布依族苗族自治县', '苗族布依族自治县',
  '彝族傣族自治县', '傣族彝族自治县', '仡佬族苗族自治县', '黎族苗族自治县', '苗族侗族自治县', '哈尼族彝族傣族自治县', '哈尼族彝族自治县',
  '彝族哈尼族拉祜族自治县', '傣族拉祜族佤族自治县', '傣族佤族自治县', '拉祜族佤族布朗族傣族自治县', '苗族瑶族傣族自治县', '彝族回族自治县',
  '独龙族怒族自治县', '保安族东乡族撒拉族自治县', '回族土族自治县', '撒拉族自治县', '哈萨克自治县', '塔吉克自治县',
  '回族自治县', '畲族自治县', '土家族自治县', '布依族自治县', '苗族自治县', '瑶族自治县', '侗族自治县', '水族自治县', '傈僳族自治县',
  '仫佬族自治县', '毛南族自治县', '黎族自治县', '羌族自治县', '彝族自治县', '藏族自治县', '纳西族自治县', '裕固族自治县', '哈萨克族自治县',
  '哈尼族自治县', '拉祜族自治县', '佤族自治县',
  '左旗', '右旗', '中旗', '后旗', '联合旗', '自治旗', '旗', '自治县',
  '区', '县', '市',
];

class ParseArea {

  static isInit = false;

  static ProvinceShort = {};

  static CityShort = {};

  static AreaShort = {};

  static init() {
    for (let code in AREA.province_list) {
      let province = AREA.province_list[code];
      ParseArea.ProvinceShort[code] = ProvinceKeys.reduce((v, key) => v.replace(key, ''), province);
    }

    for (let code in AREA.city_list) {
      let city = AREA.city_list[code];
      if (city.length > 2) {
        ParseArea.CityShort[code] = CityKeys.reduce((v, key) => v.replace(key, ''), city);
      }
    }
    for (let code in AREA.county_list) {
      let area = AREA.county_list[code];
      if (area.length > 2) {
        ParseArea.AreaShort[code] = AreaKeys.reduce((v, key) => v.replace(key, ''), area);
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
    if (parseAll || !this.results[0] || !this.results[0].city) {
      // 逆向城市解析  通过所有CityShort匹配
      this.results.unshift(...ParseArea.parseByCity(address));
      if (parseAll || !this.results[0] || !this.results[0].city) {
        // 逆向地区解析   通过所有AreaShort匹配
        this.results.unshift(...ParseArea.parseByArea(address));
      }
    }

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
    };
    let address = addressBase;
    for (let code in province_list) {
      const province = province_list[code];
      let index = address.indexOf(province);
      let shortProvince = index > -1 ? '' : ParseArea.ProvinceShort[code];
      let provinceLength = shortProvince ? shortProvince.length : province.length;
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
          address = __address;
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
    for (let city of cityList) {
      let index = address.indexOf(city.name);
      let shortCity = index > -1 ? '' : ParseArea.CityShort[city.code];
      let cityLength = shortCity ? shortCity.length : city.name.length;
      if (shortCity) {
        index = address.indexOf(shortCity);
      }
      if (index > -1 && index < 3) {
        result.city = city.name;
        result.code = city.code;
        address = address.substr(index + cityLength);
        //如果是用短名匹配的 要替换市关键字
        if (shortCity) {
          for (let key of CityKeys) {
            if (address.indexOf(key) === 0) {
              //排除几个会导致异常的解析
              if (key !== '市' && !['市北区', '市南区', '市中区', '市辖区'].some(v => address.indexOf(v) === 0)) {
                address = address.substr(key.length);
              }
            }
          }
        }
        address = ParseArea.parse_area_by_city(address, result);
        break;
      }
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
    for (let area of areaList) {
      let index = address.indexOf(area.name);
      let shortArea = index > -1 ? '' : ParseArea.AreaShort[area.code];
      let areaLength = shortArea ? shortArea.length : area.name.length;
      if (shortArea) {
        index = address.indexOf(shortArea);
      }
      if (index > -1 && index < 3) {
        result.area = area.name;
        result.code = area.code;
        address = address.substr(index + areaLength);
        //如果是用短名匹配的 要替换市关键字
        if (shortArea) {
          for (let key of AreaKeys) {
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
   * 1.4.提取省份但没有提取到城市的地址尝试通过省份下地区匹配
   */
  static parse_area_by_province(address, result) {
    const areaList = Utils.getTargetAreaListByCode('area', result.code);
    for (let area of areaList) {
      let index = address.indexOf(area.name);
      let shortArea = index > -1 ? '' : ParseArea.AreaShort[area.code];
      let areaLength = shortArea ? shortArea.length : area.name.length;
      if (shortArea) {
        index = address.indexOf(shortArea);
      }
      if (index > -1 && index < 6) {
        const [city] = Utils.getTargetAreaListByCode('city', area.code, true);
        result.city = city.name;
        result.area = area.name;
        result.code = area.code;
        address = address.substr(index + areaLength);
        //如果是用短名匹配的 要替换地区关键字
        if (shortArea) {
          for (let key of AreaKeys) {
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
    };
    let isParse = false;
    let address = addressBase;
    for (let code in city_list) {
      const city = city_list[code];
      if (city.length < 2) break;
      let index = address.indexOf(city);
      let shortCity = index > -1 ? '' : ParseArea.CityShort[code];
      let cityLength = shortCity ? shortCity.length : city.length;
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
          isParse = true;
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
    // 没有标准识别的情况下 缓存列表按name排序，左侧最短的最接近
    if (!isParse && results.length) {
      results.sort((a, b) => a.name.length > b.name.length ? 1 : -1);
    }
    return results;
  }

  /**
   * 3 通过地区识别地址
   * @returns {Array}
   */
  static parseByArea(addressBase) {
    const area_list = AREA.county_list;
    const results = [];
    const result = {
      province: '',
      city: '',
      area: '',
      details: '',
      name: '',
      code: '',
      __type: 'parseByArea',
    };
    let isParse = false;
    let address = addressBase;
    for (let code in area_list) {
      const area = area_list[code];
      if (area.length < 2) break;
      let index = address.indexOf(area);
      let shortArea = index > -1 ? '' : ParseArea.AreaShort[code];
      let areaLength = shortArea ? shortArea.length : area.length;
      if (shortArea) {
        index = address.indexOf(shortArea);
      }
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
        address = address.substr(index + areaLength);

        if (_provinceName || _cityName) {
          isParse = true;
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
    // 没有标准识别的情况下 缓存列表按name排序，左侧最短的最接近
    if (!isParse && results.length) {
      results.sort((a, b) => a.name.length > b.name.length ? 1 : -1);
    }
    return results;
  }
}

export default ParseArea;