import Taro, { Component } from "@tarojs/taro"
import { Block } from "@tarojs/components"
import Cookie from 'js-cookie';
import {
  getCouponDetail,
  getGiftinfo,
  getPaymentSignture,
  GetPaymentSignture
} from "@/api"
import {
  TYPE_APPRECIATION,
  FREE_POSTAGE,
  ACTION_CHECKED,
  ACTION_GET,
  ACTION_VIEW,
  TYPE_GROUP,
  TYPE_GROUP_OPEN
} from "@/utils/constants"
import DetailAppreciation from "./types/detail.appreciation"
import DetailGroup from "./types/detail.goup"
import { activityData } from "../../data"
import { payment } from "@/utils/payment"
import { getBrowserType } from '@/utils/common'

interface State {
  detail: any;
  giftBasicInfo: any;
  isChecked: boolean;
  isFreePostage: boolean;
  showButton: number;
}
export interface DetailProp {
  data: any;
  giftinfo: any;
  onAction: any;
  isChecked: boolean;
  isFreePostage: boolean;
  showButton: number;
}
export default class Detail extends Component<{ getPaymentSignature: Function; triggerPayment: Function }> {
  static defaultProps ={
    xx: 1
  }
  config = {
    navigationBarTitleText: "详情"
  }
  state: State = {
    detail: {},
    giftBasicInfo: null,
    isChecked: true,
    isFreePostage: false,
    showButton: 1,
  }

  componentDidMount() {
    const { type = 1, id = "", gift_id = "", activity_id = "" } = this.$router.params
    this.fetchDetail(type, id)
    this.fetchGiftinfo(gift_id, activity_id)
    sessionStorage.setItem('qilin','123')
    // Taro.showShareMenu()
  }

  onShareAppMessage() {
    const userInfo = Taro.getStorageSync("userInfo")

    const {list_brief, image  } = this.state.detail
    const { id = "1095",  activity_id, gift_id, type} = this.$router.params
    return {
      title: `${userInfo.nickName}邀请您参加『${list_brief}』`,
      path: `/pages/activity/pages/detail/detail?id=${id}&type=${type}&activity_id=${activity_id}&gift_id=${gift_id}`,
      imageUrl: image
    }
  }

  /**
   * 支付后的动作(, 跳转到"我参加的活动"页面)
   */
  handleAfterPayment(): void {
    Taro.navigateTo({
      url: "/activity-pages/my-activity/my.activity"
    })
  }

  /**
   * 用户动作处理
   */
  // @ts-ignore
  handleAction = (action: string, data: any): void => {
    switch(action) {
      case ACTION_CHECKED:
        const { isChecked } = this.state
        this.setState({
          isChecked: !isChecked
        })
        break
      case ACTION_GET:
        this.fetchPayment()
        break
      case ACTION_VIEW: {
        const { gift_id, activity_id } = this.state.giftBasicInfo
        Taro.navigateTo({
          url: `/detail-pages/gift/gift?gift_id=${gift_id}&activity_id=${activity_id}`
        })
        break
      }
      default:
        console.log("actoin?")
    }
  }

  /**
   * 请求支付(, 根据不同类型, 读取不同参数)
   * @type TYPE_APPRECIATION => 增值
   * @type TYPE_GROUP => 团购
   * @type TYPE_GROUP_OPEN => 开团
   */
  async fetchPayment(): Promise<void> {
    let as = getBrowserType();
    if (as == 'alipay') {
      alert('请前往微信进行购买')
      return
    }
    const { isChecked } = this.state
    const { type = 1, id = "", gift_id = "", activity_id = "", publictypeid } = this.$router.params
    let params: GetPaymentSignture = {
      url: "",
      xcx: 0,
      type,
      open_id: Cookie.get(process.env.OPEN_ID),
      unionid: Cookie.get(process.env.UNION_ID),
      ...(
        isChecked
          ? { gift_id, activity_id }
          : ""
      )
    }
    switch(+type) {
      case TYPE_APPRECIATION:
        params = {
          ...params,
          youhui_id: id,
          url: "v1/youhui/wxXcxuWechatPay"
        }
        break
      case TYPE_GROUP:
        params = {
          ...params,
          public_type_id: id,
          url: "payCentre/toWxPay",
          number: 1
        }
        break
      case TYPE_GROUP_OPEN:
        params = {
          ...params,
          public_type_id: publictypeid,
          url: "payCentre/toWxPay",
          number: 1
        }
        break
      default:
        console.log("no type~")
    }
    // const { data } = await getPaymentSignture(params).catch(err => {
    //   throw Error("--- 获取支付签名错误 ---")
    // })
    // await payment(data).catch(err => {
    //   throw Error("--- 支付调起出错 ---")
    // })
    const { data } = await getPaymentSignture(params)
    await payment(data)
    Taro.showToast({
      title: '购买成功',
      icon: 'none'
    })
    this.handleAfterPayment()
  }

  /**
   * 获取礼品信息
   * ps: 有免邮和非免邮两种
   */
  async fetchGiftinfo(gift_id: string, activity_id: string): Promise<void> {
    if (!gift_id || !activity_id) return
    if (+gift_id === 0) return
    const params = {
      activity_id,
      gift_id
    }
    const { data } = await getGiftinfo(JSON.stringify(params))
    const isFreePostage = data.mail_mode === FREE_POSTAGE
    this.setState({
      giftBasicInfo: data,
      // isChecked: isFreePostage,
      isFreePostage
    })
    // if (!gift_id || !activity_id) return
    // if (+gift_id === 0) return
    // const params = {
    //   activity_id,
    //   gift_id
    // }
    // Taro.request({
    //   url : 'https://test.api.tdianyi.com/api/wap/Integral/goodsDetail',
    //   method : 'POST',
    //   header : {
    //     "Content-Type" :"application/json"
    //   },
    //   data : JSON.stringify(params),
    // }).then(res => {
    // })
  }

  /**
   * 获取详情
   */
  async fetchDetail(type: number | string, id: string): Promise<void> {
    const asType = +type === TYPE_GROUP_OPEN
      ? TYPE_GROUP
      : type
    const {
      detail: { field, api }
    } = activityData[asType]
    const params = {
      [field]: id,
      // [field]: 3657,
      url: api
    }
    const { data } = await getCouponDetail(params)
    this.setState({
      detail: data,
      showButton: data.is_show_button,
    })
  }
  render() {
    const {
      detail: { type, ...rest },
      giftBasicInfo,
      isChecked,
      isFreePostage,
      showButton
    } = this.state
    const types = this.$router.params.type
    return (
      <Block>
        {
          types == 1
            ? <DetailAppreciation/>
            : types == 5 ?<DetailGroup
                data={rest}
                giftinfo={giftBasicInfo}
                onAction={this.handleAction}
                isChecked={isChecked}
                isFreePostage={isFreePostage}
                showButton={showButton}
              /> :  <DetailAppreciation/>
        }
      </Block>
    )
  }
}
