import Taro, { Component, Config } from "@tarojs/taro"
import { Block, View,Text } from "@tarojs/components"
import { AtInput, AtButton } from 'taro-ui'

import { getShortNote, loginPhone} from '@/api/index'
import "./index.styl"

export default class LoginPage extends Component<any>{

  config: Config = {
    navigationBarTitleText: "登录"
  }

  state = {
    data: '',
    value: '',
    phoneNumber:'',//手机号码
    validationNumber:'',//验证码


    time: 60,
    showTime:false
  }

  componentDidMount() {
  }

  handleChange = (type,value)=> {
    this.setState({ [type]: value})
    // 在小程序中，如果想改变 value 的值，需要 `return value` 从而改变输入框的当前值
    return value
  }



  // 定时器
  performTimer = () => {
    this.setState({ showTime:true})
    const time = setTimeout(() => {
      this.setState({ time: this.state.time - 1 }, () => {
        if (this.state.time < 1) {
          clearTimeout(time)
          this.setState({ time: 60, showTime: false})
          return
        } 
          this.performTimer()
      })
    }, 1000);

  }

  //发送短信
  sendShortNote = () => {
    const { phoneNumber } = this.state
    let format = /^1(3[0-9]|4[5,7]|5[0,1,2,3,5,6,7,8,9]|6[2,5,6,7]|7[0,1,7,8]|8[0-9]|9[1,8,9])\d{8}$/;
    if (!format.test(phoneNumber)) {
      Taro.showToast({ title: '手机号格式有误', icon: 'none' })
      return
    }
    getShortNote({ phone: phoneNumber })
      .then(({ status_code, data, message }) => {
        if (status_code == 200) {
          this.performTimer()//验证码发送成功 开始倒计时
        }
        Taro.showToast({ title: message, icon: 'none' })
      })
  }

  //确定登录
  sureLogin = () => {
    const { phoneNumber, validationNumber } = this.state
    loginPhone({
      phone: phoneNumber,
      verify_code: validationNumber
    })
      .then(({ status_code, data }) => {
        if (status_code == 200) {
          Taro.setStorageSync('phone_status', data.status)
          Taro.showToast({
            title: '登录成功',
            duration: 2000,
          })
          setTimeout(() => {
            let page = Taro.getCurrentPages()
            if (page.length > 1) {
              Taro.navigateBack({
                delta: 2
              })
            }
          }, 2000)
        }

      })
  }

  render() {
    const { time } = this.state
    return (
      <View className='loginPage'>
        <View className='loginPage_head'>
          <View className="input_phone">
            <AtInput
              name='phoneNumber'
              title='+86'
              type='number'
              placeholder='请输入手机号码'
              value={this.state.phoneNumber}
              onChange={this.handleChange.bind(this,'phoneNumber')}
            />
            {
              !this.state.showTime ? <Text onClick={this.sendShortNote}>获取验证码</Text> : <Text>{time}</Text>
            }
          </View>
          
          <AtInput
            name='validationNumber'
            title='验证码'
            type='number'
            placeholder='请输入验证码'
            value={this.state.validationNumber}
            onChange={this.handleChange.bind(this, 'validationNumber')}
          />
        </View>
        <AtButton type='primary' size='small' onClick={this.sureLogin}>登录</AtButton>
      </View>
    )
  }
}
