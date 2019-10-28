/**
 * address-parse
 * MIT License
 * By www.asseek.com
 */
import Parse from './parse';

// 测试地址 规则更新需要确保这里面的地址可以被正确解析
const list = [
  ['福建省福州市福清市石竹街道义明综合楼3F，15000000000，asseek', '350181'],
  ['福建省福清市石竹街道义明综合楼3F，15000000000，asseek', '350181'],
  ['福州市福清市石竹街道义明综合楼3F，15000000000，asseek', '350181'],
  ['福清市石竹街道义明综合楼3F，15000000000，asseek'],
  ['浙江省温州市乐清柳市镇', '330382'],
  ['李xx 13512222322 广西壮族自治区 桂林市 恭城瑶族自治县 恭城镇拱辰东路xx-xx号', '450332'],
  ['李xx 13512222222 恭城 恭城镇拱辰东路08-88号', '450332'],
  ['四川成都高新区天府大道中段530号东方希望天祥广场a座4302号北京万商天勤(成都)律师事务所', '510191'],
  '房pp,18263333333,山东省 德州市 乐陵市 市中街道怡然居小区,253600',
  '张y,18802222222,黑龙江省 哈尔滨市 道里区 经纬街道经纬七道街,000000',
  '深圳市龙华新区民治街道办民乐新村。陆xg15822222222',
  '张l,15222222222,内蒙古自治区 呼和浩特市 和林格尔县 盛乐经济工业园区内蒙古师范大学盛乐校区十三号楼,011500',
  ['张l,15222222222,和林格尔 盛乐经济工业园区内蒙古师范大学盛乐校区十三号楼,011500', '150123'],
  '上海市徐汇区 复兴中路1237号 5楼WeWork 200010 柚子',
];

let index = 0;
let isSuccess = true;
console.time('解析耗时');
for (let v of list) {
  index += 1;
  let address = Array.isArray(v) ? v[0] : v;
  let code = Array.isArray(v) ? v[1] : '';
  //let [result, ...results] = Parse.parse(address, true);
  let [result, ...results] = Parse.parse(address);

  let status = code ? result.code === code : !!result.area;
  if (!status) isSuccess = false;
  //console.log(index, code ? result.code === code : !!result.area, result, results);
  console.log(index, code ? result.code === code : !!result.area, result);
  //console.log(index, code ? result.code === code : !!result.area);
}

console.timeEnd('解析耗时');
console.log(`解析结果: ${isSuccess ? '通过' : '失败'}`);