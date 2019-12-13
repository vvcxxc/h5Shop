import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image, Button } from "@tarojs/components";
import "./index.styl";
import "../set-meal/index";
import { AtIcon, AtToast } from "taro-ui";
import CashCoupon1 from '../set-meal/cash-coupon/index'
import CashCoupon2 from './cash-coupon/index'
import MobileImg from '../../assets/dianhua.png'
import AddressImg from '../../assets/address.png'
import request from '../../services/request'
import { getLocation } from "@/utils/getInfo"
import { getBrowserType } from "@/utils/common";
import wx from 'weixin-js-sdk';


const share_url = process.env.TICKETBUY_URL;
export default class TicketBuy extends Component {
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
      icon: "",
      id: 0,
      image: "",
      image_type: 1,
      list_brief: "",
      own: "",
      label: [],
      pay_money: "",
      return_money: "",
      yname: "",
      youhui_type: 0,
      expire_day: ''
    },
    store: {
      brief: "",
      id: 0,
      open_time: "",
      route: "",
      saddress: "",
      sname: "",
      tel: "",
      distance: "",
      shop_door_header_img: "",
      xpoint: 0,
      ypoint: 0
    },
    goods_album: [
      {
        id: 0,
        image_url: ""
      }
    ],
    recommend: [{
      begin_time: "",
      brief: "",
      end_time: "",
      id: 0,
      list_brief: "",
      open_time: "",
      pay_money: "",
      return_money: "",
      sname: "",
      yname: "",
      youhui_type: 1,
      expire_day: '',
      total_fee: '',
      image: ''
    }],

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
    getLocation().then((res: any) => {
      let xPoint = res.longitude;
      let yPoint = res.latitude;
      request({
        url: 'v3/discount_coupons/' + this.$router.params.id, method: "GET", data: { xpoint: xPoint || '', ypoint: yPoint || '' }
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
          }, () => {
            this.toShare();
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
      this.setState({
        yPoint: '',
        xPoint: ''
      }, () => {
        request({
          url: 'v3/discount_coupons/' + this.$router.params.id, method: "GET", data: { xpoint: this.state.xPoint, ypoint: this.state.yPoint }
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
            }, () => {
              this.toShare();
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
      })
    })
  }

  toShare = () => {
    let userAgent = navigator.userAgent;
    let isIos = userAgent.indexOf('iPhone') > -1;
    let url: any;
    if (isIos) {
      url = sessionStorage.getItem('url');
    } else {
      url = location.href;
    }
    let titleMsg = '嘘，这里有一张' + this.state.coupon.return_money + '元现金券，悄悄领了，别声张！';
    let descMsg = this.state.store.sname + '又搞活动啦，是好友我才偷偷告诉你，现金券数量有限，领券要快姿势要帅！';
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
              console.log("分享成功")
            }
          })
        })
      })
  }




  handleClick = (id, e) => {
    console.log(id)
    Taro.navigateTo({
      url: '../../business-pages/confirm-order/index?id=' + id
    })
  }
  handleClick2 = (_id, e) => {
    Taro.navigateTo({
      //url: '/detail-pages/business/index?id=' + _id
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
    //     //     keepCollect_data: res,
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
      <View className="set-meal">
        {
          this.state.keepCollect_bull ?
            <AtToast isOpened text={this.state.keepCollect_data} duration={2000} ></AtToast> : ""
        }
        <View className=" pd30 bcff">
          <View className="ticket-buy-view">
            {/* <Image className="image" src={this.state.coupon.icon} /> */}
            {/* {
              this.state.keepCollect_bull ?
                <AtIcon className="image" value="star-2" color="#FFBF00" size="24px" />
                :
                <AtIcon className="image" value="star" color="#999" size="24px" onClick={this.keepCollect.bind(this)} />
            } */}
            <View className="_expire">购买后{this.state.coupon.expire_day}日内有效</View>
            <View className="hd tit">{this.state.store.sname}</View>
            <View className="bd money">¥{this.state.coupon.return_money}</View>
            <View className="ft" style={{ position: "relative" }}>
              <View className="desc">{this.state.coupon.yname}</View>

              <View className="tags" style={{ position: "absolute", right: "0" }}>
                {/* <Text className="tag-text" style={{ backgroundColor: this.state.coupon.label.indexOf('可叠加') !== -1 ? '' : '#fff' }}>可叠加</Text>
                <Text className="tag-text" style={{ backgroundColor: this.state.coupon.label.indexOf('随时退') !== -1 ? '' : '#fff' }}>随时退</Text>
                <Text className="tag-text" style={{ marginRight:"0",backgroundColor: this.state.coupon.label.indexOf('免预约') !== -1 ? '' : '#fff' }}>免预约</Text> */}
                {
                  this.state.coupon.label && this.state.coupon.label.indexOf('可叠加') !== -1 ?
                    <Text className="tag-text">可叠加</Text> : null
                }
                {
                  this.state.coupon.label && this.state.coupon.label.indexOf('随时退') !== -1 ?
                    <Text className="tag-text">随时退</Text> : null
                }
                {
                  this.state.coupon.label && this.state.coupon.label.indexOf('免预约') !== -1 ?
                    <Text className="tag-text"  >免预约</Text> : null
                }
              </View>
            </View>
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
              {/* <View className="money">人均：￥222.00</View> */}
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
        {/* <View className="remark mt20 pd30 bcff">
          <View className="set-meal__tit">
            <Text className="fwb">购买须知</Text>
          </View>
          <View>
            <View className="label">有效期：</View>
            <View className="label-value">{this.state.coupon.begin_time + "   -   " + this.state.coupon.end_time}</View>
            <View className="label">使用规则：</View>
            <View className="label-value">{this.state.coupon.description}
            </View>
          </View>
        </View> */}
        {/* <View className="graphic-details bt20 pd30 bcff">
          <View className="set-meal__tit">
            <Text className="fwb">图文详情</Text>
          </View>
          <View>
            {
              this.state.goods_album.map((item) => (
                <View key={item.id}>
                <Image className="image" src={item.image_url} />))
                </View>
            }
          </View>
        </View> */}
        <View className="examine-more mt20 pd30 bcff">
          <View className="set-meal__tit">
            <Text className="fwb">更多本店宝贝</Text>
          </View>
          {
            this.state.recommend.map((item) => (
              <View key={item.id}>
                {
                  item.youhui_type == 0 ? <CashCoupon1 _id={item.id} return_money={item.return_money} pay_money={item.pay_money} youhui_type={item.youhui_type} timer={item.begin_time + "-" + item.end_time} list_brief={item.list_brief} yname={item.yname} sname={item.sname} _image={item.image} expire_day={item.expire_day} />
                    : <CashCoupon2 _id={item.id} return_money={item.return_money} pay_money={item.pay_money} youhui_type={item.youhui_type} timer={item.begin_time + "-" + item.end_time} list_brief={item.list_brief} yname={item.yname} sname={item.sname} expire_day={item.expire_day} total_fee={item.total_fee} />

                }
              </View>
            ))
          }

        </View>
        <View className="occupied">
          <View className="layer-ft-buy flex">
            <View className="money">￥<Text className="count">{this.state.coupon.pay_money}</Text></View>
            <View><Button className="btn-buy" onClick={this.handleClick.bind(this, this.state.coupon.id)} >立即抢购</Button></View>
          </View>
        </View>

        {/* 去首页 */}
        {
          this.state.isFromShare ? (
            <View style={{ position: 'fixed', bottom: '50px', right: '0px' }} onClick={this.handleGoHome.bind(this)}>
              <Image src={require('../../assets/go-home/go_home.png')} style={{ width: '80px', height: '80px' }} />
            </View>
          ) : ''
        }
      </View>
    );
  }
}
