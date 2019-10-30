import Taro, { Component } from "@tarojs/taro";
import { AtIcon, AtToast } from "taro-ui"
import { View, Text, Image, ScrollView, Button, Input, Textarea } from "@tarojs/components";
import "./index.scss";
import "taro-ui/dist/style/components/toast.scss";
import request from '../../services/request'
import { getBrowserType } from "@/utils/common";
import wx from 'weixin-js-sdk';
import Cookie from 'js-cookie';

export default class confirmAddress extends Component {
    config = {
        navigationBarTitleText: "确认订单"
    };

    state = {
        contentboxShow: false,
        giftChoice: true,
        coinsChoice: false,
        activity_type: 2
    };


    clickGift = (e) => {
        if (this.state.giftChoice == true) {
            this.setState({ giftChoice: false })
        } else {
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
        Taro.navigateTo({
            url: '/activity-pages/confirm-address/chooseAddress'
        })
    }
    //没有地址，新增并使用
    goToEditor = () => {
        Taro.navigateTo({
            url: '/activity-pages/Shipping-address/editor?type=useItem'
        })
    }

    payment = () => {
        let datas = {};
        let interval;
        let _type;
        let browserType = getBrowserType();
        if (browserType == 'wechat') {
            _type = 1;
        } else if (browserType == 'alipay') {
            _type = 2;
        } else {
            Taro.showToast({ title: "支付出错", icon: "none" });
        }
        if (this.$router.params.type == '1') {
            //1增值
            if (_type == 1) {
                datas = {
                    youhui_id: this.$router.params.id,
                    activity_id: this.$router.params.activity_id,
                    gift_id: this.state.giftChoice ? this.$router.params.gift_id : undefined,
                    open_id: Cookie.get(process.env.OPEN_ID),
                    unionid: Cookie.get(process.env.UNION_ID),
                    type: _type, //1 微信 2支付宝,增值的type跟拼团的type不是一回事
                    xcx: 0,
                }
            } else {
                datas = {
                    youhui_id: this.$router.params.id,
                    activity_id: this.$router.params.activity_id,
                    gift_id: this.state.giftChoice ? this.$router.params.gift_id : undefined,
                    type: _type,  //1 微信 2支付宝,增值的type跟拼团的type不是一回事
                    xcx: 0,
                    alipay_user_id: Cookie.get(process.env.ALIPAY_USER_ID),
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
                    let order_sn = res.data.channel_order_sn;
                    Taro.hideLoading();
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
                })
        } else if (this.$router.params.type == '5') {
            //5开团
            if (_type == 1) {
                datas = {
                    public_type_id: this.$router.params.id,
                    activity_id: this.$router.params.activity_id,
                    gift_id: this.state.giftChoice ? this.$router.params.gift_id : undefined,
                    open_id: Cookie.get(process.env.OPEN_ID),
                    unionid: Cookie.get(process.env.UNION_ID),
                    type: 5,
                    xcx: 0,
                    number: 1,
                }
            } else {
                datas = {
                    public_type_id: this.$router.params.id,
                    activity_id: this.$router.params.activity_id,
                    gift_id: this.state.giftChoice ? this.$router.params.gift_id : undefined,
                    type: 5,
                    xcx: 0,
                    number: 1,
                    alipay_user_id: Cookie.get(process.env.ALIPAY_USER_ID),
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
                })

        } else if (this.$router.params.type == '55') {
            //55参团
            if (_type == 1) {
                datas = {
                    public_type_id: this.$router.params.publictypeid,
                    activity_id: this.$router.params.activity_id,
                    gift_id: this.state.giftChoice ? this.$router.params.gift_id : undefined,
                    open_id: Cookie.get(process.env.OPEN_ID),
                    unionid: Cookie.get(process.env.UNION_ID),
                    type: 55,
                    xcx: 0,
                    number: 1,
                }
            } else {
                datas = {
                    public_type_id: this.$router.params.publictypeid,
                    activity_id: this.$router.params.activity_id,
                    gift_id: this.state.giftChoice ? this.$router.params.gift_id : undefined,
                    type: 55,
                    xcx: 0,
                    number: 1,
                    alipay_user_id: Cookie.get(process.env.ALIPAY_USER_ID),
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
                                        url: '/pages/activity/pages/group/group?id=' + this.$router.params.publictypeid,
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
                                    url: '/pages/activity/pages/group/group?id=' + this.$router.params.publictypeid,
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
                })
        } else {
            console.log('不知道啥子活动类型')
            return;
        }
    }

    render() {
        return (
            <View className="confirm-address">
                {
                    this.state.contentboxShow ? <View className="no-address-contentbox">
                        <View className="tips-box">
                            <View className="tips-box-info">你还没有收货地址，快去新增一个吧</View>
                            <View className="tips-box-bottomBox">
                                <View className="tips-box-bottomBox_cancle" onClick={() => { this.setState({ contentboxShow: false }) }}>取消</View>
                                <View className="tips-box-bottomBox_go">去新增</View>
                            </View>
                        </View>
                    </View> : null
                }


                {/* <View className="no-address-box" onClick={this.goToEditor.bind(this)}>
                    你的收货地址为空，点击添加收货地址
                    <View className="no-address-msgbox">
                        <AtIcon className="msg_icon" value='chevron-right' color='#b5b5b5' size='30' />
                    </View>
                </View> */}

                <View className="address-msgbox" onClick={this.goToAddressList.bind(this)}>
                    <View className="address-msgbox-left">
                        <View className="address-name-msgbox">
                            <View className="address-name-msgbox-info">
                                <View className="address-name-msgbox-key">收件人： </View>
                                <View className="address-name-msgbox-value-box">
                                    <View className="address-msgBox_userBox_name">杨大富</View>
                                    <View className="address-msgBox_userBox_phone">13546987455</View>
                                </View>
                            </View>
                            <View className="address-msgBox_userBox_choose">默认 </View>
                        </View>

                        <View className="address-addressInfo-msgbox">
                            <View className="address-address-msgbox-key">收货地址：</View>
                            <View className="address-address-item">广东省广州市海珠区广东省广州市海珠区广东省广州市海珠区</View>
                        </View>
                    </View>
                    <View className="address-msgbox-icon">
                        <AtIcon className="msg_icon" value='chevron-right' color='#b5b5b5' size='30' />
                    </View>
                </View>
                {
                    this.state.activity_type == 1 ?
                        <View className="group-msgbox">
                            <View className="group-msgbox-title-BOX">
                                <View className="group-titlebox">
                                    <Image className="group-titlebox-storeicon" src="http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/scSRkZHXxSj3z5jjaKWGzEPCX2cK524K.png" />
                                    <View className="group_storename">杨大富的五金店</View>
                                </View>
                                <View className="group-msgbox-icon">
                                    {/* <AtIcon className="msg_icon" value='chevron-right' color='#b5b5b5' size='30' /> */}
                                </View>
                            </View>
                            <View className="group-msgbox-content-BOX">
                                <View className="group-msgbox-content-imgbox">
                                    <Image className="group-msgbox-content-img" src="http://oss.tdianyi.com/front/B445jBjXwBdFyST6SEF4kPefkF34E2H6.png" mode="widthFix" />
                                </View>
                                <View className="group-msgbox-content-msgbox">
                                    <View className="group-msgbox-content-name">活动活动活动活动活动活动活动活动活动活动活动活动活动活动活动活动活动</View>
                                    <View className="group-msgbox-label-box">
                                        <View className="group-msgbox-label">3人团</View>
                                        <View className="group-msgbox-label">24小时</View>
                                    </View>
                                </View>
                            </View>
                        </View>
                        :
                        <View className="appre-msgbox">
                            <View className="appre-msgbox-title-BOX">
                                <View className="appre-titlebox">
                                    <Image className="appre-titlebox-storeicon" src="http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/scSRkZHXxSj3z5jjaKWGzEPCX2cK524K.png" />
                                    <View className="appre_storename">杨大富的五金店</View>
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
                                            <View className="appre-msgbox-yellowBox_left_money_num">100.00</View>
                                        </View>
                                        <View className="appre-msgbox-yellowBox_left_info">最高可抵100.00元</View>
                                    </View>
                                    <View className="appre-msgbox-yellowBox_middle">
                                        <View className="appre-msgbox-yellowBox_appre_name">增值活动增值活动增值活动增值活动增值活动</View>
                                        <View className="appre-msgbox-yellowBox_appre_label_box">
                                            <View className="appre-msgbox-yellowBox_appre_label">满100元可用</View>
                                            <View className="appre-msgbox-yellowBox_appre_label">随时退</View>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>
                }
                <View className="gift-msgbox">
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
                                    <Image className="gift-img"
                                        src="http://oss.tdianyi.com/front/B445jBjXwBdFyST6SEF4kPefkF34E2H6.png"
                                    />
                                </View>
                            </View>
                        </View>
                        <View className="gift-msgbox-giftinfo-giftmsg-box">
                            <View className="gift-msgbox-giftinfo-title">赠送礼品</View>
                            <View className="gift-msgbox-giftinfo-name">耳机</View>
                            <View className="gift-msgbox-label-box">
                                <View className="gift-msgbox-label">价值3000元</View>
                                <View className="gift-msgbox-label">运费8元</View>
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
                </View>
                {
                    this.state.activity_type == 1 ? <View className="yellow-info">拼团活动完成并使用后礼品即会送出</View>
                        : <View className="yellow-info">增值券使用后礼品即会送出</View>
                }

                <View className="paymoney_box">
                    <View className="paymoney_price">
                        <View className="paymoney_price_icon">￥</View>
                        <View className="paymoney_price_num">100</View>
                        {
                            this.state.giftChoice ? <View className='paymoney_price_info'>+5</View> : null
                        }
                    </View>
                    <View className="paymoney_buynow" >立即购买</View>
                </View>

            </View>
        );
    }
}
