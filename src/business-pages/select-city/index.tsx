import Taro, { Component, getApp } from "@tarojs/taro";
import { View, ScrollView } from "@tarojs/components";
import { AtSearchBar, AtIcon, AtIndexes } from "taro-ui";
import "./index.styl";
import request from '../../services/request'
export default class SelectCity extends Component {

  state = {
    value: '',
    locationList: []
  };
  globalData:{
    userInfo:{}
  }

  componentWillMount() {
    this.requestLocation()
    this.requestLoading()
  }
  handlerChange(value) {
    this.setState({ value });
  }

  requestLoading = () => {
    Taro.showLoading({
      title: 'loading',
      mask: true
    })
  }

  requestLocation = () => {
    request({ url: 'v3/district', data: { model_type: '2' } })
      .then((res: any) => {
        this.setState({ locationList: res.city_list }, () => {
          setTimeout(() => { Taro.hideLoading()}, 3000)
        })

      })
  }

  onClick(item, event) {
    Taro.reLaunch({ url: '../../pages/index/index?id=' + item.id + '&lng=' + item.lng + '&lat=' + item.lat})
  }

  render() {
    const city = ['上海市', '杭州市', '北京市', '广州市', '天津市', '南京市', '武汉市', '苏州市', '福州市']
    return (
      <View className="search-wrap" style="height:100vh;">
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
            <View className="item name">广州市</View>
            <View className="btn">重新定位</View>
          </View>
          <View className="bg" />
          <View className="current-tip">当前定位</View>
          <View className="big-item">
            {
              city.map((item, index) => {
                return <View className="item" key={index}>{item}</View>
              })
            }
          </View>
        </AtIndexes>
      </View>
    );
  }
}
