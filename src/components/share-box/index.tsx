import Taro, { Component, Config } from "@tarojs/taro"
import { Block, View, Image, Text, Navigator, Input,Button } from "@tarojs/components"
import "./index.less"

interface Props {
    onClose: () => void,//关闭
    sendText: () => void,//发送文字
    sendLink: () => void,//发送链接
    createPoster: () => void,//生成海报
    show: Boolean,
    astrict?:String | Number
}
export default class ShareBox extends Component<Props> {

    render() {
        const { show, astrict } = this.props
        return (
            show?<View className='share-mask'>
                <View className='share-content'>
                    <View className='share-title'>分享</View >
                    <View className='share-btn'>
                        <View className='share-item'  onClick={() => this.props.sendLink()}>
                            <Image className="share-banner-img" src="http://oss.tdianyi.com/front/TETjYjkjNTzxjpfpM3AYSAFt2zzB7Thi.png" />
                            <View className='share-btn-title' >发送链接</View >
                            <Button className='share-btn' open-type="share"></Button>
                        </View >
                        <View className='share-item' onClick={() => this.props.createPoster()}>
                            <Image className="share-banner-img" src="http://oss.tdianyi.com/front/YEXaKEmEDXQS7JCGEJGyfKBB3A5BGwWF.png" />
                            <View className='share-btn-title' >生成海报</View >
                        </View >
                        {
                            astrict == 2 ? null: <View className='share-item' onClick={() => this.props.sendText()}>
                                <Image className="share-banner-img" src="http://oss.tdianyi.com/front/7wMdSA2X7XEjw3DTyiekRhdbK43J5HBh.png" />
                                <View className='share-btn-title' >发送文字</View >
                            </View >
                        }
                        
                    </View >
                    <View className='share-cancle' onClick={()=>this.props.onClose()}>取消</View >
                </View >
            </View >:null
        )
    }
}
