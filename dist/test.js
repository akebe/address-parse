'use strict';

var _parse = require('./parse');

var _parse2 = _interopRequireDefault(_parse);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toArray(arr) { return Array.isArray(arr) ? arr : Array.from(arr); } /**
                                                                               * address-parse
                                                                               * MIT License
                                                                               * By www.asseek.com
                                                                               */


//const Parse = require('address-parse').default;

// 测试地址 规则更新需要确保这里面的地址可以被正确解析
var list = [['福建省福州市福清市石竹街道义明综合楼3F，15000000000，asseek', '350181'], ['福建省福清市石竹街道义明综合楼3F，15000000000，asseek', '350181'], ['福州市福清市石竹街道义明综合楼3F，15000000000，asseek', '350181'], ['福清市石竹街道义明综合楼3F，15000000000，asseek', '350181'], ['浙江省温州市乐清柳市镇', '330382'], ['李xx 13512222322 广西壮族自治区 桂林市 恭城瑶族自治县 恭城镇拱辰东路xx-xx号', '450332'], ['李xx 13512222222 恭城 恭城镇拱辰东路08-88号', '450332'], ['四川成都高新区天府大道中段530号东方希望天祥广场a座4302号北京万商天勤(成都)律师事务所', '510191'], '房pp,18263333333,山东省 德州市 乐陵市 市中街道怡然居小区,253600', '张y,18802222222,黑龙江省 哈尔滨市 道里区 经纬街道经纬七道街,000000', '深圳市龙华新区民治街道办民乐新村。陆xg15822222222', '张l,15222222222,内蒙古自治区 呼和浩特市 和林格尔县 盛乐经济工业园区内蒙古师范大学盛乐校区十三号楼,011500', ['张l,15222222222,和林格尔 盛乐经济工业园区内蒙古师范大学盛乐校区十三号楼,011500', '150123'], '上海市徐汇区 复兴中路1237号 5楼WeWork 200010 柚子', ['龙湖区黄山路潮华雅居10栋000房 肖小姐', '440507'], ['西安市雁塔区丈八东路晶城秀府7号楼2单元     李飞', '610113'], ['湖北省安陆市西亚小铺，文元13377777788', '420982'], ['福建宁德福鼎太姥山镇岭后路。 丹', '350982'], ['南京市雨花区小行路58号名城世家花园', '320114'], ['四川省阆中市', '511381'], ['北京市市辖区东城区嘿嘿 嘿嘿 18031491271', '110101'], ['福建省福州市福清市台江公寓', '350181']];

var index = 0;
var isSuccess = true;
console.time('解析耗时');
var _iteratorNormalCompletion = true;
var _didIteratorError = false;
var _iteratorError = undefined;

try {
  for (var _iterator = list[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
    var v = _step.value;

    index += 1;
    var address = Array.isArray(v) ? v[0] : v;
    var code = Array.isArray(v) ? v[1] : '';
    //let [result, ...results] = Parse.parse(address, true);

    var _Parse$parse = _parse2.default.parse(address),
        _Parse$parse2 = _toArray(_Parse$parse),
        result = _Parse$parse2[0],
        results = _Parse$parse2.slice(1);

    var status = code ? result.code === code : result.__parse;
    if (!status) isSuccess = false;
    //console.log(index, code ? result.code === code : !!result.area, result, results);
    console.log(index, code ? result.code === code : result.__parse, result);
    //console.log(index, code ? result.code === code : !!result.area);
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

console.timeEnd('解析耗时');
console.log('\u89E3\u6790\u7ED3\u679C: ' + (isSuccess ? '通过' : '失败'));