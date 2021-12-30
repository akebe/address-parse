import area from './area.js';

/**
 * 民政部行政区划代码页面控制台执行
 * http://www.mca.gov.cn/article/sj/xzqh/2020/20201201.html
 * 先把 area.js 中的 area = {}  复制过去
 * 然后执行下面代码获得更新数据
 */
(() => {
  const list = Array.from(document.querySelectorAll('tr'))
    .map(el => [(el.children[1] ? el.children[1].innerText : '').trim(), (el.children[2] ? el.children[2].innerText : '').trim()])
    .filter(ary => ary[0] && ary[0] !== '行政区划代码');
  const updateList = [];
  const newList = [];
  /*const delList = [];
  for (const code in area.city_list) {
    if (!list.some(ary => ary[0] === code)) {
      delList.push([code, area.city_list[code]]);
      delete area.city_list[code];
    }
  }
  for (const code in area.area_list) {
    if (!list.some(ary => ary[0] === code)) {
      delList.push([code, area.area_list[code]]);
      delete area.area_list[code];
    }
  }*/
  for (const [code, name] of list) {
    const targetData = code.substr(2) === '0000' ? area.province_list : code.substr(4) === '00' ? area.city_list : area.area_list;
    if (!targetData[code]) {
      newList.push([code, name]);
      targetData[code] = name;
    } else if (targetData[code] !== name && !['北京市', '天津市', '上海市', '重庆市'].includes(name)) {
      updateList.push([code, name, targetData[code]]);
      targetData[code] = name;
    }
  }
  console.log(JSON.stringify(area));
  console.log(`更新${updateList.length}条`, updateList);
  console.log(`新增${newList.length}条`, newList);
  // console.log(`删除${delList.length}条`, delList);
})();
