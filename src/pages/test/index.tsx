import Taro, { Component } from "@tarojs/taro";
import { AtIcon, AtToast, AtTabs, AtTabsPane } from "taro-ui";
import { View, Text, Image, ScrollView, Button, Swiper, SwiperItem } from "@tarojs/components";
import "./index.less";
import { getBrowserType } from "@/utils/common";
// import { } from "./service";
import { getLocation } from "@/utils/getInfo";
import Cookie from 'js-cookie';

export default class distributionDetail extends Component {
    config = {
        navigationBarTitleText: "拼团活动",
        enablePullDownRefresh: false
    };

    render() {
        return (
            <View className="distribution-detail">
                <View className="address-red">
                    <View className="address-content">
                        <View className="address-label">默认</View>
                        <View className="address-info">广东省广州市海珠区同创汇米兰道的团卖物联小熊敬礼团卖物联小熊敬礼团卖物联小熊敬礼</View>
                        <View className="user-info-label">
                            <View className="user-name-label">小小熊</View>
                            <View className="user-phone-label">15888888888</View>
                        </View>
                        <Image className="address-icon" src={"http://oss.tdianyi.com/front/SpKtBHYnYMDGks85zyxGHrHc43K5cxRE.png"} />
                    </View>
                </View>
                <View className="activity-box">
                    <View className="store-content">
                        <View className="store-left">
                            <Image className="store-icon" src="http://oss.tdianyi.com/front/JhGtnn46tJksAaNCCMXaWWCGmsEKJZds.png" />
                            <View className="store-name">小熊敬礼团卖物</View>
                        </View>
                        <Image className="store-right" src="http://oss.tdianyi.com/front/fpsw5CyhYJQTDEABZhs4iFDdC48ZGidn.png" />
                    </View>
                    <View className="activity-content">
                        <Image className="activity-img" src="http://oss.tdianyi.com/front/JhGtnn46tJksAaNCCMXaWWCGmsEKJZds.png" />
                        <View className="activity-info">
                            <View className="activity-title">  汽车美容一套服务 汽车美容一套服务</View>
                            <View className="activity-labels">
                                <View className="activity-label-item">随时退</View>
                            </View>
                            <View className="activity-price-box">
                                <View className="activity-price-icon">￥</View>
                                <View className="activity-price-num">687.90</View>
                            </View>
                        </View>
                    </View>
                    <View className="distribution-content">
                        <View className="distribution-choose-area">
                            <Image className="distribution-choose-icon" src="http://oss.tdianyi.com/front/fpsw5CyhYJQTDEABZhs4iFDdC48ZGidn.png" />
                        </View>
                        <View className="distribution-info">
                            <View className="distribution-tips">选择后，商家将会提高送货上门的服务。</View>
                            <View className="distribution-labels">
                                <View className="distribution-label-item">配送费5元</View>
                                <View className="distribution-label-item">10km可送</View>
                            </View>
                        </View>
                    </View>
                </View>
                <View className="order-box">
                    <View className='order-title-left-box'>
                        <View className='order-title-left'></View>
                        <View className='order-title'>订单详情</View>
                    </View>
                    <View className='order-item'>
                        <View className='order-item-key'>商品价格</View>
                        <View className='order-item-words'>￥299.00</View>
                    </View>
                    <View className='order-item'>
                        <View className='order-item-key'>礼品运费</View>
                        <View className='order-item-words'>￥8.00</View>
                    </View>
                    <View className='order-item'>
                        <View className='order-item-key'>配送金额</View>
                        <View className='order-item-words'>￥5.00</View>
                    </View>
                    <View className='order-item-all'>
                        <View className='order-item-all-text'>合计</View>
                        <View className='order-item-all-num'>￥299.00</View>
                    </View>
                </View>



                <View className="paymoney_box">
                    <View className="paymoney_price">
                        <View className="paymoney_price_icon">￥</View>
                        <View className="paymoney_price_num">22.00</View>
                    </View>
                    <View className="paymoney_buynow" >提交订单</View>
                </View>

            </View>
        );
    }
}
