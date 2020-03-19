import Taro, { Component, Config } from "@tarojs/taro"
import { Block, View, Image, Text, Navigator, Input } from "@tarojs/components"
import "./index.less"

interface Props {
}
export default class ShareBox extends Component<Props> {

    config: Config = {
        navigationBarTitleText: "换绑手机号码"
    }
    state = {

    }

    render() {
        return (
            <View className='share-mask'>
                <View className='share-content'>
                    <View className='share-title'>分享</View >
                    <View className='share-btn'>
                        <View className='share-item'>
                            <Image className="share-banner-img" src="http://oss.tdianyi.com/front/TETjYjkjNTzxjpfpM3AYSAFt2zzB7Thi.png" />
                            <View className='share-btn-title'>发送链接</View >
                        </View >
                        <View className='share-item'>
                            <Image className="share-banner-img" src="http://oss.tdianyi.com/front/YEXaKEmEDXQS7JCGEJGyfKBB3A5BGwWF.png" />
                            <View className='share-btn-title'>生成海报</View >
                        </View >
                        <View className='share-item'>
                            <Image className="share-banner-img" src="http://oss.tdianyi.com/front/7wMdSA2X7XEjw3DTyiekRhdbK43J5HBh.png" />
                            <View className='share-btn-title'>发送文字</View >
                        </View >
                    </View >
                    <View className='share-cancle'>取消</View >
                </View >
            </View >
        )
    }
}
