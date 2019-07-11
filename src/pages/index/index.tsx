import Taro, { Component, Config } from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import { AtIcon } from 'taro-ui';
import './index.styl';
import request from '../../services/request';
import questTwo from '../../services/requesTwo'
import { connect } from '@tarojs/redux'
import { getLocation } from '@/utils/getInfo';

@connect(
	state => ({
		serchName: state.search.get('serchName'),
	}),
	dispatch => ({
		getDataList(payload: any): void {
			dispatch({
				type: 'search/getDataList',
				payload,
			})
		},
		onIncrement(): void {
			dispatch({
				type: 'search/searchname',
				payload: {
					serchName: '444444'
				}
			})
		},
	})
)

export default class Index extends Component<any> {
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
		locations: { longitude: null, latitude: null },//存储地理位置
		routerId: '', //路由传递的id
		cityName: '',
		page: 1,
		meta: {},
		deal_cate_id: null,
		current: null,
		showLine: false,
	};

	constructor(props) {
		super(props);
	}

	componentWillMount() {
	}

	componentDidMount() {
		// this.showLoading();
		this.requestTab(); //经营列表
		this.localStorageData();
    // this.requestLocation();
    getLocation().then(res => {
      console.log(res)
    }).catch(err => {
      console.log(err);
    })
	}

	requestLocation = () => {
		Taro.getStorage({ key: 'allCity' })
			.then(res => {
				return
			})
		request({ url: 'v3/district', data: { model_type: '2' } })
			.then((res: any) => {
				Taro.setStorage({ key: 'allCity', data: res.city_list })

			})
	}


	localStorageData = () => {
		if (Object.keys(this.$router.params).length < 1) {
			// this.getLocation();
			return
		}
		Taro.getStorage({ key: 'router' }).then((res: any) => {
			if (res.data.city_name && res.data.city_id) {
				this.setState({ cityName: res.data.city_name })
				if (this.state.deal_cate_id) {
					this.setState({ meta: { city_id: res.data.city_id, deal_cate_id: this.state.deal_cate_id } }, () => {
						this.requestHomeList(this.state.meta)
					})
				} else {
					this.setState({ meta: { city_id: res.data.city_id } }, () => {
						this.requestHomeList(this.state.meta)
					})
				}
			}
			if (res.data.xpoint || res.data.ypoint) {
				if (this.state.deal_cate_id) {
					this.setState({
						meta: {
							xpoint: res.data.xpoint,
							ypoint: res.data.ypoint,
							deal_cate_id: this.state.deal_cate_id
						}
					}, () => {
						this.requestHomeList(this.state.meta)
					})
				} else {
					this.setState({ meta: { xpoint: res.data.xpoint, ypoint: res.data.ypoint } }, () => {
						request({
							url: 'v3/city_name',
							data: { xpoint: res.data.xpoint, ypoint: res.data.ypoint }
						})
							.then((res: any) => {
								this.setState({ cityName: res.city })
							})
						this.requestHomeList(this.state.meta)
					})
				}
			}
		})

	}
	// get location
	// getLocation = () => {
	// 	Taro.getLocation({ type: 'wgs84' }).then(res => {
	// 		this.setState({ meta: { xpoint: res.longitude, ypoint: res.latitude } })
	// 		this.setState({ locations: res }, () => {
	// 			this.getCity();
	// 			if (this.state.deal_cate_id == null) {
	// 				this.requestHomeList({ xpoint: res.longitude, ypoint: res.latitude })
	// 			} else {
	// 				this.setState({
	// 					meta: {
	// 						xpoint: this.state.locations.longitude,
	// 						ypoint: this.state.locations.latitude,
	// 						deal_cate_id: this.state.deal_cate_id
	// 					}
	// 				}, () => {
	// 					this.requestHomeList(this.state.meta)
	// 				})
	// 			}
	// 		})
	// 	})
	// }

	// 获取城市
	getCity = () => {
		request({
			url: 'v3/city_name',
			data: { xpoint: this.state.locations.longitude, ypoint: this.state.locations.latitude }
		})
			.then((res: any) => {
				this.setState({ cityName: res.city })
			})
	}

	// 首页数据 初始渲染
	requestHomeList = (meta) => {
		this.showLoading();
		Taro.stopPullDownRefresh()
		request({
			url: 'v3/stores',
			data: { ...meta }
		})
			.then((res: any) => {
				Taro.hideLoading()
				this.setState({ storeList: res.store_info.data, storeHeadImg: res.banner });
			})
			.catch(() => {
				this.showLoading()
			})
	}


	onPullDownRefresh = () => { // 自带 下拉事件
		this.localStorageData();
	}

	onReachBottom = () => { 	// 自带 触底事件
		this.showLoading()
		this.setState({ page: this.state.page + 1 })
		let miss = {
			...this.state.meta, page: this.state.page
		}
		if (this.state.deal_cate_id) {
			miss['deal_cate_id'] = this.state.deal_cate_id
		}
		request({
			url: 'v3/stores',
			data: {
				...miss
			}
		})
			.then((res: any) => {
				Taro.stopPullDownRefresh()
				Taro.hideLoading()
				this.setState({ storeList: [...this.state.storeList, ...res.store_info.data], storeHeadImg: res.banner });
			})
	}

	// show loading
	showLoading = () => {
		Taro.showLoading({
			title: 'loading',
			mask: true
		})
	}

	// 获取title数据
	requestTab = () => {
		questTwo({
			url: 'v3/manage_type'
		})
			.then((res: any) => {
				let mete = [{ name: '全部', id: 'all' }, ...res]
				this.setState({ titleList: mete })
			})
	}

	handleActivityClick = () => { };

	// 跳转 搜索商家列表页面
	handleSearch = () => Taro.navigateTo({ url: './search/index' });
	// 跳转 搜素城市页面
	showSelectCity = () => Taro.navigateTo({ url: '/business-pages/select-city/index' });

	handlerTablChange(current, id, _this) {
		this.setState({ current });
		if (id == 'all' || this.state.deal_cate_id == 'all') {
			this.setState({ deal_cate_id: null })
			this.requestHomeList({ ...this.state.meta })
			return
		}
		this.setState({ deal_cate_id: id })
		this.requestHomeList({ ...this.state.meta, deal_cate_id: id })
	}


	styleControl = (item) => {
		if (item.merchant) {
			if (
				item.exchange_coupon_name === null &&
				item.gift_coupon_name === null &&
				item.gift_name === null) {
				return false
			}
			return true
		}
	}


	handleClick = (_id, e) => {
		Taro.navigateTo({
			url: '/pages/business/index?id=' + _id
		})
	};

	judgeData = (value1) => {
		return typeof (value1) === 'string' ? (value1.length > 1 ? '' : 'none') : 'none'
	}

	controlPicture = (gift, coupon) => { // 控制图片显示
		if (!coupon && !gift) return false //两个图片都没有 显示门头照preview
		if (!gift) return 1 //礼品图不存在 只显示一张coupon
		return 2 //两张都显示
	}

	render() {
		return (
			<View className="index">
				{/* <View style="	display: flex; justify-content: center; height:48px; backgroundColor:rgba(255,242,230,1);
					align-items:center">
				你还有未领取的礼品 去“我的礼品”看看
			</View> */}
				<View className="head">
					<View className="search">
						<View className="flex center container">
							<View className="city" onClick={this.showSelectCity}>
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
					<View className="swiper">
						<Image src={"http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/dHBc2GQi27cjhNpsYpAnQYxybxPdADHG.png"} className="image" />
					</View>
				</View>
				<View className="advert">
					<Image src={"http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/MfwcW2Qn5hC8T4mfJT8t5NcAEh7pTQRb.png"}></Image>
					<Image src={"http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/wWmWHKBjWZbkxYNPGPRZAst8CKbfNsGk.png"}></Image>
				</View>
				<View className="tab flex" style="background-color:#fff ; overflow :hidden;">
					{this.state.titleList.map((item: any, index) => (
						<View
							key={" "}
							className={
								"item flex center " +
								(this.state.current === index ? "active" : "")
							}
							onClick={this.handlerTablChange.bind(this, index, item.id)}
						>
							<View className="label">{item.name}</View>
						</View>
					))}
				</View>
				{
					this.state.storeList.map((item: any, index: any) => {
						return <View className='merchant  activity inset '
							style={{
								paddingBottom: this.styleControl(item) ? '5px' : '0px',
								borderRadius: this.styleControl(item) ? '' : '20px'
							}}>
							<View className="content flex" onClick={this.handleClick.bind(this, item.id)}>
								<View className="item">
									<View className="flex">
										<View className="title item">{item.name}</View>
										<AtIcon value="chevron-right" color="#999" size="16px" />
									</View>
									<View className="flex " style="position:relative;">
										{
											item.label.map((item1: any, index1: any) => {
												return <View className="tag" style="background-color:#fff">{item1}</View>
											})
										}
										<View style="position:absolute; right:0px; line-height:1; bottom:2px;font-size:12px;" >{item.distance}
										</View>
									</View>
								</View>
							</View>
							{/* {</View>
							// 如果左边的图有  右边的没有  就显示左边的图百分百的比例
								 如果两张图都没有  就显示门头照
								 item.preview   coupon_image_url gift_pic
							 */}
							<View className="content_box" onClick={this.handleClick.bind(this, item.id)}>
								<View className='content_img'	>
									<Image src={this.controlPicture(item.gift_pic, item.coupon_image_url) === false ? item.preview : item.coupon_image_url} />
								</View>
								<View className={this.controlPicture(item.gift_pic, item.coupon_image_url) === 2 ?
									'content_img' : 'hidden_content_img'}>
									<Image src={item.gift_pic} />
								</View>
							</View>
							<View>
								<View className="give flex center" style={{ display: this.judgeData(item.gift_name) }}>
									<View className="icon">礼</View>
									<View className="title item ellipsis-one">
										<Text className="strong">{item.gift_name}</Text>
									</View>
								</View>
								<View className="give flex center"
									style={{ display: typeof (item.gift_coupon_name) === 'string' ? '' : 'none' }}>
									<View className="icon" style="background: #5d84e0">卷</View>
									<View className="title item">
										<Text className="strong">{item.gift_coupon_name}</Text>
									</View>
								</View>
								<View className="give flex center"
									style={{
										display: typeof (item.exchange_coupon_name) === 'string' ? '' : 'none'
									}}>
									<View className="icon" style="background: #5dd8a5">惠</View>
									<View className="title item ellipsis-one">
										{item.exchange_coupon_name}
									</View>
								</View>
							</View>
						</View>
					})
				}
			</View>
		);
	}
}
