import Taro, { Component } from "@tarojs/taro";
import { AtIcon, AtToast } from "taro-ui"
import { View, Text, Image, ScrollView, Button, Swiper, SwiperItem } from "@tarojs/components";
import "./index.styl";
import CashCoupon from './cash-coupon/index'
import request from '../../services/request'
import MobileImg from '../../assets/dianhua.png'
import AddressImg from '../../assets/address.png'
import starImg from '../../assets/starcollect.png'

export default class PaySuccess extends Component {
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
      description: "",
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
    },
    store: {
      brief: "",
      id: 717,
      open_time: "",
      route: "",
      saddress: "",
      sname: "",
      tel: "",
      distance: ""
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
      youhui_type: '0'
    }]
  };

  componentWillMount() {
    Taro.showLoading({
      title: 'loading',
    })
    Taro.getLocation({ type: 'wgs84' }).then(res => {
      this.setState({
        yPoint: res.latitude,
        xPoint: res.longitude
      }, () => {
        request({
          url: 'v3/discount_coupons/' + this.$router.params.id, method: "GET", data: { xpoint: this.state.xPoint, ypoint: this.state.yPoint }
        })
          .then((res: any) => {
            this.setState({
              coupon: res.info.coupon,
              store: res.info.store,
              goods_album: res.info.goods_album,
              recommend: res.recommend.data
            })
            Taro.hideLoading()
          }).catch(function (error) { console.log(error); });
      })
    })

  }
  componentDidMount() {

  }
  handleClick = (id, e) => {
    Taro.navigateTo({
      url: '../../business-pages/confirm-order/index?id=' + id
    })
  };
  handleClick2 = (_id, e) => {
    Taro.navigateTo({
      url: '/pages/business/index?id=' + _id
    })
  };
  keepCollect(e) {
    //假接口，还没好
    // let _id = this.state.coupon.id;
    // request({ url: 'v3/coupons/collection', method: "PUT", data: { coupon_id: _id } })
    //   .then((res: any) => {
    //     console.log(res)
    //     // if (res) {
    //     //   this.setState({
    //     //     keepCollect_data: res,
    //     //     keepCollect_bull: !this.state.keepCollect_bull
    //     //   })
    //     // }
    //   })
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

          <View className="desc">{this.state.coupon.list_brief}</View>

          <View className="tags">
            <Text className="tag-text" style={{ backgroundColor: this.state.coupon.label.indexOf('可叠加') !== -1 ? '#fde8e5' : '#fff' }}>可叠加</Text>
            <Text className="tag-text" style={{ backgroundColor: this.state.coupon.label.indexOf('随时退') !== -1 ? '#fde8e5' : '#fff' }}>随时退</Text>
            <Text className="tag-text" style={{ backgroundColor: this.state.coupon.label.indexOf('免预约') !== -1 ? '#fde8e5' : '#fff' }}>免预约</Text>
          </View>
        </View>
        <View className="shop mt20 pd30 bcff" onClick={this.handleClick2.bind(this, this.state.store.id)}>
          <View className="set-meal__tit">
            <Text className="fwb">适用店铺</Text>
          </View>
          <View className="flex center">
            <Image className="image" src={this.state.coupon.icon} />
            <View className="item">
              <View className="tit">{this.state.store.sname}</View>
              <View className="money">{this.state.store.tel}</View>
            </View>
            <AtIcon value="chevron-right" color="#999" size="24px" />
          </View>
          <View className="address-view flex center">
            <View style={{ width: "10%" }}>
              <Image className="address-image" src={AddressImg} />
            </View>
            <View className="distance">{this.state.store.distance}</View>
            <View className="text flex-item" style={{ width: "80%" }}>{this.state.store.saddress}</View>
            <View style={{ width: "10%" }}>
              <Image className="mobile-image" src={MobileImg} />
            </View>
          </View>
        </View>
        <View className="remark mt20 pd30 bcff">
          <View className="set-meal__tit">
            <Text className="fwb">购买须知</Text>
          </View>
          <View>
            <View className="label">有效期：</View>
            <View className="label-value">{this.state.coupon.begin_time + "   -   " + this.state.coupon.end_time}</View>
            <View className="label">使用规则：</View>

            {/* <View className="label-value">{this.state.store.brief}</View> */}
          </View>
          {/* <View className="ft-more flex center">查看更多<AtIcon value="chevron-right" color="#999" size="16px" /></View> */}
        </View>

        <View className="examine-more mt20 pd30 bcff">
          <View className="set-meal__tit">
            <Text className="fwb">图文详情</Text>

            {
              this.state.goods_album.map((item) => (
                <Image src={item.image_url} style={{ width: "100%" }} key={item.id} />
              ))
            }



          </View>
        </View>

        <View className="examine-more mt20 pd30 bcff">
          <View className="set-meal__tit">
            <Text className="fwb">更多本店宝贝</Text>
          </View>
          {
            this.state.recommend.map((item) => (
              <View key={item.id} >
                <CashCoupon _id={item.id} return_money={item.return_money} pay_money={item.pay_money} youhui_type={item.youhui_type} timer={item.begin_time + "-" + item.end_time} list_brief={item.list_brief} sname={item.sname} _image={item.image} />
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
