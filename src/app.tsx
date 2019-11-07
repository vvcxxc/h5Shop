import Taro, { Component, Config } from '@tarojs/taro';
import '@tarojs/async-await';
import { Provider } from '@tarojs/redux';
import { createLogger } from 'redux-logger';

import models from './models';
import dvaCore from './dvaCore';

import Index from './pages/index';
import "../src/styles/weui.scss"
import './app.styl';
import 'taro-ui/dist/style/index.scss';
import request from './services/request';



// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

// Set Dva
const dva = dvaCore.createApp({
	defienSear: {},
	initialState: {},
	models: models,
	onAction: createLogger(),
	onError(e, dispatch) {
		console.log('发生错误 ===> ', e, dispatch);
	}
});
const store = dva.getStore();
class App extends Component {
	/**
	 * 指定config的类型声明为: Taro.Config
	 *
	 * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
	 * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
	 * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
	 */
	config: Config = {
		pages: [
			'pages/index/index',
			'pages/index/search/index',
			'pages/my/index',
      'pages/order/index',
      'pages/mycardticket/index',
			'pages/merchant/index',
			'pages/activity/index',
			'pages/mycardticket/index',
			'pages/business/index',
			"pages/activity/pages/detail/detail",
			"pages/activity/pages/group/group",
			"pages/activity/pages/appreciation/appreciation",
			"pages/activity/pages/list/list",
			"pages/activity/appreciation/index",
			"pages/activity/group/index",
		],
		subPackages: [
			{
				/**各种详情页面 比如商家详情页 */
				root: "detail-pages",
				pages: [
					'gift/gift',
					'orderdetail/index',
					'orderdetail/refundProgress'
				]
			},
			{
				/**其他业务页面 比如订单流程，礼物，物流 */
				root: 'business-pages',

				pages: [
					'confirm-order/index',
					'stars/index',
					'gift/index',
					'select-city/index',
					'pay-success/index',
					'merchant/index',
					'set-meal/index',
					'ticket-buy/index',
					'daily-recommend/index',
					'search/index'
				]
			},
			{
				/**活动页面 比如地址选择，确认订单 */
				root: 'activity-pages',

				pages: [
					'my-activity/my.activity',
					"my-welfare/pages/gift/welfare.gift",
					'offline/order',
					'Shipping-address/index',
					'Shipping-address/editor',
					'confirm-address/index',
					'confirm-address/chooseAddress'

				]
			}
		],
		window: {
			backgroundTextStyle: 'dark',
			navigationBarBackgroundColor: '#fff',
			navigationBarTitleText: '小熊敬礼',
			navigationBarTextStyle: 'black',
			enablePullDownRefresh: false, //启用下拉刷新
			onReachBottomDistance: 50 //距离底部多少px时触发上拉加载事件
		},
		permission: {
			// 需要配置这里才能使用位置定位
			"scope.userLocation": {
				"desc": "小熊敬礼"
			}
		},
		tabBar: {
			color: '#313131',
			selectedColor: '#FF6654',
			backgroundColor: '#FBFBFB',
			borderStyle: 'white',
			list: [
				{
					pagePath: 'pages/index/index',
					text: '首页',
					iconPath: './assets/tabbar/1.png',
					selectedIconPath: './assets/tabbar/6.png'
				},
				{
					pagePath: 'pages/merchant/index',
					text: '商家',
					iconPath: './assets/tabbar/2.png',
					selectedIconPath: './assets/tabbar/7.png'
				},
				{
					pagePath: 'pages/activity/index',
					text: '活动',
					iconPath: './assets/tabbar/3.png',
					selectedIconPath: './assets/tabbar/8.png'
				},
				{
					pagePath: 'pages/order/index',
					text: '订单',
					iconPath: './assets/tabbar/4.png',
					selectedIconPath: './assets/tabbar/9.png'
				},
				{
					pagePath: 'pages/my/index',
					text: '我的',
					iconPath: './assets/tabbar/5.png',
					selectedIconPath: './assets/tabbar/10.png'
				}
			]
		}
	};

	defineApp: {
		define: '22'
	}
	componentDidShow() {
	}
	componentDidHide() { }
	componentDidCatchError() { }
	// 在 App 类中的 render() 函数没有实际作用
	// 请勿修改此函数
	render() {
		return (
			<Provider store={store}>
				<Index />
			</Provider>
		);
	}
}

Taro.render(<App />, document.getElementById('app'));
