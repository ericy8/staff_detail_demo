import axios from 'axios'
import { message } from 'antd'
import Qs from 'qs'
import memoryUtils from '../utils/memoryUtils'

/*
对比之前请求接口(两个不同):
1. 设置请求头里的'Content-Type'为'application/x-www-form-urlencoded'
2. 用Qs.stringify()将对象序列化成URL的形式(对request参数做处理),
	Qs是axios里面自带的,所以直接引入就可以了
*/

function ajax(url, data = {}, type = 'GET') {

	return new Promise((resolve, reject) => {
		let promise;
		if (type === 'GET') {
			promise = axios.get(url, { params: data })
		} else {
			promise = axios.post(url, Qs.stringify(data), { headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': memoryUtils.token } })
		}

		promise.then(res => {
			console.log('res.data', res.data);
			resolve(res.data)
		}).catch(err => {
			console.log('err', err);
			message.error('请求出错了：' + err.message)
		})
	})

}

const BASE = 'http://qddh.vip'

// 获取公司列表
export const reqCompanies = (deviceId, loginType) => ajax(BASE + '/companies', { deviceId, loginType }, 'POST')

// 登录
export const reqLogin = (user) => ajax(BASE + '/login', user, 'POST')

// 获取仓库列表
export const reqWareHouse = () => ajax(BASE + '/api/warehouse/list', {}, 'POST')

// 查询公司信息
export const reqCompany = () => ajax(BASE + '/api/company/info/1000', {}, 'POST')

// 查询店铺信息
export const reqStore = () => ajax(BASE + '/api/user/shops', {}, 'POST')