/** 
 * @param USER_TOKEN 登录后获取的token值,避免手动页面刷新后memoryUtils里数据消失
*/



const USER_TOKEN = 'user_token'
export default {
	// 保存数据
	saveUser(token) {
		sessionStorage.setItem(USER_TOKEN, JSON.stringify(token))
		//因为保存的必须是对象的json字符串 
	},

	// 读取数据
	getUser() {
		return JSON.parse(sessionStorage.getItem(USER_TOKEN))
	},

	// 删除数据
	removeUser() {
		sessionStorage.removeItem(USER_TOKEN)
	}
}