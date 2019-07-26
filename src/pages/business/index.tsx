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
      preview: "",
      store_img_one: "",
      store_img_three: "",
      store_img_two: "",
      collect: "0",
      distance: "",
      tel: "",
      ypoint: 0,
      xpoint: 0,
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
        image_url_info: ''
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
        gift_desc: ''
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
        id: 1590,
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
    keepCollect_data: "收藏成功"
  };

  componentWillMount() {
    Taro.showLoading({
      title: 'loading',
    })
    let that = this;
    getLocation().then((res: any) => {
      // console.log(res);
      this.setState({
        yPoint: res.latitude,
        xPoint: res.longitude
      }, () => {
        request({ url: 'v3/stores/' + this.$router.params.id, method: "GET", data: { xpoint: this.state.xPoint, ypoint: this.state.yPoint } })
          .then((res: any) => {
            if (res.code == 200) {
              that.setState({
                business_list: res.data.store.Info,
                recommend: res.data.recommend,
                activity_group: res.data.store.activity_group,
                activity_appre: res.data.store.activity_appreciation,
                cashCouponList: res.data.store.cashCouponList,
                exchangeCouponList: res.data.store.exchangeCouponList,
                keepCollect_bull: res.data.store.Info.collect ? true : false
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
      })
    })
  }

  componentDidMount() {
  }
  onPullDownRefresh() {
    console.log('下拉事件')
  }

  onReachBottom() {
    console.log('触底事件')
  }
  //去拼团活动
  gotoGroup(_id) {
    Taro.navigateTo({
      url: '/pages/activity/pages/detail/detail?id=' + _id + '&type=5'
    })
  }
  // 去增值活动
  gotoAppreciation(_id) {
    Taro.navigateTo({
      url: '/pages/activity/pages/detail/detail?id=' + _id + '&type=1'
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
    // console.log(_id);
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
    console.log(this.state.business_list.tel)
    Taro.makePhoneCall({
      phoneNumber: this.state.business_list.tel
    })
      .then((res: any) => {
        console.log(res)
      })
  }
  //地图
  routePlanning = () => {
    // //现在所在
    // console.log(this.state.xPoint,this.state.yPoint);
    // //店铺所在
    // console.log(this.state.business_list.xpoint,this.state.business_list.ypoint);
    let browserType = getBrowserType();
    if (browserType == 'wechat') {
      let latitude = this.state.business_list.xpoint;
      let longitude = this.state.business_list.ypoint;
      let url = window.location;
      Taro.request({
        url: 'http://test.api.supplier.tdianyi.com/wechat/getShareSign',
        method: 'GET',
        data: {
          url
        }
      }).then(() => {
        wx.ready(()=> {
          wx.openLocation({
            latitude,
            longitude,
            scale: 18,
            name: this.state.business_list.name
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
        store_id: 123
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
  render() {
    // console.log(this.state.keepCollect_bull);
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
            <Image className="address-img" style={{ marginRight: "10px" }} src={AddressImg} onClick={this.routePlanning.bind(this)}/>
            <View className="text item">{this.state.business_list.address}</View>
            <Image className="mobile-img" style={{ paddingLeft: "10px", paddingTop: "2px", paddingBottom: "2px", borderLeft: "1px solid #ccc" }} src={MobileImg} onClick={this.makePhoneCall.bind(this)} />
          </View>
        </View>

        <View style={{ height: "5px", background: '#F6F6F6' }}></View>
        {/* 拼团活动 */}

        {
          this.state.activity_group.length == 0 ? <View></View> : <View style={{ background: "#fff" }}>
            <View className="merchant-details__tit" style={{ fontSize: "19px", paddingLeft: "24px", height: "26px", position: "relative", display: "flex", alignItems: "center", paddingTop: "10px" }}>
              <View className="mark" style={{
                fontSize: " 10px",
                color: "#fff",
                backgroundColor: "#D97B0B",
                padding: "1px 5px",
                borderRadius: " 2px",
                marginRight: "10px",
                verticalAlign: "inherit",
                bottom: "0",
                textAlign: "center",
                width: '12px'
              }}>礼</View>
              <Text className="fwb" style={{ fontWeight: "bold", position: "absolute", left: "50px", top: "12px" }}>拼团送豪礼</Text>
            </View>
            <View className="hidden-box" id="hidden-box" style={{ width: "100%", overflow: "hidden", height: this.state.activity_group_bull ? "auto" : "9rem" }}>
              {
                this.state.activity_group.map((item) => (
                  <View className="group-purchase bcfff _pintuan" key={item.name}>
                    <View style={{ height: "5px" }}></View>
                    <View className="hd">
                      <View className="flex center tuan" style={{ paddingBottom: "5px", borderBottom: "1px solid rgba(0,0,0,0.07)" }}>
                        <View className="item desc">{item.name}</View>
                        <View className="count">{item.participation_number}人团</View>
                      </View>
                    </View>

                    {
                      item.gift_pic == "" || item.gift_pic == null ?
                        <View className="image-list">
                          <Image className="image" src={item.image_url} />
                          <Image className="image" src={item.image_url_info} />
                        </View> :
                        <View className="image-list">
                          <Image className="image" src={item.image_url} />
                          <View className="image" style={{ position: "relative", display: "flex", background: "red" }}>
                            <Image src={require("./border.png")} style={{ width: "100%", height: "100%", position: 'absolute', top: '0px', left: '0px', zIndex: '2' }} />
                            <Image src={require("./qiu.png")} style={{ position: 'absolute', top: '-4px', left: '41%', width: '25px', height: '25px', zIndex: "3" }} />
                            <Image src={item.gift_pic} style={{ width: "100%", height: "100%" }} />
                          </View>
                        </View>
                    }
                    <View className="ft ">
                      <View className="flex center">
                        <View className="item">
                          <Text className="money">￥{item.participation_money}</Text>
                          <Text className="count">已拼{item.participation_number}件</Text>
                        </View>
                        <Button className="btn-go" onClick={this.gotoGroup.bind(this, item.youhui_id)}>立刻开团</Button>
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
                  <View className="more-box">
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
          this.state.activity_appre.length == 0 ? <View></View> : <View style={{ background: "#fff" }}>
            <View className="merchant-details__tit" style={{ fontSize: "19px", paddingLeft: "24px", height: "26px", position: "relative", display: "flex", alignItems: "center" }}>
              <Text className="mark" style={{
                fontSize: " 10px",
                color: "#fff",
                backgroundColor: "#C71D0B",
                padding: "1px 5px",
                borderRadius: " 2px",
                marginRight: "10px",
                verticalAlign: "inherit",
                bottom: "0",
                textAlign: "center",
                width: '12px'
              }}>增</Text>
              <Text className="fwb hidden-box" style={{ fontWeight: "bold", position: "absolute", left: "50px", top: "2px" }}>增值低价买</Text>
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
                    <View className="image-list" style={{ position: "relative", marginBottom: "5px" }}>
                      {
                        item.gift_pic == "" ? <Image className="backg-image" src={"http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/bMGJKGX2JcKWbs8JEypeiB7CAbd4wAz4.png"} /> :
                          <Image className="backg-image" src={"http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/andhNY3XKEWrW8nYBK5pyAptaJWeJz68.png"} />
                      }
                      <View className="img" style={{ width: "100%" }}   >
                        <View className="box_left">
                          <View className="box_left_price">￥ <View className="_price">{item.pay_money}</View></View>
                          <View className="box_left_return">最高可抵{parseInt(item.return_money)}元</View>
                        </View>
                        <View className="box_center">
                          <View className="present"><View className="present_text">{item.name}</View></View>
                          <View className="present_recommend">{item.gift_desc}</View>
                        </View>
                        <View className="box_right" style={{ overflow: "hidden" }}>
                          <Image className="image" src={item.image_url} style={{ width: "100%", height: "100%" }} />
                        </View>
                      </View>
                    </View>
                    <View className="ft ">
                      <View className="flex center">
                        <View className="item">
                          <Text className="money">￥{item.pay_money}</Text>
                          {/* <Text className="count">{item.activity_brief}</Text> */}
                        </View>
                        <Button className="btn-go" onClick={this.gotoAppreciation.bind(this, item.youhui_id)}>立刻增值</Button>
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
                  <View className="more-box">
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
          this.state.cashCouponList.length == 0 ? <View></View> : <View style={{ background: "#fff" }}>
            <View className="merchant-details__tit" style={{ fontSize: "19px", paddingLeft: "24px", height: "26px", position: "relative", display: "flex", alignItems: "center" }}>
              <Text className="mark" style={{
                fontSize: " 10px",
                color: "#fff",
                backgroundColor: "#5D84E0",
                padding: "1px 5px",
                borderRadius: " 2px",
                marginRight: "10px",
                verticalAlign: "inherit",
                bottom: "0",
                textAlign: "center",
                width: '12px'
              }}>券</Text>
              <Text className="fwb" style={{ fontWeight: "bold", position: "absolute", left: "50px", top: "2px" }}>现金券</Text>
            </View>
            <View className="ticket hidden-box" style={{ boxSizing: "border-box", width: "100%", overflow: "hidden", height: this.state.couponList_bull ? "auto" : "130px" }}>
              {
                this.state.cashCouponList.map((item) => (
                  <View className="ticket-view flex center" key={item.id} style={{ position: 'relative' }} onClick={this.handleClick.bind(this, item.id)}>
                    <View className="left" style={{ position: 'absolute', left: '30px' }}>
                      <View className="money"><View style={{ fontWeight: 'bold', float: "left", marginRight: "10px" }}>￥{item.return_money}</View>{item.name}</View>
                      <View className="desc">购买后{item.expire_day}天有效</View>
                      <View className="sales">极速退/免预约/全部商品可用</View>
                    </View>
                    <View className="right" style={{ position: 'absolute', right: '20PX' }}>
                      <View className="money">￥<Text>{item.pay_money}</Text></View>
                      <Button className="btn-buy" onClick={this.handleClick4.bind(this, item.id)} >立即购买</Button>
                    </View>
                  </View>
                ))
              }
            </View>
            {
              this.state.cashCouponList.length != 1 ? <View className="ft-more flex center"
                style={{ textAlign: "center", width: "100%", background: "#fff" }}
                onClick={() => { this.setState({ couponList_bull: !this.state.couponList_bull }) }} >
                < View className="more-box">
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
          this.state.exchangeCouponList.length == 0 ? <View></View> : <View style={{ background: "#fff" }}>
            <View className="merchant-details__tit" style={{ fontSize: "19px", paddingLeft: "24px", height: "26px", position: "relative", display: "flex", alignItems: "center" }}>
              <Text className="mark" style={{
                fontSize: " 10px",
                color: "#fff",
                backgroundColor: "#5DD8A5",
                padding: "1px 5px",
                borderRadius: " 2px",
                marginRight: "10px",
                verticalAlign: "inherit",
                bottom: "0",
                textAlign: "center",
                width: '12px'
              }}>惠</Text>
              <Text className="fwb" style={{ fontWeight: "bold", position: "absolute", left: "50px", top: "2px" }}>优惠信息</Text>
            </View>
            <View className="hidden-box" style={{ width: "100%", overflow: "hidden", height: this.state.exchangeCouponList_bull ? "auto" : "110px" }}>
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
                      <Button className="btn-buy" onClick={this.handleClick4.bind(this, item.id)} >立即购买</Button>
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
                  < View className="more-box" style={{ borderTop: "1px solid rgba(0,0,0,0.07)" }}>

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
              <View className="merchant-details__tit">
                <Text className="fwb">附近推荐</Text>
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
        }

      </View>
    );
  }
}
