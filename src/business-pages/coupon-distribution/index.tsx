import Taro, { Component } from "@tarojs/taro";
import { AtIcon, AtToast, AtTabs, AtTabsPane } from "taro-ui";
import { View, Text, Image, ScrollView, Button, Swiper, SwiperItem } from "@tarojs/components";
import "./index.less";
import { getBrowserType } from "@/utils/common";
import { discount_coupons, defaultAddress, wxWechatPay, getAddress } from "./service";
import { getLocation } from "@/utils/getInfo";
import Cookie from 'js-cookie';
import { accAdd } from '@/components/acc-num'

export default class distributionDetail extends Component {
    config = {
        navigationBarTitleText: "兑换券购买订单页",
        enablePullDownRefresh: false
    };
    state = {
        chooseDistribution: true,
        contentboxShow: false,
        sumMoney: 0,
        coupon: {
            id: 0,
            image: "",
            is_delivery: false,
            pay_money: '',
            return_money: '',
            total_fee: '',
            yname: "",
            youhui_type: 0,
            supplierDelivery: {
                created_at: null,
                delivery_end_time: "",
                delivery_phone: "",
                delivery_radius_m: 0,
                delivery_service_money: 0,
                delivery_start_time: "",
                delivery_status: 0,
                id: 0,
                location_xpoint: "",
                location_ypoint: "",
                supplier_id: 0,
                supplier_location_id: 0,
                updated_at: null,
            }
        },
        store: {
            id: 0,
            sname: "",
            supplier_id: 0,
        },
        address: {
            city: "",
            city_id: 0,
            create_time: 0,
            detail: "",
            district: "",
            district_id: 0,
            id: 0,
            is_default: 0,
            is_delete: 0,
            mobile: "",
            name: "",
            province: "",
            province_id: 0,
            user_id: 0
        }

    }
    componentDidShow() {
        this.setState({ contentboxShow: false })
        let that = this;
        Taro.pageScrollTo({ scrollTop: 0 });
        let data;
        Taro.showLoading({ title: 'loading', mask: true })
        if (that.$router.params.address_id) {
            discount_coupons(that.$router.params.id)
                .then((res: any) => {
                    if (res.code == 200) {
                        that.getTheAddress(that.$router.params.address_id);
                        that.setState({ coupon: res.data.info.coupon, store: res.data.info.store }, () => { that.calculateSumMoney() })
                    } else {
                        Taro.showToast({ title: res.message, icon: 'none' })
                        that.getTheAddress(that.$router.params.address_id);
                    }
                }).catch((err) => {
                    console.log(err);
                    Taro.showToast({ title: '加载失败', icon: 'none' })
                })
        } else {
            discount_coupons(that.$router.params.id)
                .then((res: any) => {
                    if (res.code == 200) {
                        that.getDefaultAddress();
                        that.setState({ coupon: res.data.info.coupon, store: res.data.info.store }, () => { that.calculateSumMoney() })
                    } else {
                        Taro.showToast({ title: res.message, icon: 'none' })
                        that.getDefaultAddress();
                    }
                }).catch((err) => {
                    console.log(err);
                    Taro.showToast({ title: '加载失败', icon: 'none' })
                })
        }
    }

    getTheAddress = (id) => {
        getAddress(id)
            .then((res: any) => {
                Taro.hideLoading();
                this.setState({ address: res.data })
            })
            .catch((err) => {
                Taro.hideLoading();
                Taro.showToast({ title: '查询地址失败', icon: 'none' })
            })
    }

    getDefaultAddress = () => {
        defaultAddress()
            .then((res: any) => {
                Taro.hideLoading();
                this.setState({ address: res.data })
            })
            .catch((err) => {
                Taro.hideLoading();
                Taro.showToast({ title: '查询地址失败', icon: 'none' })
            })
    }

    /**
     * 没有地址，新增并使用
     */
    goToEditor = () => {
        Taro.navigateTo({
            url: '/activity-pages/Shipping-address/editor?type=useItem&activityType=duihuan&goodsId=' + this.$router.params.id
        })
    }

    /**
     * 去店铺
     */
    goToStore = () => {
        Taro.navigateTo({
            url: '/pages/business/index?id=' + this.state.store.id
        })
    }

    /**
     * 换地址
     */
    goToAddressList = () => {
        Taro.navigateTo({
            url: '/activity-pages/confirm-address/chooseAddress?activityType=duihuan&goodsId=' + this.$router.params.id
        })
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
        let sum = Number(this.state.coupon.pay_money);
        if (this.state.chooseDistribution) { sum = accAdd(sum, this.state.coupon.supplierDelivery.delivery_service_money) }
        this.setState({ sumMoney: sum })
    }

    payMoney() {
        if ((!this.state.address || !this.state.address.id) &&
            (this.state.chooseDistribution && this.state.coupon.is_delivery)
        ) {
            this.setState({ contentboxShow: true })
            return;
        }

        Taro.showLoading({ title: 'loading', mask: true })
        let browserType = getBrowserType();
        let datas;
        let that = this;
        let sameData = {
            youhui_id: this.state.coupon.id,
            store_id: this.state.store.id,
            youhui_number: 1,
            xcx: 0,
            is_distribution: this.state.chooseDistribution ? 1 : 0,
            address_id: this.state.address.id
        }
        if (browserType == 'wechat') {
            datas = {
                ...sameData,
                type: 1,  //1 微信 2支付宝
                open_id: Cookie.get(process.env.OPEN_ID),
            }
        } else if (browserType == 'alipay') {
            datas = {
                ...sameData,
                type: 2,  //1 微信 2支付宝
                alipay_user_id: Cookie.get(process.env.ALIPAY_USER_ID),
            }
        } else {
            Taro.showToast({ title: "浏览器类型出错", icon: "none" });
        }
        wxWechatPay(datas)
            .then((res: any) => {
                Taro.hideLoading();
                if (browserType == 'wechat') {
                    //微信
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
                            Taro.hideLoading();
                            if (res.err_msg == "get_brand_wcpay_request:ok") {
                                //微信成功
                                Taro.showToast({ title: '支付成功', icon: 'none' })
                                that.goToOrder();
                            } else {
                                Taro.showToast({ title: '支付失败', icon: 'none' })
                            }
                        }
                    );
                }
                else if (browserType == 'alipay') {
                    window.AlipayJSBridge.call('tradePay', {
                        tradeNO: res.data.alipayOrderSn,
                    }, res => {
                        Taro.hideLoading();
                        if (res.resultCode === "9000") {
                            Taro.showToast({ title: '支付成功', icon: 'none' })
                            that.goToOrder();
                        } else {
                            Taro.showToast({ title: '支付失败', icon: 'none' })
                        }
                    })
                }
            })
    }

    /**
     * 支付完去订单页
     */
    goToOrder = () => {
        Taro.switchTab({
            url: '/pages/order/index',
            success: (e) => {
                let page = Taro.getCurrentPages().pop();
                if (page == undefined || page == null) return;
                page.onShow();

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
                    this.state.address && this.state.address.id ?
                        <View className="address-red" onClick={this.goToAddressList.bind(this)}>
                            <View className="address-content">
                                {
                                    this.state.address.is_default ? <View className="address-label">默认</View> : null
                                }
                                {
                                    this.state.address.is_default ?
                                        <View className="address-info">{this.state.address.province + this.state.address.city + this.state.address.district + this.state.address.detail}</View>
                                        :
                                        <View className="address-info-normal">{this.state.address.province + this.state.address.city + this.state.address.district + this.state.address.detail}</View>
                                }
                                <View className="user-info-label">
                                    <View className="user-name-label">{this.state.address.name}</View>
                                    <View className="user-phone-label">{this.state.address.mobile}</View>
                                </View>
                                <Image className="address-icon" src={"http://oss.tdianyi.com/front/SpKtBHYnYMDGks85zyxGHrHc43K5cxRE.png"} />
                            </View>
                        </View> : null
                }
                <View className="activity-box">
                    <View className="store-content" onClick={this.goToStore.bind(this)}>
                        <View className="store-left">
                            <Image className="store-icon" src="http://oss.tdianyi.com/front/JhGtnn46tJksAaNCCMXaWWCGmsEKJZds.png" />
                            <View className="store-name">{this.state.store.sname}</View>
                        </View>
                        <Image className="store-right" src="http://oss.tdianyi.com/front/SpKtBHYnYMDGks85zyxGHrHc43K5cxRE.png" />
                    </View>
                    <View className="activity-content">
                        <Image className="activity-img" src={this.state.coupon.image} />
                        <View className="activity-info">
                            <View className="activity-title">{this.state.coupon.yname}</View>
                            <View className="activity-labels">
                                <View className="activity-label-item">随时可退</View>
                            </View>
                            <View className="activity-price-box">
                                <View className="activity-price-icon">￥</View>
                                <View className="activity-price-num">{this.state.coupon.pay_money}</View>
                            </View>
                        </View>
                    </View>
                    {
                        this.state.coupon.is_delivery ?
                            <View className="distribution-content" onClick={this.chooseDistributionItem.bind(this)}>
                                <View className="distribution-choose-area">
                                    {
                                        this.state.chooseDistribution ?
                                            <Image className="distribution-choose-icon" src="http://oss.tdianyi.com/front/Dx5xds6atc3ip3eRRdT3aaHm7abTCFWs.png" />
                                            :
                                            <Image className="distribution-choose-icon" src="http://oss.tdianyi.com/front/nppTFyPWrnAGC535GBc2mddSfrXAwR5e.png" />
                                    }
                                </View>
                                <View className="distribution-info">
                                    <View className="distribution-tips">选择后，商家将会提高送货上门的服务。</View>
                                    <View className="distribution-labels">
                                        <View className="distribution-label-item">配送费{this.state.coupon.supplierDelivery.delivery_service_money}元</View>
                                        <View className="distribution-label-item">{this.state.coupon.supplierDelivery.delivery_radius_m}km可送</View>
                                        <View className="distribution-label-item">{this.state.coupon.supplierDelivery.delivery_start_time}-{this.state.coupon.supplierDelivery.delivery_end_time}配送</View>
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
                        <View className='order-item-words'>￥{this.state.coupon.pay_money}</View>
                    </View>
                    {
                        this.state.chooseDistribution && this.state.coupon.is_delivery ?
                            <View className='order-item'>
                                <View className='order-item-key'>配送金额</View>
                                <View className='order-item-words'>￥{this.state.coupon.supplierDelivery.delivery_service_money}</View>
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
                    <View className="paymoney_buynow" onClick={this.payMoney.bind(this)} >提交订单</View>
                </View>
            </View>
        );
    }
}
