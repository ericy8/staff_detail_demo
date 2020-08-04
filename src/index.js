import React from 'react';
import ReactDOM from 'react-dom';
import './index.less';
import App from './App';

// 三个antd中文全局化的配置，第三个是有关日期控件的，在入口文件引用，默认英文
import { ConfigProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';

import storageUtils from './utils/storageUtils';
import memoryUtils from './utils/memoryUtils';

const token = storageUtils.getUser()
memoryUtils.token = token

ReactDOM.render(
	<ConfigProvider locale={zh_CN}>
		<App />
	</ConfigProvider>,
	document.getElementById('root')
);


