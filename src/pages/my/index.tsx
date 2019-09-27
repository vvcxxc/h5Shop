import Taro, { Component, Config } from "@tarojs/taro"
// import { View } from "@tarojs/components";
import { Block, View, Image, Text, Navigator } from "@tarojs/components"
import request from '@/services/request'
import "./index.styl"

type Props = any

interface Cell {
  text: string;
  icon: string;
  path: string;
}

interface State {
  cells: any;
  userInfo: any;
  user_img: string;
  data: string,
  list: Object[],
  userData:Object
}

export default class NewPage extends Component<Props>{

  config: Config = {
    navigationBarTitleText: "我的"
  }

  state: State = {
    cells:{},
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
      }
      // {
      //   des: '我的收货地址',
      //   prompt: null,
      //   img: 'http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/FMMGCc7ecQ38FT3tYct45NEfBFJbhRFz.png'
      // }
    ]
  }



  componentDidMount() {
    this.handleGetUserinfo()
    request({
      url: 'v3/user/home_index'
    }).then((res:any) => {

      this.setState({
        userData: {
          head_img: res.data.avatar,
          user_name: res.data.user_name
        }
      })
      // console.log(res,'res')
      // this.setState({
      //   user_img: res.data.avatar
      // })

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
  jumpData = (data:string) => {
    Taro.navigateTo({
      url:data
    })
  }
  render() {
    return (
      <View className='newPage'>
        <View className='newPage_head'>
          <View className="img_box">
            <Image src={this.state.userData.head_img} />
          </View>
          <View className='userName'>{this.state.userData.user_name}</View>
          {/* <View className='giftMoney'>
            <Text className='white'>礼品币</Text>
            <Text className='yellow'>27</Text>
          </View> */}
        </View>

        <View className="newPage_content">
          <View className="content">
            {
              this.state.list.map((item:any, index) => {
                return <View className="list" onClick={this.jumpData.bind(this, item.path)}>
                  <View className="list_left">
                    <Image src={item.img} />
                    <View className="des">{item.des}</View>
                  </View>
                  <View className="list_right">
                    <Text className="prompt">{item.prompt}</Text>
                    <Image src={require('../../assets/right_arro.png')} className='back' />
                  </View>
                </View>
              })
            }
          </View>
        </View>

        {/* <View className="newPage_foot">
          客服电话：10101010 <Text className='left'>（服务时间：9：00~20：00）</Text>
        </View> */}
      </View>
    )
  }
}
