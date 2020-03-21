import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image, ScrollView, Button, Swiper, SwiperItem } from "@tarojs/components";
import "./index.less";
import { getBrowserType } from "@/utils/common";
import { getYouhuiAppreciationInfo, getShareSign, wxXcxuWechatPay, getUserLastYouhuiId } from "./service";
import { getLocation } from "@/utils/getInfo";
import ApplyToTheStore from '@/components/applyToTheStore';
import LandingBounced from '@/components/landing_bounced'//登录弹框
import Cookie from 'js-cookie';

export default class AppreActivity extends Component {
    config = {
        navigationBarTitleText: "我的邀请列表",
        enablePullDownRefresh: false
    };


    state = {

    };

    render() {
        return (
            <View className="invitation-list">
                <View className="invitation-list-nav">
                    <View className="invitation-title">邀请的用户数量</View>
                    <View className="invitation-num">1234</View>
                </View>
                <View className='invitation-title-left-box'>
                    <View className='invitation-title-left'></View>
                    <View className='invitation-title'>赠送礼品</View>
                </View>
                <View className='item-content'>
                    <View className='invitation-item'>
                        <View className='invitation-item-uesr'>
                            <View className='invitation-photo'>
                                <Image className="invitation-img" src='http://oss.tdianyi.com/front/kNZBjbRNiNdnMBmSJpkFBAjJEKMx3ECi.png' />
                            </View>
                            <View className='invitation-name'>小熊敬礼普通用户</View>
                        </View>
                        <View className='invitation-item-time'>2020-02-23 15:30:45</View>
                    </View>
                </View>
            </View>

        );
    }
}
