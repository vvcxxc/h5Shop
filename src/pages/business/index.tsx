import Taro, { Component } from "@tarojs/taro";
import { AtIcon, AtToast } from "taro-ui"
import { View, Text, Image, ScrollView, Button } from "@tarojs/components";
import "./index.styl";
import request from '../../services/request'
import MobileImg from '../../assets/dianhua.png'
// import starImg from '../../assets/starcollect.png'
import AddressImg from '../../assets/address.png'
import "taro-ui/dist/style/components/toast.scss";
// import "taro-ui/dist/style/components/icon.scss";
// import 'taro-ui/dist/style/index.scss'

import ActivityGroupComponent from './ActivityGroup'
import ActivityAppreComponent from './ActivityAppre'
import CashCouponListComponent from './cashCouponList'
import ExchangeCouponComponent from './ExchangeCouponList'

interface Props {
  store_id: any;
}

export default class PaySuccess extends Component<Props> {
  config = {
    navigationBarTitleText: "商家详情"
  };


  state = {
    yPoint: 0,
    xPoint: 0,
    business_list: {//自家店铺
      id: "",
      name: '',
      address: '',
      store_img_one: "",
      store_img_three: "",
      store_img_two: "",
      collect: "0",
      distance: ""
    },
    recommend: [//本店其它的推荐
      {
        id: "",
        preview: '',
        name: '',
        address: '',
        label: ['免费礼品']
      }
    ],
    activity_group: [
      // {
      //   //拼团活动
      //   name: '',
      //   activity_brief: '	',
      //   image_url: "",
      //   pay_money: '',
      //   return_money: '',
      //   participation_number: '',
      //   participation_money: '',
      //   market_price: '',
      //   gift_pic: ""
      // }
    ],
    activity_appre: [
      // {
      //   //增值活动
      //   name: "",
      //   activity_brief: '',
      //   image_url: "",
      //   pay_money: '',
      //   return_money: '',
      //   market_price: '',
      //   init_money: '',
      //   gift_pic: ""
      // }
    ],
    cashCouponList: [
      //{//优惠券列表
      //   id: '',
      //   name: '',
      //   image: "",
      //   image_type: '',
      //   address: '',
      //   list_brief: '',
      //   brief: '',
      //   youhui_type: '1',
      //   begin_time: '',
      //   end_time: '',
      //   pay_money: "",
      //   expire_day: ""
      // }
    ],
    exchangeCouponList: [
      //   {
      //   begin_time: "",
      //   brief: "",
      //   end_time: "",
      //   id: 1590,
      //   image: "",
      //   list_brief: "",
      //   name: "",
      //   youhui_type: 0,
      //   pay_money: ""
      // }
    ]
    ,
    activity_group_bull: false,
    activity_appre_bull: false,

    keepCollect_show: false,
    keepCollect_bull: false,
    keepCollect_data: "收藏成功"
  };

  componentWillMount() {
    Taro.showLoading({
      title: 'loading',
    })
    let that = this;
    Taro.getLocation({ type: 'wgs84' }).then(res => {
      // let yPoint= res.latitude;
      // let xPoint=res.longitude;
      this.setState({
        yPoint: res.latitude,
        xPoint: res.longitude
      }, () => {
        request({ url: 'v3/stores/' + this.$router.params.id, method: "GET", data: { xPoint: this.state.xPoint, yPoint: this.state.yPoint } })
          .then((res: any) => {
            console.log(res);
            that.setState({
              business_list: res.store.Info,
              recommend: res.recommend,
              activity_group: res.store.activity_group,
              activity_appre: res.store.activity_appreciation,
              cashCouponList: res.store.cashCouponList,
              exchangeCouponList: res.store.exchangeCouponList,
              keepCollect_bull: res.store.Info.collect ? true : false
            })
            Taro.hideLoading()
          });
      })

    })
  }
  componentDidMount() {
  }

  handleClick = (_id, e) => {
    Taro.navigateTo({
      url: '../../business-pages/ticket-buy/index?id=' + _id
    })
  }
  handleClick2 = (_id, e) => {
    Taro.navigateTo({
      url: '../../business-pages/set-meal/index?id=' + _id
    })
  }
  handleClick3 = (_id, e) => {
    // console.log(_id);
    Taro.navigateTo({
      url: './index?id=' + _id
    })
  }
  keepCollect(e) {
    let _id = this.state.business_list.id;
    Taro.showLoading({
      title: 'loading',
    })
    request({ url: 'v3/stores/collection', method: "PUT", data: { store_id: _id } })
      .then((res: any) => {
        Taro.hideLoading();
        if (res) {
          // console.log(this.state.keepCollect_bull)
          this.setState({
            keepCollect_data: res,
            //控制AtToast显示，set为true就好了，每次set都会触发AtToast
            keepCollect_show: true,
            keepCollect_bull: !this.state.keepCollect_bull
          })
        }
      })
  }
  render() {
    // console.log(this.state.keepCollect_bull);
    return (
      <View className="merchant-details">
        {
          !this.state.keepCollect_show ? "" : (
            this.state.keepCollect_bull ?
              <AtToast isOpened text={this.state.keepCollect_data} icon={"star-2"} duration={2000} ></AtToast> : <AtToast isOpened text={this.state.keepCollect_data} icon={"star"} duration={2000} ></AtToast>
          )
        }

        <View className="shop bcfff">
          <View className="flex center top-view">
            <View className="item">
              <View className="name">{this.state.business_list.name}</View>
              {/* <View className="money">人均：￥62</View> */}
            </View>
            {
              this.state.business_list.collect.toString() == "1" ?
                <AtIcon className="image" value="star-2" color="#FFBF00" size="24px" onClick={this.keepCollect.bind(this)} />
                :
                (
                  this.state.keepCollect_bull ?
                    <AtIcon className="image" value="star-2" color="#FFBF00" size="24px" onClick={this.keepCollect.bind(this)} />
                    :
                    <AtIcon className="image" value="star" color="#999" size="24px" onClick={this.keepCollect.bind(this)} />
                )
            }
          </View>
          <ScrollView scrollX className="scroll-view">
            <View className="flex">
              <Image className="image" src={this.state.business_list.store_img_one} />
              <Image className="image" src={this.state.business_list.store_img_three} />
              <Image className="image" src={this.state.business_list.store_img_two} />
            </View>
          </ScrollView>
          <View className="address flex center">
            <Image className="address-img" src={AddressImg} />
            <View className="distance" >{this.state.business_list.distance}</View>
            <View className="text item" >{this.state.business_list.address}</View>
            <Image className="mobile-img" src={MobileImg} />
          </View>
        </View>


        {/* 拼团活动 */}

        {
          this.state.activity_group.length == 0 ? <View></View> : <View style={{ background: "#fff" }}>
            <ActivityGroupComponent activity_group={this.state.activity_group} />
          </View>
        }
        {/* 增值活动 */}
        {
          this.state.activity_appre.length == 0 ? <View></View> : <View style={{ background: "#fff" }}>
            <ActivityAppreComponent activity_appre={this.state.activity_appre} />
          </View>
        }
        {/* 优惠券 */}
        {
          this.state.cashCouponList.length == 0 ? <View></View> : <View style={{ background: "#fff" }}>
            <CashCouponListComponent cashCouponList={this.state.cashCouponList} />
          </View>
        }
        {/* 优惠信息*/}
        {
          this.state.exchangeCouponList.length == 0 ? <View></View> : <View style={{ background: "#fff" }}>
            <ExchangeCouponComponent exchangeCouponList={this.state.exchangeCouponList} />
          </View>
        }

        <View className="recommend-view bcfff">
          <View className="merchant-details__tit">
            <Text className="fwb">附近推荐</Text>
          </View>
          <View className="recommend-cells">
            {
              this.state.recommend.map((item) => (
                <View className="recommend-cell flex center" onClick={this.handleClick3.bind(this, item.id)}>
                  <Image className="image" src={item.preview} />
                  <View className="recommend-cell__bd item">
                    <View className="tit">{item.name}</View>
                    <View className="flex center mb33">
                      {/* <Text className="ellipsis-one ">{item.address}</Text> */}
                      {/* <Text>洛溪 923m</Text> */}
                    </View>
                    <View className="flex center">
                      <View className="tags">
                        <Text className="tag-text" style={{ backgroundColor: item.label.indexOf('免费礼品') !== -1 ? '#fde8e5' : '#fff' }}>免费礼品</Text>
                        <Text className="tag-text" style={{ backgroundColor: item.label.indexOf('优秀商家') !== -1 ? '#fde8e5' : '#fff' }}>优秀商家</Text>
                        <Text className="tag-text" style={{ backgroundColor: item.label.indexOf('现金券') !== -1 ? '#fde8e5' : '#fff' }}>现金券</Text>
                      </View>
                    </View>
                  </View>
                </View>
              ))
            }
          </View>
        </View>
      </View>
    );
  }
}
