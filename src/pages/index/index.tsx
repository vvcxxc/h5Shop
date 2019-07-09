import Taro, { Component, Config } from '@tarojs/taro';
import { View, Swiper, SwiperItem, Input, Image } from '@tarojs/components';
import { AtIcon } from 'taro-ui';
import './index.styl';
import Tabs from '../../components/tabs';
import request from '../../services/request';
import questTwo from '../../services/requesTwo'
import ActivityList from './activity-list';

export default class Index extends Component {
	/**
	 * 指定config的类型声明为: Taro.Config
	 *
	 * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
	 * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
	 * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
	 */
	config: Config = {
		navigationBarTitleText: '团卖物联'
	};

	state = {
		storeList: [],
		storeHeadImg: '',
		titleList: [], // title列表
		locations: { longitude: 1, latitude: 1 },//存储地理位置
		routerId: '', //路由传递的id
		cityName: '',
		page: 1
	};

	constructor(props) {
		super(props);
	}

	componentWillMount() {
		// this.showLoading();
		this.requestTab(); //经营列表
		this.requestAllCity(); //获取全国各地列表
		// this.getLocation();//经纬度

	}

	componentDidMount() {
    // this.getToken();
	}
	// getToken() {
	// 	request({
	// 		url: 'api/wap/testLogin'
	// 	}).then((res: any) => Taro.setStorageSync('token', res.token));
	// }

	// show loading
	showLoading = () => {
		Taro.showLoading({
			title: 'loading',
			mask: true
		})
	}


	// get location
	// getLocation = () => {
	// 	Taro.getLocation({ type: 'wgs84' }).then(res => {
	// 		this.setState({ locations: res }, () => {
	// 			console.log(res)

	// 			this.getCity();
	// 			this.requestHomeList();
	// 			this.searChange();
	// 		})
	// 	})
	// }

	// 获取城市
	getCity = () => {
		let that = this.state.locations
		request({
			url: 'v3/city_name',
			data: { xpoint: that.longitude, ypoint: that.latitude }
		})
			.then((res: any) => {
				this.setState({ cityName: res.city })
			})
	}

	// get AllCity
	requestAllCity = () => {
		request({ url: 'v3/district', data: { model_type: '2' } })
			.then((res: any) => {
				Taro.setStorage({ key: 'city', data: res.city_list })
			})
	}


	// 微信自带监听 滑动事件
	onPullDownRefresh = () => {
		this.requestHomeList()
		// console.log('测试')

	}
	// 触底事件
	onReachBottom = () => {
		this.showLoading()
		this.setState({ page: this.state.page + 1 })
		request({
			url: 'v3/stores',
			data: { xpoint: this.state.locations.longitude, ypoint: this.state.locations.latitude, page: this.state.page }
		})
			.then((res: any) => {
				Taro.stopPullDownRefresh()
				Taro.hideLoading()
				this.setState({ storeList: [...this.state.storeList, ...res.store_info.data], storeHeadImg: res.banner });
			})
	}
	// 往下滚动触发
	onPageScroll = (e) => {
		// console.log(e, 'e')
	}

	// 获取title数据
	requestTab = () => {
		questTwo({
			url: 'v3/manage_type'
		})
			.then((res: any) => {
				let data = [{ name: '全部', id: 'all' }]
				let mete = [...data, ...res]
				this.setState({ titleList: mete })
			})
	}

	// router  搜索
	handleSearch = () => Taro.navigateTo({ url: './search/index' });
	// router city-search
	showSelectCity = () => Taro.navigateTo({ url: '/business-pages/select-city/index' });

	handleActivityClick = () => { };

	// 首页数据 初始渲染
	requestHomeList = () => {
		if (this.$router.params.id) {
			return
		}
		let that = this.state.locations
		request({
			url: 'v3/stores',
			data: { xpoint: that.longitude, ypoint: that.latitude }
		})
			.then((res: any) => {
				Taro.stopPullDownRefresh()
				Taro.hideLoading()
				this.setState({ storeList: res.store_info.data, storeHeadImg: res.banner });
			})
			.catch(() => {
				this.showLoading()
			})
	}

	// title 点击渲染
	tabChange = (id: string) => {
		this.showLoading()
		if (id === 'all') {
			this.requestHomeList()
			return
		}
		let that = this.state.locations
		request({
			url: 'v3/stores',
			data: { xpoint: that.longitude, ypoint: that.latitude, deal_cate_id: id }
		})
			.then((res: any) => {
				Taro.hideLoading()
				this.setState({ storeList: res.store_info.data, storeHeadImg: res.banner });
			})
	};

	// 搜索触发渲染
	searChange = () => {
		if (!this.$router.params.id) {
			return
		}
		let that = this.state.locations
		request({
			url: 'v3/stores',
			data: { xpoint: that.longitude, ypoint: that.latitude, city_id: this.$router.params.id }
		})
			.then((res: any) => {
				Taro.hideLoading()
				this.setState({ storeList: res.store_info.data, storeHeadImg: res.banner });
			})
	}


	render() {
		return (
			<View className="index">
				<View className="head">
					<View className="search">
						<View className="flex center container">
							<View className="city" onClick={this.showSelectCity}>
								{/* 广州 */}
								{this.state.cityName}
							</View>
							<AtIcon
								onClick={this.showSelectCity}
								className="chevron-down"
								value="chevron-down"
								color="#313131"
								size="12"
							/>
							<View className="long-string" />
							<AtIcon className="search-icon" value="search" color="#666666" size={14} />
							<View className="item search-input" onClick={this.handleSearch}>
								请输入商家名、品类
							</View>
						</View>
					</View>
					<Swiper
						className="swiper"
						indicatorColor="#999"
						indicatorActiveColor="#333"
						circular
						indicatorDots
						autoplay
					>
						<SwiperItem>
							<View className="swiper">
								<Image src={"http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/dHBc2GQi27cjhNpsYpAnQYxybxPdADHG.png"} className="image" />
							</View>
						</SwiperItem>
					</Swiper>
				</View>
				<View className="menus flex">
					<View className="item">
						<Image mode="widthFix" className="img" src={"http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/MfwcW2Qn5hC8T4mfJT8t5NcAEh7pTQRb.png"} />
					</View>
					<View className="item">
						<Image mode="widthFix" className="img" src={"http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/wWmWHKBjWZbkxYNPGPRZAst8CKbfNsGk.png"} />
					</View>
				</View>
				<Tabs list={this.state.titleList} onChange={this.tabChange} />
				<ActivityList list={this.state.storeList} onClick={this.handleActivityClick} />
			</View>
		);
	}
}
