import Taro, { Component, Config } from "@tarojs/taro"
// import { View } from "@tarojs/components";
import { Block, View, Image, Text, Navigator, Input } from "@tarojs/components"
import request from '@/services/request'
import "./index.less"
import { url } from "inspector"
import { AtIcon } from 'taro-ui'

export default class ChangePhoneNumber extends Component {

    config: Config = {
        navigationBarTitleText: "换绑手机号码"
    }
    state = {

    }


    render() {
        return (
            <View className='phoneInformation'>
                <View className='informationTitle'>请输入新的手机号码</View>
                <View className='changePhoneNumberBox'>
                    <View className='PhoneNumberItem'>
                        <View className='itemLeftPhone'>+86</View>
                        <Input className='itemLeftInputPhone' type="text" placeholder="请输入手机号码" />
                    </View>
                    <View className='PhoneNumberItem'>
                        <View className='itemLeftCode'>验证码</View>
                        <Input className='itemLeftInputCode' type="text" placeholder="请输入验证码" maxLength={6} />
                        <View className='getCodeBtn'>获取验证码</View>
                    </View>
                </View>
                <View className='submitBtn'>提交</View>
            </View>
        )
    }
}
