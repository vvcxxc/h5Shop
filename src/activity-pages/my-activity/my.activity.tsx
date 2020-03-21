import Taro, { Component } from "@tarojs/taro"
import { Block, View, ScrollView } from "@tarojs/components"
import { myActivity, activtys } from "./data"
import { getActivity } from "@/api"
import { TYPE_APPRECIATION, TYPE_GROUP, ACTION_JUMP } from "@/utils/constants"
import ActivityAppreciation from "./components/order.component"
import ActivityGroup from "./types/activity.group"
import Tab from "@/activity-pages/components/tab/tab"
import "./style.styl"
import TuxedoInformation from "./components/Tuxedo_information"
import Cookie from 'js-cookie'

interface MyActivityProp {
  current?: number;
}
interface State extends MyActivityProp {
  list: any[];
}
export default class MyActivity extends Component<MyActivityProp> {
  config = {
    navigationBarTitleText: "我参加的活动"
  }
  static defaultProps = {
    current: 0
  }
  state: State = {
    list: [],
    current: 0
  }
  componentDidMount() {
    // Taro.showShareMenu()
    let activity_type = Cookie.get('activity_type');
    // Cookie.set('activity_type', '');
    if (activity_type && activity_type == '拼团') {
      const current = 1;
      const { api } = myActivity[current]
      this.setState({ current: 1 })
      this.fetchActivity(api, current)
    } else {
      const { current = 0 } = this.props
      const { api } = myActivity[current]
      this.fetchActivity(api, current)
    }
  }
  componentWillUnmount(){
    Cookie.set('activity_type', '');
  }

  onShareAppMessage = e => {
    const { id, image, title } = e.target.dataset
    const userInfo = Taro.getStorageSync('userInfo')
    return {
      title: `${userInfo.nickName}邀请您参加拼团抢购${title}优惠券`,
      imageUrl: image,
      path: `/pages/activity/pages/group/group?id=${id}`
    }
  }

  /**
   * 用户点击动作: 增值(增值券)|使用(普通券)
   * @param action 动作
   * @param type 类型
   * @param id 订单id
   */
  handleAction(action: string, data: { id: string; type: number }) {
    switch (action) {
      case ACTION_JUMP:
        const { type, id } = data
        let _url = ""
        if (type === TYPE_APPRECIATION) {
          _url = "/pages/activity/pages/appreciation/appreciation"
        } else if (type === TYPE_GROUP) {
          _url = "/pages/activity/pages/group/group"
        } else {
          return console.log("no type~")
        }
        Taro.navigateTo({
          url: `${_url}?id=${id}`
        })
        break
      default:
        console.log("no~action")
    }
  }

  handleToggle = (current: number) => {
    current = Number(current)
    const { api } = myActivity[current]
    this.fetchActivity(api, current)
  }

  /**
    * 获取参加活动
    */
  async fetchActivity(api: string, current) {
    // this.setState({ current })
    if (current === 1) return
    const { data } = await getActivity({ url: api })
    this.setState({
      list: data,
    })

  }
  render() {
    const { list, current } = this.state
    return (
      <Block>
        <View className="my-activity">
          <Tab data={activtys} onToggle={this.handleToggle} index={this.state.current} />
          <ScrollView scrollY className="container-wrapper">
            <View className="container">
              {console.log(current,'current')}
              {
                current == 0 && list.map((item, index) => {
                  return <View className="activity-appreciation">
                    <ActivityAppreciation
                      key={index}
                      data={item}
                      onAction={this.handleAction}
                    />
                  </View>
                })
              }
              {
                current === 1 ? <TuxedoInformation /> : null
              }

            </View>
          </ScrollView>
        </View>
      </Block>
    )
  }
}
