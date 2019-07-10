import Taro, { Component } from "@tarojs/taro"
import { Block, View } from "@tarojs/components"
import { getUserGift, addUserReceiveinfo } from "@/api"
import GiftItem from "../../components/gift-item/gift.item"
import GiftWriteInfo from "../../components/gift-write-info/gift.write.info"
import GiftView from "../../components/gift-view/gift.view"
import { ACTION_GET, ACTION_SUBMIT, ACTION_CLOSE, ACTION_VIEW } from "@/utils/constants"
import NoData from "@/components/nodata/no.data"
import "./style.welfare.gift.styl"

interface UserReceiveinfo {
  receiver_name: string;
  receiver_phone: string;
  receiver_address: string;
}
export default class MyWelfare extends Component {
  config = {
    navigationBarTitleText: "我的礼品"
  }
  state: { list: any[]; userReceiveinfo: UserReceiveinfo; action: string; checkGiftinfo: any } = {
    action: "",
    list: [],
    userReceiveinfo: {
      receiver_name: "",
      receiver_phone: "",
      receiver_address: ""
    },
    checkGiftinfo: null
  }

  componentDidMount() {
    Taro.showShareMenu()

    this.fetchGift()
  }

  /**
   * 用户动作: 领取|查看|提交|
   */
  handleAction(action: string, data: any) {
    switch (action) {
      case ACTION_SUBMIT:
        this.handleSubmitinfo()
      case ACTION_CLOSE:
        this.setState({
          action: ""
        })
        break
      case ACTION_GET:
        this.setState({
          action,
          checkGiftinfo: data
        })
        break
      case ACTION_VIEW:
        this.setState({
          action,
          checkGiftinfo: data
        })
        break
      default:
        console.log("no action~")
    }
  }

  /**
   * 领取礼物(, 用户输入处理)
   */
  handleUserWriteinfo(e) {
    const { value, dataset: { type } } = e.currentTarget
    const merge = Object.assign({}, this.state.userReceiveinfo, { [type]: value })
    this.setState({
      userReceiveinfo: merge
    })
  }

  /**
   * 提交
   */
  handleSubmitinfo() {
    const { userReceiveinfo, checkGiftinfo } = this.state
    const merge = {
      ...userReceiveinfo,
      id: checkGiftinfo.id
    }
    this.fetchAddReceiveinfo(merge)
  }

  /**
   * 填写收货信息
   */
  async fetchAddReceiveinfo(userReceiveinfo: UserReceiveinfo) {
    await addUserReceiveinfo(userReceiveinfo).catch(err => {
      console.log(err)
      throw Error("--- 提交信息错误 ---")
    })
    this.fetchGift()
  }

  /**
   * 获取用户礼品
   */
  async fetchGift() {
    const { data } = await getUserGift()
    this.setState({
      list: data
    })
  }
  render() {
    const { list, action, checkGiftinfo } = this.state
    return (
      <Block>
        <View className="welfare-gift">
          <View className="container">
            {!list.length && <NoData />}
            {
              list.map((item, index) => {
                return (
                  <GiftItem
                    key={index}
                    data={item}
                    onAction={this.handleAction}
                  />
                )
              })
            }
          </View>
          {
            action &&
            (
              action === ACTION_GET
                ? <GiftWriteInfo
                    onAction={this.handleAction}
                    onWrite={this.handleUserWriteinfo}
                    data={checkGiftinfo}
                  />
                : <GiftView
                    onAction={this.handleAction}
                    data={checkGiftinfo}
                  />
            )
          }
        </View>
      </Block>
    )
  }
}
