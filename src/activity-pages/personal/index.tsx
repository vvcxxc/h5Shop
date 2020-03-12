import Taro, { Component, Config } from "@tarojs/taro"
// import { View } from "@tarojs/components";
import { Block, View, Image, Text, Navigator } from "@tarojs/components"
import request from '@/services/request'
import "./index.less"
import { url } from "inspector"
import { AtIcon } from 'taro-ui'

export default class Personal extends Component {

    config: Config = {
        navigationBarTitleText: "设置"
    }
    routerPush = (url: string) => {
        Taro.navigateTo({
            url: url
        })
    }
    render() {
        return (
            <View className='personal'>
                <View className='setInfoBox'>
                    <View className='setItem' onClick={this.routerPush.bind(this, '/activity-pages/personal/personalInformation/index')}>
                        <View className='itemLeft' >
                            <View className='leftTitle'>个人信息</View>
                            <View className='leftInfo'>头像、昵称、生日等</View>
                        </View>
                        <View className='itemRight'></View>
                    </View>
                    <View className='setItem' onClick={this.routerPush.bind(this, '/activity-pages/personal/phoneInformation/index')}>
                        <View className='itemLeft'>
                            <View className='leftTitle'>账号与安全</View>
                            <View className='leftInfo'>换绑手机号码</View>
                        </View>
                        <View className='itemRight'></View>
                    </View>
                </View>
            </View>
        )
    }
}
