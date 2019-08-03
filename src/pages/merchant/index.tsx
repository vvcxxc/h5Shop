import Taro, { Component, hideToast } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtSearchBar } from 'taro-ui';
import './index.styl';
import request from '../../services/request';
import List from './list';
import { getLocation } from '../../utils/getInfo'

import FilterTotal from "@/components/filter-total";
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
		locationPosition: { xpoint: '', ypoint: '' },//存储获取到的地理位置
		select: [],
		selectData: { name: '', type: "" },
		page: 1,
		deal_cate_id: null,
		distance_id: null,
    sort_id:null,
    show_bottom:false
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

	// // 获取经纬度
	// getPosition() {
	// 	getLocation().then((res: any) => {
	// 		this.setState({ locationPosition: res }, () => {
	// 			if (this.$router.params.value) {
	// 				this.setState({ search: this.$router.params.value})
	// 			}
	// 			this.requestSearch(this.$router.params.value)//路由渲染
	// 			let that = this.state.locationPosition
	// 			this.requestData(that.longitude, that.latitude, this.$router.params.value) //渲染页面
	// 		})
	// 	})
  // }
    getPosition() {
        Taro.getStorage({ key: 'router' }).then((res: any) => {
          let data: any = this.state.locationPosition
          data.xpoint = res.data.xpoint
          data.ypoint = res.data.ypoint
          data.city_id = res.data.city_id
          data.page = 1
          this.setState({ locationPosition: data }, () => {
            if (this.$router.params.value) {
              this.setState({ search: this.$router.params.value })
            }
            this.requestSearch(this.$router.params.value)//路由渲染
            this.requestData(this.state.locationPosition)
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
				xpoint: this.state.locationPosition.xpoint,
				ypoint: this.state.locationPosition.ypoint,
				keyword: search
			},
		})
			.then((res: any) => {
				this.setState({ stores: res.data.store_info.data })
				Taro.hideLoading()
			});
	}

	// 首页页面渲染
	requestData = (data, search?) => {
		if (search) return
		request({
			url: 'v3/stores',
			data
		})
			.then((res: any) => {
				Taro.stopPullDownRefresh()
				this.setState({ stores: res.data.store_info.data })
				Taro.hideLoading()
			})
	}


	filterClick(index, id1?, id2?, id3?) {
    // let define: defineType = {}
     let define: any = this.state.locationPosition
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
    define.page = this.state.page
    this.setState({
      locationPosition:define
    })
		request({
			url: 'v3/stores',
			data: define
		})
			.then((res: any) => {
        if(res.data.store_info.data.length<1){
          this.setState({show_bottom:true})
        }else {
          this.setState({show_bottom:false})
        }
				if (index === 1) {
					this.setState({ stores: [...this.state.stores, ...res.data.store_info.data], storeHeadImg: res.data.banner });
				} else {
					this.setState({ page: 1 })
					this.setState({ stores: res.data.store_info.data })
				}
				Taro.hideLoading()
			})
	}

	// // 微信自带监听 滑动事件
	// onPullDownRefresh  () {
  //   this.requestData(this.state.locationPosition.longitude, this.state.locationPosition.latitude) //渲染页面
  //   this.setState({show_bottom:false})
	// }

	// // 触底事件
	// onReachBottom () {
  //   if(this.state.show_bottom) return
  //   Taro.showLoading({ title: 'loading', mask: true })//显示loading
	// 	this.setState({ page: this.state.page + 1 }, ()=> {
	// 		this.filterClick(1, this.state.deal_cate_id, this.state.distance_id, this.state.sort_id)
	// 	})
  // }


    // 微信自带监听 滑动事件
  onPullDownRefresh() {
    this.setState({ show_bottom: false })
    this.setState({ page: 1 }, () => {
      let data: any = this.state.locationPosition
      data.page = 1
      this.setState({ locationPosition: data }, () => {
        this.requestData(this.state.locationPosition)
      })
    }
    )
  }

  // 触底事件
  onReachBottom () {
if(this.state.show_bottom) return
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
