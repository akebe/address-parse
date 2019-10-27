/**
 * address-parse
 * MIT License
 * By www.asseek.com
 */
import AREA from '../area';
import Utils from './utils';
import ParseArea from './parse-area';

class ParseAddress {

  static ExcludeKeys = ['发件人', '收货地址', '收货人', '收件人', '收货', '手机号码', '邮编', '电话', '所在地区', '详细地址', '地址', '：', ':', '；', ';', '，', ',', '。', '、'];

  static ParseArea = new ParseArea();

  static Reg = {
    mobile: /(86-[1][0-9]{10})|(86[1][0-9]{10})|([1][0-9]{10})/g,
    phone: /(([0-9]{3,4}-)[0-9]{7,8})|([0-9]{12})|([0-9]{11})|([0-9]{10})|([0-9]{9})|([0-9]{8})|([0-9]{7})/g,
    zipCode: /([0-9]{6})/g,
  };

  constructor(address) {
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
  parse(address, parseAll) {
    this.result = {
      mobile: '',
      zip_code: '',
      phone: '',
    };

    this.address = address;
    this.replace();
    this.parseMobile();
    this.parsePhone();
    this.parseZipCode();
    this.address = this.address.replace(/ {2,}/, ' ');

    let results = ParseAddress.ParseArea.parse(this.address, parseAll);

    for (let result of results) {
      Object.assign(result, this.result);
      ParseAddress.parseName(result);
    }

    return results;
  }

  /**
   * 替换无效字符
   */
  replace() {
    let {address} = this;
    for (let key of ParseAddress.ExcludeKeys) {
      address = address.replace(new RegExp(key, 'g'), ' ');
    }
    this.address = address.replace(/\r\n/g, ' ').replace(/\n/g, ' ').replace(/\t/g, ' ').replace(/ {2,}/g, ' ')
      .replace(/(\d{3})-(\d{4})-(\d{4})/g, '$1$2$3').replace(/(\d{3}) (\d{4}) (\d{4})/g, '$1$2$3');
  }

  /**
   * 提取手机号码
   */
  parseMobile() {
    const mobile = ParseAddress.Reg.mobile.exec(this.address);
    if (mobile) {
      this.result.mobile = mobile[0];
      this.address = this.address.replace(mobile[0], ' ');
    }
    ParseAddress.Reg.mobile.lastIndex = 0;
  }

  /**
   * 提取电话号码
   */
  parsePhone() {
    const phone = ParseAddress.Reg.phone.exec(this.address);
    if (phone) {
      this.result.phone = phone[0];
      this.address = this.address.replace(phone[0], ' ');
    }
    ParseAddress.Reg.phone.lastIndex = 0;
  }

  /**
   * 提取邮编
   */
  parseZipCode() {
    const zip = ParseAddress.Reg.zipCode.exec(this.address);
    if (zip) {
      this.result.zip_code = zip[0];
      this.address = this.address.replace(zip[0], '');
    }
    ParseAddress.Reg.zipCode.lastIndex = 0;
  }

  /**
   * 提取姓名
   * @param result
   * @param maxLen 字符串占位 比这个数值短才识别为姓名 汉字2位英文1位
   */
  static parseName(result, maxLen = 11) {
    if (!result.name) {
      const list = result.details.split(' ');
      const name = {
        value: '',
        index: -1,
      };
      if (list.length > 1) {
        list.forEach((v, i) => {
          if (v && Utils.strLen(v) < maxLen) {
            if (!name.value || Utils.strLen(name.value) > Utils.strLen(v)) {
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
}

export {
  ParseAddress,
  AREA,
  Utils,
};

export default new ParseAddress();

