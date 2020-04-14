import Taro, { Component } from "@tarojs/taro"
import TimeUp from '@/components/TimeUp';
import QRCode from 'qrcode'
import { AtCurtain } from 'taro-ui'
import { View, Image, Text } from "@tarojs/components"
import SpellGroupHead from "../spellGroupHead"
import request from '../../../../services/request'

import "./index.less"

export default class TuxedoInformation extends Component<any> {

  state = {
    listData: [],
    codeImg: '',
    isOpened: false
  }

  componentDidMount = async () => {
    this.clearTimeOut()
    await request({
      url: 'api/wap/user/getMeGroupList',
      method: "GET"
    })
      .then((res: any) => {
        if (res.code === 200) {
          this.setState({ listData: res.data })
        }
      })
  }

  clearTimeOut = () => {
    var end = setTimeout(function () { }, 1);
    var start = (end - 100) > 0 ? end - 100 : 0;
    for (var i = start; i <= end; i++) {
      clearTimeout(i);
    }
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

  render() {
    const { listData } = this.state
    return (
      <View id="tuxedo_box">
        {
          listData.map((item: any, index: number) => {
            return <View className="message" key={item.location}>
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
                      item.end_at == '' && item.number !== item.participation_number || item.number !== item.participation_number && new Date(item.end_at.replace(/-/g, "/")).getTime()
                        <= new Date().getTime() ? <View className="failure">拼团失败</View> : null
                    }
                    {
                      item.number === item.participation_number ? <View>拼团成功</View> : null
                    }

                    {
                      item.number !==
                        item.participation_number && new Date(item.end_at.replace(/-/g, "/")).getTime()
                        > new Date().getTime() ? <View>剩余时间</View> : null
                    }
                    {
                      item.number !==
                        item.participation_number && new Date(item.end_at.replace(/-/g, "/")).getTime()
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
                  <SpellGroupHead
                    data={item.head_list}
                    peopleNeed={item.number}//需要的总人数参团
                    hasJoined={item.participation_number}//已有的参与人数
                  />
                </View>
                <View className="right">
                  {
                    item.number !==
                      item.participation_number && new Date(item.end_at.replace(/-/g, "/")).getTime()
                      > new Date().getTime() ? <View className="invite" onClick={this.routerShare.bind(this, item.id)}>邀好友参团</View> : null
                  }

                  {
                    item.qr_code != '' && item.number ==
                      item.participation_number &&
                      new Date(item.youhui_end_time.replace(/-/g, "/")).getTime()
                      > new Date().getTime() ? <View className="userCoupon" onClick={this.userCard.bind(this, item.qr_code)}>使用卡券</View> : null
                  }
                  {
                    item.qr_code == '' && item.number == item.participation_number ? <View className="userCoupon">已使用</View> : item.end_at == '' || item.number == item.participation_number
                      && new Date(item.youhui_end_time).getTime()
                      <= new Date().getTime() ? <View className="invalid">卡券已过期</View> : null
                  }

                  {
                    new Date(item.active_end_time.replace(/-/g, "/")).getTime() < new Date().getTime() ? <View className="invalid">活动已过期</View> : null

                  }
                  {

                    item.number > item.participation_number && new Date(item.active_end_time.replace(/-/g, "/")).getTime() > new Date().getTime() && new Date(item.end_at.replace(/-/g, "/")).getTime() < new Date().getTime() ? <View className="userCoupon"
                      onClick={this.againGroup.bind(this, item.youhui_id, item.gift_id, item.activity_id)}>再次拼团</View> : null
                  }

                </View>
              </View>
            </View>
          })
        }

        <AtCurtain
          isOpened={this.state.isOpened}
          onClose={()=> {this.setState({  isOpened: false })} }
        >
          <View className="user_prompt_box">
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
