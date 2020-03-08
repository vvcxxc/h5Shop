import Taro, { Component, Config } from "@tarojs/taro"
import { Block, View,Text } from "@tarojs/components"
import { AtInput, AtButton } from 'taro-ui'

import { getShortNote, loginPhone, loginMerge } from '@/api/index'
import MergePrompt from './merge_prompt'
import Cookie from 'js-cookie'
import "./index.styl"

const TOKEN = process.env.TOKEN

export default class LoginPage extends Component<any>{
  state = {
    data: '',
    value: '',
    phoneNumber:'',//手机号码
    validationNumber:'',//验证码


    time: 60,
    showTime: false,
    prompt:false
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
    if (!/^1[346789]\d{9}$/.test(phoneNumber)) {
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
      // 状态 binded已绑定的  bind_success绑定成功 merge_fail合并失败   merge_success合并成功有token和用户信息  need_merge: 需要用户同意合并
      if (status_code == 200) {
        switch (data.status) {
          case 'binded'://成功登录
          case 'bindsuccess':
            Taro.setStorageSync('phone_status', data.status)
            Taro.showToast({ title: '登录成功', duration: 2000, })
            setTimeout(() => {
              let page = Taro.getCurrentPages()
              if (page.length > 1) {
                Taro.navigateBack({
                  delta: 1
                })
              }
            }, 2000)
            break;
          case 'need_merge'://需要合并
            this.setState({ prompt: true })
            break;
          case 'merge_fail'://自动合并失败
            Taro.showToast({ title: '登录失败', duration: 2000, })
            break;
          case 'merge_success'://自动合并成功
            Cookie.set(TOKEN, data.token)
            Taro.showToast({ title: '登录成功', duration: 2000, })
            break;
          default://其它情况
            console.log('其他错误')
            break;
        }//end switch
      }//end if
    })
}

// 确定合并手机
sureMerge = () => {
  const { phoneNumber, validationNumber } = this.state
  loginMerge({
    mobile: phoneNumber,
    verify_code: validationNumber,
    type: 'wx'
  })
    .then(({ status_code, data }) => {
      this.setState({ prompt: false })
      if (status_code == 200) {
        Taro.setStorageSync('phone_status', 'binded')
        Taro.showToast({ title: '同步成功', duration: 2000, })
        setTimeout(() => {
          let page = Taro.getCurrentPages()
          if (page.length > 1) {
            Taro.navigateBack({
              delta: 1
            })
          }
        }, 2000)
      } else {
        Taro.showToast({ title: '同步失败', duration: 2000, })
      }
    })
}


  render() {
    const { time, prompt } = this.state
    return (
      <View className='loginPage'>
        {
          prompt ? <MergePrompt
            cancel={() => this.setState({ prompt: false })}
            confirm={() => this.sureMerge()}
          />:null
        }
        
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
              !this.state.showTime ? <Text onClick={this.sendShortNote}>获取验证码</Text> : <Text>{time}s后重新获取</Text>
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
