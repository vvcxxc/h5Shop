import Taro, { Component } from "@tarojs/taro"
import { View, Image, Block, Button, ScrollView } from "@tarojs/components"
import "./style.appreciation.styl"
import {
  getAppreciationinfo,
  getGiftinfo,
  getCoupon,
  getParticipator,
  getAppreciation
} from "@/api"
import Coupon from "@/components/coupon/coupon"
import NoData from "@/components/nodata/no.data"
import { getLocation } from "@/utils/getInfo"
import {
  APPRECIATE_NOT,
  APPRECIATE_ALREADY,
  COUPON_SELF,
  COUPON_OTHER,
  NOT_GET
} from "../../data"
import { ACTION_APPRECIATION, ACTION_JUMP, ACTION_VIEW } from "@/utils/constants"
import AppreCoupon from '@/components/appreCoupon'
import wx from 'weixin-js-sdk';

type State = {
  isRule: boolean;
  list: any[];
  rules: string[];
  basicinfo: any;
  shareinfo: any;
  userStatusinfo: any;
  giftBasicInfo: any;
  participators: any[];
  appreciationProcess: string;
  isAppreciation: boolean;
  isInvite: boolean;
  isGet: boolean;
  isShare: boolean;
  isFromShare: boolean;
};
const share_url = process.env.APPRE_URL
export default class Appreciation extends Component {
  config = {
    navigationBarTitleText: "增值"
  }
  state: State = {
    appreciationProcess: "0%",
    isRule: false,
    list: [],
    rules: [],
    participators: [],
    basicinfo: {},
    shareinfo: {},
    userStatusinfo: {
    },
    giftBasicInfo: {
      cover_image: '',
    },
    isInvite: false,
    isAppreciation: false,
    isGet: false,
    isShare: false,

    isFromShare: false
  }
  componentDidShow() {

  }
  async componentWillMount() {
    let arrs = Taro.getCurrentPages()
    if (arrs.length <= 1) {
      this.setState({
        isFromShare: true
      })
    }
    // Taro.showShareMenu()
    const { id = "1095" } = this.$router.params
    /**
     * 授权认证用
     */
    Taro.setStorageSync("authid", id)
    const location = await getLocation().catch(err => {
      console.log(err)
    })

    /**
     * 这里留一个暂停来做授权处理！
     */
    await this.fetchBasicinfo(id)
    this.fetchParticipator(id)
    this.fetchCoupon(location)
    this.share()
  }

  onShareAppMessage() {
    const { getTextContent: { title, small_img: imageUrl } } = this.state.basicinfo
    const { id = "1095" } = this.$router.params
    return {
      title,
      path: `/pages/activity/pages/appreciation/appreciation?id=${id}`,
      imageUrl
    }
  }

  /**
   * 计算: |我也想要?|点击增值?|邀请好友?
   */
  handleCalculate(couponinfo: any, userCouponStatus: any) {
    const {
      init_money: moneyInit,
      appreciation_money: moneyAppreciation,
      money: moneyMax
    } = couponinfo
    const {
      is_get: statusGet,
      isself: statusCoupon,
      status: statusAppreciation
    } = userCouponStatus
    const isGet = (+statusGet === NOT_GET) && (+statusCoupon === COUPON_OTHER)
    const isAppreciation = (+moneyMax !== +moneyInit + +moneyAppreciation) && (+statusAppreciation === APPRECIATE_NOT)
    const isInvite = (+statusAppreciation === APPRECIATE_ALREADY) && (+statusCoupon === COUPON_SELF)
    this.setState({
      isGet,
      isAppreciation,
      isInvite
    })
  }

  /**
   * 点击动作
   */
  handleClick = (e) => {
    const { action } = e.currentTarget.dataset
    switch (action) {
      case ACTION_JUMP: {
        const { id, gift_id, activity_id } = this.state.basicinfo.userYonhuiInfo
        this.handleAction(action, {
          id,
          gift_id,
          activity_id
        })
        break
      }
      case ACTION_VIEW:
        const { gift_id, activity_id } = this.state.basicinfo.userYonhuiInfo
        Taro.navigateTo({
          url: `/detail-pages/gift/gift?gift_id=${gift_id}&activity_id=${activity_id}`
        })
        break
      case ACTION_APPRECIATION:
      default:
        this.handleAction(action, null)
    }
  }

  /**
   * 用户动作集中处理
   */
  handleAction = (action: string, data: any) => {
    switch (action) {
      case ACTION_APPRECIATION:
        this.fetchAppreciation()
        break
      case ACTION_JUMP: {
        const { id, gift_id, activity_id } = data
        Taro.navigateTo({
          url: '/pages/activity/appreciation/index?id=' + id + '&type=1&gift_id=' + gift_id + '&activity_id=' + activity_id
        })
        break
      }
      default:
        console.log("on action~")
    }
  }

  /**
   * 计算增值进度: 初始金额|已增长金额|金额最大值
   */
  handleCalculateProcess(moneyInit: string, moneyAppreciating: string, moneyMax: string): void {
    const appreciationProcess = `${(+moneyInit + +moneyAppreciating) / +moneyMax * 100}%`
    this.setState({
      appreciationProcess
    })
  }

  /**
   * 点击增值
   */
  async fetchAppreciation() {
    const { id = "" } = this.$router.params
    const params = {
      youhui_log_id: id
    }
    await getAppreciation(params)
    this.fetchBasicinfo(id)
    this.fetchParticipator(id)
  }

  /**
   * 获取增值用户
   */
  async fetchParticipator(id: string): Promise<void> {
    const params = {
      youhui_log_id: id
    }
    const { data } = await getParticipator(params)
    this.setState({
      participators: data
    })
  }

  /**
   * 获取优惠券
   */
  async fetchCoupon(userLocation): Promise<void> {
    const params = {
      xpoint: userLocation.longitude || "",
      ypoint: userLocation.latitude || ""
    }
    const {
      data: {
        youhui: { data }
      }
    } = await getCoupon(params)
    this.setState({
      list: data
    })
  }

  /**
   * 获取礼品信息
   */
  async fetchGiftinfo(gift_id: string, activity_id: string): Promise<void> {
    if (!activity_id || !gift_id) return
    const params = {
      activity_id,
      gift_id
    }
    const { data } = await getGiftinfo(params)
    this.setState({
      giftBasicInfo: data
    })
  }

  /**
   * 获取券基本信息
   */
  async fetchBasicinfo(id: string): Promise<void> {
    const params = {
      youhui_log_id: id,
    }
    const { data } = await getAppreciationinfo(params)
    const { userYonhuiInfo: couponinfo, buttonstatus: userCouponStatus } = data
    this.fetchGiftinfo(couponinfo.gift_id, couponinfo.activity_id)
    this.handleCalculateProcess(couponinfo.init_money, couponinfo.appreciation_money, couponinfo.money)
    this.handleCalculate(couponinfo, userCouponStatus)
    this.setState({
      basicinfo: data
    }, () => { this.share(); })
  }
  share = () => {
    const { id = "" } = this.$router.params
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
    }).then(res => {
      let { data } = res;
      wx.config({
        debug: false,
        appId: data.appId,
        timestamp: data.timestamp,
        nonceStr: data.nonceStr,
        signature: data.signature,
        jsApiList: [
          'updateAppMessageShareData'
        ]
      });
      wx.ready(() => {
        let shareInfo = this.state.basicinfo.getTextContent
        let router = JSON.parse(sessionStorage.getItem('router')) || {}
        let link = share_url + id
        if(router.city_id){
          link =share_url + id + '&c_id=' + router.city_id
        }
        wx.updateAppMessageShareData({
          title: this.state.basicinfo.userYonhuiInfo.gift_id ? '我在抢' + this.state.basicinfo.userYonhuiInfo.money + '增值券，快帮我点一下！' : '我正在抢' + this.state.basicinfo.userYonhuiInfo.money + '增值券，就差你的助力了，点一下就好！',
          desc: this.state.basicinfo.userYonhuiInfo.gift_id ? '我在参加' + this.state.basicinfo.userYonhuiInfo.name + '活动，快来帮我助力一下，买券还送惊喜礼品哦！' : '我在参加' + this.state.basicinfo.userYonhuiInfo.store_name + '增值券抢购活动，就差你的帮忙了，快来帮我增值一下，拜托拜托！', // 分享描述
          link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: 'http://wx.qlogo.cn/mmhead/Q3auHgzwzM6UL4r7LnqyAVDKia7l4GlOnibryHQUJXiakS1MhZLicicMWicg/0', // 分享图标
        })
      })
    })



  }
  closeShare = () => {
    this.setState({ isShare: false });
  }

  /**
   * 回首页
   */
  handleGoHome = () => {
    Taro.switchTab({
      url: '/pages/index/index',
      success: () => {
        location.href = location.href
      }
    })
  }

  render() {
    const {
      giftBasicInfo,
      list,
      participators,
      appreciationProcess,
      isAppreciation,
      isInvite,
      isGet,
      isShare
    } = this.state
    const {
      userdata: userinfo,
      userYonhuiInfo: couponinfo,
      dateTime,
      buttonstatus
    } = this.state.basicinfo
    const { gift_id, cover_image } = this.state.giftBasicInfo
    console.log(this.state.giftBasicInfo)
    let coupon_info = couponinfo ? {
      money: couponinfo.money || '',
      limit_money: couponinfo.total_fee,
      gift_image: this.state.giftBasicInfo ? this.state.giftBasicInfo.cover_image : '',
      youhui_type: couponinfo.youhui_type
    } : {}
    return (
      <Block>
        <View className="appreciation" style={`background-image: url(http://tmwl-resources.tdianyi.com/miniProgram/MiMaQuan/img_appreciation.png)`}>
          <View className="container">
            {
              buttonstatus ? buttonstatus.isself == 1 ? (
                <View className="area-title">邀请好友增值</View>
              ) : (
                  <View className="area-title">帮{userinfo.user_name}增值</View>
                ) : null
            }

            <View className="area-panel">
              <View className="user-info">
                <Image className="icon" src={require('../../../../assets/shop.png')} />
                <View className="text" style={{ fontWeight: 600 }}>{couponinfo ? couponinfo.store_name : ''}</View>
              </View>
              {/* 增值券 */}
              {
                couponinfo ? couponinfo.youhui_type == 1 ? (
                  <View>
                    <AppreCoupon data={coupon_info} />
                    <View className='coupon_name'>{couponinfo.name}</View>
                    <View>活动时间：{dateTime.activity_begin_time}-{dateTime.activity_end_time}</View>
                  </View>
                ) : couponinfo.youhui_type == 0 ? (
                  <View>
                    {
                      gift_id ? (
                        <View>
                          <View style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <View>
                              <Image src={couponinfo.image} className='coupon_image' />
                            </View>
                            <View className='gift_image'>
                              <Image src={cover_image} className='coupon_image' style={{ position: 'absolute', top: 0, left: 0 }} />
                              <Image src={require('../../../business/border.png')} className='border_image' />
                              <Image src={require('../../../business/qiu.png')} className='qiu_image' />
                            </View>
                          </View>
                          <View className='coupon_name'>{couponinfo.name}</View>
                          <View>活动时间：{dateTime.activity_begin_time}-{dateTime.activity_end_time}</View>
                        </View>

                      ) : (
                          <View style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <View>
                              <Image src={couponinfo.image} className='coupon_image' />
                            </View>
                            <View className='coupon_infos'>
                              <View className='coupon_name'>{couponinfo.name}</View>
                              <View>活动时间：{dateTime.activity_begin_time}-{dateTime.activity_end_time}</View>
                            </View>
                          </View>
                        )
                    }
                  </View>
                ) : null : null
              }

              <View className="process">
                <View className="process-in" style={`width: ${appreciationProcess}`}>
                  <Image className="icon" src={require("../../../../static/images/ic_process_bar.png")} />
                </View>
              </View>
              <View className="status">
                <View className="text appreciation-init">起始{couponinfo ? couponinfo.init_money : null}元</View>
                <View className="text appreciating">已增值{couponinfo ? couponinfo.appreciation_money : null}元</View>
                <View className="text appreciation-max">最高{couponinfo ? couponinfo.money : null}元</View>
              </View>
            </View>
            <View className="area-action">
              {
                isAppreciation
                  ? <Button
                    className="item action-appreaciation"
                    data-action="appreciation"
                    onClick={this.handleClick}
                  >
                    点击增值
                  </Button>
                  : <Button className="item action-appreaciation">
                    已经增值
                  </Button>
              }
              {
                isGet && (
                  <Button
                    className="item action-buy"
                    data-action="jump"
                    onClick={this.handleClick}
                  >
                    我也想要
                  </Button>
                )
              }
              {
                isInvite && (
                  <Button
                    className="item action-invite"
                    onClick={
                      () => {
                        this.setState({ isShare: true })
                        this.share();
                      }
                    }
                  >
                    邀请好友增值
                  </Button>
                )
              }
            </View>
            {
              giftBasicInfo.gift_title &&
              (
                <View
                  className="area-gift"
                  data-action="view"
                  onClick={this.handleClick}
                >
                  <View
                    className="title"
                    style={`background-image: url(http://tmwl-resources.tdianyi.com/miniProgram/MiMaQuan/img_sharp.png)`}
                  >
                    赠送礼物
                  </View>
                  <View className="split" />
                  <View className="tips">点击查看</View>
                  <View className="content">
                    <Image className="icon" src={giftBasicInfo.cover_image} />
                    <View className="description">
                      <View className="name">{giftBasicInfo.gift_title}</View>
                      <View className="brief">{giftBasicInfo.title}</View>
                      <View className="price">￥{giftBasicInfo.postage}</View>
                    </View>
                  </View>
                </View>
              )
            }
            <View className="area-participator">
              <View
                className="title"
                style={`background-image: url(http://tmwl-resources.tdianyi.com/miniProgram/MiMaQuan/img_sharp.png)`}
              >
                增值帮
              </View>
              <View className="split" />
              <ScrollView scrollY style="height: 100px;">
                <View className="participator-wrapper">
                  {!participators.length && <NoData />}
                  {
                    participators.map((item, index) => {
                      return (
                        <View className="item" key={index}>
                          <View className="avatar">
                            <Image className="icon" src={item.user_portrait} />
                            <View className="text">{item.user_name}</View>
                          </View>
                          <View className="result">
                            {`涨了${item.money}元`}
                          </View>
                        </View>
                      )
                    })
                  }
                </View>
              </ScrollView>
            </View>
            <View className="area-coupon">
              {!list.length && <NoData />}
              {
                list.map((item, index) => {
                  return (
                    <Coupon
                      key={index}
                      data={item}
                      onAction={this.handleAction}
                    />
                  )
                })
              }
            </View>
          </View>
        </View>
        {/* 分享 */}
        {
          isShare == true ? (
            <View className='share_mask' onClick={this.closeShare}>
              <View className='share_box'>
                <View className='share_text text_top'>
                  点击分享给好友
                </View>
                <View className='share_text'>
                  一起增值领礼品吧
                </View>
                <Image src={require('../../../../assets/share_arro.png')} className='share_img' />
              </View>
            </View>
          ) : null
        }
        {/* 去首页 */}
        {
          this.state.isFromShare ? (
            <View style={{ position: 'fixed', bottom: '80px', right: '20px', zIndex: 88, width: '80px', height: '80px' }} onClick={this.handleGoHome.bind(this)}>
              <Image src={require('../../../../assets/go-home/go_home.png')} style={{ width: '80px', height: '80px' }} />
            </View>
          ) : ''
        }
      </Block>
    )
  }
}
