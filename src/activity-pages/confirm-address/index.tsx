import Taro, { Component } from "@tarojs/taro";
import { AtIcon, AtToast } from "taro-ui"
import { View, Text, Image, ScrollView, Button, Input, Textarea } from "@tarojs/components";
import "./index.scss";
import "taro-ui/dist/style/components/toast.scss";
import request from '../../services/request'
import { getBrowserType } from "@/utils/common";
import wx from 'weixin-js-sdk';
import Cookie from 'js-cookie';
import iNoBounce from '@/utils/inobouce';
import LandingBounced from '@/components/landing_bounced'//登录弹框

export default class confirmAddress extends Component {
    config = {
        navigationBarTitleText: "确认订单"
    };

    state = {
        showBounced: false,//登录弹框
        contentboxShow: false,
        giftChoice: true,
        coinsChoice: false,
        data: {
            address: {
                city: "",
                detail: "",
                district: "",
                mobile: "",
                name: "",
                is_default: 0,
                province: ""
            },
            youhui: {
                activity_id: 0,
                gift_id: 0,
                gift_name: "",
                gift_pic: "",
                gift_price: 0,
                id: 0,
                image_url: "",
                init_money: 0,
                name: "",
                pay_money: 0,
                postage: 0,
                return_money: 0,
                total_fee: 0,
                youhuiHour: '',
                participation_number: 0
            },
            team_set_end_time: ''
        }
    };

    componentDidShow() {
        let u = navigator.userAgent
        if (u.indexOf('iPhone') > -1) {
            console.log('iNoBounce', iNoBounce)
            iNoBounce.enable()
        }
        console.log(this.$router.params);
        Taro.pageScrollTo({ scrollTop: 0 });
        let data;
        if (this.$router.params.address_id) {
            data = { youhui_id: this.$router.params.id, address_id: this.$router.params.address_id }
        } else {
            data = { youhui_id: this.$router.params.id }
        }
        if (this.$router.params.activityType == '1') {
            request({
                url: 'api/wap/user/appreciation/appreciationOrderInfo',
                method: "GET",
                data: data
            }).then((res: any) => {
                if (res.code == 200) {
                    this.setState({ data: res.data })
                } else {
                    Taro.showToast({ title: '加载失败', icon: 'none' })
                }

            }).catch((err) => {
                console.log(err);
                Taro.showToast({ title: '加载失败', icon: 'none' })
            })

        } else {
            request({
                url: 'api/wap/user/groupOrderInfo',
                method: "GET",
                data: data
            }).then((res: any) => {
                if (res.code == 200) {
                    console.log(res)
                    this.setState({ data: res.data })
                } else {
                    Taro.showToast({ title: '加载失败', icon: 'none' })
                }

            }).catch((err) => {
                console.log(err);
                Taro.showToast({ title: '加载失败', icon: 'none' })
            })

        }
    }
    // componentDidMount() {
    //     console.log(this.$router.params);
    //     Taro.showLoading({
    //         title: ""
    //     });
    //     let data;
    //     if (this.$router.params.address_id) {
    //         data = { youhui_id: this.$router.params.id, address_id: this.$router.params.address_id }
    //     } else {
    //         data = { youhui_id: this.$router.params.id }
    //     }
    //     if (this.$router.params.activityType == '1') {
    //         request({
    //             url: 'api/wap/user/appreciation/appreciationOrderInfo',
    //             method: "GET",
    //             data: data
    //         }).then((res: any) => {
    //             if (res.code == 200) {
    //                 Taro.hideLoading();
    //                 this.setState({ data: res.data })
    //             } else {
    //                 Taro.hideLoading();
    //                 Taro.showToast({ title: '加载失败', icon: 'none' })
    //             }

    //         }).catch((err) => {
    //             Taro.hideLoading();
    //             console.log(err);
    //             Taro.showToast({ title: '加载失败', icon: 'none' })
    //         })

    //     } else {
    //         request({
    //             url: 'api/wap/user/groupOrderInfo',
    //             method: "GET",
    //             data: data
    //         }).then((res: any) => {
    //             if (res.code == 200) {
    //                 Taro.hideLoading();
    //                 console.log(res)
    //                 this.setState({ data: res.data })
    //             } else {
    //                 Taro.hideLoading();
    //                 Taro.showToast({ title: '加载失败', icon: 'none' })
    //             }

    //         }).catch((err) => {
    //             Taro.hideLoading();
    //             console.log(err);
    //             Taro.showToast({ title: '加载失败', icon: 'none' })
    //         })

    //     }
    // }
    clickGift = (e) => {
        if (this.state.giftChoice == true) {
            this.setState({ giftChoice: false })
        } else {
            if ((!this.state.data.address || !this.state.data.address.detail) && this.state.data.youhui.gift_id) {
                Taro.showToast({ title: '请添加收货地址后再提交', icon: 'none' })
            }
            this.setState({ giftChoice: true, coinsChoice: false })
        }
    }

    clickCoins = (e) => {
        if (this.state.coinsChoice == true) {
            this.setState({ coinsChoice: false })
        } else {
            this.setState({ coinsChoice: true, giftChoice: false })
        }
    }
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
    //没有地址，新增并使用
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

    payment = () => {
        let phone_status = Taro.getStorageSync('phone_status')
        if (phone_status !== 'binded' && phone_status != 'bindsuccess') {
            this.setState({ showBounced: true })
            return
        }

        if ((!this.state.data.address || !this.state.data.address.detail) && this.state.data.youhui.gift_id && this.state.giftChoice) {
            this.setState({ contentboxShow: true })
            return;
        }
        let datas = {};
        let interval;
        let _type;
        let browserType = getBrowserType();
        if (browserType == 'wechat') {
            _type = 1;
        } else if (browserType == 'alipay') {
            _type = 2;
        } else {
            Taro.showToast({ title: "网页类型出错", icon: "none" });
        }
        let that = this;
        if (this.$router.params.activityType == '1') {
            //1增值activityType == '1'
            if (_type == 1) {
                //增值--微信浏览器
                console.log('增值--微信浏览器')
                if (this.state.giftChoice && this.state.data.youhui.gift_id) {
                    //增值--微信浏览器--有选礼品
                    datas = {
                        youhui_id: this.$router.params.id,
                        activity_id: this.state.data.youhui.activity_id,
                        gift_id: this.state.data.youhui.gift_id,
                        open_id: Cookie.get(process.env.OPEN_ID),
                        unionid: Cookie.get(process.env.UNION_ID),
                        type: _type, //1 微信 2支付宝,增值的type跟拼团的type不是一回事
                        xcx: 0,
                    }
                } else {
                    //增值--微信浏览器--没有选礼品
                    datas = {
                        youhui_id: this.$router.params.id,
                        activity_id: this.state.data.youhui.activity_id,
                        open_id: Cookie.get(process.env.OPEN_ID),
                        unionid: Cookie.get(process.env.UNION_ID),
                        type: _type, //1 微信 2支付宝,增值的type跟拼团的type不是一回事
                        xcx: 0,
                    }
                }
            } else {
                //增值--支付宝浏览器
                if (this.state.giftChoice && this.state.data.youhui.gift_id) {
                    //增值--支付宝浏览器--有选礼品
                    datas = {
                        youhui_id: this.$router.params.id,
                        activity_id: this.state.data.youhui.activity_id,
                        gift_id: this.state.data.youhui.gift_id,
                        type: _type,  //1 微信 2支付宝,增值的type跟拼团的type不是一回事
                        xcx: 0,
                        alipay_user_id: Cookie.get(process.env.ALIPAY_USER_ID),
                    }
                } else {
                    //增值--支付宝浏览器--没有选礼品
                    datas = {
                        youhui_id: this.$router.params.id,
                        activity_id: this.state.data.youhui.activity_id,
                        type: _type,  //1 微信 2支付宝,增值的type跟拼团的type不是一回事
                        xcx: 0,
                        alipay_user_id: Cookie.get(process.env.ALIPAY_USER_ID),
                    }
                }
            }
            //请求支付属性
            request({
                url: 'v1/youhui/wxXcxuWechatPay',
                method: "POST",
                header: {
                    "Content-Type": "application/json"
                },
                data: JSON.stringify(datas)
            })
                .then((res: any) => {
                    Taro.hideLoading();
                    if (res.code == 200) {
                        let order_sn = res.data.channel_order_sn;

                        if (_type == 1) {
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
                                        Taro.showLoading({
                                            title: 'loading',
                                        });
                                        interval = setInterval(function () {
                                            //查询用户最后一次购买的增值活动id
                                            request({
                                                url: 'v1/youhui/getUserLastYouhuiId',
                                                method: "GET",
                                                data: { order_sn: order_sn }
                                            }).then((res: any) => {
                                                if (res.code == 200) {
                                                    clearInterval(interval);
                                                    Taro.hideLoading();
                                                    //得到增值活动id并跳转活动详情
                                                    Taro.navigateTo({
                                                        url: '/pages/activity/pages/appreciation/appreciation?id=' + res.data.id,
                                                        success: function (e) {
                                                            let page = Taro.getCurrentPages().pop();
                                                            if (page == undefined || page == null) return;
                                                            page.onShow();
                                                        }
                                                    })
                                                }
                                            })
                                        }, 500);
                                    } else {
                                        //微信支付失败
                                    }
                                }
                            );
                        } else if (_type == 2) {
                            //支付宝支付
                            window.AlipayJSBridge.call('tradePay', {
                                tradeNO: res.data.alipayOrderSn, // 必传，此使用方式下该字段必传
                            }, res => {
                                //支付宝支付成功
                                if (res.resultCode === "9000") {
                                    Taro.showLoading({
                                        title: 'loading',
                                    });
                                    interval = setInterval(function () {
                                        //查询用户最后一次购买的增值活动id
                                        request({
                                            url: 'v1/youhui/getUserLastYouhuiId',
                                            method: "GET",
                                            data: { order_sn: order_sn }
                                        }).then((res: any) => {
                                            if (res.code == 200) {
                                                clearInterval(interval);
                                                Taro.hideLoading();
                                                //得到增值活动id并跳转活动详情
                                                Taro.navigateTo({
                                                    url: '/pages/activity/pages/appreciation/appreciation?id=' + res.data.id,
                                                    success: function (e) {
                                                        let page = Taro.getCurrentPages().pop();
                                                        if (page == undefined || page == null) return;
                                                        page.onShow();
                                                    }
                                                })
                                            }
                                        })
                                    }, 500);
                                } else {
                                    //支付宝支付失败
                                }
                            })
                        } else {
                            console.log('不知道啥子支付类型', _type)
                        }
                    } else {
                        Taro.showToast({ title: res.message, icon: 'none' })
                    }
                }).catch(err => {
                    Taro.hideLoading();
                })

        } else if (this.$router.params.activityType == '5') {
            //开团activityType == '5'
            if (_type == 1) {
                //开团--微信浏览器
                if (this.state.giftChoice && this.state.data.youhui.gift_id) {
                    //开团--微信浏览器--有选礼品
                    datas = {
                        public_type_id: this.$router.params.id,
                        activity_id: this.state.data.youhui.activity_id,
                        gift_id: this.state.data.youhui.gift_id,
                        open_id: Cookie.get(process.env.OPEN_ID),
                        unionid: Cookie.get(process.env.UNION_ID),
                        type: 5,
                        xcx: 0,
                        number: 1,
                    }
                } else {
                    //开团--微信浏览器--没有选礼品
                    datas = {
                        public_type_id: this.$router.params.id,
                        activity_id: this.state.data.youhui.activity_id,
                        open_id: Cookie.get(process.env.OPEN_ID),
                        unionid: Cookie.get(process.env.UNION_ID),
                        type: 5,
                        xcx: 0,
                        number: 1,
                    }
                }
            } else {
                //开团--支付宝浏览器--有选礼品
                if (this.state.giftChoice && this.state.data.youhui.gift_id) {
                    //开团--支付宝浏览器--有选礼品
                    datas = {
                        public_type_id: this.$router.params.id,
                        activity_id: this.state.data.youhui.activity_id,
                        gift_id: this.state.data.youhui.gift_id,
                        type: 5,
                        xcx: 0,
                        number: 1,
                        alipay_user_id: Cookie.get(process.env.ALIPAY_USER_ID),
                    }
                } else {
                    //开团--支付宝浏览器--没有选礼品
                    datas = {
                        public_type_id: this.$router.params.id,
                        activity_id: this.state.data.youhui.activity_id,
                        type: 5,
                        xcx: 0,
                        number: 1,
                        alipay_user_id: Cookie.get(process.env.ALIPAY_USER_ID),
                    }
                }
            }
            //请求支付属性
            request({
                url: 'payCentre/toWxPay',
                method: "POST",
                header: {
                    "Content-Type": "application/json"
                },
                data: JSON.stringify(datas)
            })
                .then((res: any) => {
                    Taro.hideLoading();
                    if (res.code == 200) {
                        let order_sn = res.channel_order_sn;//比增值少一层data
                        if (_type == 1) {
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
                                        //开团要得到开团活动id再跳转活动详情
                                        Taro.showLoading({
                                            title: 'loading',
                                            mask: true
                                        });
                                        interval = setInterval(() => {
                                            request({
                                                url: 'api/wap/user/getUserYouhuiGroupId',
                                                method: "GET",
                                                data: { order_sn: order_sn }
                                            }).then((res: any) => {
                                                if (res.code == 200) {
                                                    clearInterval(interval);
                                                    Taro.hideLoading();
                                                    let resGroupid = res.data.id;
                                                    Taro.navigateTo({
                                                        url: '/pages/activity/pages/group/group?id=' + resGroupid,
                                                        success: () => {
                                                            var page = Taro.getCurrentPages().pop();
                                                            if (page == undefined || page == null) return;
                                                            page.onLoad();
                                                        }
                                                    })
                                                }
                                            })
                                        }, 1000);
                                    } else {
                                        //微信支付失败
                                    }
                                }
                            );
                        } else if (_type == 2) {
                            //支付宝支付
                            window.AlipayJSBridge.call('tradePay', {
                                tradeNO: res.data.alipayOrderSn, // 必传，此使用方式下该字段必传
                            }, res => {
                                //支付宝支付成功
                                if (res.resultCode === "9000") {
                                    //开团要得到开团活动id再跳转活动详情
                                    Taro.showLoading({
                                        title: 'loading',
                                        mask: true
                                    });
                                    interval = setInterval(() => {
                                        request({
                                            url: 'api/wap/user/getUserYouhuiGroupId',
                                            method: "GET",
                                            data: { order_sn: order_sn }
                                        }).then((res: any) => {
                                            if (res.code == 200) {
                                                clearInterval(interval);
                                                Taro.hideLoading();
                                                let resGroupid = res.data.id;
                                                Taro.navigateTo({
                                                    url: '/pages/activity/pages/group/group?id=' + resGroupid,
                                                    success: () => {
                                                        var page = Taro.getCurrentPages().pop();
                                                        if (page == undefined || page == null) return;
                                                        page.onLoad();
                                                    }
                                                })
                                            }
                                        })
                                    }, 1000);
                                } else {
                                    //支付宝支付失败
                                }
                            })
                        } else {
                            console.log('不知道啥子支付类型', _type)
                        }
                    } else {
                        Taro.showToast({ title: res.message, icon: 'none' })
                    }
                }).catch(err => {
                    Taro.hideLoading();
                })
        } else if (this.$router.params.activityType == '55') {
            console.log('参团')
            //参团activityType == '55'
            if (_type == 1) {
                console.log('参团--微信浏览器')
                //参团--微信浏览器
                if (this.state.giftChoice && this.state.data.youhui.gift_id) {
                    console.log('参团--微信浏览器--有选礼品')
                    //参团--微信浏览器--有选礼品
                    datas = {
                        public_type_id: this.$router.params.groupId,
                        activity_id: this.state.data.youhui.activity_id,
                        gift_id: this.state.data.youhui.gift_id,
                        open_id: Cookie.get(process.env.OPEN_ID),
                        unionid: Cookie.get(process.env.UNION_ID),
                        type: 55,
                        xcx: 0,
                        number: 1,
                    }
                } else {
                    console.log('参团--微信浏览器--没有选礼品')
                    //参团--微信浏览器--没有选礼品
                    datas = {
                        public_type_id: this.$router.params.groupId,
                        activity_id: this.state.data.youhui.activity_id,
                        open_id: Cookie.get(process.env.OPEN_ID),
                        unionid: Cookie.get(process.env.UNION_ID),
                        type: 55,
                        xcx: 0,
                        number: 1,
                    }
                }
            } else {
                //参团--支付宝浏览器
                if (this.state.giftChoice && this.state.data.youhui.gift_id) {
                    console.log('参团--支付宝浏览器--有选礼品')
                    //参团--支付宝浏览器--有选礼品
                    datas = {
                        public_type_id: this.$router.params.groupId,
                        activity_id: this.state.data.youhui.activity_id,
                        gift_id: this.state.data.youhui.gift_id,
                        type: 55,
                        xcx: 0,
                        number: 1,
                        alipay_user_id: Cookie.get(process.env.ALIPAY_USER_ID),
                    }
                } else {
                    //参团--支付宝浏览器--没有选礼品
                    console.log('参团--支付宝浏览器--没有选礼品')
                    datas = {
                        public_type_id: this.$router.params.groupId,
                        activity_id: this.state.data.youhui.activity_id,
                        type: 55,
                        xcx: 0,
                        number: 1,
                        alipay_user_id: Cookie.get(process.env.ALIPAY_USER_ID),
                    }
                }
            }
            //请求支付属性
            request({
                url: 'payCentre/toWxPay',
                method: "POST",
                header: {
                    "Content-Type": "application/json"
                },
                data: JSON.stringify(datas)
            })
                .then((res: any) => {
                    Taro.hideLoading();
                    if (res.code == 200) {
                        if (_type == 1) {
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
                                        Taro.navigateTo({
                                            url: '/pages/activity/pages/group/group?id=' + that.$router.params.groupId,
                                            // url: '/activity-pages/my-activity/my.activity',
                                            success: function (e) {
                                                let page = Taro.getCurrentPages().pop();
                                                if (page == undefined || page == null) return;
                                                page.onShow();
                                            }
                                        })
                                    } else {
                                        //微信支付失败
                                    }
                                }
                            );
                        } else if (_type == 2) {
                            //支付宝支付
                            window.AlipayJSBridge.call('tradePay', {
                                tradeNO: res.data.alipayOrderSn, // 必传，此使用方式下该字段必传
                            }, res => {
                                //支付宝支付成功
                                if (res.resultCode === "9000") {
                                    Taro.navigateTo({
                                        url: '/pages/activity/pages/group/group?id=' + that.$router.params.groupId,
                                        // url: '/activity-pages/my-activity/my.activity',
                                        success: function (e) {
                                            let page = Taro.getCurrentPages().pop();
                                            if (page == undefined || page == null) return;
                                            page.onShow();
                                        }
                                    })
                                } else {
                                    //支付宝支付失败
                                }
                            })
                        } else {
                            console.log(_type)
                        }
                    } else {
                        Taro.showToast({ title: res.message, icon: 'none' })
                    }
                }).catch(err => {
                    Taro.hideLoading();
                })
        } else {
            console.log('不知道啥子活动类型')
            return;
        }
    }

    render() {
        const { showBounced } = this.state
        return (
            <View className="confirm-address">
                {
                    showBounced ? <LandingBounced cancel={() => { this.setState({ showBounced: false }) }} confirm={() => {
                        this.setState({ showBounced: false })
                    }} /> : null
                }
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
                    !this.state.data.address || !this.state.data.address.name ?
                        <View className="no-address-box" onClick={this.goToEditor.bind(this)}>
                            你的收货地址为空，点击添加收货地址
                    <View className="no-address-msgbox">
                                <AtIcon className="msg_icon" value='chevron-right' color='#b5b5b5' size='30' />
                            </View>
                        </View> : null
                }
                {
                    this.state.data.address && this.state.data.address.name ? <View className="address-msgbox" onClick={this.goToAddressList.bind(this)}>
                        <View className="address-msgbox-left">
                            <View className="address-name-msgbox">
                                <View className="address-name-msgbox-info">
                                    <View className="address-name-msgbox-key">收件人： </View>
                                    <View className="address-name-msgbox-value-box">
                                        <View className="address-msgBox_userBox_name">{this.state.data.address.name}</View>
                                        <View className="address-msgBox_userBox_phone">{this.state.data.address.mobile}</View>
                                    </View>
                                </View>
                                {
                                    this.state.data.address.is_default ? <View className="address-msgBox_userBox_choose">默认 </View> : null
                                }

                            </View>

                            <View className="address-addressInfo-msgbox">
                                <View className="address-address-msgbox-key">收货地址：</View>
                                <View className="address-address-item">{this.state.data.address.province + this.state.data.address.city + this.state.data.address.district + this.state.data.address.detail}</View>
                            </View>
                        </View>
                        <View className="address-msgbox-icon">
                            <AtIcon className="msg_icon" value='chevron-right' color='#b5b5b5' size='30' />
                        </View>
                    </View> : null
                }

                {
                    this.$router.params.activityType == '55' || this.$router.params.activityType == '5' ?
                        <View className="group-msgbox">
                            <View className="group-msgbox-title-BOX">
                                <View className="group-titlebox">
                                    <Image className="group-titlebox-storeicon" src="http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/scSRkZHXxSj3z5jjaKWGzEPCX2cK524K.png" />
                                    <View className="group_storename">{decodeURIComponent(this.$router.params.storeName)}</View>
                                </View>
                                <View className="group-msgbox-icon">
                                    {/* <AtIcon className="msg_icon" value='chevron-right' color='#b5b5b5' size='30' /> */}
                                </View>
                            </View>
                            <View className="group-msgbox-content-BOX">
                                <View className="group-msgbox-content-imgbox">
                                    <Image className="group-msgbox-content-img" src={this.state.data.youhui.image_url} />
                                </View>
                                <View className="group-msgbox-content-msgbox">
                                    <View className="group-msgbox-content-name">{this.state.data.youhui.name}</View>
                                    <View className="group-msgbox-label-box">
                                        {
                                            this.state.data.youhui.participation_number? <View className="group-msgbox-label">{this.state.data.youhui.participation_number}人团</View>:null
                                        }
                                        <View className="group-msgbox-label">{this.state.data.team_set_end_time}小时</View>
                                    </View>
                                </View>
                            </View>
                        </View>
                        :
                        <View className="appre-msgbox">
                            <View className="appre-msgbox-title-BOX">
                                <View className="appre-titlebox">
                                    <Image className="appre-titlebox-storeicon" src="http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/scSRkZHXxSj3z5jjaKWGzEPCX2cK524K.png" />
                                    <View className="appre_storename">{decodeURIComponent(this.$router.params.storeName)}</View>
                                </View>
                                <View className="appre-msgbox-icon">
                                    {/* <AtIcon className="msg_icon" value='chevron-right' color='#b5b5b5' size='30' /> */}
                                </View>
                            </View>
                            <View className="appre-msgbox-content-BOX">
                                <View className="appre-msgbox-yellowBox">
                                    <View className="appre-msgbox-yellowBox_left">
                                        <View className="appre-msgbox-yellowBox_left_money">
                                            <View className="appre-msgbox-yellowBox_left_money_icon">￥</View>
                                            <View className="appre-msgbox-yellowBox_left_money_num">{this.state.data.youhui.pay_money}</View>
                                        </View>
                                        <View className="appre-msgbox-yellowBox_left_info">最高可抵{this.state.data.youhui.return_money}元</View>
                                    </View>
                                    <View className="appre-msgbox-yellowBox_middle">
                                        <View className="appre-msgbox-yellowBox_appre_name">{this.state.data.youhui.name}</View>
                                        <View className="appre-msgbox-yellowBox_appre_label_box">
                                            <View className="appre-msgbox-yellowBox_appre_label">满{this.state.data.youhui.total_fee}元可用</View>
                                            {
                                                this.state.data.youhui.youhuiHour && this.state.data.youhui.youhuiHour != '' ? <View className="appre-msgbox-yellowBox_appre_label">{this.state.data.youhui.youhuiHour}</View> : null
                                            }
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                }

                {
                    this.state.data.youhui.gift_id ? <View className="gift-msgbox">
                        <View className="gift-msgbox-giftinfo-box">
                            <View className="gift-msgbox-giftinfo-chooseimg-box" onClick={this.clickGift.bind(this)}>
                                {
                                    this.state.giftChoice ? <Image className="gift-msgbox-giftinfo-chooseimg" src="http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/jCzizjY4Fjna5HdneGSccWChTtA4DThf.png" />
                                        : <Image className="gift-msgbox-giftinfo-chooseimg" src="http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/tX8YdWMcGPYZMdJGdCjTtRPD3WsP7szh.png" />

                                }
                            </View>
                            <View className="gift-msgbox-giftinfo-giftimg-box">
                                <View className="gift-image-list" >
                                    <View className="gift-image-content">
                                        <Image className="gift-img1" src="http://oss.tdianyi.com/front/enfshdWzXJy8FsBYeMzPfHJW8fetDNzy.png" />
                                        <Image className="gift-img2" src="http://oss.tdianyi.com/front/daNKrCsn2kK7Zr8ZzEJwdnQC5jPsaFkX.png" />
                                        <Image className="gift-img" src={this.state.data.youhui.gift_pic} />
                                    </View>
                                </View>
                            </View>
                            <View className="gift-msgbox-giftinfo-giftmsg-box">
                                <View className="gift-msgbox-giftinfo-title">赠送礼品</View>
                                <View className="gift-msgbox-giftinfo-name">{this.state.data.youhui.gift_name}</View>
                                <View className="gift-msgbox-label-box">
                                    <View className="gift-msgbox-label">价值{this.state.data.youhui.gift_price}元</View>
                                    {
                                        this.state.data.youhui.postage ? <View className="gift-msgbox-label">运费{this.state.data.youhui.postage}元</View> : null
                                    }
                                </View>
                            </View>
                        </View>
                        {/* <View className="gift-msgbox-giftcoins-box">
                        <View className="gift-msgbox-giftcoins-chooseimg-box1" onClick={this.clickCoins.bind(this)}>
                            {
                                this.state.coinsChoice ? <Image className="gift-msgbox-giftcoins-chooseimg" src="http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/jCzizjY4Fjna5HdneGSccWChTtA4DThf.png" />
                                    : <Image className="gift-msgbox-giftcoins-chooseimg" src="http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/tX8YdWMcGPYZMdJGdCjTtRPD3WsP7szh.png" />

                            }
                        </View>
                        <View className="gift-msgbox-giftcoins-chooseimg-box2">
                            <View className="gift-msgbox-giftcoins-label">27礼品币</View>
                        </View>
                    </View> */}
                    </View> : null
                }


                {
                    this.state.giftChoice && this.state.data.youhui.gift_id && (this.$router.params.activityType == '55' || this.$router.params.activityType == '5') ? <View className="yellow-info">拼团活动完成并使用后礼品即会送出</View>
                        : (
                            this.state.giftChoice && this.state.data.youhui.gift_id && this.$router.params.activityType == '1' ? <View className="yellow-info">增值券使用后礼品即会送出</View> : null
                        )
                }

                <View className="paymoney_box">
                    <View className="paymoney_price">
                        <View className="paymoney_price_icon">￥</View>
                        <View className="paymoney_price_num">{this.state.data.youhui.pay_money}</View>
                        {
                            this.state.data.youhui.gift_id && this.state.giftChoice && this.state.data.youhui.postage ? <View className='paymoney_price_info'>+{this.state.data.youhui.postage}</View> : null
                        }
                    </View>
                    <View className="paymoney_buynow" onClick={this.payment.bind(this)} >立即购买</View>
                </View>

            </View>
        );
    }
}
