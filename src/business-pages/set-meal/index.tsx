import Taro, { Component } from "@tarojs/taro";
import { AtIcon, AtToast } from "taro-ui"
import { View, Text, Image, Button } from "@tarojs/components";
import "./index.styl";
import CashCoupon1 from './cash-coupon/index'
import CashCoupon2 from '../ticket-buy/cash-coupon/index'
import request from '../../services/request'
import MobileImg from '../../assets/dianhua.png'
import AddressImg from '../../assets/address.png'
import { getLocation } from "@/utils/getInfo"
import { getBrowserType } from "@/utils/common";
import wx from 'weixin-js-sdk';
import isArray = require("lodash/isArray");

export default class SetMeal extends Component {
  config = {
    navigationBarTitleText: "优惠信息"
  };

  state = {
    yPoint: 0,
    xPoint: 0,
    keepCollect_data: "",
    //表面收藏
    keepCollect_bull: false,
    coupon: {
      begin_time: "",
      brief: "",
      //真正的收藏
      collect: "0",
      description: [],
      end_time: "",
      icon: "h",
      id: 1311,
      image: "",
      image_type: 1,
      list_brief: "",
      own: "",
      label: ['1'],
      pay_money: "",
      return_money: "",
      yname: "",
      youhui_type: 0,
      expire_day: ''
    },
    store: {
      brief: "",
      id: 717,
      open_time: "",
      route: "",
      saddress: "",
      sname: "",
      tel: "",
      distance: "",
      shop_door_header_img: '',
      xpoint: 0,
      ypoint: 0
    },
    goods_album: [
      {
        id: 700,
        image_url: ""
      }
    ],
    recommend: [{
      begin_time: "",
      brief: "",
      end_time: "",
      id: 1283,
      image: "",
      list_brief: "",
      open_time: "",
      pay_money: "",
      return_money: "",
      sname: "",
      yname: "",
      youhui_type: 0,
      expire_day: '',
      total_fee: ''
    }]
  };

  componentWillMount() {
    Taro.showLoading({
      title: 'loading',
    })
    // console.log(this.$router.params)
    getLocation().then((res: any) => {
      console.log(res)
      let xPoint = res.longitude;
      let yPoint = res.latitude;
      request({
        url: 'v3/discount_coupons/' + this.$router.params.id, method: "GET", data: { xpoint: xPoint, ypoint: yPoint }
      })
        .then((res: any) => {
          console.log(res);
          if (res.code != 200) {
            Taro.hideLoading()
            Taro.showToast({ title: '信息错误', icon: 'none' })
            setTimeout(() => {
              Taro.navigateBack({
              })
            }, 2000)
          }
          this.setState({
            coupon: res.data.info.coupon,
            store: res.data.info.store,
            goods_album: res.data.info.goods_album,
            recommend: res.data.recommend.data
          })
          Taro.hideLoading()
        }).catch(function (error) {
          Taro.hideLoading()
          Taro.showToast({ title: '数据请求失败', icon: 'none' })
          setTimeout(() => {
            Taro.navigateBack({
            })
          }, 2000)
        });

    }).catch(err => {

      setTimeout(() => {
        Taro.showToast({ title: '信息错误', icon: 'none' })
        Taro.navigateBack({
        })
      }, 2000)
    })


  }
  componentDidMount() {

  }
  handleClick = (id, e) => {
    console.log(id)
    Taro.navigateTo({
      url: '../../business-pages/confirm-order/index?id=' + id
    })
  };
  handleClick2 = (_id, e) => {
    Taro.navigateTo({
      // url: '/detail-pages/business/index?id=' + _id
      url: '/pages/business/index?id=' + _id
    })
  };
  //打电话
  makePhoneCall = (e) => {
    // console.log(this.state.store.tel)
    Taro.makePhoneCall({
      phoneNumber: this.state.store.tel
    })
      .then((res: any) => {
        console.log(res)
      });
    e.stopPropagation();
  }

  keepCollect(e) {
    //假接口，还没好
    // let _id = this.state.coupon.id;
    // request({ url: 'v3/coupons/collection', method: "PUT", data: { coupon_id: _id } })
    //   .then((res: any) => {
    //     console.log(res)
    //     // if (res) {
    //     //   this.setState({
    //     //     keepCollect_data: res.data,
    //     //     keepCollect_bull: !this.state.keepCollect_bull
    //     //   })
    //     // }
    //   })
  }
  //地图
  routePlanning = (e) => {
    let browserType = getBrowserType();
    if (browserType == 'wechat') {
      let longitude = parseFloat(this.state.store.xpoint);
      let latitude = parseFloat(this.state.store.ypoint);
      let url = window.location;
      Taro.request({
        url: 'http://api.supplier.tdianyi.com/wechat/getShareSign',
        method: 'GET',
        data: {
          url
        }
      })
        .then(res => {
          let {
            data
          } = res;
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
              name: this.state.store.sname,
              address: this.state.store.saddress,
            })

          })
        })

    } else if (browserType == 'alipay') {
      Taro.navigateTo({
        url: 'https://m.amap.com/navi/?start=' + this.state.xPoint + ',' + this.state.yPoint + '&dest=' + this.state.store.xpoint + ',' + this.state.store.ypoint + '&destName=' + this.state.store.sname + '&key=67ed2c4b91bf9720f108ae2cc686ec19'
      })
    } else {
      Taro.showToast({
        title: "参数错误",
        icon: "none"
      });
    }
    e.stopPropagation();
  }
  render() {
    return (
      <View className="set-meal">
        {
          this.state.keepCollect_bull ? <AtToast isOpened text={this.state.keepCollect_data} duration={2000} ></AtToast> : ""
        }
        {/* <Swiper
          className="swiper"
          indicatorColor="#999"
          indicatorActiveColor="#333"
          circular
          indicatorDots
          autoplay
        >
          <SwiperItem>
            <View className="demo-text-1"><Image className="image" src="http://www.w3school.com.cn/i/eg_tulip.jpg" /></View>
          </SwiperItem>
          <SwiperItem>
            <View className="demo-text-2"><Image className="image" src="http://www.w3school.com.cn/i/eg_tulip.jpg" /></View>
          </SwiperItem>
          <SwiperItem>
            <View className="demo-text-3"><Image className="image" src="http://www.w3school.com.cn/i/eg_tulip.jpg" /></View>
          </SwiperItem>
        </Swiper> */}
        <View className="demo-text-3"><Image style={{ width: "100%" }} src={this.state.coupon.image} /></View>

        <View className="info bcff">
          {/* <Image className="image" src={starImg} onClick={this.keepCollect.bind(this)} /> */}

          {/* {
            this.state.coupon.collect == "1" ? <AtIcon className="image" value="star-2" color="#FFBF00" size="24px" />
              :
              (
                this.state.keepCollect_bull ?
                  <AtIcon className="image" value="star-2" color="#FFBF00" size="24px" />
                  :
                  <AtIcon className="image" value="star" color="#999" size="24px" onClick={this.keepCollect.bind(this)} />
              )
          } */}
          <View className="tit">{this.state.coupon.yname} </View>

          {/* <View className="desc">{this.state.coupon.list_brief}</View> */}

          <View className="tags">
            <Text className="tag-text" style={{ backgroundColor: this.state.coupon.label.indexOf('可叠加') !== -1 ? '' : '#fff' }}>可叠加</Text>
            <Text className="tag-text" style={{ backgroundColor: this.state.coupon.label.indexOf('随时退') !== -1 ? '' : '#fff' }}>随时退</Text>
            <Text className="tag-text" style={{ backgroundColor: this.state.coupon.label.indexOf('免预约') !== -1 ? '' : '#fff' }}>免预约</Text>
          </View>
        </View>
        <View className="shop mt20 pd30 bcff" onClick={this.handleClick2.bind(this, this.state.store.id)}>
          <View className="set-meal__tit">
            <Text className="fwb">适用店铺</Text>
          </View>
          <View className="flex center">
            <Image className="image" src={this.state.store.shop_door_header_img} />
            <View className="item">
              <View className="tit">{this.state.store.sname}</View>
              {/* <View className="money">{this.state.store.tel}</View> */}
            </View>
            <AtIcon value="chevron-right" color="#999" size="24px" />
          </View>
          <View className="address-view flex center">
            <Image className="address-image" onClick={this.routePlanning.bind(this)} style={{ width: "15px", height: "15px" }} src={AddressImg} />
            <View className="distance" onClick={this.routePlanning.bind(this)} >{this.state.store.distance}</View>
            <View className="text flex-item" onClick={this.routePlanning.bind(this)} style={{ width: "80%" }}>{this.state.store.saddress}</View>
            <Image className="mobile-image" style={{ width: "15px", height: "15px" }} src={MobileImg} onClick={this.makePhoneCall.bind(this)} />

          </View>
        </View>
        <View className="remark mt20 pd30 bcff">
          <View className="set-meal__tit">
            <Text className="fwb">购买须知</Text>
          </View>
          <View>
            <View className="label">有效期：</View>
            <View className="label-value">购买后{this.state.coupon.expire_day}日内有效</View>
            {
              Array.isArray(this.state.coupon.description) ? (
                <View>
                  <View className="label">使用规则：</View>
                  <View className="label-value">
                    {

                      this.state.coupon.description.map((item) => (
                        <View className="label-value_info">.  {item}</View >
                      ))
                    }
                  </View>
                </View>

              ) : (
                  <View>
                    <View className="label">使用规则：</View>
                    <View className="label-value">
                      <View className="label-value_info">.  {this.state.coupon.description}</View >
                    </View>
                  </View>
                )
            }

          </View>
          {/* <View className="ft-more flex center">查看更多<AtIcon value="chevron-right" color="#999" size="16px" /></View> */}
        </View>

        {
          this.state.goods_album.length != 0 ?
            <View className="examine-more mt20 pd30 bcff">
              <View className="set-meal__tit">
                <Text className="fwb">图文详情</Text>
              </View>
              {
                this.state.goods_album.map((item) => (
                  <Image src={item.image_url} style={{ width: "100%",borderRadius: "8px"}} key={item.id} />
                ))
              }

            </View> : ""
        }
        <View className="examine-more mt20 pd30 bcff">
          <View className="set-meal__tit">
            <Text className="fwb">更多本店宝贝</Text>
          </View>
          {
            this.state.recommend.map((item) => (
              <View key={item.id} >
                {
                  item.youhui_type == 0 ? <CashCoupon1 _id={item.id} return_money={item.return_money} pay_money={item.pay_money} youhui_type={item.youhui_type} timer={item.begin_time + "-" + item.end_time} list_brief={item.list_brief} yname={item.yname} sname={item.sname} _image={item.image} expire_day={item.expire_day} />
                    : <CashCoupon2 _id={item.id} return_money={item.return_money} pay_money={item.pay_money} youhui_type={item.youhui_type} timer={item.begin_time + "-" + item.end_time} list_brief={item.list_brief} yname={item.yname} sname={item.sname} expire_day={item.expire_day} total_fee={item.total_fee} />
                }
              </View>
            ))
          }

          {/* <CashCoupon _id={"1"} return_money={"11"} pay_money={"22"} youhui_type={"1"} timer={"1111"} list_brief={"5555555"} sname={"222"} /> */}


        </View>
        <View className="occupied">
          <View className="layer-ft-buy flex">
            <View className="money">￥<Text className="count">{this.state.coupon.pay_money}</Text></View>
            <View><Button onClick={this.handleClick.bind(this, this.state.coupon.id)} className="btn-buy">立即抢购</Button></View>
          </View>
        </View>
      </View>
    );
  }
}
