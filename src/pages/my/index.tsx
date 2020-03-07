import Taro, { Component, Config } from "@tarojs/taro"
import { View, Image, Text } from "@tarojs/components"
import request from '@/services/request'
import LandingBounced from '@/components/landing_bounced'
import "./index.styl"

type Props = any

interface State {
  cells: any;
  userInfo: any;
  user_img: string;
  data: string,
  list: Object[],
  userData: Object,
  showBounced: boolean
}

export default class NewPage extends Component<Props>{

  config: Config = {
    navigationBarTitleText: "我的"
  }

  state: State = {
    cells: {},
    userInfo: {},
    userData: {},
    user_img: '',
    data: '',
    list: [
      {
        des: '我的订单',
        prompt: '有快到期的券',
        img: 'http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/XWWfhzTJEXwsB6DKczbKBNRpbDASRDsW.png',
        path: "/pages/order/index",
      }
      , {
        des: '我的礼品',
        prompt: '有正在配送的礼品',
        img: 'http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/BjNjHfJ2FstMaB4PjNbCChCS6D2FDJb5.png',
        path: "/activity-pages/my-welfare/pages/gift/welfare.gift"
      }, {
        des: '我参与的活动',
        prompt: '有正在进行的拼团活动',
        img: 'http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/r55CxTJ4AAkmZFHRESeFs2GAFDCJnW5Z.png',
        path: "/activity-pages/my-activity/my.activity",
      },
      {
        des: '我的奖品',
        prompt: '',
        img: 'http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/iYK4YnfmBrNP8tZGWHeQNpRTHFj5ajyr.png',
        path: "/activity-pages/my-prize/index"
      },
      {
        des: '我的收货地址',
        prompt: '',
        img: 'http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/FMMGCc7ecQ38FT3tYct45NEfBFJbhRFz.png',
        path: "/activity-pages/Shipping-address/index",
      }
    ],
    showBounced: false//登录弹框
  }



  componentDidMount() {
    this.handleGetUserinfo()
    request({
      url: 'v3/user/home_index'
    }).then((res: any) => {

      this.setState({
        userData: {
          head_img: res.data.avatar,
          user_name: res.data.user_name
        }
      })
      let myData: any = this.state.list
      myData[0].prompt = res.data.order_msg
      myData[1].prompt = res.data.gift_msg
      myData[2].prompt = res.data.activity_msg
      this.setState({ list: myData })
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

  // 跳转路径
  jumpData = (data: string) => {
    let phone_status = Taro.getStorageSync('phone_status')
    if (phone_status == 'binded' || phone_status == 'bindsuccess') {
      Taro.navigateTo({ url: data })
      return
    }
    this.setState({ showBounced: true })
  }

  setPersonalInfo = () => {
    Taro.navigateTo({
      url: '/activity-pages/personal/index'
    })
  }

  render() {
    const { showBounced } = this.state
    return (
      <View className='newPage'>
        <Image className='settleIcon' src='http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/nAP8aBrDk2yGzG7AdaTrPDWey8fDB2KP.png' onClick={this.setPersonalInfo.bind(this)} />
        <View className='newPage_head'>
          <View className="img_box">
            <Image src={this.state.userData.head_img} />
          </View>
          <View className='userName'>{this.state.userData.user_name}</View>
          <View className='setPersonalInfoBox'  >
            <View className='setPersonalInfo' >一键设置头像</View>
          </View>
          {/* <View className='giftMoney'>
            <Text className='white'>礼品币</Text>
            <Text className='yellow'>27</Text>
          </View> */}
        </View>

        <View className="newPage_content">
          <View className="content_my">
            {
              this.state.list.map((item: any, index) => {
                return <View className="list_my" onClick={this.jumpData.bind(this, item.path)}>
                  <View className="list_content">
                    <View className="list_left">
                      <Image src={item.img} />
                      <View className="des">{item.des}</View>
                    </View>
                    <View className="list_right">
                      <Text className="prompt">{item.prompt}</Text>
                      <Image src={require('../../assets/right_arro.png')} className='back' />
                    </View>
                  </View>
                </View>
              })
            }
          </View>
        </View>
        {
          showBounced ? <LandingBounced cancel={() => { this.setState({ showBounced: false }) }} confirm={() => {
            this.setState({ showBounced: false })
          }} /> : null
        }
      </View>
    )
  }
}
