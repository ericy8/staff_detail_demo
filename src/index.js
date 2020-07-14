import React from 'react';
import ReactDOM from 'react-dom';
import './index.less';
import Staff from './staff-detail/staff'

// 三个antd中文全局化的配置，第三个是有关日期控件的，在入口文件引用，默认英文
import { ConfigProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';

ReactDOM.render(
	<ConfigProvider locale={zh_CN}>
		<Staff />
	</ConfigProvider>,
	document.getElementById('root')
);


