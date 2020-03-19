import Taro, { PureComponent } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtSearchBar, AtIcon } from 'taro-ui';
import './index.scss';

interface Props {
	history: {
		push: (number) => any;
	}
	onSearch: (number) => any;
}

class IndexSearchPage extends PureComponent<Props> {
	config = {
		navigationBarTitleText: '小熊敬礼'
	};

	state = {
		searchStr: '',
		locationList: [],
		list: [],
		searchData: [],
		showStorage:true
	};

	constructor(props) {
		super(props);//把this轉會
	}

	componentWillMount() {


	}

	componentDidMount() {
		if (Taro.getStorageSync("searchKey").length >= 1) {
			this.setState({ showStorage:true})
		} else {
			this.setState({ showStorage: false })
		}
	}

	// 往下滚动触发
	onPageScroll = (e) => {
	}

	requestLoading = () => {
		Taro.showLoading({
			title: 'loading',
			mask: true
		})
	}

	handleSearchBarChange = value => {
		this.setState({ searchStr: value });
	}

	onActionClick = () => {
		let meta = Taro.getStorageSync("searchKey") ? Taro.getStorageSync("searchKey") : []
		if (meta.length < 9 && this.state.searchStr) {
			meta.unshift(this.state.searchStr)
			Taro.setStorageSync("searchKey", meta)
		} else if (meta.length >= 9 && this.state.searchStr) {
			meta.splice(8, 1)
			meta.unshift(this.state.searchStr)
			Taro.setStorageSync("searchKey", meta)
		}
		if (meta.length>=1) this.setState({ showStorage:true})
		Taro.reLaunch(
			{ url: '../../merchant/index?value=' + this.state.searchStr  }
    )
	}

	lineOnclick = (item) => {
		Taro.reLaunch(
			{ url: '../../merchant/index?value=' + item }
		)
	}

	clearStorage = () => {
		this.setState({ showStorage: false })
		Taro.clearStorageSync()
	}

	handleSearch = () => { };

	render() {
		let saveSearch = Taro.getStorageSync("searchKey") ? Taro.getStorageSync("searchKey"):[]
		return (
			<View style='height:100vh; background-color:#fff;'>
				<View className="flex column page">
					<AtSearchBar
						placeholder="请输入商家名、品类"
						value={this.state.searchStr}
						onChange={this.handleSearchBarChange}
						onConfirm={this.handleSearch}
						onActionClick={this.onActionClick.bind(this)}
					/>
					<View className="item content"
						style={{ display: !this.state.showStorage ? 'none' : '' }}
					>
						<View className="head flex center">
							<View className="text item" style=" display:flex;  justify-content:space-between;">
								<View style="color:#999999;">历史搜索</View>
								<AtIcon value='trash' size='20' color='#999999' onClick={this.clearStorage.bind(this)}></AtIcon>
							</View>
						</View>
						<View className="history">
							{
								saveSearch.map((item, index) => {
									return <View className="item" onClick={this.lineOnclick.bind(this,item)} key={item}>{item}</View>
								})
							}
						</View>
					</View>
					<View >
						{/* <View style="color:#999999; padding-left:20px;margin-bottom:20px;">大家都在搜</View> */}
						{/* <View className="history" style="padding:0px 20px 0px 20px;">
							{
								this.state.list.map((item, index) => {
									return <View className="item" key={item}>{item}</View>
								})
							}
						</View> */}
					</View>
				</View>
				<View>
				</View>
			</View>
		);
	}
}
export default IndexSearchPage;
