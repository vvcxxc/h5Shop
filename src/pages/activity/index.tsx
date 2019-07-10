import Taro, { Component, Config } from "@tarojs/taro"
import {
  Block,
  View,
  Swiper,
  SwiperItem,
  Navigator,
  Image,
} from "@tarojs/components"
import { getActivityCenter } from "@/api"
import { activitys } from "./data"
import carousel from "@/static/images/img_carousel.png"
import "./activity.styl"
import Coupon from "@/components/coupon/coupon"
import { ACTION_JUMP } from "@/utils/constants"
import { getLocation } from "@/utils/getInfo"

// import { connect } from "@tarojs/redux"

interface State {
  banner?: any[];
  recommend: any[];
  seckill?: any[];
  menu: number;
}
interface ActivityProps {
  handleChange: any;
}
// const mapStateToProps = (state, ownProps) => {
//   return {
//     isTest: state.test === ownProps.test
//   }
// }
// const mapDispatchToProps = (dispatch, ownProps) => {
//   return {
//     handleChange() {
//       dispatch({
//         type: "CHANGE"
//       })
//     }
//   }
// }
// @connect(mapStateToProps, mapDispatchToProps)
export default class Activity extends Component<ActivityProps> {
  state: State = {
    recommend: [],
    menu: 0,
  }
  config: Config = {
    navigationBarTitleText: "活动中心"
  }

  componentDidMount() {
    Taro.showShareMenu()
    this.fetchActivityCenter()
  }

  /**
   * 用户动作
   */
  handleAction(action: string, data: any) {
    switch(action) {
      case ACTION_JUMP:
        const { type, id, gift_id, activity_id } = data
        Taro.navigateTo({
          url: `/pages/activity/pages/detail/detail?id=${id}&type=${type}&activity_id=${activity_id}&gift_id=${gift_id}`
        })
        break
      default:
        console.log("no action~")
    }
  }

  /**
   * 获取活动中心数据
   */
  async fetchActivityCenter(): Promise<void> {
    const location = await getLocation()

    const params = {
      xpoint: location.longitude || "",
      ypoint: location.latitude || ""
    }
    const {
      data: {
        recommend: { data },
        menu,
      }
    } = await getActivityCenter(params).catch(err => {
      console.log(err)
      throw Error("--- 获取活动中心数据错误 ---")
    })
    this.setState({
      recommend: data,
      menu,
    })
  }

  goTo = (url) => {
    if (url) {
      Taro.navigateTo({ url })
    } else {
      if (this.state.menu === 1) {
        Taro.navigateTo({ url: '/pages/activity/pages/list/list?type=5' })
      }
    }
  }

  render() {
    const { recommend } = this.state;
    return (
      <Block>
        <View className="activity">
          <Swiper className="area-banner" indicatorDots={false}>
            <SwiperItem>
              <Navigator url="">
                <Image background-size="cover" src={carousel} className="image" />
              </Navigator>
            </SwiperItem>
          </Swiper>
          <View className="area-activity-list">
            <View className="weui-grids" style="border: 0 none;">
              {
                activitys.map((item, index) => {
                  return (
                    <Block key={index}>
                      <View
                        onClick={this.goTo.bind(this, item.path)}
                        className="weui-grid"
                        // hoverClass="weui-grid_active"
                        style="border: 0 none; width: 25%;"
                      >
                        <Image className="weui-grid__icon" src={item.src} />
                        <View className="weui-grid__label">{item.text}</View>
                      </View>
                    </Block>
                  )
                })
              }
            </View>
          </View>
          <View className="area-recommend">
            <View className="title">推荐活动</View>
            <View className="container">
              {
                recommend.map((item, index) => {
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
      </Block>
    )
  }
}
