import Taro, { Component } from "@tarojs/taro"
import { Block, View } from "@tarojs/components"
import { getUserGift, addUserReceiveinfo } from "@/api"
import GiftItem from "../../components/gift-item/gift.item"
import GiftView from "../../components/gift-view/gift.view"
import { ACTION_GET, ACTION_SUBMIT, ACTION_CLOSE, ACTION_VIEW } from "@/utils/constants"
import NoData from "@/components/nodata/no.data"
import "./style.welfare.gift.styl"
import request from '../../../../services/request'

interface UserReceiveinfo {
  receiver_name: string;
  receiver_phone: string;
  receiver_address: string;
}
export default class MyWelfare extends Component {
  config = {
    navigationBarTitleText: "我的礼品"
  }
  state: { list: any; userReceiveinfo: UserReceiveinfo; action: string; checkGiftinfo: any } = {
    action: "",
    list: {},
    userReceiveinfo: {
      receiver_name: "",
      receiver_phone: "",
      receiver_address: ""
    },
    checkGiftinfo: null
  }

  componentDidMount() {
    // Taro.showShareMenu()

    this.fetchGift()
  }

  /**
   * 用户动作: 领取|查看|提交|
   */
  handleAction = (action: string, data: any) => {
    switch (action) {
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
   * 获取用户礼品
   */
  async fetchGift() {
    Taro.showLoading({
      title: ""
    });
    request({
      url: 'v3/Lotterys/user_activity_prize',
      method: "GET"
    })
      .then((res: any) => {
        this.setState({
          list: res.data
        }, () => {
          Taro.hideLoading();
        })
      })
      .catch((err) => {
        Taro.showToast({ title: '获取失败', icon: 'none' })
        Taro.hideLoading();
      })
  }
  render() {
    const { list, action } = this.state
    return (
      <Block>
        <View className="welfare-gift">
          <View className="container">
            {!list && <NoData />}
            {
              list && <GiftItem
                key={0}
                data={list}
                onAction={this.handleAction}
              />
            }
          </View>
          {
            action ?
              <GiftView
                onAction={this.handleAction}
                data={list}
              />
              : null
          }
        </View>
      </Block>
    )
  }
}
