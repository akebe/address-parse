/**
 * address-parse
 * MIT License
 * By www.asseek.com
 */
import Parse, {AREA, Utils} from './parse/index.js';

/**
 * 地址列表解析验证
 * @param list {Array} [address, [address, resultCode]]
 * @returns {boolean}
 */
function addressParseTest(list = []) {
  let isSuccess = true;
  let index = 0;
  for (const item of list) {
    index += 1;
    const address = Array.isArray(item) ? item[0] : item;
    const options = Array.isArray(item) ? item[1] : '';
    const code = typeof options === 'object' ? options.code : options;
    const [result, ...results] = Parse.parse(address, true);
    let status = code ? result.code === code : result.__parse;
    if (typeof options === 'object') {
      for (const key in options) {
        if (result[key] !== options[key]) {
          status = false;
          break;
        }
      }
    }
    if (!status) {
      isSuccess = false;
      console.log('addressParseTest->fail', `${address} [${code}->${result.code}]`, result, results, options);
    }
  }
  return isSuccess;
}

/**
 * 把所有省市区组为测试数组123
 */
function getAllAreaTestList() {
  const cityTestList = [];
  const areaTestList = [];
  const province_list = AREA.province_list;
  for (const provinceCode in province_list) {
    const province = province_list[provinceCode];
    const city_list = Utils.getTargetAreaListByCode('city', provinceCode);
    for (const city of city_list) {
      cityTestList.push([`${province}${city.name}`, city.code]);
      const area_list = Utils.getTargetAreaListByCode('area', city.code);
      for (const area of area_list) {
        areaTestList.push([`${province}${city.name}${area.name}`, area.code]);
      }

    }
  }
  return {
    cityTestList,
    areaTestList
  };
}

const list = [
  ['福建省福州市福清市石竹街道义明综合楼3F，15000000000，asseek', '350181'],
  ['福建省福清市石竹街道义明综合楼3F，15000000000，asseek', '350181'],
  ['福州市福清市石竹街道义明综合楼3F，15000000000，asseek', '350181'],
  ['福清市石竹街道义明综合楼3F，15000000000，asseek', '350181'],
  ['浙江省温州市乐清柳市镇', '330382'],
  ['李xx 13512222322 广西壮族自治区 桂林市 恭城瑶族自治县 恭城镇拱辰东路xx-xx号', '450332'],
  ['李xx 13512222222 恭城 恭城镇拱辰东路08-88号', '450332'],
  ['四川成都高新区天府大道中段530号东方希望天祥广场a座4302号北京万商天勤(成都)律师事务所', '510191'],
  '房pp,18263333333,山东省 德州市 乐陵市 市中街道怡然居小区,253600',
  ['张y,18802222222,黑龙江省 哈尔滨市 道里区 经纬街道经纬七道街,000000', {name: '张y'}],
  ['深圳市龙华新区民治街道办民乐新村。陆xg15822222222', {name: '陆xg'}],
  '张l,15222222222,内蒙古自治区 呼和浩特市 和林格尔县 盛乐经济工业园区内蒙古师范大学盛乐校区十三号楼,011500',
  ['张l,15222222222,和林格尔 盛乐经济工业园区内蒙古师范大学盛乐校区十三号楼,011500', '150123'],
  '上海市徐汇区 复兴中路1237号 5楼WeWork 200010 柚子',
  ['龙湖区黄山路潮华雅居10栋000房 肖小姐', {code: '440507', name: '肖小姐'}],
  ['西安市雁塔区丈八东路晶城秀府7号楼2单元     李飞', {code: '610113', name: '李飞'}],
  ['湖北省安陆市西亚小铺，文元13377777788', {code: '420982', name: '文元'}],
  ['福建宁德福鼎太姥山镇岭后路。 丹', {code: '350982', name: '丹'}],
  ['南京市雨花区小行路58号名城世家花园', '320114'],
  ['四川省阆中市', '511381'],
  ['北京市市辖区东城区嘿嘿 嘿嘿 18031491271', {code: '110101', name: '嘿嘿'}],
  ['福建省福州市福清市台江公寓', '350181'],
  ['山东省青岛市平度市南村镇亭兰  张13668888888', {code: '370283', name: '张'}],
  ['佛山市南海区盐步 穗盐路景裕嘉园1期 13609770999 大旋仔', {name: '大旋仔'}],
  ['广东省 东莞市 东城街道', {details: '', code: '441916'}],
  ['山东省青岛平度市南村镇', '370283'],
  ['重庆市县城口县', '500229'],
  ['上海 上海市 浦东区 asd，大liu， ', '310115'],
  ['吐鲁番市吐鲁番宾馆', '650400'],
  ['新疆伊宁市上海城徐汇苑23号楼5单元401室', '654002'],
  ['重庆忠县', '500233'],
  ['湖北神农架太阳村10组', '429021'],
  ['广东省惠来县惠城镇南门西路209号', '445224'],
  ['江苏省靖江市江阴经济开发区靖江园区五星村里面的江阴经济开发区', {details: '江阴经济开发区靖江园区五星村里面的江阴经济开发区'}],
  ['北京市密云区花园小区1楼三单元30115801691123 唐娜明收', {mobile: '15801691123'}],
  ['重庆市永川区南大街街道重庆文理学院', '500118'],
  ['18112341234 上海奉贤区南桥镇程普路123号上海可通营业部 朱某某', {code: '310120', name: '朱某某'}],
  ['18112341234 天津大港区大港油田花园路123号 刘某某', {code: '120100', name: '刘某某'}],
  ['海南省三亚市天涯区海南省三亚市天涯区凤凰镇芒果村', {details: '凤凰镇芒果村', code: '460204'}],
  ['海南省海南省白沙黎族自治县海南省省直辖县级行政区划白沙黎族自治县海南省白沙黎族自治县牙叉农场老机关九栋107号', {details: '牙叉农场老机关九栋107号'}],
  ['海南省三亚市天涯区收货人吴艾培手机号码17689751439所在地区海南省三亚市吉阳区国营南新农场详细地址三亚富春山居', {name: '吴艾培', details: '吉阳区国营南新农场 三亚富春山居'}],
  ['广东省东莞市东莞市塘厦塘镇东莞市印中电子厂林村林东三路16号', {details: '塘厦塘镇东莞市印中电子厂林村林东三路16号'}],
  ['黑龙江齐齐哈尔市梅里斯区', '230208'],
  ['江西上饶市广信区华坛山镇', '361104'],
  ['重庆石柱县南宾街道', '500240'],
  ['您用安全的包装发到这个地址：江苏省南京市玄武区 珠江路498号 未来城B座946室 杨寅13913018489 里面用纸条备注下旺旺ID 以及硬盘问题 快递麻烦不要到付 不要发顺丰 什么便宜发什么 邮费我们会打您支付宝账户（如果是硬盘本身问题） 硬盘务必包装好 不能有外伤 麻烦了\n' +
  '请勿发 百世快递，谢谢',{name:'杨寅'}]
];

console.time('测试地址解析耗时');
const result1 = addressParseTest(list);
console.timeEnd('测试地址解析耗时');
console.log(`测试地址解析结果 共 ${list.length} 条`, result1 ? '通过' : '失败');

const {areaTestList, cityTestList} = getAllAreaTestList();

console.time('全国city测试解析耗时');
const result2 = addressParseTest(cityTestList);
console.timeEnd('全国city测试解析耗时');
console.log(`全国city测试解析结果 共 ${cityTestList.length} 条`, result2 ? '通过' : '失败');

console.time('全国area测试解析耗时');
const result3 = addressParseTest(areaTestList);
console.timeEnd('全国area测试解析耗时');
console.log(`全国area测试解析结果 共 ${areaTestList.length} 条`, result3 ? '通过' : '失败');


/**
 * TODO 山东省青岛平度市南村镇 这个地址的parseByArea有问题，现不影响正确解析结果，留待解决
 * 与 https://github.com/akebe/address-parse/issues/14 核心原因一致，靠前的地区先被匹配成功了跳出循环
 */
