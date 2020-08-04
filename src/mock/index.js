const Mock = require('mockjs')
// const url = require('url')

/* 定义数据模板可参考：
'https://github.com/nuysoft/Mock/wiki/Mock.mock()#mockmock-rurl-rtype-templatefunction-options--'
和Mock官网文档 */

const data = Mock.mock('/staff-detail', {
	"result|5": [ // 意思是data数组中有10条数据
		{
			"id|+1": 0,
			"name": "@cname()",
			"age|0-99": 100,
			"sex|1": ["男", "女"],
			"duty|1": ["前端开发", "软件测试", "后端开发", "产品运营", "售后服务",],
			"entry_time": '@date("yyyy-MM-dd")',
			"phone": /^1(3|5|7|8|9)\d{9}$/,
			// "address": "@county(true)",
			"address|1": [["江西", "南昌", "赣州"], ["广东", "东莞", "常平"]],
			"hobby": "@cword(2,3)"
		}
	]
})

export default data;

// console.log(data);
// 可以在下面的终端测试数据生成情况。node index指令,文件位置一定要在当前位置下

// Mock.mock(/\staff\/staffList/, "GET", (options) => { console.log(options) })