import Taro, { Component, hideToast } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtSearchBar } from 'taro-ui';
import './index.styl';
import request from '../../services/request';
import List from './list';
import FilterTab from 'src/components/filter-tab';
import LiftList from 'src/components/lift-list';

import FilterTotal from "src/components/filter-total";
interface defineType {
	deal_cate_id?: number,
	distance_id?: number,
	sort_id?: number
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
		page:1
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

	// 点击搜索触发
	onActionClick = () => {
		this.requestSearch(this.state.search)// 搜索渲染
	}


	// 获取经纬度
	getPosition() {
		Taro.getLocation({ type: 'wgs84' }).then(res => {
			this.setState({ locationPosition: res }, () => {
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
				this.setState({ stores: res.store_info.data })
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
				this.setState({ stores: res.store_info.data })
				Taro.hideLoading()
			})
	}


	filterClick(id1, id2, id3) {
		let define: defineType = {}
		if (id1) {
			define.deal_cate_id = id1
		}
		if (id2) {
			define.distance_id = id2
		}
		if (id3) {
			define.sort_id = id3
		}
		else {

		}
		request({
			url: 'v3/stores',
			data: {
				xpoint: this.state.locationPosition.longitude,
				ypoint: this.state.locationPosition.latitude,
				...define
			}
		})
			.then((res: any) => {
				this.setState({ stores: res.store_info.data })
				Taro.hideLoading()
			})
	}

	// 微信自带监听 滑动事件
	onPullDownRefresh = () => {
		this.requestData(this.state.locationPosition.longitude, this.state.locationPosition.latitude) //渲染页面
	}

	// 触底事件
	onReachBottom = () => {
		Taro.showLoading({ title: 'loading', mask: true })//显示loading
		this.setState({ page: this.state.page + 1 })
		request({
			url: 'v3/stores',
			data: { xpoint: this.state.locationPosition.longitude, ypoint: this.state.locationPosition.latitude, page: this.state.page }
		})
			.then((res: any) => {
				Taro.stopPullDownRefresh()
				Taro.hideLoading()
				this.setState({ stores: [...this.state.stores, ...res.store_info.data], storeHeadImg: res.banner });
			})
	}

	// 跳转详情
	handleClick = id => {
		Taro.navigateTo({
			url: '/detail-pages/business/index?id=' + id
		})
	};

	render() {
		return (
			<View>
				<AtSearchBar value={this.state.search}
					onActionClick={this.onActionClick.bind(this)}
					onChange={this.handlerSearch.bind(this)}
				/>
				<FilterTotal onClick={this.filterClick.bind(this)} />
				<View className="merchant-list" style="height:100vh; background-color:#fff;">
					<List onClick={this.handleClick} list={
						this.state.stores
					} />
				</View>
			</View>
		);
	}
}
