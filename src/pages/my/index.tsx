import Taro, { Component, Config } from "@tarojs/taro"
import { View, Image, Text } from "@tarojs/components"
import request from '@/services/request'
import LandingBounced from '@/components/landing_bounced'
import { getUserInfo } from '@/utils/getInfo';
import Cookie from 'js-cookie'
import "./index.styl"

type Props = any

interface State {
  emptyAvatar: String,
  settingShow: Boolean;
  cells: any;
  userInfo: any;
  user_img: string;
  data: string,
  list: Object[],
  userData: Object,
  showBounced: boolean,
  needLogin: boolean
}

export default class NewPage extends Component<Props>{

  config: Config = {
    navigationBarTitleText: "我的"
  }

  state: State = {
    emptyAvatar: 'N',
    settingShow: false,
    cells: {},
    userInfo: {},
    userData: {},
    user_img: '',
    data: '',
    list: [
      {
        des: '我的订单',
        prompt: '',
        img: 'http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/XWWfhzTJEXwsB6DKczbKBNRpbDASRDsW.png',
        path: "/pages/order/index",
      }
      , {
        des: '我的礼品',
        prompt: '',
        img: 'http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/BjNjHfJ2FstMaB4PjNbCChCS6D2FDJb5.png',
        path: "/activity-pages/my-welfare/pages/gift/welfare.gift"
      }, {
        des: '我参与的活动',
        prompt: '',
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
    showBounced: false,//登录弹框
    needLogin :false
  }



  componentDidShow() {
    let phone_status = Cookie.get('phone_status')
    if (phone_status == 'binded' || phone_status == 'bind_success') {
      this.setState({ settingShow: true, needLogin: false })
    } else {
      this.setState({ settingShow: false, needLogin: true })
    }
    this.handleGetUserinfo()
    request({
      url: 'v3/user/home_index'
    }).then((res: any) => {

      this.setState({
        userData: {
          head_img: res.data.avatar,
          user_name: res.data.user_name
        },
        emptyAvatar: res.data.emptyAvatar
      })
      let myData: any = this.state.list
      myData[0].prompt = res.data.order_msg
      myData[1].prompt = res.data.gift_msg
      myData[2].prompt = res.data.activity_msg
      this.setState({ list: myData })
      if(this.state.needLogin){
        this.setState({
          userData: {
            head_img: 'http://oss.tdianyi.com/front/ek7cPQsFbEt7DXT7E7B6Xaf62a46SCXw.png',
            user_name: ''
          },
        })
      }
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
    let phone_status = Cookie.get("phone_status")
    if (phone_status == 'binded' || phone_status == 'bind_success') {
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

  // 手动登录跳转
  handLogin = () => {
    Taro.setStorageSync('ql_href', location.href)
    Taro.navigateTo({ url: '/pages/my/login_page/index' })
  }

  render() {
    const { showBounced, needLogin} = this.state
    return (
      <View className='newPage'>
        {
          this.state.settingShow ?
            <Image className='settleIcon' src='http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/nAP8aBrDk2yGzG7AdaTrPDWey8fDB2KP.png' onClick={this.setPersonalInfo.bind(this)} />
            : null
        }
        <View className='newPage_head'>
          <View className="img_box">
            <Image src={this.state.userData.head_img} />
          </View>
          <View className='userName'>{this.state.userData.user_name}</View>
          {
            this.state.emptyAvatar == 'Y' && this.state.settingShow ? <View className='setPersonalInfoBox' onClick={getUserInfo}  >
              <View className='setPersonalInfo' >一键设置头像/昵称</View>
            </View> : null
          }
          {
            needLogin ?   <View>
            <View className='phone_text'>登录手机号，同步全渠道订单与优惠券</View>
            <View className='setPersonalInfoBox' onClick={this.handLogin} >
              <View className='setPersonalInfo' >登录</View>
            </View>
          </View>:null
        }
        </View>
        {
          console.log(showBounced,'eee4e')
        }
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
