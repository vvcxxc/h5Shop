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
import { getLocation } from '@/utils/getInfo'
import request from '../../services/request'

interface State {
  banner?: any[];
  recommend: any[];
  seckill?: any[];
  menu: number;
  cityId: number | string;
  need_jump: number;
  indexImgId: number;
  adLogId: number;
  indexImg:string
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
    cityId: 1942,
    need_jump: 0,
    indexImgId: 0,
    adLogId: 0,
    indexImg:''
  }
  config: Config = {
    navigationBarTitleText: "活动中心"
  }

  componentWillMount() {
    let data:any = JSON.parse(sessionStorage.getItem('router'))
    this.setState({
      city: data.city_id
    }, () => {
        this.getAdvertising()
    })

  }
  componentDidMount() {
    // Taro.showShareMenu()
    this.fetchActivityCenter()
    // console.log(JSON.parse(sessionStorage.getItem('router'));

  }

  // get 广告
  getAdvertising = () => {
    request({
      url: "v3/ads",
      method: 'GET',
      data: {
        position_id:2, //位置id
        city_id:this.state.cityId
      }
    })
      .then((res: any) => {
        // console.log(res,'res');
        if (res.code == 200) {
          this.setState({ indexImg: res.data.pic })
          this.setState({ indexImgId: res.data.id })
          this.setState({ adLogId: res.data.adLogId })
          this.setState({ need_jump: res.data.need_jump })
        }

      })

  }


  // 点击广告
  advertOnclick = () => {
    if (!this.state.need_jump) return
    let store_id = this.$router.params.store_id || sessionStorage.getItem('storeId')
    let data = {}
    if (store_id) {
      data = {
        ad_id: this.state.indexImgId, //广告id
        ad_log_id: this.state.adLogId, //广告日志id
        store_id
      }
    } else {
      data = {
        ad_id: this.state.indexImgId, //广告id
        ad_log_id: this.state.adLogId //广告日志id
      }
    }
    request({
      url: 'v3/ads/onclick',
      data
    })
      .then((res: any) => {
        let define: any = {
          [1]: '/pages/business/index?id=' + res.data.store_id,//店铺
          [2]: '/business-pages/ticket-buy/index?id=' + res.data.coupon_id,//现金券
          [3]: '/business-pages/set-meal/index?id=' + res.data.coupon_id,//兑换券
          [4]: '/pages/activity/pages/detail/detail?id=' + res.data.activity_id + '&type=1',//拼团
          [5]: '/pages/activity/pages/detail/detail?id=' + res.data.activity_id + '&type=5'//增值
        }
        Taro.navigateTo({
          url: define[res.data.popularize_type]
        })
      })
  }
  /**
   * 用户动作
   */
  handleAction(action: string, data: any) {
    switch (action) {
      case ACTION_JUMP:
        const { type, id, gift_id, activity_id } = data
        if (type == 1) {
          Taro.navigateTo({
            url: '/pages/activity/appreciation/index?id=' + id + '&type='+type+'&gift_id=' + gift_id + '&activity_id=' + activity_id
            //  url: `/pages/activity/pages/detail/detail?id=${id}&type=${type}&activity_id=${activity_id}&gift_id=${gift_id}`
          })
        } else {
          Taro.navigateTo({
            url: '/pages/activity/group/index?id=' + id + '&type='+type+'&gift_id=' + gift_id + '&activity_id=' + activity_id
            // url: `/pages/activity/pages/detail/detail?id=${id}&type=${type}&activity_id=${activity_id}&gift_id=${gift_id}`
          })
        }
        break
      default:
        console.log("no action~")
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
              <Navigator url="" >
                {/* <Image background-size="cover" src={carousel} className="image" /> */}
                {/* indexImg */}
                <Image onClick={this.advertOnclick} background-size="cover" src={this.state.indexImg} className="image" />
              </Navigator>
            </SwiperItem>
          </Swiper>
          {/* <View className="area-activity-list">
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
          </View> */}
          <View className="area-activity-list">
            <View
              // className="weui-grids"
              style={{ border: " 0 none", display: "flex", height: "200px", flexWrap: "wrap" }}>
              {
                activitys.map((item, index) => {
                  return (
                    <View
                      key={index}
                      onClick={this.goTo.bind(this, item.path)}
                      // className="weui-grid"
                      // hoverClass="weui-grid_active"
                      style={{ border: "none", flex: "25%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}
                    >
                      <Image className="weui-grid__icon" src={item.src} />
                      <View className="weui-grid__label">{item.text}</View>
                    </View>
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
