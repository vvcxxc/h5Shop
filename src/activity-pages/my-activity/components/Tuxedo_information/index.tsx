import Taro, { Component } from "@tarojs/taro"
import request from '../../../../services/request'
import "./index.less"
import { spawn } from "child_process"
import TimeUp from '../../../../pages/activity/group/TimeUp'
import wx from 'weixin-js-sdk';
import QRCode from 'qrcode'
import { AtCurtain, AtButton } from 'taro-ui'
import { Block, View, Image, Text, Button } from "@tarojs/components"

interface Props {
  // list: any
}
const share_url = process.env.GROUP_URL;

export default class TuxedoInformation extends Component<Props> {

  state = {
    listData: [],
    codeImg: '',
    isOpened: false,

  }

  componentDidMount() {
    request({
      url: 'api/wap/user/getMeGroupList',
      method: "GET"
    })
      .then((res: any) => {
        const { data, code } = res
        if (code !== 200) return
        this.setState({ listData: res.data })
      })
  }

  // 未开团人数头像显示
  for_data = (list: Array<string>, length: number, people: number) => {
    let total: any = []
    list.map((item2: any, index2: number) => {
      total.push(<View
        className={index2 == 0 ? '' : 'tuxedo_people'} style={{ zIndex: 6 - index2 }}>
        <View className="user_head">
          <Image src={item2} />
        </View>
        {index2 == 0 ? <Text>团长</Text> : null}
      </View>)
    })
    for (let i = 0; i < length; i++) {
      total.push(
        <View className="no_user_head " style={{ zIndex: 4 - people - i }}>
          <Image src={require('../../../../assets/problem.png')} />
        </View>
      )
    }
    if (total.length >= 5) total.length = 5
    return total
  }

  againGroup = (youhui_id, gift_id, activity_id) => {
    Taro.navigateTo({
      url: '/pages/activity/group/index?id=' + youhui_id + '&type=5&gift_id=' + gift_id + '&activity_id=' + activity_id
    })

  }

  shopDetails = (location_id) => {
    Taro.navigateTo({
      url: '/pages/business/index?id=' + location_id
    })
  }

  routerShare = (id, e) => {
    Taro.navigateTo({
      url: '/pages/activity/pages/group/group?id=' + id
    })
    e.stopPropagation()
  }

  //使用卡券
  userCard = (data) => {
    QRCode.toDataURL(JSON.stringify(data))
      .then((url: any) => {
        Taro.hideLoading();
        this.setState({ codeImg: url, isOpened: true })
      })
      .catch((err: any) => {
        Taro.hideLoading();
        Taro.showToast({ title: '获取二维码失败', icon: 'none' })
      })
  }

  handleChange() {
    this.setState({
      isOpened: true
    })
  }
  onClose() {
    this.setState({
      isOpened: false
    })
  }



  render() {
    const { listData } = this.state
    return (
      <View id="tuxedo_box">
        {
          listData.map((item: any, index: number) => {
            return <View className="message" >
              <View className="tuxedo_title" onClick={this.shopDetails.bind(this, item.location_id)}>
                <Image src={require('../../../../assets/shop_head.png')} />
                <View className="title_right" >{item.supplier_name}
                </View>
              </View>
              <View className="tuxedo_content" onClick={this.againGroup.bind(this, item.youhui_id, item.gift_id, item.activity_id)}>
                <View className="message_left">
                  <Image src={item.image} />
                </View>
                <View className="message_right">
                  <View className="full_name">
                    <Text>{item.name}</Text>
                  </View>
                  <View className="residue_time">
                    {
                      item.end_at == '' &&
                        item.number !==
                        item.participation_number
                        ||
                        item.number !==
                        item.participation_number && new Date(item.end_at).getTime()
                        <= new Date().getTime()
                        ? <Text className="failure">拼团失败</Text> : null
                    }
                    {
                      item.end_at == '' &&
                        item.number ==
                        item.participation_number
                        ||
                        item.number ==
                        item.participation_number && new Date(item.end_at).getTime()
                        <= new Date().getTime() ? <Text>拼团成功</Text> : null
                    }

                    {
                      item.number !==
                        item.participation_number && new Date(item.end_at).getTime()
                        > new Date().getTime() ? <Text>剩余时间</Text> : null
                    }
                    {
                      item.number !==
                        item.participation_number && new Date(item.end_at).getTime()
                        > new Date().getTime() ? <TimeUp itemtime={item.end_at} /> : null
                    }
                  </View>
                  <View className="group">
                    <View className="group_left">
                      <Image src={item.cover_image} />
                    </View>
                    <View className="group_right">
                      <View className="original_price">原价：￥{item.pay_money}</View>
                      <View className="group_price">
                        <Text>拼团价：</Text>
                        <Text>￥{item.participation_money}</Text>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              <View className="foot">
                <View className="left">
                  {
                    this.for_data(item.head_list, item.number - item.participation_number, item.participation_number)
                  }
                </View>
                <View className="right">
                  {
                    item.number !==
                      item.participation_number && new Date(item.end_at).getTime()
                      > new Date().getTime() ? <View className="invite" onClick={this.routerShare.bind(this, item.id)}>邀好友参团</View> : null
                  }

                  {
                    item.number ==
                      item.participation_number &&
                      new Date(item.youhui_end_time).getTime()
                      > new Date().getTime() ? <View className="userCoupon" onClick={this.userCard.bind(this, item.qr_code)}>使用卡券</View> : null
                  }


                  {
                    item.end_at == '' || item.number == item.participation_number
                      && new Date(item.youhui_end_time).getTime()
                      <= new Date().getTime() ? <View className="userCoupon">卡券已过期</View> : null
                  }

                  {
                    // 活动未成团 ， 且在有效期内， 应只显示邀好友参团 
                    item.number === item.participation_number //人数相等
                      &&
                      new Date(item.active_end_time).getTime() > new Date().getTime()//活动时间大于当前时间
                      ?
                      <View className="userCoupon"
                        onClick={this.againGroup.bind(this, item.youhui_id, item.gift_id, item.activity_id)}>再次拼团</View> : null
                  }

                </View>
              </View>
            </View>
          })
        }

        <AtCurtain
          isOpened={this.state.isOpened}
          onClose={this.onClose.bind(this)}
        >
          <View >
            <View className="user_prompt">商家扫码/输码验证即可消费</View>
            <Image
              src={this.state.codeImg}
            />
          </View>
        </AtCurtain>

      </View>
    )
  }
}