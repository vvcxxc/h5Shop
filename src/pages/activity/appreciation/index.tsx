import Taro, { Component } from "@tarojs/taro";
import { AtIcon, AtNoticebar } from 'taro-ui';
import { View, Image, Swiper, SwiperItem } from "@tarojs/components";
import request from '../../../services/request';
import { getBrowserType } from "@/utils/common";
import wx from 'weixin-js-sdk';
import Cookie from 'js-cookie';
import { getLocation } from "@/utils/getInfo";
import share from '../../../assets/share.png';
import AddressImg from '../../../assets/address.png';
import MobileImg from '../../../assets/dianhua.png';
import Zoom from '../../../components/zoom/index';
import './index.scss';

interface Props {
  id: any;
}
const share_url = process.env.APPRE_Details_URL;
let interval;
export default class Appre extends Component<Props>{
  state = {
    ruleMore: false,
    imgZoom: false,
    imgZoomSrc: '',
    xPoint: '',
    yPoint: '',
    imagesCurrent: 0,
    data: {
      activity_begin_time: "",
      activity_end_time: "",
      activity_time_status: 0,
      address: "",
      begin_time: "",
      imagesCurrent: 0,
      description: [],
      distances: "",
      end_time: "",
      gift: { title: "", price: "", postage: "", mail_mode: 0 },
      gift_id: 0,
      gift_pic: '',
      id: 0,
      image: "",
      images: [],
      init_money: "",
      is_show_button: 0,
      location_name: "",
      name: "",
      pay_money: "",
      preview: "",
      return_money: "",
      store_id: 0,
      supplier_id: 0,
      tel: "",
      total_fee: 0,
      type: 0,
      validity: 0,
      xpoint: "",
      ypoint: "",
      dp_count: 0
    },
    isPostage: true,
    isShare: false,

    isFromShare: false
  };
  componentDidShow() {
    this.toShare();
  }
  componentWillUnmount() {
    clearInterval(interval);
  }
  componentDidMount = () => {
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
      this.setState({
        yPoint: res.latitude || '',
        xPoint: res.longitude || ''
      }, () => {
        request({
          url: 'api/wap/user/appreciation/getYouhuiAppreciationInfo',
          method: "GET",
          data: {
            youhui_id: this.$router.params.id,
            xpoint: this.state.xPoint,
            ypoint: this.state.yPoint
          }
        })
          .then((res: any) => {
            if (res.code == 200) {
              if (res.data.gift_id) {
                if (res.data.gift.mail_mode == 2) {
                  this.setState({ isPostage: true })
                }
              } else {
                this.setState({ isPostage: false })
              }
              this.setState({ data: res.data }, () => {
                this.toShare();
              });
              Taro.hideLoading()
            }
          }).catch(err => {
            console.log(err);
          })
      })
    }).catch(err => {
      this.setState({
        yPoint: '',
        xPoint: ''
      }, () => {
        request({
          url: 'api/wap/user/appreciation/getYouhuiAppreciationInfo',
          method: "GET",
          data: {
            // youhui_id: 3713,
            youhui_id: this.$router.params.id,
            xpoint: this.state.xPoint,
            ypoint: this.state.yPoint
          }
        })
          .then((res: any) => {
            if (res.code == 200) {
              if (res.data.gift_id) {
                if (res.data.gift.mail_mode == 2) {
                  this.setState({ isPostage: true })
                }
              } else {
                this.setState({ isPostage: false })
              }
              this.setState({ data: res.data }, () => {
                this.toShare();
              });
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

  };


  toShare = () => {
    let url = window.location.href;
    let titleMsg = this.state.data.gift_id ? '你有一张' + this.state.data.return_money + '元增值券待领取，邀请好友助力还有免费好礼拿！' : '什么？' + this.state.data.pay_money + '元还可以当' + this.state.data.return_money + '元花，走过路过不要错过！';
    let descMsg = this.state.data.gift_id ? this.state.data.pay_money + '元当' + this.state.data.return_money + '元花的秘密，我只告诉你一个！增值成功还有' + this.state.data.gift.price + '元' + this.state.data.gift.title + '免费拿！' : this.state.data.location_name + '增值券福利来了！只要邀请' + this.state.data.dp_count + '个好友助力，' + this.state.data.pay_money + '元秒变' + this.state.data.return_money + '元，感觉能省一个亿！';
    let linkMsg = share_url + 'id=' + this.$router.params.id + '&type=1&gift_id=' + this.$router.params.gift_id + '&activity_id=' + this.$router.params.activity_id;
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
            'updateAppMessageShareData',
            'updateTimelineShareData',
            'onMenuShareAppMessage', //旧的接口，即将废弃
            'onMenuShareTimeline'//旧的接口，即将废弃
          ]
        })
        console.log(linkMsg)
        wx.ready(() => {
          wx.updateAppMessageShareData({
            title: titleMsg,
            desc: descMsg,
            link: linkMsg.split('#')[0] + '##' + linkMsg.split('#')[1],
            imgUrl: 'http://wx.qlogo.cn/mmhead/Q3auHgzwzM6UL4r7LnqyAVDKia7l4GlOnibryHQUJXiakS1MhZLicicMWicg/0',
            success: function () {
              //成功后触发
            }
          })
        })
      })
  }

  buttonToShare = () => {
    this.setState({ isShare: true });
  }
  closeShare = () => {
    this.setState({ isShare: false });
  }

  //去图文详情
  toImgList = () => {

    Taro.navigateTo({
      url: '/detail-pages/gift/gift?gift_id=' + this.$router.params.gift_id + '&activity_id=' + this.$router.params.activity_id
    })
  }
  //去商店
  handleClick2 = (e) => {
    Taro.navigateTo({
      // url: '/detail-pages/business/index?id=' + _id
      url: '/pages/business/index?id=' + this.state.data.store_id
    })
  };
  //打电话
  makePhoneCall = (e) => {
    Taro.makePhoneCall({
      phoneNumber: this.state.data.tel
    })
      .then((res: any) => {
        console.log(res)
      });
    e.stopPropagation();
  }
  //地图
  routePlanning = (e) => {
    let browserType = getBrowserType();
    if (browserType == 'wechat') {
      let longitude = parseFloat(this.state.data.xpoint);
      let latitude = parseFloat(this.state.data.ypoint);
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
              name: this.state.data.location_name,
              address: this.state.data.address,
            })

          })
        })


    } else if (browserType == 'alipay') {
      Taro.navigateTo({
        url: 'https://m.amap.com/navi/?start=' + this.state.xPoint + ',' + this.state.yPoint + '&dest=' + this.state.data.xpoint + ',' + this.state.data.ypoint + '&destName=' + this.state.data.location_name + '&key=67ed2c4b91bf9720f108ae2cc686ec19'
      })
    } else {
      Taro.showToast({
        title: "信息出错",
        icon: "none"
      });
    }
    e.stopPropagation();
  }

  chooseGift = () => {
    this.setState({ isPostage: !this.state.isPostage })
  }

  payment() {
    Taro.showLoading({
      title: 'loading',
    })
    let _type;
    let browserType = getBrowserType();
    if (browserType == 'wechat') {
      _type = 1;
    } else if (browserType == 'alipay') {
      _type = 2;
    } else {
      Taro.showToast({
        title: "支付出错",
        icon: "none"
      });
    }
    let datas = {}
    if (_type == 1) {
      datas = {
        youhui_id: this.$router.params.id,
        activity_id: this.$router.params.activity_id,
        gift_id: this.state.isPostage ? this.$router.params.gift_id : undefined,
        open_id: Cookie.get(process.env.OPEN_ID),
        unionid: Cookie.get(process.env.UNION_ID),
        type: _type,
        xcx: 0,
      }
    } else {
      datas = {
        youhui_id: this.$router.params.id,
        activity_id: this.$router.params.activity_id,
        gift_id: this.state.isPostage ? this.$router.params.gift_id : undefined,
        type: _type,  //1 微信 2支付宝
        xcx: 0,
        alipay_user_id: Cookie.get(process.env.ALIPAY_USER_ID),
      }
    }
    //请求支付属性
    request({
      url: 'v1/youhui/wxXcxuWechatPay',
      method: "POST",
      header: {
        "Content-Type": "application/json"
      },
      data: JSON.stringify(datas)
    })
      .then((res: any) => {
        Taro.hideLoading();
        if (res.code == 200) {
          let order_sn = res.data.channel_order_sn;

          if (_type == 1) {
            //微信支付
            window.WeixinJSBridge.invoke(
              'getBrandWCPayRequest', {
              "appId": res.data.appId,
              "timeStamp": res.data.timeStamp,
              "nonceStr": res.data.nonceStr,
              "package": res.data.package,
              "signType": res.data.signType,
              "paySign": res.data.paySign
            },
              function (res) {
                //微信支付成功
                if (res.err_msg == "get_brand_wcpay_request:ok") {
                  Taro.showLoading({
                    title: 'loading',
                  });
                  interval = setInterval(function () {
                    //查询用户最后一次购买的增值活动id
                    request({
                      url: 'v1/youhui/getUserLastYouhuiId',
                      method: "GET",
                      data: { order_sn: order_sn }
                    }).then((res: any) => {
                      if (res.code == 200) {
                        clearInterval(interval);
                        Taro.hideLoading();
                        //得到增值活动id并跳转活动详情
                        Taro.navigateTo({
                          url: '/pages/activity/pages/appreciation/appreciation?id=' + res.data.id,
                          success: function (e) {
                            let page = Taro.getCurrentPages().pop();
                            if (page == undefined || page == null) return;
                            page.onShow();
                          }
                        })
                      }
                    })
                  }, 500);

                } else {
                  //微信支付失败
                }
              }
            );
          } else if (_type == 2) {
            //支付宝支付
            window.AlipayJSBridge.call('tradePay', {
              tradeNO: res.data.alipayOrderSn, // 必传，此使用方式下该字段必传
            }, res => {
              //支付宝支付成功
              if (res.resultCode === "9000") {
                Taro.showLoading({
                  title: 'loading',
                });
                interval = setInterval(function () {
                  //查询用户最后一次购买的增值活动id
                  request({
                    url: 'v1/youhui/getUserLastYouhuiId',
                    method: "GET",
                    data: { order_sn: order_sn }
                  }).then((res: any) => {
                    if (res.code == 200) {
                      clearInterval(interval);
                      Taro.hideLoading();
                      //得到增值活动id并跳转活动详情
                      Taro.navigateTo({
                        url: '/pages/activity/pages/appreciation/appreciation?id=' + res.data.id,
                        success: function (e) {
                          let page = Taro.getCurrentPages().pop();
                          if (page == undefined || page == null) return;
                          page.onShow();
                        }
                      })
                    }
                  })
                }, 500);
              } else {
                //支付宝支付失败
              }
            })
          } else {
            console.log(_type)
          }
        } else {
          Taro.showToast({ title: res.message, icon: 'none' })
        }
      }).catch(err => {
        Taro.hideLoading();
      })
  }

  goToaConfirm = (e) => {
    if (this.state.data.gift_id) {
      Taro.navigateTo({
        url: '/activity-pages/confirm-address/index?activityType=1&id=' + this.$router.params.id + '&storeName=' + encodeURIComponent(this.state.data.location_name)
      })
    } else {
      this.payment()
    }

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
    const { images, description } = this.state.data;
    return (
      <View className="d_appre" >

        <View className="group_head_bottom_share" onClick={this.buttonToShare.bind(this)}>
          <Image className="shareimg" src="http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/TTbP3DjHQZPhRCxkcY7aSBAaSxKKS3Wi.png" />
          分享
        </View >

        <View className="appre_head_activityTitle">
          <View className="appre_head_activityTitle_title">{this.state.data.name}</View>
          <View className="appre_head_activityTitle_time">活动时间 : {this.state.data.activity_begin_time}-{this.state.data.activity_end_time}</View>
        </View>

        {
          this.state.data.type == 0 && this.state.data.images.length > 0 ?
            <View
              onClick={() => {
                this.setState({ imgZoom: true, imgZoomSrc: this.state.data.images[this.state.imagesCurrent] })
              }}>
              <Swiper
                onChange={(e) => {
                  this.setState({ imagesCurrent: e.detail.current })
                }}
                className='test-h'
                indicatorColor='#999'
                indicatorActiveColor='#333'
                circular={true}

                indicatorDots
                autoplay>
                {
                  this.state.data.images ? this.state.data.images.map((item, index) => {
                    return (
                      <SwiperItem key={item}>
                        <View className='demo-text'>
                          <Image className="demo-text-Img" src={item} />
                        </View>
                      </SwiperItem>
                    )
                  }) : null
                }
              </Swiper>
            </View> : null
        }

        <View className="appre_hd" >
          <View className="appre_head">
            <View className="appre_head_ticket">
              <View className="appre_head_circle1"></View>
              <View className="appre_head_circle2"></View>
              <View className="appre_head_left">
                <View className="appre_head_left_pricebox">
                  <View className="appre_head_left_pricebox_msg">最高可抵扣</View>
                  <View className="appre_head_left_pricebox_price">￥{this.state.data.return_money}</View>
                </View>
                <View className="appre_head_left_pricebox_info">满{this.state.data.total_fee}可用</View>
              </View>
              <View className="appre_head_right">
                <View className="appre_head_right_total">起始值为{this.state.data.init_money}元</View>
                <View className="appre_head_right_days">领取后{this.state.data.validity}日内有效</View>
              </View>
            </View>
            <View style={{ height: "24px" }}></View>
            {/* <View className="appre_head_bottom">
              <View className="appre_head_bottom_gift">送价值3000元耳机</View>
              <View className="appre_head_bottom_list">随时用</View>
              <View className="appre_head_bottom_share">
                <Image className="appre_head_bottom_shareimg" src={share} />
                分享</View>
            </View> */}
          </View>
        </View>
        {
          this.state.data.gift_id ?
            <View className="appre_gift" >
              <View className="appre_gift_titlebox" >
                <View className="appre_gift_title" >赠送礼品</View>
                <View className="appre_gift_Imagelist" onClick={this.toImgList.bind(this)}>图文详情</View>
              </View>
              <View className="appre_gift_giftinfo" >{this.state.data.gift.title}</View>
              <View className="appre_gift_giftmsgbox" >
                <View className="appre_gift_giftmsg" >{
                  this.state.data.gift.mail_mode == 1 ? '免运费' : `运费${this.state.data.gift.postage}元`
                }</View>
              </View>
              <View className="appre_gift_giftlist" >
                <Image className="appre_gift_giftlistImg"
                  onClick={() => { this.setState({ imgZoom: true, imgZoomSrc: this.state.data.gift_pic }) }}
                  src={this.state.data.gift_pic} />
              </View>
            </View> : null
        }
        <View className="appre_process2" >
          <Image className="appre_process2_Image" src="http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/XzPRtr5xGGiEiP8xHiS8tYEwCwyQWib8.png" />
        </View>

        <View className="appre_rule" >
          <View className="appre_rule_title" >温馨提示</View>
          {
            this.state.data.type != 0 ?
              <View className="appre_rule_time" >
                <View className="appre_rule_time_key" >使用范围:</View>
                <View className="appre_rule_time_data" >全场通用</View>
              </View> : null
          }
          <View className="appre_rule_time" >
            <View className="appre_rule_time_key" >使用门槛:</View>
            <View className="appre_rule_time_data" >满{this.state.data.total_fee}元可用</View>
          </View>
          <View className="appre_rule_time" >
            <View className="appre_rule_time_key" >活动时间:</View>
            <View className="appre_rule_time_data" >{this.state.data.activity_begin_time}-{this.state.data.activity_end_time}</View>
          </View>
          <View className="appre_rule_time" >
            <View className="appre_rule_time_key" >券有效期:</View>
            <View className="appre_rule_time_data" >领取后{this.state.data.validity}日内有效</View>
          </View>
          {
            (this.state.data.type == 0 && description) ?
              <View className="appre_rule_list" style={{ height: description.length <= 3 ? "auto" : (this.state.ruleMore ? "auto" : "2.5rem") }}>
                <View className="appre_rule_list_key" >使用规则:</View>
                <View className="appre_rule_list_data" >
                  {
                    (this.state.data.type == 0 && description) ? description.map((item) => {
                      return (
                        <View className="appre_rule_list_msg" >. {item}</View>
                      )
                    }) : null
                  }
                </View>

              </View> : null
          }
          {
            (this.state.data.type == 0 && description && description.length > 3) ?
              <View className="appre_rule_list_more" onClick={() => { this.setState({ ruleMore: !this.state.ruleMore }) }}>
                {this.state.ruleMore ? "收回" : "查看更多"}
                {
                  this.state.ruleMore ?
                    <AtIcon value="chevron-up" color="#999" size="16px" /> : <AtIcon value="chevron-down" color="#999" size="16px" />
                }
              </View> : null
          }
        </View>
        <View className="setMeal_store">
          <View className="setMeal_store_box" onClick={this.handleClick2.bind(this)}>
            <View className="setMeal_store_title">适用店铺</View>
            <View className="setMeal_store_storebox">
              <View className="setMeal_store_Image">
                <Image className="setMeal_store_img" src={this.state.data.preview} />
              </View>
              <View className="setMeal_store_msg">
                <View className="setMeal_store_name">{this.state.data.location_name}</View>
                {/* <View className="setMeal_store_price">人均：￥222</View> */}
              </View>
              <View className="setMeal_store_icon">
                <AtIcon value='chevron-right' size='20' color='#ccc'></AtIcon>
              </View>
            </View>
            <View className="setMeal_store_addressbox">
              <View className="setMeal_store_distance" onClick={this.routePlanning.bind(this)}>
                <View className="setMeal_store_distance_Image" >
                  <Image className="setMeal_store_distance_AddressImg" src={AddressImg} />
                </View>
                <View className="setMeal_store_distance_info" >{this.state.data.distances}</View>
              </View>
              <View className="setMeal_store_address" onClick={this.routePlanning.bind(this)}>{this.state.data.address}</View>
              <View className="setMeal_store_mobile" onClick={this.makePhoneCall.bind(this)}>
                <Image className="setMeal_store_MobileImg" src={MobileImg} />
              </View>
            </View>
          </View>
        </View>
        {/* {
          (this.state.data.gift && this.state.data.gift.mail_mode == 2) ? (
            <View className='choosePostage' onClick={this.chooseGift}>

              <View>
                {
                  this.state.isPostage ? <Image src={require('../../../assets/choose.png')} className='choose' /> : <Image src={require('../../../assets/nochoose.png')} className='choose' />
                }
              </View>
              （邮费 {this.state.data.gift.postage}元）
              <View className='lbmsg' >
                <AtNoticebar marquee> {this.state.data.gift.title}</AtNoticebar>
              </View>
            </View>) : null
        } */}
        <View className="paymoney_box">
          <View className="paymoney_price">
            <View className="paymoney_price_icon">￥</View>
            <View className="paymoney_price_num">{this.state.data.pay_money}</View>
            {
              this.state.isPostage ? <View className='paymoney_price_info'> {
                this.state.data.gift.mail_mode == 1 ? null :
                  '+' + this.state.data.gift.postage}</View> : null
            }


          </View>
          {
            this.state.data.activity_time_status == 1 ? (
              <View className="paymoney_buynow_no">暂未开始</View>
            ) : this.state.data.activity_time_status == 2 ? (
              <View className="paymoney_buynow" onClick={this.goToaConfirm.bind(this)}>立即购买</View>
            ) : this.state.data.activity_time_status == 3 ? (
              <View className="paymoney_buynow_no">已结束</View>
            ) : null
          }
        </View>

        <Zoom
          src={this.state.imgZoomSrc}
          showBool={this.state.imgZoom}
          onChange={() => {
            this.setState({ imgZoom: false })
          }}
        />

        {
          this.state.isShare == true ? (
            <View className='share_mask' onClick={this.closeShare}>
              <View className='share_box'>
                <View className='share_text text_top'>
                  点击此按钮分享给好友
                </View>
                {/* <View className='share_text'>
                  一起增值领礼品吧
                </View> */}
                <Image src={require('../../../assets/share_arro.png')} className='share_img' />
              </View>
            </View>
          ) : null
        }

        {/* 去首页 */}
        {
          this.state.isFromShare ? (
            <View style={{ position: 'fixed', bottom: '50%', right: '0px' }} onClick={this.handleGoHome.bind(this)}>
              <Image src={require('../../../assets/go-home/go_home.png')} style={{ width: '80px', height: '80px' }} />
            </View>
          ) : ''
        }

      </View>
    );
  }
}
