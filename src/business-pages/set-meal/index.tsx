import Taro, { Component } from "@tarojs/taro";
import { AtIcon } from 'taro-ui';
import { View, Text, Image, ScrollView, Button, Swiper, SwiperItem } from "@tarojs/components";
import "./index.styl";
import ApplyToTheStore from '@/components/applyToTheStore';
import { discountCoupons } from "./service";
import { getLocation } from "@/utils/getInfo";
import Cookie from 'js-cookie'
import LandingBounced from '@/components/landing_bounced'//登录弹框
import Zoom from '@/components/zoom';
import ShareBox from "@/components/share-box";//分享组件
import wx from 'weixin-js-sdk';
// import Poster from '@/components/posters/vouchers'//   海报无礼品
import Poster from '@/components/posters/set-meal'//   海报无礼品
import { shopPoster } from '@/api/poster'
import { accSub } from '@/components/acc-num'
const BASIC_API = process.env.BASIC_API;//二维码域名
const share_url = process.env.SETMEAL_URL;
const H5_URL = process.env.H5_URL

// import ShareBox from '@/components/share-box';
export default class AppreActivity extends Component {
  config = {
    navigationBarTitleText: "兑换券",
    enablePullDownRefresh: false
  };

  state = {
    imgZoomSrc: '',
    imgZoom: false,
    bannerImgIndex: 0,
    yPoint: '',
    xPoint: '',
    keepCollect_data: "",
    //表面收藏
    keepCollect_bull: false,
    coupon: {
      invitation_user_id: '',
      share_text: '',
      begin_time: "",
      brief: "",
      //真正的收藏
      collect: "",
      description: [],
      end_time: "",
      icon: "",
      id: 0,
      image: "",
      image_type: 1,
      list_brief: "",
      own: "",
      label: [''],
      pay_money: "",
      return_money: "",
      yname: "",
      youhui_type: 0,
      expire_day: ''
    },
    delivery_service_info: {
      delivery_end_time: '',
      delivery_radius_m: 0,
      delivery_service_money: 0,
      delivery_start_time: '',
      id: 0
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
      image: "",
      list_brief: "",
      open_time: "",
      pay_money: "",
      return_money: "",
      sname: "",
      yname: "",
      youhui_type: 0,
      expire_day: '',
    }],
    isFromShare: false,
    is_alert: false,
    showAll: false,
    showBounced: false,
    showMoreRules: false,
    showShare: false, //显示分享
    isShare: false,
    posterList: {},
    showPoster: false,
  }

  componentDidMount() {
    let youhui_id = this.$router.params.id
    shopPoster({ youhui_id, from: 'h5' })
      .then(({ data, code }) => {
        this.setState({ posterList: data })
      })
  }

  /**
   * 回首页
   */
  handleGoHome = () => {
    Taro.switchTab({ url: '/pages/index/index' })
  }

  /**
       * 获取定位
       */
  componentDidShow() {
    let arrs = Taro.getCurrentPages()
    if (arrs.length <= 1) {
      this.setState({ isFromShare: true })
    }
    Taro.showLoading({ title: 'loading', mask: true })
    getLocation().then((res: any) => {
      this.toShare();
      this.getTicketInfo(this.$router.params.id, { ypoint: res.latitude || '', xpoint: res.longitude || '' })
    }).catch(err => {
      this.getTicketInfo(this.$router.params.id, { xpoint: '', ypoint: '' })
    })

  }

  /**
     * 获取券信息
     */
  getTicketInfo = (id: number | string, data: object) => {
    discountCoupons(id, data)
      .then((res: any) => {
        Taro.hideLoading()
        this.setState({
          coupon: res.data.info.coupon,
          store: res.data.info.store,
          goods_album: res.data.info.goods_album,
          recommend: res.data.recommend.data,
          delivery_service_info: res.data.delivery_service_info
        })
      }).catch(err => {
        Taro.hideLoading()
        Taro.showToast({ title: '信息错误', icon: 'none' })
        setTimeout(() => { Taro.navigateBack() }, 2000)
      })
  }


  /**
      * 去支付
      */
  goToPay = (id, e) => {
    let phone_status = Cookie.get('phone_status')
    if (phone_status != 'binded' && phone_status != 'bind_success') {//两者不等，需要登录
      this.setState({ showBounced: true })
      return
    }
    Taro.navigateTo({
      url: '../../business-pages/coupon-distribution/index?id=' + id
    })
  }

  // 登录弹窗
  loginChange = (type: string) => {
    if (type == 'close') {
      this.setState({ is_alert: false })
    } else {
      // 重新请求当前数据
      this.setState({ is_alert: false })
    }
  }

  /**
      * 其他现金券
      */
  gotoTicketBuy = (type, _id, e) => {
    if (type == 0) {
      Taro.navigateTo({ url: '../set-meal/index?id=' + _id })
    } else {
      Taro.navigateTo({ url: '../ticket-buy/index?id=' + _id })
    }
  }

  buttonToShare = () => {
    this.setState({ isShare: true });
  }
  closeShare = () => {
    this.setState({ isShare: false });
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
    let titleMsg = this.state.store.sname + '正在派发' + this.state.coupon.return_money + '元兑换券，手慢无，速抢！';
    let descMsg = '拼手速的时候来了，超值兑换券限量抢购，手慢就没了！速速戳进来一起领取！';
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
            link: share_url + this.$router.params.id + '&invitation_user_id=' + this.state.coupon.invitation_user_id,
            imgUrl: 'http://wx.qlogo.cn/mmhead/Q3auHgzwzM6UL4r7LnqyAVDKia7l4GlOnibryHQUJXiakS1MhZLicicMWicg/0',
            success: function () {
              //成功后触发
              console.log("分享成功")
            }
          })
        })
      })
  }

  copyText = () => {
    let NValue = this.state.coupon.share_text.replace(/@#@#/, H5_URL)
    let NumClip = document.createElement("textarea");
    NumClip.value = NValue;
    NumClip.style.height = '0px';
    NumClip.style.overflow = 'hidden';
    NumClip.style.opacity = '0';
    NumClip.readOnly = true//防止ios键盘弹出
    document.body.appendChild(NumClip);
    NumClip.select();
    this.selectText(NumClip, 0, NValue.length);
    if (document.execCommand('copy', false)) {
      document.execCommand('copy', false)// 执行浏览器复制命令
      Taro.showToast({ title: '复制成功，请前往微信发送给好友。' })
    } else {
      Taro.showToast({ title: '该浏览器不支持点击复制到剪贴板', icon: 'none' })
    }
    this.setState({ showShare: false })
  }

  selectText = (textbox, startIndex, stopIndex) => {
    if (textbox.createTextRange) {//ie
      var range = textbox.createTextRange();
      range.collapse(true);
      range.select();//不兼容苹果
    } else {//firefox/chrome
      textbox.setSelectionRange(startIndex, stopIndex);
      // textbox.focus();
    }
  }

  /* 关闭海报 */
  closePoster = () => {
    this.setState({ showPoster: false, showShare: false })
  }


  render() {
    const { description } = this.state.coupon;
    const { showPoster, posterList, delivery_service_info } = this.state
    return (
      <View className="appre-activity-detail">
        {/* 分享组件 */}
        <ShareBox
          show={this.state.showShare}
          onClose={() => this.setState({ showShare: false })}
          sendText={() => {
            this.copyText()
            this.setState({ showShare: false })
          }}
          sendLink={() => {
            this.buttonToShare()
            this.setState({ showShare: false })
          }}
          createPoster={() => {
            this.setState({ showPoster: true, showShare: false })
          }}
        />

        <View className={showPoster ? "show-poster" : "hidden-poster"} onClick={() => this.setState({ showPoster: false })}>
          <Poster show={showPoster} list={posterList} onClose={this.closePoster} />
          <View className="click-save">长按保存图片到相册</View>
        </View>
        {
          this.state.isShare == true ? (
            <View className='share_mask' onClick={this.closeShare}>
              <View className='share_box'>
                <View className='share_text text_top'>
                  点击此按钮分享给好友
                                    </View>
                <Image src={require('@/assets/share_arro.png')} className='share_img' />
              </View>
            </View>
          ) : null
        }
        <Image className='appre-banner' src={this.state.coupon.image}
          onClick={(e) => {
            this.setState({ imgZoom: true, imgZoomSrc: this.state.coupon.image })
          }} />
        <View className="banner-number-box">
          <View className="banner-number">1</View>
          <View className="banner-number">1</View>
        </View>
        {/* <View className="collect-box">
          <Image className="collect-img" src="http://oss.tdianyi.com/front/7mXMpkiaD24hiAEw3pEJMQxx6cnEbxdX.png" />
        </View>
        <View className="share-box">
          <Image className="share-img" src="http://oss.tdianyi.com/front/Af5WfM7xaAjFHSWNeCtY4Hnn4t54i8me.png" />
        </View> */}
        <View className="appre-info-content">
          <View className="appre-info-title-setmeal">
            <View className="appre-info-title-label-setmeal">小熊敬礼</View>
            <View className="appre-info-title-text-setmeal">{this.state.coupon.yname}</View>
          </View>
          <View className="appre-info-price">
            <View className="appre-price-info">
              <View className="appre-price-info-text">优惠价￥</View>
              <View className="appre-price-info-new">{this.state.coupon.pay_money}</View>
              <View className="appre-price-info-old">￥{this.state.coupon.return_money}</View>
            </View>
            <View className="appre-price-discounts">已优惠￥{accSub(this.state.coupon.return_money, this.state.coupon.pay_money)}</View>
          </View>
          {
            delivery_service_info.id ? <View className="appre-info-label">
              <View className="appre-info-label-item">可配送</View>
            </View> : null
          }
        </View>
        <Image className="appre-banner-img" src="http://oss.tdianyi.com/front/AY8XDHGntwa8dWN3fJe4hTWkK4zFG7F3.png" />

        <View className="appre-store-info">
          <ApplyToTheStore
            id={this.state.store.id}
            isTitle={true}
            img={this.state.store.shop_door_header_img}
            name={this.state.store.sname}
            phone={this.state.store.tel}
            address={this.state.store.saddress}
            location={{ xpoint: this.state.store.xpoint, ypoint: this.state.store.ypoint }}
            meter={this.state.store.distance}
          />
        </View>

        <View className="appre-rules">
          <View className="appre-title-box">
            <View className='appre-title-left'></View>
            <View className='appre-title'>使用说明</View>
          </View>

          <View className="appre-rules-item" >
            <View className="rules-key">有效期：</View>
            <View className="rules-words">购买后{this.state.coupon.expire_day}天内可用</View>
          </View>
          {
            delivery_service_info.id ? <View className="group-rules-list-margin">
              <View className="group-rules-list-title" >配送服务：</View>
              <View className="group-rules-list-text" >-配送费用：{delivery_service_info.delivery_service_money}元</View>
              <View className="group-rules-list-text" >-配送范围：{delivery_service_info.delivery_radius_m}km</View>
              <View className="group-rules-list-text" >-配送时间：{delivery_service_info.delivery_start_time + '-' + delivery_service_info.delivery_end_time}</View>
              <View className="group-rules-list-text" >-联系电话：{this.state.store.tel}</View>
            </View> : null
          }
          {
            description && description.length && !this.state.showMoreRules ? <View>
              <View className="appre-rules-list-title" >使用规则：</View>
              {
                description.length > 0 ? <View className="appre-rules-list-text" >-{description[0]}</View> : null
              }
              {
                description.length > 1 ? <View className="appre-rules-list-text" >-{description[1]}</View> : null
              }
              {
                description.length > 2 ? <View className="appre-rules-list-text" >-{description[2]}</View> : null
              }
              {
                description.length > 3 ? <View className="appre-rules-list-text" >-{description[3]}</View> : null
              }
            </View> : null
          }
          {
            description && description.length && description.length > 4 && this.state.showMoreRules ? <View>
              <View className="appre-rules-list-title" >使用规则：</View>
              {
                description.map((item) => {
                  return (
                    <View className="appre-rules-list-text" >-{item}</View>
                  )
                })
              }
            </View> : null
          }
          {
            description && description.length && description.length > 4 && !this.state.showMoreRules ? <View className="appre-more" onClick={() => { this.setState({ showMoreRules: true }) }} >
              <Image className="appre-more-icon" src={"http://oss.tdianyi.com/front/GQr5D7QZwJczZ6RTwDapaYXj8nMbkenx.png"} />
              <View className="appre-more-text" >查看更多</View>
            </View> : null
          }
        </View>

        {
          this.state.recommend && this.state.recommend.length && this.state.recommend.length > 0 ?
            <View className="more_goods">
              <View className="title-box">
                <View className='title-left'></View>
                <View className="title">更多本店宝贝</View>
              </View>
              {
                this.state.recommend.length > 0 && !this.state.showAll ? <View className="good_info">
                  <View className="good_msg">
                    <Image className="good_img" src={this.state.recommend[0].image} />

                    <View className="good_detail">
                      <View className="good_detail_info">
                        <View className="good_title">
                          <View className="good_type">
                            <View className="text">{this.state.recommend[0].youhui_type == 0 ? "小熊敬礼" : "小熊敬礼"}</View>
                          </View>
                          <View className="good_cash">{this.state.recommend[0].yname}</View>
                        </View>
                        <View className="good_desc">
                          <View className="good_desc_info">购买后{this.state.recommend[0].expire_day}天内有效</View>
                        </View>
                      </View>
                      <View className="good_money">
                        <View className="good_new_money_icon">￥</View>
                        <View className="good_new_money">{this.state.recommend[0].pay_money}</View>
                        <View className="good_old_money">￥{this.state.recommend[0].return_money}</View>
                      </View>
                    </View>
                  </View>

                  <View className="good_btn" onClick={this.gotoTicketBuy.bind(this, this.state.recommend[0].youhui_type, this.state.recommend[0].id)}>
                    <View className="text">抢购</View>
                  </View>
                </View> : null
              }
              {
                this.state.recommend.length > 1 && !this.state.showAll ? <View className="good_info">
                  <View className="good_msg">
                    <Image className="good_img" src={this.state.recommend[1].image} />
                    <View className="good_detail">
                      <View className="good_detail_info">
                        <View className="good_title">
                          <View className="good_type">
                            <View className="text">{this.state.recommend[1].youhui_type == 0 ? "小熊敬礼" : "小熊敬礼"}</View>
                          </View>
                          <View className="good_cash">{this.state.recommend[1].yname}</View>
                        </View>
                        <View className="good_desc">
                          <View className="good_desc_info">购买后{this.state.recommend[1].expire_day}天内有效</View>
                        </View>
                      </View>
                      <View className="good_money">
                        <View className="good_new_money_icon">￥</View>
                        <View className="good_new_money">{this.state.recommend[1].pay_money}</View>
                        <View className="good_old_money">￥{this.state.recommend[1].return_money}</View>
                      </View>
                    </View>
                  </View>
                  <View className="good_btn" onClick={this.gotoTicketBuy.bind(this, this.state.recommend[1].youhui_type, this.state.recommend[1].id)}>
                    <View className="text">抢购</View>
                  </View>
                </View> : null
              }
              {
                this.state.showAll && this.state.recommend.map((item) => (
                  <View className="good_info">
                    <View className="good_msg">
                      <Image className="good_img" src={item.image} />

                      <View className="good_detail">
                        <View className="good_detail_info">
                          <View className="good_title">
                            <View className="good_type">
                              <View className="text">{item.youhui_type == 0 ? "小熊敬礼" : "小熊敬礼"}</View>
                            </View>
                            <View className="good_cash">{item.yname}</View>
                          </View>
                          <View className="good_desc">
                            <View className="good_desc_info">购买后{item.expire_day}天内有效</View>
                          </View>
                        </View>
                        <View className="good_money">
                          <View className="good_new_money_icon">￥</View>
                          <View className="good_new_money">{item.pay_money}</View>
                          <View className="good_old_money">￥{item.return_money}</View>
                        </View>
                      </View>
                    </View>

                    <View className="good_btn" onClick={this.gotoTicketBuy.bind(this, item.youhui_type, item.id)}>
                      <View className="text">抢购</View>
                    </View>
                  </View>
                ))
              }
              {
                this.state.recommend.length && this.state.recommend.length > 2 && !this.state.showAll ?
                  <View className="load_more" onClick={() => this.setState({ showAll: !this.state.showAll })}>
                    <View><AtIcon value='chevron-down' size="18" color='#999'></AtIcon>点击查看更多</View>
                  </View> : (this.state.recommend.length && this.state.recommend.length > 2 && !this.state.showAll ?
                    <View className="load_more" onClick={() => this.setState({ showAll: !this.state.showAll })}>
                      <View><AtIcon value='chevron-up' size="18" color='#999'></AtIcon>收起</View>
                    </View> : null
                  )
              }
            </View> : null
        }

        <View className="appre-buy-box" >
          <View className="appre-buy-price-box" >
            <View className="appre-buy-price-icon" >￥</View>
            <View className="appre-buy-price-num" >{this.state.coupon.pay_money}</View>
          </View>
          <View className="appre-buy-btn-box" >
            <View className="appre-buy-btn-left" onClick={() => {
              this.setState({ showShare: true })
            }}>分享活动</View>
            <View className="appre-buy-btn-right" onClick={this.goToPay.bind(this, this.state.coupon.id)}>立即购买</View>

          </View>
        </View>
        {
          this.state.showBounced ? <LandingBounced cancel={() => { this.setState({ showBounced: false }) }} confirm={() => {
            this.setState({ showBounced: false })
          }} /> : null
        }
        {
          this.state.isFromShare ? (
            <View style={{ position: 'fixed', bottom: '80px', right: '20px', zIndex: 88, width: '80px', height: '80px' }} onClick={this.handleGoHome.bind(this)}>
              <Image src={require('../../assets/go-home/go_home.png')} style={{ width: '80px', height: '80px' }} />
            </View>
          ) : ''
        }


        <Zoom
          src={this.state.imgZoomSrc}
          showBool={this.state.imgZoom}
          onChange={() => { this.setState({ imgZoom: !this.state.imgZoom }) }}
        />
      </View>
    );
  }
}
