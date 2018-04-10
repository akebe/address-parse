import areaList from 'area-list.js'
import addressParse,{parseArea} from 'address-parse.js'

parseArea(areaList);

let result = addressParse('福建省福州市福清市石竹街道义明综合楼3F，15000000000，akebe');
result = addressParse('福清市石竹街道义明综合楼3F15000000000akebe');
result = addressParse('福清市石竹街道义明综合楼3F150-0000-0000akebe');

//以上地址都能正确解析为{"name":"akebe","mobile":"15000000000","detail":"","zip_code":"","phone":"","province":"福建","city":"福州","area":"福清市","addr":"石竹街道义明综合楼3F"}
console.log(result);
