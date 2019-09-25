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
const share_url = process.env.GROUP_Details_URL
export default class Group extends Component<Props>{
  state = {
    ruleMore: false,
    imgZoom: false,
    imgZoomSrc: '',
    xPoint: 0,
    yPoint: 0,
    imagesCurrent: 0,
    imagesList: [],
    data: {
      activity_begin_time: "",
      activity_end_time: "",
      activity_id: 0,
      activity_time_status: 0,
      address: "",
      begin_time: "",
      description: [],
      distances: "",
      end_time: "",
      gift: { title: "", price: "", postage: "", mail_mode: 2, cover_image: '' },
      gift_id: 0,
      icon: "",
      id: 0,//店id
      image: "",
      images: [],
      is_show_button: 0,
      list_brief: "",
      locate_match_row: "",
      name: "",//店名
      number: 0,
      participate_number: 0,
      participation_money: "",
      pay_money: "",
      preview: '',
      route: "",
      succeed_participate_number: 0,
      supplier_id: 0,
      tel: "",
      xpoint: '',
      youhui_id: 0,//活动id
      youhui_name: "",//活动名
      ypoint: ""
    },
    isPostage: true,
    isShare: false,

    isFromShare: false
  };
  componentDidShow() {
    this.toShare();
  }

  componentDidMount = () => {
    console.log('params:', this.$router.params);
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
          url: 'api/wap/user/getGroupYouhuiInfo',
          method: "GET",
          data: {
            group_info_id: this.$router.params.id,
            is_xcx: 0,
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
              this.setState({ data: res.data, imagesList: imgList }, () => {
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
          url: 'api/wap/user/getGroupYouhuiInfo',
          method: "GET",
          data: {
            group_info_id: this.$router.params.id,
            is_xcx: 0,
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
              this.setState({ data: res.data, imagesList: imgList }, () => {
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
    let titleMsg = this.state.data.gift_id ? '在吗？现只需' + this.state.data.participation_money + '元疯抢价值' + this.state.data.pay_money + '元套餐，并送价值' + this.state.data.gift.price + '元大礼，快戳！' : '就差你啦！我在抢' + this.state.data.pay_money + '元套餐，快跟我一起拼吧！';
    let descMsg = this.state.data.gift_id ? '重磅！你！就是你！已被' + this.state.data.name + '选为幸运用户，现拼团成功可获得价值' + this.state.data.gift.price + '元的精美礼品！' : '花最低的价格买超值套餐，团购让你嗨翻天！';
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
            link: share_url + 'id=' + this.$router.params.id + '&type=1&gift_id=' + this.$router.params.gift_id + '&activity_id=' + this.$router.params.activity_id,
            imgUrl: 'http://wx.qlogo.cn/mmhead/Q3auHgzwzM6UL4r7LnqyAVDKia7l4GlOnibryHQUJXiakS1MhZLicicMWicg/0',
            success: function () {
              //成功后触发
              console.log("分享成功")
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
      url: '/pages/business/index?id=' + this.state.data.id
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
              name: this.state.data.name,
              address: this.state.data.address,
            })

          })
        })


    } else if (browserType == 'alipay') {
      Taro.navigateTo({
        url: 'https://m.amap.com/navi/?start=' + this.state.xPoint + ',' + this.state.yPoint + '&dest=' + this.state.data.xpoint + ',' + this.state.data.ypoint + '&destName=' + this.state.data.name + '&key=67ed2c4b91bf9720f108ae2cc686ec19'
      })
    } else {
      Taro.showToast({
        title: "信息出错",
        icon: "none"
      });
    }
    e.stopPropagation();
  }

  // 是否选择礼品
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
        public_type_id: this.$router.params.publictypeid ? this.$router.params.publictypeid : this.$router.params.id,
        activity_id: this.$router.params.activity_id,
        gift_id: this.state.isPostage ? this.$router.params.gift_id : undefined,
        open_id: Cookie.get(process.env.OPEN_ID),
        unionid: Cookie.get(process.env.UNION_ID),
        type: this.$router.params.type,
        xcx: 0,
        number: 1,
      }
    } else {
      datas = {
        public_type_id: this.$router.params.id,
        activity_id: this.$router.params.activity_id,
        gift_id: this.state.isPostage ? this.$router.params.gift_id : undefined,
        type: "5",
        xcx: 0,
        number: 1,
        alipay_user_id: Cookie.get(process.env.ALIPAY_USER_ID),

      }
    }
    //请求支付属性
    request({
      url: 'payCentre/toWxPay',
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
                Taro.navigateTo({
                  url: '/activity-pages/my-activity/my.activity',
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
            if (res.resultCode === "9000") {
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

        {
          this.state.imagesList.length > 0 ? <View
            onClick={() => {
              this.setState({ imgZoom: true, imgZoomSrc: this.state.imagesList[this.state.imagesCurrent] })
            }}>
            <Swiper
              onChange={(e) => {
                // console.log(e.detail.current)
                this.setState({ imagesCurrent: e.detail.current })
              }}
              className='test-h'
              indicatorColor='#999'
              indicatorActiveColor='#333'
              circular={true}

              indicatorDots
              autoplay>
              {
                this.state.imagesList ? this.state.imagesList.map((item, index) => {
                  return (
                    <SwiperItem key={item} >
                      <View className='demo-text'
                      //  onClick={() => { this.setState({ imgZoom: true, imgZoomSrc: item }) }}
                      >
                        <Image className="demo-text-Img" src={item} />
                      </View>
                    </SwiperItem>
                  )
                }) : null
              }
            </Swiper>
          </View> : null
        }

        <View className="coupon_box_title">
          <View className="group_coupon_title" >{this.state.data.youhui_name}</View>
          <View className="group_rule_time" >
            <View className="group_rule_time_key" >活动时间:</View>
            <View className="group_rule_time_data" > {this.state.data.activity_begin_time}-{this.state.data.activity_end_time}</View>
          </View>
          <View className="group_head_bottom" style={{ borderBottom: "none" }}>
            {this.state.data.gift ? <View className="group_head_bottom_gift">送{this.state.data.gift.title}</View> : null}
            <View className="group_head_bottom_list">{this.state.data.number}人团</View>
            {/* <View className="group_head_bottom_list">24小时</View> */}
          </View>

          {/* <View className="group_msg" >
            <View className="group_msg_titlebox" >商品详情</View>
            <View className="group_msgBox" >
              <View className="group_msgTitle_Box" >
                <View className="group_msgTitle" >名称</View>
                <View className="group_msgTitle" >数量</View>
                <View className="group_msgTitle" >价格</View>
              </View>
              <View className="group_msgContent_Box" >
                <View className="group_msgContent" >番茄炒蛋</View>
                <View className="group_msgContent" >2</View>
                <View className="group_msgContent" >￥200</View>
              </View>
              <View className="group_msgContent_Box" >
                <View className="group_msgContent" >麦当劳开心乐园儿童套餐</View>
                <View className="group_msgContent" >1</View>
                <View className="group_msgContent" >￥150</View>
              </View>
            </View>
          </View> */}

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
                  mode="widthFix"
                  onClick={() => { this.setState({ imgZoom: true, imgZoomSrc: this.state.data.gift.cover_image }) }}
                  src={this.state.data.gift.cover_image} />
              </View>
            </View> : null
        }
        <View className="appre_process2" >
          <Image className="appre_process2_Image" src="http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/x2WBTiwQwdap5ktNYYTyrGeP7E4zD5Qk.png" />
        </View>


        {/* <View className="group_num" >
          <View className="group_num_titlebox" >
            <View className="group_num_title" >4人正在拼</View>
            <View className="group_num_now" >正在拼团</View>
          </View>
          <View className="group_listbox" >
            <View className="group_list" >
              <View className="group_list_img" >
                <Image className="listImg" src={this.state.data.preview} />
              </View>
              <View className="group_list_name" >杨大富</View>
              <View className="group_list_btnbox" >
                <View className="group_list_btn" >立即参团</View>
              </View>
              <View className="group_list_timesbox" >
                <View className="group_list_lack" >
                  <View className="group_list_lackredblack1" >还差</View>
                  <View className="group_list_lackred" >1人</View>
                  <View className="group_list_lackredblack2" >拼成</View>
                </View>
                <View className="group_list_times" >23.50.30</View>
              </View>
            </View>
            <View className="group_list" >
              <View className="group_list_img" >
                <Image className="listImg" src={this.state.data.preview} />
              </View>
              <View className="group_list_name" >杨大富</View>
              <View className="group_list_btnbox" >
                <View className="group_list_btn" >立即参团</View>
              </View>
              <View className="group_list_timesbox" >
                <View className="group_list_lack" >
                  <View className="group_list_lackredblack1" >还差</View>
                  <View className="group_list_lackred" >1人</View>
                  <View className="group_list_lackredblack2" >拼成</View>
                </View>
                <View className="group_list_times" >23.50.30</View>
              </View>
            </View>
          </View>
        </View> */}


        <View className="appre_rule" >
          <View className="appre_rule_title" >使用规则</View>
          <View className="appre_rule_time" >
            <View className="appre_rule_time_key" >拼团人数:</View>
            <View className="appre_rule_time_data" >{this.state.data.number}人团</View>
          </View>
          {/* <View className="appre_rule_time" >
            <View className="appre_rule_time_key" >时间限制:</View>
            <View className="appre_rule_time_data" >24小时内</View>
          </View> */}
          {
            (description) ?
              <View className="appre_rule_list" style={{ height: description.length <= 3 ? "auto" : (this.state.ruleMore ? "auto" : "2.5rem") }}>
                <View className="appre_rule_list_key" >详情描述:</View>
                <View className="appre_rule_list_data" >
                  {
                    (description) ? description.map((item) => {
                      return (
                        <View className="appre_rule_list_msg" >. {item}</View>
                      )
                    }) : null
                  }
                </View>

              </View> : null
          }
          {
            (description && description.length > 3) ?
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
                <View className="setMeal_store_name">{this.state.data.name}</View>
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
          (this.state.data.gift && this.state.data.gift.mail_mode == 2) ? (
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
            <View className="paymoney_price_num">{this.state.data.participation_money}</View>
            <View className="paymoney_price_oldprice">￥{this.state.data.pay_money}</View>
            {
              this.state.isPostage ? <View className='paymoney_price_info'> {
                this.state.data.gift.mail_mode == 1 ? null :
                  '+' + this.state.data.gift.postage}</View> : null
            }
          </View>

          {
            this.$router.params.type == "55" ? <View className="paymoney_buynow" onClick={this.payment.bind(this)}>参加拼团</View> : <View className="paymoney_buynow" onClick={this.payment.bind(this)}>发起拼团</View>
          }
        </View>

        <Zoom
          src={this.state.imgZoomSrc}
          showBool={this.state.imgZoom}
          onChange={() => { this.setState({ imgZoom: !this.state.imgZoom }) }}
        />
        {/* 分享 */}
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
            <View style={{ position: 'fixed', bottom: '70px', right: '0px' }} onClick={this.handleGoHome.bind(this)}>
              <Image src={require('../../../assets/go-home/go_home.png')} style={{ width: '80px', height: '80px' }} />
            </View>
          ) : ''
        }
      </View>
    );
  }
}
