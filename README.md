# address-parse

### 项目介绍
收货地址智能解析

### Install
`npm install address-parse --save`

### Start
````
import AddressParse from 'address-parse';

const [result, ...results] = AddressParse.parse('福建省福州市福清市石竹街道义明综合楼3F，15000000000，asseek');
console.log(result, results);
/* 
{
  'province': '福建省',
  'city': '福州市',
  'area': '福清市',
  'details': '石竹街道义明综合楼3F',
  'name': 'asseek',
  'code': '350181',
  '__type': 'parseByProvince',     //结果解析使用函数 parseByProvince parseByCity parseByArea
  'mobile': '',
  'zip_code': '',
  'phone': '15000000000',
};
*/
````

parse默认识别到第一个可信结果就会返回内容，但这不一定准确，如果传入第二个参数会执行所有解析方法，并将所有解析内容返回


### LICENSE
MIT