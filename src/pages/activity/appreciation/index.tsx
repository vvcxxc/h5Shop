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

export default class Appre extends Component<Props>{
  state = {
    ruleMore: false,
    imgZoom: false,
    imgZoomSrc: '',
    xPoint: 0,
    yPoint: 0,
    imagesList: [],
    data: {
      activity_begin_time: "",
      activity_end_time: "",
      activity_time_status: 0,
      address: "",
      begin_time: "",
      description: [],
      distances: "",
      end_time: "",
      gift: { title: "", price: "", postage: "", mail_mode: '' },
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
      supplier_id: 0,
      tel: "",
      total_fee: 0,
      type: 0,
      validity: 0,
      xpoint: "",
      ypoint: "",
    },
    isPostage: true
  };

  componentDidMount = () => {
    console.log(this.$router.params);
    Taro.showLoading({
      title: 'loading',
    })


    getLocation().then((res: any) => {
      console.log(res);
      this.setState({
        yPoint: res.latitude || '',
        xPoint: res.longitude || ''
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
              let { image, images } = res.data;
              let imgList;
              if (image && images) {
                imgList = new Array(image).concat(images);
              } else {
                imgList = [];
              }
              if (res.data.gift_id) {
                if (res.data.gift.mail_mode == 2) {
                  this.setState({ isPostage: true })
                }
              } else {
                this.setState({ isPostage: false })
              }
              console.log("lala", imgList)
              this.setState({ data: res.data, imagesList: imgList }, () => {
                console.log("lalaal", this.state.imagesList)
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
              let { image, images } = res.data;
              let imgList;
              if (image && images) {
                imgList = new Array(image).concat(images);
              } else {
                imgList = [];
              }
              if (res.data.gift_id) {
                if (res.data.gift.mail_mode == 2) {
                  this.setState({ isPostage: true })
                }
              } else {
                this.setState({ isPostage: false })
              }
              console.log("lala", imgList)
              this.setState({ data: res.data, imagesList: imgList }, () => {
                console.log("lalaal", this.state.imagesList)
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
      url: '/pages/business/index?id=' + this.state.data.supplier_id
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
      let url = window.location;
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
        gift_id: this.$router.params.gift_id,
        open_id: Taro.getStorageSync("openid"),
        unionid: Taro.getStorageSync("unionid"),
        type: _type,
        xcx: 0,
      }
    } else {
      datas = {
        youhui_id: this.$router.params.id,
        activity_id: this.$router.params.activity_id,
        gift_id: this.$router.params.gift_id,
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
        if (_type == 1) {
          //微信
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
              if (res.err_msg == "get_brand_wcpay_request:ok") {
                //微信成功
                Taro.switchTab({
                  url: '/pages/order/index',
                  success: function (e) {
                    let page = Taro.getCurrentPages().pop();
                    if (page == undefined || page == null) return;
                    page.onShow();
                  }
                })
              } else {
                //微信失败
              }
            }
          );
        } else if (_type == 2) {
          //支付宝
          window.AlipayJSBridge.call('tradePay', {
            tradeNO: res.data.alipayOrderSn, // 必传，此使用方式下该字段必传
          }, res => {
            if (res.status == "200") {
              //支付宝成功
              Taro.navigateTo({
                url: '/activity-pages/my-activity/my.activity',
                success: function (e) {
                  let page = Taro.getCurrentPages().pop();
                  if (page == undefined || page == null) return;
                  page.onShow();

                }
              })
            } else {
              //支付宝失败
            }
          })
        } else {
          console.log(_type)
        }
      })
  }

  render() {
    const { images, description } = this.state.data;
    return (
      <View className="d_appre" >
        <View className="appre_head_activityTitle">
          <View className="appre_head_activityTitle_title">{this.state.data.name}</View>
          <View className="appre_head_activityTitle_time">活动时间 : {this.state.data.activity_begin_time}-{this.state.data.activity_end_time}</View>
        </View>

        {
          this.state.data.type == 0 ?
            <Swiper
              className='test-h'
              indicatorColor='#999'
              indicatorActiveColor='#333'
              circular
              indicatorDots
              autoplay>
              {
                this.state.imagesList ? this.state.imagesList.map((item, index) => {
                  return (
                    <SwiperItem key={item}>
                      <View className='demo-text' onClick={() => { this.setState({ imgZoom: true, imgZoomSrc: item }) }}>
                        <Image className="demo-text-Img" src={item} />
                      </View>
                    </SwiperItem>
                  )
                }) : null
              }
            </Swiper> : null
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
                <View className="appre_gift_giftmsg" >运费{this.state.data.gift.postage}元</View>
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
        {
          (this.state.data.gift && this.state.data.gift.mail_mode) == '2' ? (
            <View className='choose_postage' onClick={this.chooseGift}>

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
        }
        <View className="paymoney_box">
          <View className="paymoney_price">
            <View className="paymoney_price_icon">￥</View>
            <View className="paymoney_price_num">{this.state.data.pay_money}</View>
            {
              this.state.isPostage ? <View className='paymoney_price_info'> {'+' + this.state.data.gift.postage}</View> : null
            }


          </View>
          <View className="paymoney_buynow" onClick={this.payment.bind(this)}>立即购买</View>
        </View>

        <Zoom
          src={this.state.imgZoomSrc}
          showBool={this.state.imgZoom}
          onChange={() => {
            this.setState({ imgZoom: false })
          }}
        />

      </View>
    );
  }
}
