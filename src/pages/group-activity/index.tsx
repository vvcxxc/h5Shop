import Taro, { Component } from "@tarojs/taro";
import { AtIcon, AtToast, AtTabs, AtTabsPane } from "taro-ui";
import { View, Text, Image, ScrollView, Button } from "@tarojs/components";
import "./index.less";
import request from '../../services/request';
import { getBrowserType } from "@/utils/common";
import { getGroupYouhuiInfo, getGroupbuyings, getShareSign, toWxPay, getUserYouhuiGroupId } from "./service";
import { getLocation } from "@/utils/getInfo";
import { Swiper, SwiperItem } from '@tarojs/components';
import ActivityItem from '@/components/activity-item';
import Cookie from 'js-cookie';
import wx from 'weixin-js-sdk';
import ApplyToTheStore from '@/components/applyToTheStore';
import TimeUp from '@/components/TimeUp';
import LandingBounced from '@/components/landing_bounced'//登录弹框

export default class GroupActivity extends Component {
    config = {
        navigationBarTitleText: "拼团活动",
        enablePullDownRefresh: false
    };


    state = {
        //允许参加活动
        allowGroup: '',
        isShare: false,
        isFromShare: false,
        showBounced: false,
        bannerImgIndex: 0,
        current: 0,
        ruleMore: false,
        data: {
            activity_begin_time: "",
            activity_end_time: "",
            activity_id: 0,
            activity_time_status: 0,
            address: "",
            begin_time: "",
            description: [],
            distances: "",
            end_time: "",
            gift: { title: "", price: "", postage: "", mail_mode: 2, cover_image: '' },
            gift_id: 0,
            icon: "",
            id: 0,//店id
            image: "",
            images: [],
            is_show_button: 0,
            list_brief: "",
            locate_match_row: "",
            name: "",//店名
            number: 0,
            participate_number: 0,
            participation_money: "",
            pay_money: "",
            preview: '',
            route: "",
            succeed_participate_number: 0,
            supplier_id: 0,
            team_set_end_time: '',
            tel: "",
            xpoint: '',
            youhui_id: 0,//活动id
            youhui_name: "",//活动名
            ypoint: ""
        },
        data2: {
            data: [],
            page: 1,
            pageRow: 2,
            total: 0,
        },
        newGroupList: []
    };

    /**
         * 获取位置信息
         */
    componentDidShow() {
        let arrs = Taro.getCurrentPages()
        if (arrs.length <= 1) { this.setState({ isFromShare: true }) }
        Taro.showLoading({ title: 'loading' })
        getLocation().then((res: any) => {
            this.getGroupInfo({ group_info_id: this.$router.params.id, is_xcx: 0, yPoint: res.latitude || '', xPoint: res.longitude || '' })
        }).catch((err) => {
            this.getGroupInfo({ group_info_id: this.$router.params.id, is_xcx: 0, yPoint: '', xPoint: '' })
        })
    }

    /**
     * 获取拼团活动信息
     * @param {object} data 活动id，坐标
     */
    getGroupInfo = (data: object) => {
        getGroupYouhuiInfo(data)
            .then((res: any) => {
                Taro.hideLoading();
                if (res.code == 200) {
                    let isPostage = false;
                    if (res.data.gift_id && res.data.gift.mail_mode == 2) { isPostage = true; }
                    let new_time = new Date().getTime()//ql
                    new Date(res.data.activity_end_time).getTime() + 86399000 < new_time ? this.setState({ allowGroup: '已结束' }) : null
                    new Date(res.data.activity_begin_time).getTime() > new_time ? this.setState({ allowGroup: '暂未开始' }) : null
                    this.setState({ data: res.data, isPostage });
                    this.getGroupList({ group_info_id: this.$router.params.id, page: 1 });
                } else {
                    Taro.showToast({ title: '请求失败', icon: 'none' });
                }
            }).catch(err => {
                Taro.hideLoading();
                Taro.showToast({ title: '请求失败', icon: 'none' });
            })
    }

    /**
      * 获取拼团列表
      * @param {object} data 活动id，页数
      */
    getGroupList = (data: object) => {
        getGroupbuyings(data).then((res: any) => {
            Taro.hideLoading();
            if (res.code == 200) {
                let newGroupList = this.chunk(res.data.data, 2);
                this.setState({ data2: res.data, newGroupList: newGroupList }, () => { this.listAtb() });
            } else {
                Taro.showToast({ title: res.message, icon: 'none' });
            }
        }).catch((err) => {
            Taro.hideLoading();
        })
    }

    /**
       * 切割数组
       * @param {object} arr 旧数组
       * @param {object} size 二维数组第二层长度
       */
    chunk = (arr, size) => {
        var arr1 = new Array();
        for (var i = 0; i < Math.ceil(arr.length / size); i++) {
            arr1[i] = new Array();
        }
        var j = 0;
        var x = 0;
        for (var i = 0; i < arr.length; i++) {
            if (!((i % size == 0) && (i != 0))) {
                arr1[j][x] = arr[i];
                x++;
            } else {
                j++;
                x = 0;
                arr1[j][x] = arr[i];
                x++;
            }
        }
        return arr1;
    }

    /**
          * 去图文详情
          */
    toImgList = () => {
        Taro.navigateTo({
            url: '/detail-pages/gift/gift?gift_id=' + this.$router.params.gift_id + '&activity_id=' + this.$router.params.activity_id
        })
    }

    /**
      * 底部发团参团，判断登录，判断带不带礼品
      */
    goToaConfirm = (e) => {
        let phone_status = Cookie.get('phone_status')
        if (phone_status != 'binded' && phone_status != 'bind_success') {//两者不等，需要登录
            this.setState({ showBounced: true })
            return
        }

        if (this.state.data.gift_id) {
            if (this.$router.params.type == '5') {
                //列表页或商家页进入拼团，路由params带过来的为活动id,id为活动id
                Taro.navigateTo({
                    url: '/activity-pages/confirm-address/index?activityType=' + this.$router.params.type + '&id=' + this.$router.params.id + '&storeName=' + encodeURIComponent(this.state.data.name)
                })
            } else if (this.$router.params.type == '55') {
                //打开分享链接进入参团，接口的youhui_id为活动id，路由过来的id为团id
                Taro.navigateTo({
                    url: '/activity-pages/confirm-address/index?activityType=' + this.$router.params.type + '&id=' + this.$router.params.id + '&groupId=' + this.$router.params.publictypeid + '&storeName=' + encodeURIComponent(this.state.data.name)
                })
            }
        } else {
            this.payment();
        }
    }

    /**
      * 列表参团，判断登录，判断带不带礼品
      */
    goToaConfirmAddGroup = (_id, e) => {
        let phone_status = Cookie.get('phone_status')
        if (phone_status != 'binded' && phone_status != 'bind_success') {//两者不等，需要登录
            this.setState({ showBounced: true })
            return
        }
        if (this.state.data.gift_id) {
            Taro.navigateTo({
                url: '/activity-pages/confirm-address/index?activityType=55&id=' + this.$router.params.id + '&groupId=' + _id + '&storeName=' + encodeURIComponent(this.state.data.name)
            })
        } else {
            this.groupPayment(_id);
        }
    }

    /**
      * 底部按钮发团或者拼团支付,不带礼品
      */
    payment() {
        let that = this;
        let _tempid = this.$router.params.publictypeid ? this.$router.params.publictypeid : undefined;
        let _temptype = this.$router.params.type;
        Taro.showLoading({ title: 'loading' });
        let sameDatas = {
            public_type_id: this.$router.params.publictypeid ? this.$router.params.publictypeid : this.$router.params.id,
            activity_id: this.$router.params.activity_id,
            type: this.$router.params.type,
            xcx: 0,
            number: 1,
        };
        let browserType = getBrowserType();
        let datas;
        if (browserType == 'wechat') {
            datas = {
                ...sameDatas,
                open_id: Cookie.get(process.env.OPEN_ID),
                unionid: Cookie.get(process.env.UNION_ID),
            }
        }
        else if (browserType == 'alipay') {
            datas = {
                ...sameDatas,
                alipay_user_id: Cookie.get(process.env.ALIPAY_USER_ID),
            }
        }
        else {
            Taro.showToast({ title: "浏览器类型出错", icon: "none" }); return;
        }
        toWxPay(datas).then((res: any) => {
            Taro.hideLoading();
            if (res.code == 200) {
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
                } else {
                    Taro.showToast({ title: res.message, icon: 'none' })
                }
            }
        })
    }

    /**
     * 列表参团，不带礼品
     * @param {object} _groupid 团id
     */
    groupPayment(_groupid) {
        let that = this;
        Taro.showLoading({ title: 'loading' });
        let sameDatas = {
            public_type_id: _groupid,
            activity_id: this.$router.params.activity_id,
            type: 55,
            xcx: 0,
            number: 1,
        };
        let browserType = getBrowserType();
        let datas;
        if (browserType == 'wechat') {
            datas = {
                ...sameDatas,
                open_id: Cookie.get(process.env.OPEN_ID),
                unionid: Cookie.get(process.env.UNION_ID),
            }
        }
        else if (browserType == 'alipay') {
            datas = {
                ...sameDatas,
                alipay_user_id: Cookie.get(process.env.ALIPAY_USER_ID),
            }
        }
        else {
            Taro.showToast({ title: "浏览器类型出错", icon: "none" }); return;
        }

        toWxPay(datas).then((res: any) => {
            Taro.hideLoading();
            if (res.code == 200) {
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
                                that.goToGroupInfo(_groupid);
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
                            that.goToGroupInfo(_groupid);
                        } else { Taro.showToast({ title: "支付宝支付失败", icon: "none" }); }
                    })
                } else {
                    Taro.showToast({ title: res.message, icon: 'none' })
                }
            }
        })
    }


    /**
    * 发团支付后查询团id跳转
    *  @param {object} order_sn 订单号
    */
    getLastGroupId = (order_sn) => {
        Taro.showLoading({ title: '支付成功，正在查询用户增值活动id' });
        let timer = setTimeout(() => {
            clearTimeout(timer);
            getUserYouhuiGroupId({ order_sn: order_sn })
                .then((res: any) => {
                    if (res.code == 200) {
                        Taro.hideLoading();
                        this.goToGroupInfo(res.data.id)
                    } else {
                        this.getLastGroupId(order_sn)
                    }
                }).catch((err) => {
                    this.getLastGroupId(order_sn)
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

    /**
     * 列表轮播
     */
    listAtb = () => {
        let timer = setTimeout(() => {
            clearTimeout(timer);
            let tempPage = this.state.current == this.state.newGroupList.length - 1 ? 0 : this.state.current + 1;
            this.setState({ current: tempPage }, () => { this.listAtb() })
        }, 3000)
    }

    /**
    * 回首页
    */
    handleGoHome = () => { Taro.navigateTo({ url: '/' }) }

    render() {
        const { description } = this.state.data;
        const { showBounced } = this.state;
        return (
            <View className="group-activity-detail">
                <Swiper
                    onChange={(e) => {
                        this.setState({ bannerImgIndex: e.detail.current })
                    }}
                    className='group-banner'
                    circular
                    autoplay
                >
                    {
                        this.state.data.images.length ? this.state.data.images.map((item, index) => {
                            return (
                                <SwiperItem className="group-banner-swiperItem" key={item}>
                                    <Image className="group-banner-img" src={item} />
                                </SwiperItem>
                            )
                        }) : null
                    }
                </Swiper>
                <View className="banner-number-box">
                    <View className="banner-number">{Number(this.state.bannerImgIndex) + 1}</View>
                    <View className="banner-number">{this.state.data.images.length}</View>
                </View>
                <View className="collect-box">
                    <Image className="collect-img" src="http://oss.tdianyi.com/front/7mXMpkiaD24hiAEw3pEJMQxx6cnEbxdX.png" />
                </View>
                <View className="share-box">
                    <Image className="share-img" src="http://oss.tdianyi.com/front/Af5WfM7xaAjFHSWNeCtY4Hnn4t54i8me.png" />
                </View>

                <View className="group-info-content">
                    <View className="group-info-title">
                        <View className="group-info-title-label">拼团券</View>
                        <View className="group-info-title-text">{this.state.data.youhui_name}</View>
                    </View>
                    <View className="group-info-price">
                        <View className="group-price-info">
                            <View className="group-price-info-text">优惠价￥</View>
                            <View className="group-price-info-new">{this.state.data.participation_money}</View>
                            <View className="group-price-info-old">￥{this.state.data.pay_money}</View>
                        </View>
                        <View className="group-price-discounts">已优惠￥{Number(this.state.data.pay_money) - Number(this.state.data.participation_money)}</View>
                    </View>
                    <View className="group-info-label">
                        <View className="group-info-label-item">{this.state.data.number}人团</View>
                        {this.state.data.gift ? <View className="group-info-label-item">送{this.state.data.gift.title}</View> : null}
                    </View>
                </View>
                <Image className="group-banner-img" src="http://oss.tdianyi.com/front/AY8XDHGntwa8dWN3fJe4hTWkK4zFG7F3.png" />

                {
                    this.state.newGroupList.length ? <View className="group-group-num">
                        <View className='apply-title-box'>
                            <View className='apply-title-left'></View>
                            <View className='apply-title'>{this.state.data2.total}人正在拼</View>
                        </View>
                        <View className='apply-title-right'>正在拼团</View>
                    </View> : null

                }
                {
                    this.state.newGroupList.length ? <AtTabs
                        current={this.state.current}
                        scroll
                        className="swiper-group-list"
                        tabDirection='vertical'
                        height={'34.6vw'}
                        tabList={[]}
                        onClick={() => { }}>
                        {
                            this.state.newGroupList.map((item: any, index) => {
                                return (
                                    <AtTabsPane tabDirection='vertical' current={this.state.current} index={index} key={index} className="swiper-group-list-atTabsPane">
                                        <View className="swiper-group-list-item">
                                            <View className="swiper-item" onClick={() => { console.log(item[0]) }}>
                                                <View className="group-user" >
                                                    <View className="group-list-img" >
                                                        <Image className="listImg" src={item[0].avatar} />
                                                    </View>
                                                    <View className="group-list-name" >{item[0].real_name}</View>
                                                </View>

                                                <View className="group-info" >
                                                    <View className="group-list-timesbox" >
                                                        <View className="group-list-lack" >
                                                            <View className="group-list-lackredblack1" >还差</View>
                                                            <View className="group-list-lackred" >{item[0].number - item[0].participation_number}人</View>
                                                            <View className="group-list-lackredblack2" >拼成</View>
                                                        </View>
                                                        <View className="group-list-times" >
                                                            <TimeUp itemtime={item[0].end_at} />
                                                        </View>
                                                    </View>
                                                    <View className="group-list-btnbox" >
                                                        {
                                                            item[0].is_team ? <View className="group-list-btn" style={{ background: '#999999' }}  >您已参团</View> :
                                                                <View className="group-list-btn" onClick={this.goToaConfirmAddGroup.bind(this, item[0].id)} >立即参团</View>
                                                        }
                                                    </View>
                                                </View>
                                            </View>
                                            {
                                                item[1] ? <View className="swiper-item" >

                                                    <View className="group-user" >
                                                        <View className="group-list-img" >
                                                            <Image className="listImg" src={item[1].avatar} />
                                                        </View>
                                                        <View className="group-list-name" >{item[1].real_name}</View>
                                                    </View>

                                                    <View className="group-info" >
                                                        <View className="group-list-timesbox" >
                                                            <View className="group-list-lack" >
                                                                <View className="group-list-lackredblack1" >还差</View>
                                                                <View className="group-list-lackred" >{item[1].number - item[1].participation_number}人</View>
                                                                <View className="group-list-lackredblack2" >拼成</View>
                                                            </View>
                                                            <View className="group-list-times" >
                                                                <TimeUp itemtime={item[1].end_at} />
                                                            </View>
                                                        </View>
                                                        <View className="group-list-btnbox" >
                                                            {
                                                                item[1] && item[1].is_team ? <View className="group-list-btn" style={{ background: '#999999' }} >已参团</View> :
                                                                    <View className="group-list-btn" onClick={this.goToaConfirmAddGroup.bind(this, item[1].id)}  >参团</View>
                                                            }
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
                        : null

                }
                {/* <Swiper
                    onChange={(e) => {
                        // console.log(this.state.current, e.detail.current)
                        // if (this.state.current == this.state.list.length - 2) {
                        //     this.setState({ current: 0 })
                        // }
                        // else {
                        //     this.setState({ current: e.detail.current })
                        // };
                    }}
                    className='swiper-group-list'
                    autoplay
                    // circular
                    displayMultipleItems={2}
                    vertical
                >
                    {
                        this.state.list.map((item, index) => {
                            return (
                                <SwiperItem key={item} >
                                    <View className="swiper-item" onClick={() => { console.log(item) }}>

                                        <View className="group-user" >
                                            <View className="group-list-img" >
                                                <Image className="listImg" src={"http://oss.tdianyi.com/front/2tp2Gi5MjC47hd7mGBCjEGdsBiWt5Wec.png"} />
                                            </View>
                                            <View className="group-list-name" >{index}测试测试测试测试</View>
                                        </View>

                                        <View className="group-info" >
                                            <View className="group-list-timesbox" >
                                                <View className="group-list-lack" >
                                                    <View className="group-list-lackredblack1" >还差</View>
                                                    <View className="group-list-lackred" >33人</View>
                                                    <View className="group-list-lackredblack2" >拼成</View>
                                                </View>
                                                <View className="group-list-times" >
                                                    <TimeUp itemtime={'2020-6-8'} />
                                                </View>
                                            </View>
                                            <View className="group-list-btnbox" >
                                                <View className="group-list-btn" >参团</View>
                                            </View>
                                        </View>

                                    </View>
                                </SwiperItem>
                            )
                        })
                    }
                </Swiper> */}
                {
                    this.state.newGroupList.length ? <View className="group-group-bottom"></View> : null
                }

                <View className="group-store-info">
                    <ApplyToTheStore
                        isTitle={true}
                        img={this.state.data.preview}
                        name={this.state.data.name}
                        phone={this.state.data.tel}
                        address={this.state.data.address}
                        location={{ xpoint: this.state.data.xpoint, ypoint: this.state.data.ypoint }}
                    />
                </View>

                {this.state.data.gift ?
                    <View className="group-gift">
                        <View className="group-title-box">
                            <View className='group-title-left-box'>
                                <View className='group-title-left'></View>
                                <View className='group-title'>赠送礼品</View>
                            </View>
                            <View className='group-title-right'>
                                <View className='group-title-right-info'>查看详情</View>
                                <Image className="group-title-right-icon" src={"http://oss.tdianyi.com/front/SpKtBHYnYMDGks85zyxGHrHc43K5cxRE.png"} />
                            </View>
                        </View>
                        <View className='group-gift-brief'>{this.state.data.gift.title}</View>
                        <View className='group-gift-label-box'>
                            <View className='group-gift-label'>{this.state.data.gift.mail_mode == 1 ? '免运费' : `运费${this.state.data.gift.postage}元`}</View>
                        </View>
                        <Image className="group-gift-img" src={this.state.data.gift.cover_image} mode={'widthFix'} />
                    </View> : null
                }


                <View className="group-rules">
                    <View className="group-title-box">
                        <View className='group-title-left'></View>
                        <View className='group-title'>使用说明</View>
                    </View>
                    <View className="group-rules-item" >
                        <View className="rules-key">拼团人数：</View>
                        <View className="rules-words">{this.state.data.number}人成团</View>
                    </View>
                    <View className="group-rules-item" >
                        <View className="rules-key"> 拼团时限：</View>
                        <View className="rules-words">需{this.state.data.team_set_end_time}时内成团</View>
                    </View>
                    {/* <View className="group-rules-item" >
                        <View className="rules-key">有效期：</View>
                        <View className="rules-words">成团后7日内可用</View>
                    </View> */}

                    {
                        description.length ? <View>
                            <View className="group-rules-list-title" >使用规则：</View>
                            {
                                description.map((item) => {
                                    return (
                                        <View className="group-rules-list-text" >-{item}</View>
                                    )
                                })
                            }
                        </View> : null
                    }

                    {/* <View className="group-more" >
                        <Image className="group-more-icon" src={"http://oss.tdianyi.com/front/GQr5D7QZwJczZ6RTwDapaYXj8nMbkenx.png"} />
                        <View className="group-more-text" >查看更多</View>
                    </View> */}
                    {/* <View className="group-more" >
                        <Image className="group-more-icon" src={"http://oss.tdianyi.com/front/EhJAKdDjiD2N4D4MjJ2wWsdkHDf6bMkw.png"} />
                        <View className="group-more-text" >收起</View>
                    </View> */}
                </View>
                <View className="group-buy-box" >
                    <View className="group-buy-price-box" >
                        <View className="group-buy-price-icon" >￥</View>
                        <View className="group-buy-price-num" >{this.state.data.participation_money}</View>
                    </View>
                    <View className="group-buy-btn-box" >
                        <View className="group-buy-btn-left" >分享活动</View>
                        {
                            this.state.allowGroup ? <View className="group-buy-btn-right" >{this.state.allowGroup}</View>
                                : <View className="group-buy-btn-right" onClick={this.goToaConfirm.bind(this)} >
                                    <View className="group-buy-btn-group" > {this.$router.params.type == "55" ? '参加拼团' : '发起拼团'}</View>
                                    <View className="group-buy-btn-groupnum" >{this.state.data.number}人成团</View>
                                </View>
                        }
                    </View>
                </View>
                {
                    showBounced ? <LandingBounced cancel={() => { this.setState({ showBounced: false }) }} confirm={() => {
                        this.setState({ showBounced: false })
                    }} /> : null
                }
                {
                    this.state.isFromShare ? (
                        <View style={{ position: 'fixed', bottom: '50%', right: '0px', zIndex: 88 }} onClick={this.handleGoHome.bind(this)}>
                            <Image src={require('../../assets/go-home/go_home.png')} style={{ width: '80px', height: '80px' }} />
                        </View>
                    ) : ''
                }
            </View>
        );
    }
}