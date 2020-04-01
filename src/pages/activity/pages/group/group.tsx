import Taro, { Component } from "@tarojs/taro"
import {
  Block,
  View,
  Text,
  Image,
  ScrollView,
  Button,
} from "@tarojs/components"
import "./style.styl"
import {
  getCouponinforForGroup,
  getGiftinfo,
  getCouponForGroup,
  getQrcode,
  listenQrcodeForGroup
} from "@/api"
import { getLocation } from "@/utils/getInfo"
import { getTime } from '@/utils/common';
import { GROUP_AREADY, UNUSED, USED } from "../../data"
import { ACTION_JUMP, ACTION_USE, ACTION_VIEW, ACTION_CLOSE } from "@/utils/constants"
import Coupon from "@/components/coupon/coupon"
import Qrcode from "@/components/qrcode/qrcode"
import wx from 'weixin-js-sdk';
import dayjs from 'dayjs'

interface State {
  basicinfo: any;
  giftBasicInfo: any;
  list: any[];
  isFinish: boolean;
  isJoin: boolean;
  isShowUse: boolean;
  isQrcode: boolean;
  base64: string;
  isShare: boolean;
  isFromShare: boolean;
  isShowStartGroup: boolean;
  time: any;
  groupDesc: string
}
let timer2 = null
let timer = null;
const share_url = process.env.GROUP_URL
export default class Group extends Component {
  config = {
    navigationBarTitleText: "社区拼团"
  }
  state: State = {
    basicinfo: {},
    giftBasicInfo: {},
    list: [],
    isFinish: false,
    isJoin: false,
    isShowUse: false,
    isQrcode: false,
    base64: "",
    isShare: false,
    groupDesc: '',
    isFromShare: false,
    isShowStartGroup: false,
    time: {
      date: '',
      display: 2
    },

  }

  componentDidShow() {

  }

  async componentDidMount() {
    // Taro.showShareMenu()
    let arrs = Taro.getCurrentPages()
    if (arrs.length <= 1) {
      this.setState({
        isFromShare: true
      })
    }

    const { id = "" } = this.$router.params
    /**
     * 授权认证用
     */
    Taro.setStorageSync("authid", id)
    const location = await getLocation().catch(err => {
    })
    await this.fetchBasicinfo(id)
    this.fetchCoupon(location)
    this.setTime()
    this.share()
    let res = this.groupDesc()
    this.setState({ groupDesc: res })
  }

  // onShareAppMessage() {
  //   const { share: { title, small_img: imageUrl } } = this.state.basicinfo
  //   const { id = "" } = this.$router.params
  //   return {
  //     title,
  //     imageUrl,
  //     path: `/pages/activity/pages/group/group?id=${id}`
  //   }
  // }

  /**
   * 点击动作(如果是跳转动作的时候, 带上参数type, id, publictypeid)
   */
  handleClick = (e): void => {
    const { action, type } = e.currentTarget.dataset
    this.handleAction(action, null, type)
  }

  /**
   * 用户动作集中处理(跳转, 查看, 使用, 关闭动作)
   */
  // @ts-ignore
  handleAction = (action: string, data: any, type: string | number): void => {
    switch (action) {
      case ACTION_JUMP: {
        const {
          youhui_id: id,
          id: publictypeid,
          gift_id,
          activity_id
        } = this.state.basicinfo;
        let dataId = 0
        if (data && data.id) {
          dataId = data.id
        }
        Taro.navigateTo({
          // url: `/pages/activity/pages/detail/detail?id=${dataId || id}&type=${+type === 55 ? 55 : 5}&gift_id=${gift_id}&activity_id=${activity_id}&publictypeid=${dataId || publictypeid}`
          url: `/pages/activity/group/index?id=${dataId || id}&type=${type === '55' ? '55' : '5'}&gift_id=${gift_id}&activity_id=${activity_id}&publictypeid=${dataId || publictypeid}`
        })
        break
      }
      case ACTION_VIEW: {
        const { gift_id, activity_id } = this.state.basicinfo
        Taro.navigateTo({
          url: `/detail-pages/gift/gift?gift_id=${gift_id}&activity_id=${activity_id}`
        })
        break
      }
      case ACTION_USE:
        this.fetchQrcode()
        break
      case ACTION_CLOSE:
        this.setState({
          isQrcode: false
        })
        break
      default:
        console.log("no action~")
    }
  }

  /**
   * 计算: 已完成?|参团?|去使用?
   */
  handleCalculate(data: any): void {
    const {
      number: groupNumber,
      participation_number: groupParticipator,
      is_group_participation,
      is_employ
    } = data

    const isFinish = groupParticipator === groupNumber
    const isJoin = is_group_participation !== GROUP_AREADY
    const isShowUse = isFinish && (is_employ === UNUSED)
    // const isFinish = false
    // const isJoin = true
    // const isShowUse = false
    const isShowStartGroup = isFinish && !is_group_participation
    this.setState({
      isFinish,
      isJoin,
      isShowUse,
      isShowStartGroup
    })
  }

  /**
   * 监听二维码的使用(, 太屌了👀)
   */
  async fetchListenQrcode(): Promise<void> {
    const {
      basicinfo: { youhui_log_id }
    } = this.state
    const { data } = await listenQrcodeForGroup({ youhui_log_id })
    if (data.status === USED) {
      this.setState({
        isQrcode: false
      })
    }
    const timer = setTimeout(() => {
      const { isQrcode } = this.state
      clearTimeout(timer)
      isQrcode && this.fetchListenQrcode()
    }, 2000)
  }

  /**
   * 获取二维码(, "去使用"按钮)
   */
  async fetchQrcode(): Promise<void> {
    const { youhui_log_id } = this.state.basicinfo
    const { data, code } = await getQrcode({ youhui_log_id })
    if (code == 0) {
      Taro.showToast({ title: '卡券已核销使用' })
    } else {
      this.setState({
        isQrcode: true,
        base64: data
      })
      this.fetchListenQrcode()
    }

  }

  /**
   * 获取券列表
   */
  async fetchCoupon(userLocation): Promise<void> {
    const params = {
      xpoint: userLocation.longitude || "",
      ypoint: userLocation.latitude || ""
    }
    const { data } = await getCouponForGroup(params)
    this.setState({
      list: data
    })
  }

  /**
   * 获取礼品信息
   */
  async fetchGiftinfo(gift_id: string, activity_id: string): Promise<void> {
    if (!activity_id || !gift_id) return
    if (+gift_id === 0) return
    const params = {
      activity_id,
      gift_id
    }
    const { data } = await getGiftinfo(params)
    if (data) {
      this.setState({
        giftBasicInfo: data
      })
    }
  }

  /**
   * 获取基本信息
   */
  async fetchBasicinfo(id: string): Promise<void> {
    const params = {
      group_id: id
    }
    const { data } = await getCouponinforForGroup(params)
    const { gift_id = "", activity_id = "" } = data
    this.fetchGiftinfo(gift_id, activity_id)
    this.handleCalculate(data)
    this.setState({
      basicinfo: data
    }, () => { this.share(); })
  }


  share = () => {
    const { id = "" } = this.$router.params
    let info = this.state.basicinfo.share;
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
        wx.updateAppMessageShareData({
          title: this.state.basicinfo.gift_id ? this.state.basicinfo.participation_money + '元拼团！100%有奖，你还在等什么！' : '就差你啦！我在抢' + this.state.basicinfo.participation_money + '元套餐，快跟我一起拼吧！',
          desc: this.state.basicinfo.gift_id ? '【仅剩' + (this.state.basicinfo.number - this.state.basicinfo.participation_number) + '个名额】我' + this.state.basicinfo.participation_money + '元拼了' + this.state.basicinfo.pay_money + '元超值套餐，还有惊喜礼品，等你来跟我一起拼！' : '买了不后悔！我' + this.state.basicinfo.participation_money + '元拼了' + this.state.basicinfo.pay_money + '元超值套餐，快来跟我一起完成拼团吧。', // 分享描述
          link: share_url + id, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: 'http://wx.qlogo.cn/mmhead/Q3auHgzwzM6UL4r7LnqyAVDKia7l4GlOnibryHQUJXiakS1MhZLicicMWicg/0', // 分享图标
        })
      })
    })

  }
  clickShare = () => {
    this.setState({ isShare: true })
  }
  closeShare = () => {
    this.setState({ isShare: false });
  }

  /**
   * 回首页
   */
  handleGoHome = () => {
    console.log(333)
    Taro.navigateTo({ url: '/pages/index/index' })
    // Taro.reLaunch({ url: '/pages/index/index' })
  }
  /**
  * 定时
  */
  setTime = () => {
    let times = dayjs(this.state.basicinfo.end_at).unix()
    if (this.state.time.display <= 0) {
      clearTimeout(timer2)
      return
    } else {
      timer2 = setTimeout(() => {
        clearTimeout(timer)
        let time = getTime(times)
        this.setState({
          time
        })
        this.setTime()
      }, 1000)
    }
  }
  toMoreGroup = () => {
    Taro.navigateTo({
      url: '/pages/activity/pages/list/list?type=5'
    })
  }
  componentWillUnmount() {
    clearTimeout(timer)
    clearTimeout(timer2)
  }

  groupDesc = () => {
    if (this.state.time.display > 0) {
      // 活动未结束
      if (this.state.isFinish) {
        // 活动完成
        return "拼团已经完成, 感谢您的参与!"
      } else {
        // 活动未完成
        if (this.state.basicinfo.is_group_participation) {
          // 参与
          const surplus = this.state.basicinfo.number
            ? this.state.basicinfo.number - this.state.basicinfo.participation_number
            : 0
          return `还差${surplus}人成团`
        } else {
          // 未参与
          const surplus = this.state.basicinfo.number
            ? this.state.basicinfo.number - this.state.basicinfo.participation_number
            : 0
          return `仅剩${surplus}个名额`
        }
      }
    } else {
      // 活动结束
      if (this.state.isFinish) {
        // 活动完成
        return "拼团已经完成, 感谢您的参与!"
      } else {
        // 活动未完成
        if (this.state.basicinfo.is_group_participation) {
          return '拼团失败，金额已返还至账户'
        } else {
          return '本拼团已结束，可前往查看更多拼团活动'
        }
      }
    }
  }

  render() {
    const {
      basicinfo,
      giftBasicInfo,
      list,
      isFinish,
      isShowUse,
      isJoin,
      isQrcode,
      base64,
      isShare,
      isShowStartGroup,
      groupDesc
    } = this.state
    const surplus = basicinfo.number
      ? basicinfo.number - basicinfo.participation_number
      : 0
    // const groupDesc = this.state.time.display > 0 ? isFinish
    //   ? "拼团已经完成, 感谢您的参与!"
    //   : `还差${surplus}人成团` : this.state.basicinfo.is_group_participation ? '拼团失败，金额已返还至账户' : '本拼团已结束，可前往查看更多拼团活动'
    // const groupDesc = this.state.time.display > 0 ? isFinish ? "拼团已经完成, 感谢您的参与!" : `还差${surplus}人成团`  : '本拼团已结束，可前往查看更多拼团活动'
    return (
      <Block>
        <View className="group" style="background-image: url(http://tmwl-resources.tdianyi.com/miniProgram/MiMaQuan/img_group.png)">
          <View className="container">
            <View className="area-title">社区拼团</View>
            <View className="area-panel">
              <View className="coupon-info">
                <View className="avatar">
                  <Image className="icon" src={basicinfo.image} />
                </View>
                <View className="description">
                  <View className="item name">{basicinfo.name}</View>
                  <View className="item brief">
                    {basicinfo.list_brief || "暂无"}
                  </View>
                  <View className="item remark">
                    <View className="classify">
                      {`${basicinfo.number}人团`}
                    </View>
                    <View className="price">
                      {`${basicinfo.participation_money}元`}
                    </View>
                    <View className="price-old">
                      {`原价${basicinfo.pay_money}元`}
                    </View>
                  </View>
                </View>
              </View>
              {!isFinish ? <View className="time">
                <Text className="text">距离结束时间还剩:</Text>
                <Text>{this.state.time.date}</Text>
              </View> : null}
              <ScrollView
                scrollX
                style="margin-top: 25px; height: 50px; white-space: nowrap;"
              >
                <View className="participator-wrapper">
                  {
                    basicinfo.rsParticipate ? basicinfo.rsParticipate.map((item, index) => {
                      return (
                        <View className="item" key={index}>
                          <Image className="icon" src={item.user_portrait} />
                        </View>
                      )
                    }) : null
                  }
                </View>
              </ScrollView>
              <View className="group-tips">{groupDesc}</View>
              {
                this.state.time.display > 0 ? (
                  <View>
                    {
                      isShowStartGroup ? (<View className='actions'>
                        <Button
                          className="item join"
                          data-action="jump"
                          data-publictypeid={basicinfo.id}
                          data-id={basicinfo.youhui_id}
                          data-type="5"
                          onClick={this.handleClick}
                        >
                          我也要发起拼团
                    </Button>
                      </View>) : (
                          <View className="actions">
                            {
                              isJoin && (
                                <Button
                                  className="item join"
                                  data-action="jump"
                                  data-publictypeid={basicinfo.id}
                                  data-id={basicinfo.youhui_id}
                                  data-type="55"
                                  onClick={this.handleClick}
                                >
                                  参加拼团
                                </Button>
                              )
                            }
                            {
                              isShowUse && (
                                <Button
                                  className="item used"
                                  data-action="use"
                                  onClick={this.handleClick}
                                >
                                  去使用
                                </Button>
                              )
                            }
                            {
                              // 未完成就表示可以参团
                              !isFinish && (
                                <Button
                                  className="item invite"
                                  openType="share"
                                  onClick={this.clickShare}
                                >
                                  邀请好友参团
                                </Button>
                              )
                            }
                          </View>
                        )
                    }
                  </View>
                ) : isShowUse && this.state.basicinfo.is_group_participation ? (
                  (
                    <View className="actions">
                      <Button
                        className="item used"
                        data-action="use"
                        onClick={this.handleClick}
                      >
                        去使用
                  </Button>
                    </View>
                  )
                ) : (
                      <View className='actions'>
                        <Button
                          className="item used"
                          onClick={this.toMoreGroup}
                        >
                          查看更多拼团送礼
                    </Button>
                      </View>
                    )
              }
            </View>

            {
              giftBasicInfo.gift_title &&
              (
                <View className="gift-wrapper">
                  <View
                    className="area-gift"
                    data-action="view"
                    onClick={this.handleClick.bind(this)}
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
                </View>
              )
            }
            <View className="area-coupon">
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
          {isQrcode && <Qrcode data={base64} onAction={this.handleClick.bind(this)} />}
        </View>
        {/* 分享 */}
        {
          isShare == true ? (
            <View className='share_mask' onClick={this.closeShare}>
              <View className='share_box'>
                <View className='share_text text_top'>
                  点击分享给好友
                </View>
                {/* <View className='share_text'>
                  一起拼团领礼品吧
                </View> */}
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
