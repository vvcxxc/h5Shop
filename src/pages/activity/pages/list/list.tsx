import Taro, { Component } from "@tarojs/taro"
import { Block, View } from '@tarojs/components'
import Coupon from "@/components/coupon/coupon"
import { getCouponList } from "@/api"
import { activityData } from "../../data"
import { TYPE_APPRECIATION, TYPE_GROUP, ACTION_JUMP } from "@/utils/constants"
import NoData from "@/components/nodata/no.data"
import { getLocation } from "@/utils/getInfo"
import "./style.styl"

export default class List extends Component {
  config = {
    navigationBarTitleText: "活动列表"
  }
  state: { list: any } = {
    list: []
  }
  componentDidMount() {
    Taro.showShareMenu()

    const { type } = this.$router.params
    this.handleSetTitle(type)
    this.fetchCoupon(type)
  }

  /**
   * 设置标题
   */
  handleSetTitle(type: any): void {
    let title = ""
    if (+type === TYPE_APPRECIATION) {
      title = "增值活动列表"
    } else if (+type === TYPE_GROUP) {
      title = "团购活动列表"
    }
    Taro.setNavigationBarTitle({
      title
    })
  }

  /**
   * 用户动作
   */
  handleAction(action: string, data: any) {
    switch(action) {
      case ACTION_JUMP:
        const {
          type,
          id,
          gift_id,
          activity_id
        } = data
        Taro.navigateTo({
          url: `/pages/activity/pages/detail/detail?id=${id}&type=${type}&activity_id=${activity_id}&gift_id=${gift_id}`
        })
        break
      default:
        console.log("no action~")
    }
  }

  /**
   * 获取优惠券
   */
  async fetchCoupon(type: number) {
    const location = await getLocation()

    const locationParams = {
      xpoint: location.longitude || "",
      ypoint: location.latitude || ""
    }

    const {
      list: { api, method }
    } = activityData[type]
    const params = {
      url: api,
      method,
      xpoint: locationParams.xpoint,
      ypoint: locationParams.ypoint,
    }
    const { data } = await getCouponList(params)
    let list = []
    if (+type === TYPE_APPRECIATION) {
      list = data.youhui.data
    } else if (+type === TYPE_GROUP) {
      list = data
    }
    this.setState({
      list
    })
  }
  render() {
    const { list } = this.state
    return (
      <Block>
        <View className="list">
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
      </Block>
    )
  }
}
