import Taro, { Component } from "@tarojs/taro";
import { AtIcon, AtToast } from "taro-ui"
import { View, Text, Image, ScrollView, Button } from "@tarojs/components";
import "./index.styl";
import request from '../../services/request'
import MobileImg from '../../assets/dianhua.png'
import AddressImg from '../../assets/address.png'
import "taro-ui/dist/style/components/toast.scss";
import { getLocation } from "@/utils/getInfo"
import { getBrowserType } from "@/utils/common";
import wx from 'weixin-js-sdk';


interface Props {
  store_id: any;
}
const share_url = process.env.BUSINESS_URL
export default class PaySuccess extends Component<Props> {
  config = {
    navigationBarTitleText: "商家详情",
    enablePullDownRefresh: false
  };


  state = {
    yPoint: '',
    xPoint: '',
    business_list: {//自家店铺
      id: "",
      name: '',
      address: '',
      preview: "",
      store_img_one: "",
      store_img_three: "",
      store_img_two: "",
      collect: "0",
      distance: "",
      tel: "",
      ypoint: '',
      xpoint: '',
    },
    recommend: [//本店其它的推荐
      {
        id: "",
        preview: '',
        name: '',
        address: '',
        label: [''],
        distance: ''
      }
    ],
    activity_group: [
      {
        //拼团活动
        name: '',
        activity_brief: '	',
        image_url: "",
        pay_money: '',
        return_money: '',
        participation_number: '',
        participation_money: '',
        market_price: '',
        gift_pic: "",
        activity_id: '',
        youhui_id: '',
        image_url_info: '',
        gift_id: ''
      }
    ],
    activity_appre: [
      {
        //增值活动
        name: "",
        activity_brief: '',
        image_url: "",
        pay_money: '',
        return_money: '',
        market_price: '',
        init_money: '',
        gift_pic: "",
        youhui_id: '',
        gift_desc: '',
        gift_id: '',
        activity_id: '',
        youhui_type: 0,
        expire_day: '',
        images: []
      }
    ],
    cashCouponList: [
      {//优惠券列表
        id: '',
        name: '',
        image: "",
        image_type: '',
        address: '',
        list_brief: '',
        brief: '',
        youhui_type: '1',
        begin_time: '',
        end_time: '',
        pay_money: "",
        expire_day: "",
        return_money: ''
      }
    ],
    exchangeCouponList: [
      {
        begin_time: "",
        brief: "",
        end_time: "",
        id: 0,
        image: "",
        list_brief: "",
        name: "",
        youhui_type: 0,
        pay_money: "",
        expire_day: ''
      }
    ]
    ,
    activity_group_bull: false,
    activity_appre_bull: false,
    couponList_bull: false,
    exchangeCouponList_bull: false,
    keepCollect_show: false,
    keepCollect_bull: false,
    keepCollect_data: "收藏成功",

    isFromShare: false
  };

  componentDidShow() {
    this.toShare();
  }

  componentWillMount() {
    let arrs = Taro.getCurrentPages()
    if (arrs.length <= 1) {
      this.setState({
        isFromShare: true
      })
    }
    Taro.showLoading({
      title: 'loading',
    })
    let that = this;
    getLocation().then((res: any) => {
      this.setState({
        yPoint: res.latitude || '',
        xPoint: res.longitude || ''
      }, () => {
        this.requestData();

      })
    }).catch(err => {
      this.setState({
        yPoint: '',
        xPoint: ''
      }, () => {
        this.requestData();
      })

    })
  }

  requestData = () => {
    request({ url: 'v3/stores/' + this.$router.params.id, method: "GET", data: { xpoint: this.state.xPoint, ypoint: this.state.yPoint } })
      .then((res: any) => {
        console.log('res', res)
        if (res.code == 200) {
          this.setState({
            business_list: res.data.store.Info,
            recommend: res.data.recommend,
            activity_group: res.data.store.activity_group,
            activity_appre: res.data.store.activity_appreciation,
            cashCouponList: res.data.store.cashCouponList,
            exchangeCouponList: res.data.store.exchangeCouponList,
            keepCollect_bull: res.data.store.Info.collect ? true : false
          }, () => {
            this.toShare();
          })
          Taro.hideLoading()
        } else {
          Taro.showToast({
            title: res.data,
            icon: 'none',
            duration: 2000
          })
          setTimeout(() => {
            Taro.navigateBack()
          }, 2000)
        }

      }).catch(err => {
        console.log(err);
      })
  }


  toShare = () => {
    let url = window.location.href;
    let titleMsg = '发现一家你喜欢的店铺' + this.state.business_list.name + '，速来围观！';
    let descMsg = '刚刚发现了这家店铺' + this.state.business_list.name + '，活动多多，优惠空前，你绝对喜欢，快点进来看看！';
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
          jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData']
        })
        wx.ready(() => {
          wx.updateAppMessageShareData({
            title: titleMsg,
            desc: descMsg,
            link: share_url + this.$router.params.id,
            imgUrl: 'http://wx.qlogo.cn/mmhead/Q3auHgzwzM6UL4r7LnqyAVDKia7l4GlOnibryHQUJXiakS1MhZLicicMWicg/0',
            success: function () {
              //成功后触发
              // console.log("分享成功")
            }
          })
        })
      })
  }


  //去拼团活动
  gotoGroup = (_id, gift_id, activity_id) => {
    Taro.navigateTo({
      url: '/pages/activity/group/index?id=' + _id + '&type=5&gift_id=' + gift_id + '&activity_id=' + activity_id
      // url: '/pages/activity/pages/detail/detail?id=' + _id + '&type=5&gift_id=' + gift_id + '&activity_id=' + activity_id
    })
  }
  // 去增值活动
  gotoAppreciation = (_id, gift_id, activity_id) => {
    Taro.navigateTo({
      url: '/pages/activity/appreciation/index?id=' + _id + '&type=1&gift_id=' + gift_id + '&activity_id=' + activity_id
    })
  }
  //现金券详情
  handleClick = (_id, e) => {
    Taro.navigateTo({
      url: '../../business-pages/ticket-buy/index?id=' + _id
    })
  }
  //去优惠信息
  handleClick2 = (_id, e) => {
    Taro.navigateTo({
      url: '../../business-pages/set-meal/index?id=' + _id
    })
  }
  //去附近店铺
  handleClick3 = (_id, e) => {
    Taro.navigateTo({
      url: './index?id=' + _id
    })
  }
  //去给钱
  handleClick4 = (id, e) => {
    Taro.navigateTo({
      url: '../../business-pages/confirm-order/index?id=' + id
    })
    e.stopPropagation();
  }

  //打电话
  makePhoneCall = () => {
    Taro.makePhoneCall({
      phoneNumber: this.state.business_list.tel
    })
      .then((res: any) => {
      })
  }
  //地图
  routePlanning = () => {
    let browserType = getBrowserType();
    if (browserType == 'wechat') {
      let longitude = parseFloat(this.state.business_list.xpoint);
      let latitude = parseFloat(this.state.business_list.ypoint);
      let url = window.location.href;
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
  //收藏
  keepCollect = (e) => {
    let _id = this.state.business_list.id;
    Taro.showLoading({
      title: 'loading',
    })
    request({
      url: "v3/stores/collection",
      method: 'PUT',
      data: {
        store_id: _id
      }
    })
      .then((res: any) => {
        Taro.hideLoading();
        if (res.code == 200) {
          this.setState({
            keepCollect_bull: !this.state.keepCollect_bull
          })
        }
        Taro.showToast({
          title: res.data,
          icon: "none"
        })
      })
  }

  /**
   * 回首页
   */
  handleGoHome = () => {
    Taro.navigateTo({
      url: '/'
    })
  }

  render() {
    return (
      <View className="merchant-details">
        {/* {
          !this.state.keepCollect_show ? "" : (
            this.state.keepCollect_bull ?
              <AtToast isOpened text={this.state.keepCollect_data} icon={"star-2"} duration={2000} ></AtToast> : <AtToast isOpened text={this.state.keepCollect_data} icon={"star"} duration={2000} ></AtToast>
          )
        } */}

        <View className="shop bcfff">
          <View className="flex center top-view">
            <View className="item">
              <View className="name">{this.state.business_list.name}</View>
              {/* <View className="money">人均：￥62</View> */}
            </View>
            {

              this.state.keepCollect_bull ?
                <AtIcon className="image" value="star-2" color="#FFBF00" size="24px" onClick={this.keepCollect.bind(this)} />
                :
                <AtIcon className="image" value="star" color="#999" size="24px" onClick={this.keepCollect.bind(this)} />

            }
          </View>
          <ScrollView scrollX className="scroll-view" >
            <View className="flex">
              <Image className="image" src={this.state.business_list.preview} />
              <Image className="image" src={this.state.business_list.store_img_one} />
              <Image className="image" src={this.state.business_list.store_img_two} />
            </View>
          </ScrollView>
          <View className="address flex center">
            <Image className="address-img" style={{ paddingLeft: "10px", paddingRight: "10px" }} src={AddressImg} onClick={this.routePlanning.bind(this)} />
            <View className="text item" onClick={this.routePlanning.bind(this)}>{this.state.business_list.address}</View>
            <Image className="mobile-img" style={{ paddingLeft: "30px", paddingTop: "2px", paddingBottom: "2px", borderLeft: "1px solid #f0eff0" }} src={MobileImg} onClick={this.makePhoneCall.bind(this)} />
          </View>
        </View>

        {/* 拼团活动 */}

        {
          this.state.activity_group.length == 0 ? <View></View> : <View>
            <View className="merchant-details__tit" style={{ paddingTop: "10px" }} >
              <Image className="iconImg" src="https://tmwl-supplier.oss-cn-shenzhen.aliyuncs.com/static/ping.png" />
              <Text className="fwb" >拼团送豪礼</Text>
            </View>
            <View className="hidden-box" id="hidden-box" style={{ background: "#fff", width: "100%", overflow: "hidden", height: this.state.activity_group_bull ? "auto" : "9rem" }}>
              {
                this.state.activity_group.map((item) => (
                  <View className="group-purchase _pintuan" key={item.name}>
                    <View style={{ height: "5px", background: "#fff" }}></View>
                    <View className="hd">
                      <View className="flex center tuan" style={{ paddingBottom: "10px" }}>
                        <View className="item desc">{item.name}</View>
                        <View className="count">{item.participation_number}人团</View>
                      </View>
                    </View>

                    {
                      item.gift_pic == "" || item.gift_pic == null ?
                        <View className="image-list" style={{ paddingTop: "10px", boxSizing: "border-box" }} onClick={this.gotoGroup.bind(this, item.youhui_id, item.gift_id, item.activity_id)} >
                          <View className="image" style={{ position: "relative", overflow: "hidden" }}>
                            <View style={{ position: "absolute", left: "0", bottom: "0", background: "rgba(0,0,0,.7)", zIndex: 3, padding: "5px 10px 5px 5px", borderTopRightRadius: "8px", textAlign: "center", display: "flex", justifyContent: "flex-end" }}>
                              <View style={{ fontSize: "20px", color: "#fff", lineHeight: 1 }}>￥{item.participation_money}</View>
                              <View style={{ textDecoration: "line-through", fontSize: "14px", color: "rgba(225,225,225,.5)", lineHeight: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "flex-end" }}>￥{item.pay_money}</View>
                            </View>
                            <Image src={item.image_url} style={{ width: "100%", height: "100%" }} />
                          </View>
                          <Image className="image" src={item.image_url_info} />
                        </View> :
                        <View className="image-list" style={{ paddingTop: "10px", boxSizing: "border-box" }} onClick={this.gotoGroup.bind(this, item.youhui_id, item.gift_id, item.activity_id)} >
                          <View className="image" style={{ position: "relative", overflow: "hidden" }}>
                            <View style={{ position: "absolute", left: "0", bottom: "0", background: "rgba(0,0,0,.7)", zIndex: 3, padding: "5px 10px 5px 5px", borderTopRightRadius: "8px", textAlign: "center", display: "flex", justifyContent: "flex-end" }}>
                              <View style={{ fontSize: "20px", color: "#fff", lineHeight: 1 }}>￥{item.participation_money}</View>
                              <View style={{ textDecoration: "line-through", fontSize: "14px", color: "rgba(225,225,225,.5)", lineHeight: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", alignItems: "flex-end" }}>￥{item.pay_money}</View>
                            </View>
                            <Image src={item.image_url} style={{ width: "100%", height: "100%" }} />
                          </View>                          <View className="image" style={{ position: "relative", display: "flex", background: "red" }}>
                            <Image src={require("./border.png")} style={{ width: "100%", height: "100%", position: 'absolute', top: '0px', left: '0px', zIndex: 2 }} />
                            <Image src={require("./qiu.png")} style={{ position: 'absolute', top: '-4px', left: '41%', width: '25px', height: '25px', zIndex: 3 }} />
                            <Image src={item.gift_pic} style={{ width: "100%", height: "100%" }} />
                          </View>
                        </View>
                    }
                    <View className="ft ">
                      <View className="flex center">
                        <View className="item">
                          <Text className="money">￥{item.participation_money}</Text>
                          {/* <Text className="count">已拼{item.participation_number}件</Text> */}
                        </View>
                        <Button className="btn-go" onClick={this.gotoGroup.bind(this, item.youhui_id, item.gift_id, item.activity_id)} >立刻拼团</Button>
                      </View>
                    </View>
                  </View>
                ))
              }
            </View>

            {
              this.state.activity_group.length != 1 ?
                <View className="ft-more flex center" style={{ textAlign: "center", width: "100%", background: "#fff" }}
                  onClick={() => { this.setState({ activity_group_bull: !this.state.activity_group_bull }); }}>
                  <View className="more-box" style={{ color: "#999", fontSize: "12px" }}>
                    {this.state.activity_group_bull ? "收回" : "查看更多"}
                    {
                      this.state.activity_group_bull ?
                        <AtIcon value="chevron-up" color="#999" size="16px" /> : <AtIcon value="chevron-down" color="#999" size="16px" />
                    }
                  </View>
                </View>
                : ""
            }
          </View>
        }
        {/* 增值活动 */}
        {
          this.state.activity_appre.length == 0 ? <View></View> : <View style={{ background: "#fff", marginTop: "12px" }}>
            <View className="merchant-details__tit">
              <Image className="iconImg" src="https://tmwl-supplier.oss-cn-shenzhen.aliyuncs.com/static/zeng.png" />
              <Text className="fwb hidden-box" >增值低价买</Text>
            </View>
            <View style={{ width: "100%", overflow: "hidden", height: this.state.activity_appre_bull ? "auto" : "9rem" }}>
              {
                this.state.activity_appre.map((item) => (
                  <View className="group-purchase bcfff" key={item.activity_brief} >
                    <View style={{ height: "5px" }}></View>
                    <View className="hd">
                      <View className="flex center">
                        <View className="item desc">{item.name}</View>
                      </View>
                    </View>
                    {/* <View className="image-list" style={{ position: "relative", marginBottom: "10px" }}>
                      {
                        item.gift_pic == "" ? <Image className="backg-image" src={"http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/bMGJKGX2JcKWbs8JEypeiB7CAbd4wAz4.png"} /> :
                          <Image className="backg-image" src={"http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/andhNY3XKEWrW8nYBK5pyAptaJWeJz68.png"} />
                      }
                      <View className="img" style={{ width: "100%" }}   >
                        <View className="box_left">
                        <View className="box_left_return">最高价值</View>
                          <View className="box_left_price">￥ <View className="_price">{item.return_money}</View></View>
                        </View>
                        <View className="box_center">
                          <View className="present">
                            <View className="present_text1">
                              <View className="present_text1_box">全场通用</View>
                            </View>
                            <View className="present_text2">{item.expire_day}天内有效</View>
                            <View className="present_text3">满{item.init_money}元可用</View>
                          </View>
                        </View>
                        <View className="box_right" style={{ overflow: "hidden" }}>
                          <Image className="image" src={item.gift_pic} style={{ width: "100%", height: "100%" }} />
                        </View>
                      </View>
                    </View> */}

                    {
                      item.youhui_type == 1 ? (
                        <View className="image-list" style={{ position: "relative", marginBottom: "5px" }} onClick={this.gotoAppreciation.bind(this, item.youhui_id, item.gift_id, item.activity_id)}>
                          {
                            item.gift_id && item.gift_pic != "" ? <Image className="backg-image" src={"http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/andhNY3XKEWrW8nYBK5pyAptaJWeJz68.png"} /> :
                              <Image className="backg-image" src={"http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/bMGJKGX2JcKWbs8JEypeiB7CAbd4wAz4.png"} />
                          }
                          <View className="img" style={{ width: "100%" }}   >
                            <View className="box_left">
                              <View className="box_left_return">最高价值</View>
                              <View className="box_left_price">￥ <View className="_price">{item.return_money}</View></View>
                            </View>
                            <View className="box_center">
                              <View className="present">
                                <View className="present_text1">
                                  <View className="present_text1_box">全场通用</View>
                                </View>
                                <View className="present_text2">{item.expire_day}天内有效</View>
                                <View className="present_text3">满{item.init_money}元可用</View>
                              </View>
                            </View>
                            <View className="box_right" style={{ overflow: "hidden" }}>
                              <Image className="image" src={item.gift_pic} style={{ width: "100%", height: "100%" }} />
                            </View>
                          </View>
                        </View>
                      ) : (
                          !item.gift_id ? <View className="image-list" style={{ paddingTop: "10px", boxSizing: "border-box" }} onClick={this.gotoAppreciation.bind(this, item.youhui_id, item.gift_id, item.activity_id)}>
                            <View className="image" style={{ position: "relative", overflow: "hidden" }}>
                              <Image src={item.image_url} style={{ width: "100%", height: "100%" }} />
                            </View>
                            <Image className="image" src={item.images[0]} style={{ marginLeft: "7px" }} />
                          </View> :
                            <View className="image-list" style={{ paddingTop: "10px", boxSizing: "border-box" }} onClick={this.gotoAppreciation.bind(this, item.youhui_id, item.gift_id, item.activity_id)}>
                              <View className="image" style={{ position: "relative", overflow: "hidden" }}>
                                <Image src={item.image_url} style={{ width: "100%", height: "100%" }} />
                              </View>
                              <View className="image" style={{ position: "relative", display: "flex", background: "red", marginLeft: "7px" }}>
                                <Image src={require("./border.png")} style={{ width: "100%", height: "100%", position: 'absolute', top: '0px', left: '0px', zIndex: 2 }} />
                                <Image src={require("./qiu.png")} style={{ position: 'absolute', top: '-4px', left: '41%', width: '25px', height: '25px', zIndex: 3 }} />
                                <Image src={item.gift_pic} style={{ width: "100%", height: "100%" }} />
                              </View>
                            </View>
                        )
                    }
                    <View className="ft ">
                      <View className="flex center">
                        <View className="item">
                          <Text className="money">￥{item.pay_money}</Text>
                          {/* <Text className="count">{item.activity_brief}</Text> */}
                        </View>
                        <Button className="btn-go" onClick={this.gotoAppreciation.bind(this, item.youhui_id, item.gift_id, item.activity_id)}>立刻增值</Button>
                      </View>
                    </View>
                  </View>
                ))
              }
            </View>
            {
              this.state.activity_appre.length != 1 ?
                <View className="ft-more flex center"
                  style={{ textAlign: "center", width: "100%", background: "#fff" }}
                  onClick={() => { this.setState({ activity_appre_bull: !this.state.activity_appre_bull }) }}
                >
                  <View className="more-box" style={{ color: "#999", fontSize: "12px" }}>
                    {this.state.activity_appre_bull ? "收回" : "查看更多"}
                    {
                      this.state.activity_appre_bull ? <AtIcon value="chevron-up" color="#999" size="16px" /> : <AtIcon value="chevron-down" color="#999" size="16px" />
                    }

                  </View>
                </View>
                : ""
            }
          </View>
        }
        {/* 优惠券 */}
        {
          this.state.cashCouponList.length == 0 ? <View></View> : <View>
            <View className="merchant-details__tit" >
              <Image className="iconImg" src="https://tmwl-supplier.oss-cn-shenzhen.aliyuncs.com/static/quan.png" />
              <Text className="fwb" >现金券</Text>
            </View>
            <View className="ticket hidden-box" style={{ boxSizing: "border-box", width: "100%", overflow: "hidden", paddingTop: "0", height: this.state.couponList_bull ? "auto" : "5.05rem" }}>
              {
                this.state.cashCouponList.map((item) => (
                  <View className="ticket-view flex center" key={item.id} style={{ position: 'relative' }} onClick={this.handleClick.bind(this, item.id)}>
                    <View className="left" style={{ position: 'absolute', left: '24px' }}>
                      <View className="money"><View style={{ fontWeight: 'bold', float: "left", marginRight: "10px" }}>￥{item.return_money}</View>{item.name}</View>
                      <View className="desc">购买后{item.expire_day}天有效</View>
                      <View className="sales">极速退/免预约/全部商品可用</View>
                    </View>
                    <View className="right" style={{ position: 'absolute', right: '20PX' }}>
                      <View className="money">￥<Text>{item.pay_money}</Text></View>
                      <Button className="btn-buy" >立即购买</Button>
                    </View>
                  </View>
                ))
              }
            </View>
            {
              this.state.cashCouponList.length != 1 ? <View className="ft-more flex center"
                style={{ textAlign: "center", width: "100%", background: "#fff" }}
                onClick={() => { this.setState({ couponList_bull: !this.state.couponList_bull }) }} >
                < View className="more-box" style={{ color: "#999", fontSize: "12px" }}>
                  {this.state.couponList_bull ? "收回" : "查看更多"}
                  {
                    this.state.couponList_bull ? <AtIcon value="chevron-up" color="#999" size="16px" /> : <AtIcon value="chevron-down" color="#999" size="16px" />
                  }
                </View>
              </View> : ""
            }
          </View>
        }

        {/* 优惠信息*/}
        {
          this.state.exchangeCouponList.length == 0 ? <View></View> : <View style={{ background: "#fff", marginTop: "12px" }}>
            <View className="merchant-details__tit" >
              <Image className="iconImg" src="https://tmwl-supplier.oss-cn-shenzhen.aliyuncs.com/static/hui.png" />
              <Text className="fwb">特惠商品</Text>
            </View>
            <View className="hidden-box" style={{ width: "100%", overflow: "hidden", height: this.state.exchangeCouponList_bull ? "auto" : "5.4rem" }}>
              {
                this.state.exchangeCouponList.map((item) => (
                  <View className="discounts-view" key={item.id} onClick={this.handleClick2.bind(this, item.id)}>
                    <View className="discounts-cell flex center"   >
                      <Image className="image" src={item.image} />
                      <View className="discounts-cell__bd item">
                        <View className="tit">{item.name}</View>
                        <View className="desc">购买后{item.expire_day}日内有效</View>
                        <View className="flex center" style={{ position: "relative" }}>
                          <View className="money" style={{ position: 'absolute', left: '0' }}>￥{item.pay_money}</View>
                        </View>
                      </View>
                      <Button className="btn-buy" >立即购买</Button>
                    </View>
                  </View>
                ))
              }
            </View>
            {
              this.state.exchangeCouponList.length != 1 ?
                <View className="ft-more flex center"
                  style={{ textAlign: "center", width: "100%", background: "#fff", paddingBottom: "0", marginTop: "0" }}
                  onClick={() => { this.setState({ exchangeCouponList_bull: !this.state.exchangeCouponList_bull }) }} >
                  < View className="more-box" style={{ color: "#999", fontSize: "12px" }}>

                    {this.state.exchangeCouponList_bull ? "收回" : "查看更多"}
                    {
                      this.state.exchangeCouponList_bull ? <AtIcon value="chevron-up" color="#999" size="16px" /> : <AtIcon value="chevron-down" color="#999" size="16px" />
                    }
                  </View>
                </View> : ""
            }
          </View>
        }


        {
          this.state.recommend.length == 0 ? "" :
            <View className="recommend-view bcfff">
              <View className="merchant-details__tit" style={{ paddingLeft: "0" }} >
                <Text className="fwb" >附近推荐</Text>
              </View>
              <View className="recommend-cells">
                {
                  this.state.recommend.map((item) => (
                    <View className="recommend-cell flex center" key={item.id} onClick={this.handleClick3.bind(this, item.id)}>
                      <Image className="image" src={item.preview} />
                      <View className="recommend-cell__bd item">
                        <View className="tit">{item.name}</View>
                        <View className="flex center mb33">
                          <Text className="ellipsis-one "></Text>
                          <Text>{item.distance}</Text>
                        </View>
                        <View className="flex center">
                          <View className="tags">
                            {/* <Text className="tag-text" style={{ backgroundColor: item.label.indexOf('免费礼品') !== -1 ? '#fde8e5' : '#fff' }}>免费礼品</Text>
                            <Text className="tag-text" style={{ backgroundColor: item.label.indexOf('优秀商家') !== -1 ? '#fde8e5' : '#fff' }}>优秀商家</Text>
                            <Text className="tag-text" style={{ backgroundColor: item.label.indexOf('现金券') !== -1 ? '#fde8e5' : '#fff' }}>现金券</Text> */}
                            {
                              item.label.indexOf('免费礼品') !== -1 ?
                                <View className="tag-text">
                                  <Image className="tag-textImg" src="http://oss.tdianyi.com/front/GcMRM4HjnkyGnkws5FAJT4hRwiMRFDRd.png" />
                                </View> : null
                            }
                            {
                              item.label.indexOf('优秀商家') !== -1 ?
                                <View className="tag-text">
                                  <Image className="tag-textImg" src="http://oss.tdianyi.com/front/pssNMjtQWPMsmdFj4JiX6MWYReFc4GGT.png" />
                                </View> : null
                            }
                            {
                              item.label.indexOf('现金券') !== -1 ?
                                <View className="tag-text">
                                  <Image className="tag-textImg" src="http://oss.tdianyi.com/front/Yi2sdtYnQ4axMaN6BMbbGCDW5iwK37wE.png" />
                                </View> : null
                            }
                          </View>
                        </View>
                      </View>
                    </View>
                  ))
                }
              </View>
            </View>
        }

        {/* 去首页 */}
        {
          this.state.isFromShare ? (
            <View style={{ position: 'fixed', bottom: '0px', right: '0px' }} onClick={this.handleGoHome.bind(this)}>
              <Image src={require('../../assets/go-home/go_home.png')} style={{ width: '80px', height: '80px' }} />
            </View>
          ) : ''
        }

      </View>
    );
  }
}
