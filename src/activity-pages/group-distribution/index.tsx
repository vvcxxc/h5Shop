import Taro, { Component } from "@tarojs/taro";
import { AtIcon, AtToast, AtTabs, AtTabsPane } from "taro-ui";
import { View, Text, Image, ScrollView, Button, Swiper, SwiperItem } from "@tarojs/components";
import "./index.less";
import { getBrowserType } from "@/utils/common";
import { groupOrderInfo, toWxPay, getUserYouhuiGroupId } from "./service";
import { getLocation } from "@/utils/getInfo";
import Cookie from 'js-cookie';

export default class distributionDetail extends Component {
    config = {
        navigationBarTitleText: "拼团活动购买订单页",
        enablePullDownRefresh: false
    };
    state = {
        chooseGift: false,
        chooseDistribution: false,
        contentboxShow: true,
        sumMoney: 0,
        data: {
            address: {
                id: 0,
                city: "",
                detail: "",
                district: "",
                mobile: "",
                name: "",
                is_default: 0,
                province: ""
            },
            supplier_location: {
                id: 0,
                name: ''
            },
            youhui: {
                activity_id: 0,
                gift_id: 0,
                gift_name: "",
                gift_pic: "",
                gift_price: 0,
                image_url: "",
                is_delivery: 0,
                location_id: 0,
                name: "",
                participation_number: 0,
                pay_money: 0,
                postage: 0,
                supplier_delivery_id: 0,
                supplier_delivery_service_money: 0,
                youhuiHour: 0,
                youhui_id: 0,
            },
            team_set_end_time: ''
        }
    }
    componentDidShow() {
        this.setState({ contentboxShow: false })
        let that = this;
        Taro.pageScrollTo({ scrollTop: 0 });
        let data;
        if (this.$router.params.address_id) {
            data = { youhui_id: this.$router.params.id, address_id: this.$router.params.address_id }
        } else {
            data = { youhui_id: this.$router.params.id }
        }
        groupOrderInfo(data)
            .then((res: any) => {
                if (res.code == 200) {
                    console.log(res)
                    that.setState({ data: res.data }, () => { that.calculateSumMoney() })
                } else {
                    Taro.showToast({ title: res.message, icon: 'none' })
                }
            }).catch((err) => {
                console.log(err);
                Taro.showToast({ title: '加载失败', icon: 'none' })
            })
    }

    /**
     * 没有地址，新增并使用
     */
    goToEditor = () => {
        if (this.$router.params.activityType == '55') {
            Taro.navigateTo({
                url: '/activity-pages/Shipping-address/editor?type=useItem&activityType=55&goodsId=' + this.$router.params.id + '&groupId=' + this.$router.params.groupId + '&storeName=' + this.$router.params.storeName
            })
        } else {
            Taro.navigateTo({
                url: '/activity-pages/Shipping-address/editor?type=useItem&activityType=' + this.$router.params.activityType + '&goodsId=' + this.$router.params.id + '&storeName=' + this.$router.params.storeName
            })
        }
    }

    /**
     * 去店铺
     */
    goToStore = () => {
        Taro.navigateTo({
            url: '/pages/business/index?id=' + this.state.data.supplier_location.id
        })
    }

    /**
     * 换地址
     */
    goToAddressList = () => {
        if (this.$router.params.activityType == '55') {
            Taro.navigateTo({
                url: '/activity-pages/confirm-address/chooseAddress?activityType=55&goodsId=' + this.$router.params.id + '&groupId=' + this.$router.params.groupId + '&storeName=' + this.$router.params.storeName
            })
        } else {
            Taro.navigateTo({
                url: '/activity-pages/confirm-address/chooseAddress?activityType=' + this.$router.params.activityType + '&goodsId=' + this.$router.params.id + '&storeName=' + this.$router.params.storeName
            })
        }
    }

    /**
     * 选礼品
     */

    chooseGiftItem = () => {
        this.setState({ chooseGift: !this.state.chooseGift }, () => { this.calculateSumMoney(); })
    }

    /**
     * 选配送
     */
    chooseDistributionItem = () => {
        this.setState({ chooseDistribution: !this.state.chooseDistribution }, () => { this.calculateSumMoney(); })
    }

    /**
     * 总金额计算
     */
    calculateSumMoney = () => {
        let sum = Number(this.state.data.youhui.pay_money);
        if (this.state.chooseGift) { sum = sum + Number(this.state.data.youhui.postage) }
        if (this.state.chooseDistribution) { sum = sum + Number(this.state.data.youhui.supplier_delivery_service_money) }
        this.setState({ sumMoney: sum })
    }

    /**
     * 支付
     */
    payment = () => {
        let phone_status = Cookie.get('phone_status')
        if (phone_status != 'binded' && phone_status != 'bind_success') {//两者不等，需要登录
            this.setState({ showBounced: true })
            return
        }

        if ((!this.state.data.address || !this.state.data.address.detail) &&
            (
                (this.state.data.youhui.gift_id && this.state.chooseGift) ||
                (this.state.chooseDistribution && this.state.data.youhui.is_delivery)
            )
        ) {
            this.setState({ contentboxShow: true })
            return;
        }
        Taro.showLoading({ title: 'loading', mask: true });
        let _tempid = this.$router.params.groupId ? this.$router.params.groupId : undefined;
        let _temptype = this.$router.params.activityType;
        let sameDatas = {
            public_type_id: this.$router.params.activityType == '55' ? this.$router.params.groupId : this.$router.params.id,
            activity_id: this.state.data.youhui.activity_id,
            gift_id: this.state.chooseGift ? this.state.data.youhui.gift_id : undefined,
            is_distribution: this.state.chooseDistribution ? 1 : 0,
            address_id: this.state.data.address.id ? this.state.data.address.id : undefined,
            type: this.$router.params.activityType,
            xcx: 0,
            number: 1,
        };
        let data;
        let that = this;
        let browserType = getBrowserType();
        if (browserType == 'wechat') {
            data = {
                ...sameDatas,
                open_id: Cookie.get(process.env.OPEN_ID),
                unionid: Cookie.get(process.env.UNION_ID),
            }
        } else if (browserType == 'alipay') {
            data = {
                ...sameDatas,
                alipay_user_id: Cookie.get(process.env.ALIPAY_USER_ID)
            }
        } else {
            Taro.showToast({ title: "网页类型出错", icon: "none" });
            return;
        }
        console.log('data_', data)
        toWxPay(data).then((res: any) => {
            Taro.hideLoading();
            if (res.code == 200) {
                console.log('订单成功:', res)
                let order_sn = res.channel_order_sn;//比增值少一层data
                if (browserType == 'wechat') {
                    //微信支付
                    window.WeixinJSBridge.invoke(
                        'getBrandWCPayRequest', {
                        "appId": res.data.appId,
                        "timeStamp": res.data.timeStamp,
                        "nonceStr": res.data.nonceStr,
                        "package": res.data.package,
                        "signType": res.data.signType,
                        "paySign": res.data.paySign
                    },
                        function (res) {
                            //微信支付成功
                            if (res.err_msg == "get_brand_wcpay_request:ok") {
                                console.log('微信支付成功,order_sn:', order_sn)
                                if (_temptype == '5') {
                                    //开团要得到开团活动id再跳转活动详情
                                    that.getLastGroupId(order_sn);
                                } else if (_temptype == '55') {
                                    that.goToGroupInfo(_tempid);
                                }
                            } else { Taro.showToast({ title: "微信支付失败", icon: "none" }); }
                        }
                    );
                }
                else if (browserType == 'alipay') {
                    //支付宝支付
                    window.AlipayJSBridge.call('tradePay', {
                        tradeNO: res.data.alipayOrderSn, // 必传，此使用方式下该字段必传
                    }, res => {
                        //支付宝支付成功
                        if (res.resultCode === "9000") {
                            if (_temptype == '5') {
                                //开团要得到开团活动id再跳转活动详情
                                that.getLastGroupId(order_sn);
                            } else if (_temptype == '55') {
                                that.goToGroupInfo(_tempid);
                            }
                        } else { Taro.showToast({ title: "支付宝支付失败", icon: "none" }); }
                    })
                }
            } else {
                console.log('res失败', res)
                Taro.showToast({ title: res.message, icon: 'none' })
            }
        }).catch(err => {
            console.log('err', err)
            console.log('err', err.json())
            Taro.showToast({ title: '调起支付失败', icon: 'none' })
        })
    }

    /**
      * 发团支付后查询团id跳转
      *  @param {object} order_sn 订单号
      */
    getLastGroupId = (order_sn) => {
        let that = this;
        Taro.showLoading({ title: '支付成功，正在查询用户团活动id', mask: true });
        console.log('getLastGroupId', order_sn)
        let timer = setTimeout(() => {
            clearTimeout(timer);
            getUserYouhuiGroupId({ order_sn: order_sn })
                .then((res: any) => {
                    if (res.code == 200) {
                        Taro.hideLoading();
                        that.goToGroupInfo(res.data.id)
                    } else {
                        console.log('res', res)
                        that.getLastGroupId(order_sn)
                    }
                }).catch((err) => {
                    console.log('err', err)
                    that.getLastGroupId(order_sn)
                })
        }, 1000);
    }

    /**
     * 跳转团详情
     *  @param {object} _tempid 团id
     */
    goToGroupInfo = (_tempid: any) => {
        Taro.navigateTo({
            url: '/pages/activity/pages/group/group?id=' + _tempid,
            success: () => {
                var page = Taro.getCurrentPages().pop();
                if (page == undefined || page == null) return;
                page.onLoad();
            }
        })
    }

    render() {
        return (
            <View className="distribution-detail">
                {
                    this.state.contentboxShow ? <View className="no-address-contentbox">
                        <View className="tips-box">
                            <View className="tips-box-info">你还没有收货地址，快去新增一个吧</View>
                            <View className="tips-box-bottomBox">
                                <View className="tips-box-bottomBox_cancle" onClick={() => { this.setState({ contentboxShow: false }) }}>取消</View>
                                <View className="tips-box-bottomBox_go" onClick={this.goToEditor.bind(this)} >去新增</View>
                            </View>
                        </View>
                    </View> : null
                }
                {
                    this.state.data.address && this.state.data.address.name ?
                        <View className="address-red" onClick={this.goToAddressList.bind(this)}>
                            <View className="address-content">
                                {
                                    this.state.data.address.is_default ? <View className="address-label">默认</View> : null
                                }
                                {
                                    this.state.data.address.is_default ?
                                        <View className="address-info">{this.state.data.address.province + this.state.data.address.city + this.state.data.address.district + this.state.data.address.detail}</View>
                                        :
                                        <View className="address-info-normal">{this.state.data.address.province + this.state.data.address.city + this.state.data.address.district + this.state.data.address.detail}</View>
                                }
                                <View className="user-info-label">
                                    <View className="user-name-label">{this.state.data.address.name}</View>
                                    <View className="user-phone-label">{this.state.data.address.mobile}</View>
                                </View>
                                <Image className="address-icon" src={"http://oss.tdianyi.com/front/SpKtBHYnYMDGks85zyxGHrHc43K5cxRE.png"} />
                            </View>
                        </View> : null
                }
                <View className="activity-box">
                    <View className="store-content" onClick={this.goToStore.bind(this)}>
                        <View className="store-left">
                            <Image className="store-icon" src="http://oss.tdianyi.com/front/JhGtnn46tJksAaNCCMXaWWCGmsEKJZds.png" />
                            <View className="store-name">{this.state.data.supplier_location.name}</View>
                        </View>
                        <Image className="store-right" src="http://oss.tdianyi.com/front/fpsw5CyhYJQTDEABZhs4iFDdC48ZGidn.png" />
                    </View>
                    <View className="activity-content">
                        <Image className="activity-img" src={this.state.data.youhui.image_url} />
                        <View className="activity-info">
                            <View className="activity-title">{this.state.data.youhui.name}</View>
                            <View className="activity-labels">
                                <View className="activity-label-item">随时退</View>
                            </View>
                            <View className="activity-price-box">
                                <View className="activity-price-icon">￥</View>
                                <View className="activity-price-num">{this.state.data.youhui.pay_money}</View>
                            </View>
                        </View>
                    </View>
                    {
                        this.state.data.youhui.gift_id ?
                            <View className="gift-content" onClick={this.chooseGiftItem.bind(this)}>
                                <View className="gift-choose-area">
                                    {
                                        this.state.chooseGift ?
                                            <Image className="gift-choose-icon" src="http://oss.tdianyi.com/front/mhth4rhHmcW3SmQ8kWiHeNw2NDdYxiwc.png" />
                                            :
                                            <Image className="gift-choose-icon" src="http://oss.tdianyi.com/front/nppTFyPWrnAGC535GBc2mddSfrXAwR5e.png" />

                                    }
                                </View>
                                <View className="gift-info-area">
                                    <Image className="gift-img" src={this.state.data.youhui.gift_pic} />
                                    <View className="gift-info">
                                        <View className="gift-title">{this.state.data.youhui.gift_name}</View>
                                        <View className="gift-labels">
                                            <View className="gift-label-item">价值￥{this.state.data.youhui.gift_price}</View>
                                            <View className="gift-label-item">运费{this.state.data.youhui.postage}元</View>
                                        </View>
                                    </View>
                                </View>
                            </View> : null
                    }
                    {
                        this.state.data.youhui.is_delivery ?
                            <View className="distribution-content" onClick={this.chooseDistributionItem.bind(this)}>
                                <View className="distribution-choose-area">
                                    {
                                        this.state.chooseDistribution ?
                                            <Image className="distribution-choose-icon" src="http://oss.tdianyi.com/front/mhth4rhHmcW3SmQ8kWiHeNw2NDdYxiwc.png" />
                                            :
                                            <Image className="distribution-choose-icon" src="http://oss.tdianyi.com/front/nppTFyPWrnAGC535GBc2mddSfrXAwR5e.png" />
                                    }
                                </View>
                                <View className="distribution-info">
                                    <View className="distribution-tips">选择后，商家将会提高送货上门的服务。</View>
                                    <View className="distribution-labels">
                                        <View className="distribution-label-item">配送费{this.state.data.youhui.supplier_delivery_service_money}元</View>
                                        {/* <View className="distribution-label-item">10km可送</View> */}
                                    </View>
                                </View>
                            </View> : null
                    }

                </View>
                <View className="order-box">
                    <View className='order-title-left-box'>
                        <View className='order-title-left'></View>
                        <View className='order-title'>订单详情</View>
                    </View>
                    <View className='order-item'>
                        <View className='order-item-key'>商品价格</View>
                        <View className='order-item-words'>￥{this.state.data.youhui.pay_money}</View>
                    </View>
                    {
                        this.state.chooseGift ?
                            <View className='order-item'>
                                <View className='order-item-key'>礼品运费</View>
                                <View className='order-item-words'>￥{this.state.data.youhui.postage}</View>
                            </View> : null
                    }{
                        this.state.chooseDistribution ?
                            <View className='order-item'>
                                <View className='order-item-key'>配送金额</View>
                                <View className='order-item-words'>￥{this.state.data.youhui.supplier_delivery_service_money}</View>
                            </View> : null
                    }
                    <View className='order-item-all'>
                        <View className='order-item-all-text'>合计</View>
                        <View className='order-item-all-num'>￥{this.state.sumMoney}</View>
                    </View>
                </View>

                <View className="paymoney_box">
                    <View className="paymoney_price">
                        <View className="paymoney_price_icon">￥</View>
                        <View className="paymoney_price_num">{this.state.sumMoney}</View>
                    </View>
                    <View className="paymoney_buynow" onClick={this.payment.bind(this)} >提交订单</View>
                </View>

            </View>
        );
    }
}
