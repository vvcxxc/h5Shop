import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import "./index.styl";
import { getBrowserType } from "@/utils/common";
import wx from 'weixin-js-sdk';
interface Location {
  xpoint: number;
  ypoint: number;
}

interface Props {
  isTitle?: boolean; // 是否展示店铺名
  img: string; // 店铺图片
  name: string; // 店铺名称
  phone: string; // 店铺电话
  address: string; // 店铺地址
  location: Location;
}
export default class ApplyToTheStore extends Component<Props> {
  ApplyToTheStore.defaultProps = {
    isTitle: false, // 是否展示店铺名
    img: '', // 店铺图片
    name: '', // 店铺名称
    phone: null, // 店铺电话
    address: '', // 店铺地址
    location: {
      xpoint: null,
      ypoint: null
    },
  }
  state = {
  }


  //打电话
  makePhoneCall = (e) => {
    Taro.makePhoneCall({
      phoneNumber: this.props.phone
    })
      .then((res: any) => {
        console.log(res)
      });
    e.stopPropagation();
  }

  //地图
  routePlanning = () => {
    let browserType = getBrowserType();
    if (browserType == 'wechat') {
      let longitude = parseFloat(this.props.location.xpoint);
      let latitude = parseFloat(this.props.location.ypoint);
      let userAgent = navigator.userAgent;
      let isIos = userAgent.indexOf('iPhone') > -1;
      let url: any;
      if (isIos) {
        url = sessionStorage.getItem('url');
      } else {
        url = location.href;
      }
      Taro.request({
        url: 'http://api.supplier.tdianyi.com/wechat/getShareSign',
        method: 'GET',
        data: {
          url
        }
      })
        .then(res => {
          let { data } = res;
          wx.config({
            debug: false,
            appId: data.appId,
            timestamp: data.timestamp,
            nonceStr: data.nonceStr,
            signature: data.signature,
            jsApiList: [
              "getLocation",
              "openLocation"
            ]
          })
          wx.ready(() => {
            wx.openLocation({
              latitude,
              longitude,
              scale: 18,
              name: this.state.business_list.name,
              address: this.state.business_list.address,
            })
          })
        })
    } else if (browserType == 'alipay') {
      Taro.navigateTo({
        url: 'https://m.amap.com/navi/?start=' + this.state.xPoint + ',' + this.state.yPoint + '&dest=' + this.state.business_list.xpoint + ',' + this.state.business_list.ypoint + '&destName=' + this.state.business_list.name + '&key=67ed2c4b91bf9720f108ae2cc686ec19'
      })
    } else {
      Taro.showToast({
        title: "信息出错",
        icon: "none"
      });
    }
  }

  render() {
    return (
      <View>
        {
          !this.props.isTitle ?
            (<View className='apply-page'>
              <View className='apply-title-box'>
                <View className='apply-title-left'></View>
                <View className='apply-title'>适用店铺</View>
              </View>
              <View className='apply-main'>
                <Image className='store-img' src={this.props.img} />
                <View className='store-detail'>
                  <View className='store-name-box'>
                    <View className='store-name'>{this.props.name}</View>
                    <View className='store-icon'>
                      <Image className='icon' src={require('@/assets/store/phone.png')} onClick={this.makePhoneCall} />
                    </View>
                  </View>
                  <View className='store-text' onClick={this.routePlanning}>
                    {this.props.address}
                  </View>
                </View>
              </View>
            </View>)
            : (
              <View className='apply-page'>
                <View className='apply-main'>
                  <Image className='store-img' src={this.props.img} />
                  <View className='store-detail'>
                    <View className='store-name-box'>
                      <View className='store-name'>{this.props.name}</View>
                      <View className='store-icon'>
                        <Image className='icon' src={require('@/assets/store/phone.png')} onClick={this.makePhoneCall} />
                      </View>
                    </View>
                    <View className='store-text' onClick={this.routePlanning}>
                      <View className='store-address'>{this.props.address}</View>
                      <View className='meter-box'>
                        <Image className='address-icon' src={require('@/assets/store/address.png')} />
                        300m
                        <Image className='right-arrow' src={require('@/assets/store/right-arrow.png')}/>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            )
        }
      </View>

    )
  }
}
