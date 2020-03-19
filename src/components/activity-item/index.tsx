import Taro, { Component } from "@tarojs/taro";
import { AtIcon, AtToast } from "taro-ui"
import { View, Text, Image, ScrollView, Button } from "@tarojs/components";
import "./index.less";
import request from '../../services/request'
import { Swiper, SwiperItem } from '@tarojs/components'

interface Props {
    imgIconType: string;//图片左下角标识类型 group拼团 appre增值 goods商品券 cash现金券
    img: string;//图片
    label?: string;//短红色标签 
    longLabel?: string;//长红色标签 ，与红标签选其一
    name?: string;//短名字
    longName?: string;//长名字,与名字选其一
    brief: string;//简介
    oldPrice: string;//原价
    newPrice: string;//现价
    btnText: string;//按钮文字
    unBtnText?: string;//按钮底下的文字
    handleClick: Function//点击事件
}
export default class ActivityItem extends Component<Props> {

    render() {
        const imgIconType = this.props.imgIconType == 'group' ? <View className="item-group-btn">拼团购</View> : (
            this.props.imgIconType == 'appre' ? <View className="item-appre-btn">增值券</View> : (
                this.props.imgIconType == 'goods' ? <View className="item-goods-btn">商品券</View> : (
                    this.props.imgIconType == 'cash' ? <View className="item-cash-btn">现金券</View> : null
                )
            )
        )
        return (
            <View className="activity-item">
                <View className="item-img-box">
                    <Image className="item-img" src={this.props.img} />
                    {imgIconType}
                </View>
                <View className="item-info">
                    <View className="item-title">
                        {
                            this.props.label ? <View className="item-number">{this.props.label}</View> : null
                        }
                        {
                            this.props.longLabel ? <View className="item-long-number">{this.props.longLabel}</View> : null
                        }
                        {
                            this.props.name ? <View className="item-name">{this.props.name}</View> : null
                        }
                        {
                            this.props.longName ? <View className="item-long-name">{this.props.longName}</View> : null
                        }
                    </View>
                    <View className="item-validity">{this.props.brief}</View>
                    <View className="item-price">
                        <View className="new-price-icon">￥</View>
                        <View className="new-price-price">{this.props.oldPrice}</View>
                        <View className="old-price">￥{this.props.newPrice}</View>
                    </View>
                </View>
                <View className="item-btn-box">
                    <View className="item-group-btn">{this.props.btnText}</View>
                    {
                        this.props.unBtnText ? <View className="item-group-number">{this.props.unBtnText}</View> : null
                    }
                </View>
            </View>
        );
    }
}
