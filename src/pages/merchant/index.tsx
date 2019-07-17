import Taro, { Component, hideToast } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtSearchBar } from 'taro-ui';
import './index.styl';
import request from '../../services/request';
import List from './list';
import { getLocation } from '../../utils/getInfo'

import FilterTotal from "src/components/filter-total";
interface defineType {
	deal_cate_id?: number,
	distance_id?: number,
	sort_id?: number,
	page?: number,
	keyword?:number|string
}
export default class MerChantPage extends Component {
	config = {
		navigationBarTitleText: '商家'
	};

	state = {
		search: '',
		stores: [],
		filter: [],
		locationPosition: { longitude: '', latitude: '' },//存储获取到的地理位置
		select: [],
		selectData: { name: '', type: "" },
		page: 1,
		deal_cate_id: null,
		distance_id: null,
		sort_id:null
	};

	constructor(props) {
		super(props);
	}
	componentWillMount() {
		this.getPosition();// 经纬度
		Taro.showLoading({ title: 'loading', mask: true })//显示loading
	}

	componentDidMount() {
	}

	// 搜索赋值
	handlerSearch = (value) => {
		this.setState({ search: value });
	}

	// 获取经纬度
	getPosition() {
		getLocation().then((res: any) => {
			this.setState({ locationPosition: res }, () => {
				if (this.$router.params.value) {
					this.setState({ search: this.$router.params.value})
				}
				this.requestSearch(this.$router.params.value)//路由渲染
				let that = this.state.locationPosition
				this.requestData(that.longitude, that.latitude, this.$router.params.value) //渲染页面
			})
		})
	}

	//处理 路由跳转 和 搜索
	requestSearch = (search) => {
		if (!search) return
		Taro.showLoading({ title: 'loading', mask: true })
		request({
			url: 'v3/stores',
			data: {
				xpoint: this.state.locationPosition.longitude,
				ypoint: this.state.locationPosition.latitude,
				keyword: search
			},
		})
			.then((res: any) => {
				this.setState({ stores: res.data.store_info.data })
				Taro.hideLoading()
			});
	}

	// 首页页面渲染
	requestData = (xpoint, ypoint, search?) => {
		if (search) return
		request({
			url: 'v3/stores',
			data: {
				xpoint: xpoint,
				ypoint: ypoint
			}
		})
			.then((res: any) => {
				Taro.stopPullDownRefresh()
				this.setState({ stores: res.data.store_info.data })
				Taro.hideLoading()
			})
	}


	filterClick(index, id1?, id2?, id3?) {
		let define: defineType = {}
		if (id1) {
			define.deal_cate_id = id1
			this.setState({ deal_cate_id:id1})
		} else {
			this.setState({ deal_cate_id: null })
		}
		if (id2) {
			define.distance_id = id2
			this.setState({ distance_id: id2 })
		} else {
			this.setState({ distance_id: null })
		}
		if (id3) {
			define.sort_id = id3
			this.setState({ sort_id: id3 })
		} else {
			this.setState({ sort_id: null })
		}
		if (this.$router.params.value) {
			define.keyword = this.$router.params.value
			this.setState({ search: this.$router.params.value})
		}
		if (this.state.search) {
			define.keyword=this.state.search
		}
		request({
			url: 'v3/stores',
			data: {
				xpoint: this.state.locationPosition.longitude,
				ypoint: this.state.locationPosition.latitude,
				pages: this.state.page,
				...define
			}
		})
			.then((res: any) => {
				if (index === 1) {
					this.setState({ stores: [...this.state.stores, ...res.data.store_info.data], storeHeadImg: res.data.banner });
				} else {
					this.setState({ page: 1 })
					this.setState({ stores: res.data.store_info.data })
				}
				Taro.hideLoading()
			})
	}

	// 微信自带监听 滑动事件
	onPullDownRefresh  () {
		this.requestData(this.state.locationPosition.longitude, this.state.locationPosition.latitude) //渲染页面
	}

	// 触底事件
	onReachBottom () {
		Taro.showLoading({ title: 'loading', mask: true })//显示loading
		this.setState({ page: this.state.page + 1 }, ()=> {
			this.filterClick(1, this.state.deal_cate_id, this.state.distance_id, this.state.sort_id)
		})
	}

	// 标题点击
	titleOnClick = (index,deal_cate_id, distance_id, sort_id) => { // 点击事件
		this.setState({ page: 1 }, () => {
			this.filterClick(0, deal_cate_id, distance_id, sort_id)
		})
	}

	// 点击搜索触发
	onActionClick = () => {
		this.$router.params.value = null
		this.setState({ page: 1 }, () => {
			this.filterClick(0, this.state.deal_cate_id, this.state.distance_id, this.state.sort_id)
		})
	}
	onClearSearch = () => {
		this.setState({ search: '' });
		console.log('888')
	}
	// onActionClick
	// 跳转详情
	handleClick = id => {
		Taro.navigateTo({
			url: '/detail-pages/business/index?id=' + id
		})
	};

	render() {
		return (
			<View>
				<AtSearchBar
					value={this.state.search}
					onActionClick={this.onActionClick.bind(this)}
					onClear={this.onClearSearch.bind(this)}
					onChange={this.handlerSearch.bind(this)}
				/>
				<FilterTotal onClick={this.titleOnClick.bind(this,0)} />
				<View className="merchant-list" style="background-color:#fff;">
					<List onClick={this.handleClick} list={
						this.state.stores
					} />
				</View>
			</View>
		);
	}
}
