import Taro, { Component, Config } from "@tarojs/taro"
// import { View } from "@tarojs/components";
import { Block, View, Image, Text, Navigator, Input } from "@tarojs/components"
import request from '@/services/request'
import "./index.less"
import { url } from "inspector"
import { AtIcon } from 'taro-ui'

export default class PhoneInformation extends Component {

    config: Config = {
        navigationBarTitleText: "换绑手机号码"
    }
    state = {
        tipsType: 1,
        tipsShow: false

    }
    cancleBtn = () => {
        this.setState({ tipsShow: false })
    }
    sumbit = () => {
        //测试
        this.setState({ tipsShow: true, tipsType: !this.state.tipsType })
    }
    changeNumber = () => {
        Taro.navigateTo({
            url: '/activity-pages/personal/phoneInformation/changePhoneNumber'
        })
    }
    render() {
        return (
            <View className='phoneInformation'>
                <View className='phoneInformationBox'>
                    <View className='imageBox'>
                        <Image className='phoneImg' src="http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/7f2mdFaRxyYHsDeGGRXcrpCFP5fHTfEJ.png" />
                    </View>
                    <View className='msgBox'> 您当前绑定的手机号码：15888888888</View>
                    <View className='infoBox'> 为了您的账户安全，请输入验证码</View>
                    <View className='inputBox'>
                        <Input className='phoneInformationInput' type="text" maxLength={6} />
                        <View className='phoneInformationBtn'> 获取验证码</View>
                    </View>
                    <View className='btnBox' onClick={this.sumbit.bind(this)}>确认</View>
                </View>
                {
                    this.state.tipsShow ? <View className='phoneMask'>
                        {
                            this.state.tipsType == 1 ?
                                <View className='maskContentBox'>
                                    <View className='maskTitle'>温馨提示</View>
                                    <View className='maskInfo'>验证码不正确，请重试</View>
                                    <View className='maskBtnBox'>
                                        <View className='maskSumbitBtn' onClick={this.cancleBtn.bind(this)}>确认</View>
                                    </View>
                                </View>
                                :
                                <View className='maskContentBox'>
                                    <View className='maskTitle'>温馨提示</View>
                                    <View className='maskInfo'>该手机号码已和其他账号绑定，如果继续，原账号将自动解绑。是否继续？</View>
                                    <View className='maskBtnBox'>
                                        <View className='sumbitBtn' onClick={this.cancleBtn.bind(this)}>暂不解绑</View>
                                        <View className='cancelBtn' onClick={this.changeNumber.bind(this)}>确认</View>
                                    </View>
                                </View>
                        }
                    </View> : null
                }

            </View>
        )
    }
}
