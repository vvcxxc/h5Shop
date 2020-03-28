import Taro, { Component, Config } from "@tarojs/taro"
import { Block, View, Text } from "@tarojs/components"
import { AtInput, AtButton } from 'taro-ui'

import { getShortNote, loginPhone, loginMerge, updateLoginPhone } from '@/api/index'
import MergePrompt from './merge_prompt'
import Cookie from 'js-cookie'
import { getBrowserType } from '../../../utils/common';
import "./index.styl"

const TOKEN = process.env.TOKEN
const USER_API = process.env.USER_API//重新登录成功跳转

export default class LoginPage extends Component<any>{
  state = {
    data: '',
    value: '',
    phoneNumber: '',//手机号码
    validationNumber: '',//验证码


    time: 60,
    showTime: false,
    prompt: false,
    replace_interface:false // true使用更改手机接口， false 使用常规登录接口
  }

  componentDidMount() {
  }

  handleChange = (type, value) => {
    this.setState({ [type]: value })
    // 在小程序中，如果想改变 value 的值，需要 `return value` 从而改变输入框的当前值
    return value
  }



  // 定时器
  performTimer = () => {
    this.setState({ showTime: true })
    const time = setTimeout(() => {
      this.setState({ time: this.state.time - 1 }, () => {
        if (this.state.time < 1) {
          clearTimeout(time)
          this.setState({ time: 60, showTime: false })
          return
        }
        this.performTimer()
      })
    }, 1000);

  }

  //发送短信
  sendShortNote = () => {
    const { phoneNumber } = this.state
    if (!/^1[123456789]\d{9}$/.test(phoneNumber)) {
      Taro.showToast({ title: '手机号格式有误', icon: 'none' })
      return
    }
    getShortNote({ phone: phoneNumber })
      .then(({ status_code, data, message }) => {
        if (status_code == 200) {
          this.performTimer()//验证码发送成功 开始倒计时
        }
        Taro.showToast({ title: message, icon: 'none' })
      }).catch(err => {
        Taro.showToast({title: err.message, icon: 'none'})
      })
  }

  //确定登录
  sureLogin = () => {
    const { phoneNumber, validationNumber } = this.state
    let url = Taro.getStorageSync('ql_href')//登录成功后跳转回来的页面
    if (!phoneNumber) {
      Taro.showToast({ title: '手机不能为空', duration: 2000,  icon: 'none'})
      return
    }
    if (!validationNumber) {
      Taro.showToast({ title: '验证码不能为空', duration: 2000, icon: 'none'})
      return
    }
    let type = getBrowserType() == 'wechat' ? 'wx' : 'ali'
    url = encodeURIComponent(url)
    loginPhone({
      phone: phoneNumber,
      verify_code: validationNumber,
      from: type
    }).then(({ status_code,data }) => {
        if (status_code == 200) {
          switch (data.status) {//成功登录
            case "binded":
              Taro.showToast({
                title: '登录成功', duration: 2000, success: () => {
                  setTimeout(() => {
                    location.href = USER_API + 'v1/user/auth/relogin?phone=' + phoneNumber + '&verify_code=' + validationNumber + '&url=' + url + '&from=' + type
                  }, 1000);
                }
              })
              break;
            case "bind_success":
              Taro.showToast({
                title: '登录成功', duration: 2000, success: () => {
                  setTimeout(() => {
                    location.href = USER_API + 'v1/user/auth/relogin?phone=' + phoneNumber + '&verify_code=' + validationNumber + '&url=' + url + '&from=' + type
                  }, 1000);
                }
              })
              break;
            case 'need_merge'://需要合并
              this.setState({ prompt: true })
              break;
            case 'need_switch'://跟换手机
              Taro.showToast({
                title: '登录成功', duration: 2000, success: () => {
                  setTimeout(() => {
                    location.href = USER_API + 'v1/user/auth/relogin?phone=' + phoneNumber + '&verify_code=' + validationNumber + '&url=' + url + '&from=' + type
                  }, 1000);
                }
              })
              // setTimeout(() => {
              //   location.href = USER_API + '/v1/user/auth/relogin?phone=' + phoneNumber + '&verify_code=' + validationNumber + '&url=' + url + '&from=' + type
              // }, 1000);
              break;
            case 'merge_fail'://自动合并失败
              Taro.showToast({ title: '登录失败', duration: 2000, icon: 'none' })
              break;
            case 'merge_success'://自动合并成功
              Taro.showToast({
                title: '登录成功', duration: 2000, success: () => {
                  setTimeout(() => {
                    location.href = USER_API + 'v1/user/auth/relogin?phone=' + phoneNumber + '&verify_code=' + validationNumber + '&url=' + url + '&from=' + type
                  }, 1000);
                }
              })
              break;
            default://其它情况
              break;
          }//end switch
        }//end if
    }).catch(err => {
      Taro.showToast({ title: '登录失败', duration: 2000, icon: 'none' })
      })
  }

  // 确定合并手机
  sureMerge = () => {
    const { phoneNumber, validationNumber } = this.state
    let type = getBrowserType() == 'wechat' ? 'ali' : 'wx'
    let url = Taro.getStorageSync('ql_href')//登录成功后跳转回来的页面
    url = encodeURIComponent(url)
    loginMerge({
      mobile: phoneNumber,
      verify_code: validationNumber,
      type: type
    }).then(({ status_code, data }) => {
        this.setState({ prompt: false })
        if (status_code == 200) {
          Taro.showToast({
            title: '同步成功', duration: 2000, success: () => {
              setTimeout(() => {
                location.href = USER_API + '/v1/user/auth/relogin?phone=' + phoneNumber + '&verify_code=' + validationNumber + '&url=' + url +
                  '&from=' + type
              }, 1000);
            }
          })
        } else {
          Taro.showToast({ title: '同步失败', duration: 2000, icon: 'none' })
        }
    }).catch(res => {
      Taro.showToast({ title: '登录失败', duration: 2000, icon: 'none' })
    })
  }

  // 将登录接口改成需改手机号接口
  replaceInterface = () => {
    this.setState({ prompt: false})
  }


  render() {
    const { time, prompt, replace_interface } = this.state
    return (
      <View className='loginPage'>
        {
          prompt ? <MergePrompt
            cancel={this.replaceInterface}
            confirm={this.sureMerge}
          /> : null
        }

        <View className='loginPage_head'>
          <View className="input_phone">
            <AtInput
              name='phoneNumber'
              title='+86'
              type='number'
              placeholder='请输入手机号码'
              value={this.state.phoneNumber}
              onChange={this.handleChange.bind(this, 'phoneNumber')}
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
