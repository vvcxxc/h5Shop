import Taro, { Component, getApp } from "@tarojs/taro";
import { View, ScrollView } from "@tarojs/components";
import { AtSearchBar, AtIcon, AtIndexes, AtActivityIndicator, AtList, AtListItem } from "taro-ui";
import "./index.styl";
import request from '../../services/request'
export default class SelectCity extends Component {

  state = {
    searchStr: '',
    locationList: [],
    locations: { longitude: null, latitude: null },
    cityName: '',
    searchList: [],
    hot_city: [],
    showSearchList: false,
    searchValue:''
  };
  globalData: {
    userInfo: {}
  }

  componentWillMount() {
    Taro.showLoading({ title: 'loading', mask: true })
  }
  componentDidMount() {
    this.getLocation()
    this.requestLocation()
    this.getStorage()
  }

  getStorage = () => {
    Taro.getStorage({ key: 'allCity' })
      .then(res => {
        this.setState({ locationList: res.data })
    })
  }

  requestLocation = () => {
    request({ url: 'v3/district', data: { model_type: '2' } })
      .then((res: any) => {
        // this.setState({ locationList: res.city_list })
        this.setState({ hot_city: res.hot_city })
        setTimeout(() => {
          Taro.hideLoading()
        }, 2000);
      })
  }

  // get location
  getLocation = () => {
    Taro.getLocation({ type: 'wgs84' }).then(res => {
      this.setState({ locations: res }, () => {
        this.getCity();
      })
    })
  }

  // get City
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
  // agin location
  reLocation = (index?) => {
    this.getLocation();
    Taro.setStorage({
      key: 'router',
      data: { xpoint: this.state.locations.longitude, ypoint: this.state.locations.latitude }
    }) 
    if (index == 1) {
      Taro.reLaunch({ url: '../../pages/index/index?router' })
    }
   
  }

  handleSearchBarChange = value => {
    this.setState({ searchStr: value })
    this.setState({ searchValue: value })
    if (value.length < 1) {
      this.setState({ searchList: [] })
    }
  }

  // onclick 搜索按键
  onActionClick = () => {
    request({ url: 'v3/citys', data: { keyword: this.state.searchStr } })
      .then((res: any) => {
        this.setState({ searchList: res })
      })
  }

  // click 热门城市
  searchData = (name, id) => {
    Taro.setStorage({ key: 'router', data: { city_id: id, city_name: name } }) 
    Taro.reLaunch({ url: '../../pages/index/index?router' })
  }

  // 全国列表数据  点击
  onClick = (item, event) => {
    Taro.setStorage({ key: 'router', data: { city_id: item.id, city_name: item.name } })
    Taro.reLaunch({ url: '../../pages/index/index?router' })
  }

  // 搜索列表点击
  lineOnClick = (id, name) => {
    Taro.setStorage({ key: 'router', data: { city_id: id, city_name: name } })
    Taro.reLaunch({ url: '../../pages/index/index?router' })
  }
  // 回车键 模糊搜索
  handleSearch = () => {
    request({ url: 'v3/citys', data: { keyword: this.state.searchStr } })
      .then((res: any) => {
        this.setState({ searchList: res })
      })
  }

  onClear = () => {
    this.setState({ searchList: [] })
    this.setState({ searchStr: null })
  }

  onFocus = () => {//聚焦时 触发
    this.setState({ showSearchList:true})
  }
  onBlur = () => {//失去焦点 触发
    if (this.state.searchStr.length < 1) {
      this.setState({ showSearchList: false })
    }
  }
  render() {
    const city = ['上海市', '杭州市', '北京市', '广州市', '天津市', '南京市', '武汉市', '苏州市', '福州市']
    let hidenData = this.state.hot_city ? this.state.hot_city : city
    return (
      <View >
        <AtSearchBar
          placeholder="请输入城市名/拼音"
          value={this.state.searchValue}
          onChange={this.handleSearchBarChange}
          onConfirm={this.handleSearch}
          onClear={this.onClear}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onActionClick={this.onActionClick.bind(this)}
        />
        <View className={'search-wrap ' + 'search-result' + ' ' + (!this.state.showSearchList ? 'search-hidden' : 'search-show')}
          style="width:100vm; overflow-y:none; overflow-x:none;padding:0px 10px;"
        >
          {
            this.state.searchList.map((item: any, index: any) => {
              return <View className="line" key={index} onClick={this.lineOnClick.bind(this, item.id, item.name)}>{item.name}</View>
            })
          }
        </View>
        <View className={'search-wrap ' + ' ' + (this.state.showSearchList ? 'search-hidden' : 'search-show')} >
          <AtIndexes
            list={this.state.locationList}
            isVibrate={false}
            animation={true}
            onClick={this.onClick.bind(this)}
            topKey={'#'}
          >
            <View className="current-tip">当前定位</View>
            <View className="current-position flex center">
              <AtIcon value="map-pin" color="#FF6654" size={12} />
              <View className="item name" onClick={this.reLocation.bind(this, 1)} >
                {this.state.cityName ? this.state.cityName : '广州市'}
              </View>
              <View className="btn" onClick={this.reLocation.bind(this)}>重新定位</View>
            </View>
            <View className="bg" />
            <View className="current-tip">热门城市</View>
            <View className="big-item">
              {
                hidenData.map((item: any, index: any) => {
                  return <View className="item" key={index} onClick={this.searchData.bind(this, item.name, item.id)}>{item.name}</View>
                })
              }
            </View>
          </AtIndexes>
        </View>
      </View>
    );
  }
}
