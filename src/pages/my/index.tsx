import Taro, { Component, Config } from "@tarojs/taro"
import { View, Image, Text } from "@tarojs/components"
import request from '@/services/request'
import LandingBounced from '@/components/landing_bounced'
import { getUserInfo } from '@/utils/getInfo';
import Cookie from 'js-cookie'
import PosterGeneral from '@/components/posters/value_added/general'//增值海报
import SpellGroupPoster from "@/components/posters/spell_group";
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
  needLogin: boolean,
  mobile: Number | null,

  spell_group: boolean,
  poster_youhui_type: any
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
    needLogin: false,
    mobile: null,

    //海报
    spell_group: false,
    poster_youhui_type: 0
  }

  componentWillMount() {
    //拼团海报所需信息
    this.setState({
      spellGroupInfo: {
        activity_name: '活动名称',
        group_money: 12,//拼团价
        pay_money: 23,              //原价
        group_number: 4,       //拼团人数
        // ...data.supplier,
        link: '34523342423',                       //跳转的详情页面
        gift_id: 5,             // 礼品id为0? 不显示礼品以及信息
        gif_name:'礼品名字',
        gif_pic: 'http://oss.tdianyi.com/front/hr3JDhtFjQH54GW3RPcQFjdibMQy3PTs.png?x-oss-process=image/crop,x_420,y_0,w_1080,h_1080',             //礼品图片
        gift_money: 56,     //礼品价
        coupons_number: 7,     //猜测是几人团
        big_pic: 'http://oss.tdianyi.com/front/hr3JDhtFjQH54GW3RPcQFjdibMQy3PTs.png?x-oss-process=image/crop,x_420,y_0,w_1080,h_1080'
      }
    })//end 拼团海报信息
    this.setState({
      poster_youhui_type: 1,//0品类券/1:全场通用
      youhui_id: 2,
      show_notice: true,
      posterData: {
        // ...data.supplier,                     //地址 店名 店铺照 电话
        // 礼品id为0? 不显示礼品以及信息
        gift_id: 12,
        //活动价格
        active_money: 23,
        //增值最大金额
        max_money: 34,
        //购买券的价格
        pay_money: 45,
        //礼品小图
        git_img: 'http://oss.tdianyi.com/front/hr3JDhtFjQH54GW3RPcQFjdibMQy3PTs.png?x-oss-process=image/crop,x_420,y_0,w_1080,h_1080',
        // data.appreciation_info.images[0],
        link: '3242342',
        activity_name: '名字',
        total_fee: 67,//使用门槛
        use_tim: 78,
        gif_name: '礼品名字',
        gif_money: '89',
        big_pic: 'http://oss.tdianyi.com/front/hr3JDhtFjQH54GW3RPcQFjdibMQy3PTs.png?x-oss-process=image/crop,x_420,y_0,w_1080,h_1080',
        gif_integral: 90
      }
    })
  }

  componentDidShow() {
    let phone_status = Cookie.get('phone_status')

    this.handleGetUserinfo()
    request({
      url: 'v3/user/home_index'
    }).then((res: any) => {

      this.setState({
        userData: {
          head_img: res.data.avatar,
          user_name: res.data.user_name
        },
        emptyAvatar: res.data.emptyAvatar,
        mobile: res.data.mobile
      })
      if (res.data.mobile) {
        this.setState({ settingShow: true, needLogin: false })
      } else {
        this.setState({ settingShow: false, needLogin: true }, () => {
          if (this.state.needLogin) {
            this.setState({
              userData: {
                head_img: 'http://oss.tdianyi.com/front/ek7cPQsFbEt7DXT7E7B6Xaf62a46SCXw.png',
                user_name: ''
              },
            })
          }
        })
      }
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
    // let phone_status = Cookie.get("phone_status")

    if (this.state.mobile) {
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
    const { showBounced, needLogin } = this.state
    return (
      <View className='newPage'>
        <View onClick={() => { this.setState({ spell_group: true }) }}>
          点击生成海报
        </View>
        {/* <PosterGeneral
          show={this.state.spell_group}
          list={this.state.posterData}
          close={() => this.setState({ spell_group: false })}
        />  */}

        <SpellGroupPoster
          show={this.state.spell_group}
          list={this.state.spellGroupInfo}
          close={() => this.setState({ value_added: false })}
        />
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
            needLogin ? <View>
              <View className='phone_text'>登录手机号，同步全渠道订单与优惠券</View>
              <View className='setPersonalInfoBox' onClick={this.handLogin} >
                <View className='setPersonalInfo' >登录</View>
              </View>
            </View> : null
          }
        </View>
        {
          console.log(showBounced, 'eee4e')
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
