import Taro, { Component } from "@tarojs/taro";
import { AtTabs, AtTabsPane } from 'taro-ui'
import { View, Image, Swiper, SwiperItem, ScrollView } from "@tarojs/components";
import './scrollTab.scss';
import TimeUp from './TimeUp';
import request from '../../../services/request';
import { getBrowserType } from "@/utils/common";
import Cookie from 'js-cookie';

interface Props {
    tabList: Array<any>;
    storeName?: any;
    isPostage: any,
    gift_id: any
}
let timer;
let timeout;
export default class Scrolltab extends Component<Props>{

    componentDidMount() {
        timer = setInterval(() => {
            let tempPage = this.state.current == this.props.tabList.length - 1 ? 0 : this.state.current + 1;
            this.setState({ current: tempPage })
        }, 5000)
    }

    componentDidShow() {
        clearInterval(timer);
        this.setState({ current: 0 })
        timer = setInterval(() => {
            let tempPage = this.state.current == this.props.tabList.length - 1 ? 0 : this.state.current + 1;
            this.setState({ current: tempPage })
        }, 5000)
    }
    componentWillUnmount() {
        clearInterval(timer);
    }
    state = {
        current: 0,
        Ypoint: 0
    }
    handleClick(value) {
        this.setState({
            current: value
        })
    }
    goToaConfirmAddGroup = (_id, e) => {
        if (this.props.gift_id) {
            clearInterval(timer);
            //轮播列表参团,路由params带过来的id为活动id, 接口传过来的id为团id
            Taro.navigateTo({
                url: '/activity-pages/confirm-address/index?activityType=55&id=' + this.$router.params.id + '&groupId=' + _id + '&storeName=' + encodeURIComponent(this.props.storeName)
            })
        } else {
            this.payment2(_id);
        }
    }
    payment2(_groupid) {
        Taro.showLoading({
            title: 'loading',
        })
        let _type;
        let browserType = getBrowserType();
        if (browserType == 'wechat') {
            _type = 1;
        } else if (browserType == 'alipay') {
            _type = 2;
        } else {
            Taro.showToast({
                title: "支付出错",
                icon: "none"
            });
        }
        let datas = {}
        if (_type == 1) {
            datas = {
                public_type_id: _groupid,
                activity_id: this.$router.params.activity_id,
                gift_id: this.props.isPostage ? this.$router.params.gift_id : undefined,
                open_id: Cookie.get(process.env.OPEN_ID),
                unionid: Cookie.get(process.env.UNION_ID),
                type: 55,
                xcx: 0,
                number: 1,
            }
        } else {
            datas = {
                public_type_id: _groupid,
                activity_id: this.$router.params.activity_id,
                gift_id: this.props.isPostage ? this.$router.params.gift_id : undefined,
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
                if (res.code == 200) {
                    let order_id = res.data.order_id;
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
                                        url: '/pages/activity/pages/group/group?id=' + _groupid,
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
                                    url: '/pages/activity/pages/group/group?id=' + _groupid,
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
    }
    touchStart = (e) => {
        // console.log(e.changedTouches[0].clientY)
        this.setState({ Ypoint: e.changedTouches[0].clientY })
    }
    touchMove = (e) => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
            // console.log(e.changedTouches[0].clientY)
            if (e.changedTouches[0].clientY > this.state.Ypoint) {
                this.setState({ current: this.state.current - 1 })
            } else if (this.state.current < this.props.tabList.length - 1) {
                this.setState({ current: this.state.current + 1 })
            }
        }, 3000);
    }
    render() {
        return (
            <div className="scrolltab" onTouchStart={this.touchStart.bind(this)} onTouchMove={this.touchMove.bind(this)}>
                <AtTabs
                    current={this.state.current}
                    scroll
                    height='200px'
                    tabDirection='vertical'
                    tabList={[]}
                    onClick={() => { }}>
                    {
                        this.props.tabList.map((item: any, index) => {
                            return (
                                <AtTabsPane tabDirection='vertical' current={this.state.current} index={index}>
                                    <View >
                                        <View className="group_list" >
                                            <View className="group_list_img" >
                                                <Image className="listImg" src={item[0].avatar} />
                                            </View>
                                            <View className="group_list_name" >{item[0].real_name}</View>
                                            <View className="group_list_btnbox" >
                                                {
                                                    item[0].is_team ? <View className="group_list_btn" style={{ background: '#999999' }}  >您已参团</View> :
                                                        <View className="group_list_btn" onClick={this.goToaConfirmAddGroup.bind(this, item[0].id)} >立即参团</View>
                                                }
                                            </View>
                                            <View className="group_list_timesbox" >
                                                <View className="group_list_lack" >
                                                    <View className="group_list_lackredblack1" >还差</View>
                                                    <View className="group_list_lackred" >{item[0].number - item[0].participation_number}人</View>
                                                    <View className="group_list_lackredblack2" >拼成</View>
                                                </View>
                                                <View className="group_list_times" >
                                                    <TimeUp itemtime={item[0].end_at} />
                                                </View>
                                            </View>
                                        </View>
                                        {
                                            item[1] ? <View className="group_list" >
                                                <View className="group_list_img" >
                                                    <Image className="listImg" src={item[1].avatar} />
                                                </View>
                                                <View className="group_list_name" >{item[1].real_name}</View>
                                                <View className="group_list_btnbox" >
                                                    {
                                                        item[1] && item[1].is_team ? <View className="group_list_btn" style={{ background: '#999999' }} >您已参团</View> :
                                                            <View className="group_list_btn" onClick={this.goToaConfirmAddGroup.bind(this, item[1].id)}  >立即参团</View>
                                                    }
                                                </View>
                                                <View className="group_list_timesbox" >
                                                    <View className="group_list_lack" >
                                                        <View className="group_list_lackredblack1" >还差</View>
                                                        <View className="group_list_lackred" >{item[1].number - item[1].participation_number}人</View>
                                                        <View className="group_list_lackredblack2" >拼成</View>
                                                    </View>
                                                    <View className="group_list_times" >
                                                        <TimeUp itemtime={item[1].end_at} />
                                                    </View>
                                                </View>
                                            </View> : null
                                        }
                                    </View>
                                </AtTabsPane>

                            )
                        })
                    }

                </AtTabs>
            </div>
        );
    }
}