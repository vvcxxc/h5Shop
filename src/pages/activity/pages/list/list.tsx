import Taro, { Component } from "@tarojs/taro"
import { Block, View } from '@tarojs/components'
import Coupon from "@/components/coupon/coupon"
import { getCouponList } from "@/api"
import { activityData } from "../../data"
import { TYPE_APPRECIATION, TYPE_GROUP, ACTION_JUMP } from "@/utils/constants"
import Cookie from 'js-cookie';
import NoData from "@/components/nodata/no.data"
// import { getLocation } from "@/utils/getInfo"
import { getLocation } from '@/utils/getInfo'
import "./style.styl"

export default class List extends Component {
  config = {
    navigationBarTitleText: "活动列表"
  }
  state: { list: any } = {
    list: []
  }
  componentDidMount() {
    console.log( Cookie.get('tempLocation'))
    // Taro.showShareMenu()
    const { type } = this.$router.params
    console.log(type);
    this.handleSetTitle(type)
    this.fetchCoupon(type);
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
    switch (action) {
      case ACTION_JUMP:
        const {
          type,
          id,
          gift_id,
          activity_id
        } = data
        if (type == 1) {
          Taro.navigateTo({
            url: '/pages/activity/appreciation/index?id=' + id + '&type=1&gift_id=' + gift_id + '&activity_id=' + activity_id
            // url: `/pages/activity/pages/detail/detail?id=${id}&type=${type}&activity_id=${activity_id}&gift_id=${gift_id}`
          })
        } else {
          Taro.navigateTo({
            url: `/pages/activity/pages/detail/detail?id=${id}&type=${type}&activity_id=${activity_id}&gift_id=${gift_id}`
          })
        }
        break
      default:
        console.log("no action~")
    }
  }

  /**
   * 获取优惠券
   */
  fetchCoupon = async (type: number) => {
    // const location = await getLocation()
    getLocation().then((res: any) => {
      const locationParams = {
          xpoint: res.longitude || "",
          ypoint: res.latitude || ""
        }
        console.log(res,'麒麟');
        
    })
    // const locationParams = {
    //   xpoint: location.longitude || "",
    //   ypoint: location.latitude || ""
    // }

    console.log(location, "~~~~~~~~~~~~~~~~~")
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
