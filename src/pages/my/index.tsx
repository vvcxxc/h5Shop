import Taro, { Component, Config } from "@tarojs/taro"
import { Block, View, Image, Text, Navigator } from "@tarojs/components"
import { cells } from "./data"
import "./style.my.styl"
import request from '@/services/request'
interface Cell {
  text: string;
  icon: string;
  path: string;
}
interface State {
  cells: Cell[];
  userInfo: any;
  user_img: string;
}
export default class My extends Component {
  config: Config = {
    navigationBarTitleText: "我的"
  }
  state: State = {
    cells,
    userInfo: {},
    user_img: ''
  }
  componentDidMount() {
    this.handleGetUserinfo()
    // Taro.showShareMenu()
    request({
      url: 'v3/user/home_index'
    }).then(res => {
      console.log(res)
      this.setState({
        user_img: res.data.avatar
      })
    })
  }

  /**
   * 获取用户信息
   */
  handleGetUserinfo = (): void => {
    const { userInfo } = this.state
    if (!userInfo.nickName) {
      const userInfo = Taro.getStorageSync("userInfo")
      if (userInfo) {
        this.setState({
          userInfo
        })
      } else {
        // const { toMiniProgramSign } = require("../../utils/sign")
        // toMiniProgramSign(process.env.BASIC_API)
      }
    }
  }
  render() {
    const { cells, userInfo, user_img } = this.state
    return (
      <Block>
        <View className="my">
          <View className="area-userinfo">
            <View className="avatar">
              <Image className="icon" src={user_img} />
            </View>
            <View className="description">
              <Text className="text">{userInfo.nickName}</Text>
            </View>
          </View>
          <View className="area-menu weui-cells weui-cells_after-title">
            {
              cells.map((item, index) => {
                return (
                  <Navigator
                    key={index}
                    url={item.path}
                    openType={item.open_type}
                    className="weui-cell weui-cell_access"
                    hoverClass="weui-cell_active"
                  >
                    <View className="weui-cell__hd">
                      <Image src={item.icon} style="margin-right: 5px;vertical-align: middle;width:20px; height: 20px;" />
                    </View>
                    <View className="weui-cell__bd" style="font-size: 14px; padding-top: 7px; color: #333;">
                      {item.text}
                    </View>
                    <View className="weui-cell__ft weui-cell__ft_in-access" />
                  </Navigator>
                )
              })
            }
          </View>
        </View>
      </Block>
    )
  }
}
