import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image, ScrollView, Button, Swiper, SwiperItem } from "@tarojs/components";
import "./index.less";
import { getBrowserType } from "@/utils/common";
import { getYouhuiAppreciationInfo, getShareSign, wxXcxuWechatPay, getUserLastYouhuiId } from "./service";
import { getLocation } from "@/utils/getInfo";
import ApplyToTheStore from '@/components/applyToTheStore';
import LandingBounced from '@/components/landing_bounced'//登录弹框
import Cookie from 'js-cookie';
import Zoom from '@/components/zoom';
import ShareBox from "@/components/share-box";//分享组件
import wx from 'weixin-js-sdk';
import { geValueAddedPoster } from '@/api/poster'
import HavegiftPoster from '@/components/posters/value_added/have-gift'// 海报存在礼品
import NogiftPoster from '@/components/posters/value_added/no-gift'//   海报无礼品
import OtherPoster from '@/components/posters/value_added/other'//   其他类型
import { accSubtr, accAdd } from '@/utils/common'
const share_url = process.env.APPRE_Details_URL;
const BASIC_API = process.env.BASIC_API;//二维码域名
import { accAdd } from '@/components/acc-num'

export default class AppreActivity extends Component {
    config = {
        navigationBarTitleText: "增值活动",
        enablePullDownRefresh: false
    };


    state = {
        imgZoomSrc: '',
        imgZoom: false,
        //图片轮播下标
        bannerImgIndex: 0,
        //是否从分享链接进入
        isFromShare: false,
        //是否登录
        showBounced: false,
        //查看更多
        showMoreRules: false,
        data: {
            invitation_user_id: '',
            activity_begin_time: "",
            activity_end_time: "",
            activity_time_status: 0,
            address: "",
            begin_time: "",
            imagesCurrent: 0,
            description: [],
            distances: "",
            end_time: "",
            gift: { title: "", price: "", postage: "", mail_mode: 0 },
            gift_id: 0,
            gift_pic: '',
            id: 0,
            image: "",
            images: [],
            init_money: "",
            is_show_button: 0,
            location_name: "",
            name: "",
            pay_money: "",
            preview: "",
            return_money: "",
            store_id: 0,
            supplier_id: 0,
            tel: "",
            total_fee: 0,
            type: 0,
            validity: 0,
            xpoint: "",
            ypoint: "",
            dp_count: 0
        },
        showShare: false, //显示分享
        isShare: false,
        showPoster: false,
        posterList: {//海报数据
            gift: {
                gift_pic: '',
                gift_price: ''
            },
            store: {
                name: '',
                address: ''
            },
            youhui_type: ''
        },
        posterType: '',
        securityPoster: false// fasle不允许显示海报
    };

    /**
   * 判断从分享链接进入
   * 获取定位
   */
    componentDidShow() {
        let arrs = Taro.getCurrentPages()
        if (arrs.length <= 1) { this.setState({ isFromShare: true }) }
        Taro.showLoading({ title: 'loading' })
        getLocation().then((res: any) => {
            this.getAppreInfo({ youhui_id: this.$router.params.id, ypoint: res.latitude || '', xpoint: res.longitude || '' })
        }).catch((err) => {
            this.getAppreInfo({ youhui_id: this.$router.params.id, ypoint: '', xpoint: '' })
        })
    }


    /**
       * 获取增值活动信息
       * @param {object} data 增值id,坐标
       */
    getAppreInfo = (data: object) => {
        getYouhuiAppreciationInfo(data)
            .then((res: any) => {
                Taro.hideLoading();
                if (res.code == 200) {
                    let isPostage = false;
                    this.getPostList(res.data.id)
                    if (res.data.gift_id && res.data.gift.mail_mode == 2) { isPostage = true; }
                    this.setState({ data: res.data, isPostage }, () => {
                        this.toShare()
                        this.setState({ securityPoster: true })
                    });
                } else {
                    Taro.showToast({ title: '请求失败', icon: 'none' });
                }
            }).catch(err => {
                Taro.hideLoading();
                Taro.showToast({ title: '请求失败', icon: 'none' });
            })
    }

    /**
       * 判断活动是否有礼品，有礼品跳页面，没礼品调起支付
       * 判断是否登录
       */
    goToaConfirm = () => {
        Taro.showLoading({ title: 'loading', mask: true })
        let phone_status = Cookie.get('phone_status')
        if (phone_status != 'binded' && phone_status != 'bind_success') {//两者不等，需要登录
            Taro.hideLoading();
            this.setState({ showBounced: true })
            return
        }
        if (this.state.data.gift_id) {
            Taro.hideLoading();
            Taro.navigateTo({
                url: '/activity-pages/confirm-address/index?activityType=1&id=' + this.$router.params.id + '&storeName=' + encodeURIComponent(this.state.data.location_name)
            })
        } else {
            this.payment()
        }
    }

    /**
    * 支付,不带礼品
    */
    payment = () => {
        let that = this;
        Taro.showLoading({ title: 'loading', mask: true })
        let sameDatas = {
            youhui_id: this.$router.params.id,
            activity_id: this.$router.params.activity_id,
            xcx: 0,
        }
        let browserType = getBrowserType();
        let datas;
        if (browserType == 'wechat') {
            datas = {
                ...sameDatas,
                open_id: Cookie.get(process.env.OPEN_ID),
                unionid: Cookie.get(process.env.UNION_ID),
                type: 1,
            }
        }
        else if (browserType == 'alipay') {
            datas = {
                ...sameDatas,
                alipay_user_id: Cookie.get(process.env.ALIPAY_USER_ID),
                type: 2,
            }
        }
        else {
            Taro.showToast({ title: "浏览器类型出错", icon: "none" }); return;
        }
        wxXcxuWechatPay(datas).then((res: any) => {
            Taro.hideLoading();
            if (res.code == 200) {
                let order_sn = res.data.channel_order_sn;
                if (browserType == 'wechat') {
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
                                that.getLastYouhuiId(order_sn)
                            } else { Taro.showToast({ title: "微信支付失败", icon: "none" }); }
                        })
                }
                else if (browserType == 'alipay') {
                    window.AlipayJSBridge.call('tradePay', {
                        tradeNO: res.data.alipayOrderSn, // 必传，此使用方式下该字段必传
                    }, res => {
                        //支付宝支付成功
                        if (res.resultCode === "9000") {
                            that.getLastYouhuiId(order_sn)
                        } else { Taro.showToast({ title: "支付宝支付失败", icon: "none" }); }
                    })
                }
            } else {
                Taro.showToast({ title: res.message, icon: 'none' })
            }
        }).catch(err => {
            Taro.hideLoading();
            Taro.showToast({ title: "调起支付失败", icon: "none" });
        })
    }

    /**
     * 查询用户最后一次购买的增值活动id
     * @param {string} order_sn 订单号
     */
    getLastYouhuiId = (order_sn) => {
        let that = this;
        Taro.showLoading({ title: '支付成功，正在查询用户增值活动id', mask: true });
        let timer = setTimeout(() => {
            clearTimeout(timer);
            getUserLastYouhuiId({ order_sn: order_sn })
                .then((res: any) => {
                    if (res.code == 200) {
                        Taro.hideLoading();
                        //得到增值活动id并跳转活动详情
                        Taro.navigateTo({
                            url: '/pages/activity/pages/appreciation/appreciation?id=' + res.data.id,
                            success: (e) => {
                                let page = Taro.getCurrentPages().pop();
                                if (page == undefined || page == null) return;
                                page.onShow();
                            }
                        })
                    } else {
                        that.getLastYouhuiId(order_sn)
                    }
                }).catch((err) => {
                    that.getLastYouhuiId(order_sn)
                })
        }, 500);
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
   * 回首页
   */
    handleGoHome = () => {
        Taro.switchTab({ url: '/pages/index/index' })
    }
    toShare = () => {
        let userAgent = navigator.userAgent;
        let isIos = userAgent.indexOf('iPhone') > -1;
        let url: any;
        if (isIos) {
            url = sessionStorage.getItem('url');
        } else {
            url = location.href;
        }
        let titleMsg = this.state.data.gift_id ? '你有一张' + this.state.data.return_money + '元增值券待领取，邀请好友助力还有免费好礼拿！' : '什么？' + this.state.data.pay_money + '元还可以当' + this.state.data.return_money + '元花，走过路过不要错过！';
        let descMsg = this.state.data.gift_id ? this.state.data.pay_money + '元当' + this.state.data.return_money + '元花的秘密，我只告诉你一个！增值成功还有' + this.state.data.gift.price + '元' + this.state.data.gift.title + '免费拿！' : this.state.data.location_name + '增值券福利来了！只要邀请' + this.state.data.dp_count + '个好友助力，' + this.state.data.pay_money + '元秒变' + this.state.data.return_money + '元，感觉能省一个亿！';
        let linkMsg = share_url + 'id=' + this.$router.params.id + '&type=1&gift_id=' + this.$router.params.gift_id + '&activity_id=' + this.$router.params.activity_id
        Taro.request({
            url: 'http://api.supplier.tdianyi.com/wechat/getShareSign',
            method: 'GET',
            data: {
                url
            }
        })
            .then(res => {
                let { data } = res;
                wx.config({
                    debug: false,
                    appId: data.appId,
                    timestamp: data.timestamp,
                    nonceStr: data.nonceStr,
                    signature: data.signature,
                    jsApiList: [
                        'updateAppMessageShareData',
                        'updateTimelineShareData',
                        'onMenuShareAppMessage', //旧的接口，即将废弃
                        'onMenuShareTimeline'//旧的接口，即将废弃
                    ]
                })
                wx.ready(() => {
                    wx.updateAppMessageShareData({
                        title: titleMsg,
                        desc: descMsg,
                        link: linkMsg + '&invitation_user_id=' + this.state.data.invitation_user_id,
                        imgUrl: 'http://wx.qlogo.cn/mmhead/Q3auHgzwzM6UL4r7LnqyAVDKia7l4GlOnibryHQUJXiakS1MhZLicicMWicg/0',
                        success: function () {
                            //成功后触发
                        }
                    })
                })
            })
    }

    buttonToShare = () => {
        this.setState({ isShare: true });
    }
    closeShare = () => {
        this.setState({ isShare: false });
    }

    /* 请求海报数据 */
    getPostList = (id: number) => {
        geValueAddedPoster({ youhui_id: id, from: 'h5' })
            .then(({ data, code }) => {
                this.setState({ posterList: data })
                switch (data.youhui_type) {
                    case 0:
                        this.setState({ posterType: 'Other' })
                        break;
                    default:
                        this.setState({ posterType: data.gift.gift_pic ? 'HaveGift' : 'NoGift' })
                        break;
                }

            })
    }

    /* 关闭海报 */
    closePoster = () => {
        this.setState({ showPoster: false, showShare: false })
    }

    createPosterData = () => {
        if (this.state.securityPoster) {
            this.setState({ showPoster: true, showShare: false })
        } else {
            Taro.showToast({ title: '页面加载失败,请重试', icon: 'none' })
        }
    }

    render() {
        const { showBounced } = this.state;
        const { images, description } = this.state.data;
        const { posterList, posterType, showPoster } = this.state
        return (
            <View className="appre-activity-detail">
                {/* 分享组件 */}
                <ShareBox
                    astrict={2}
                    show={this.state.showShare}
                    onClose={() => this.setState({ showShare: false })}
                    sendText={() => { }}
                    sendLink={() => {
                        this.buttonToShare()
                        this.setState({ showShare: false })
                    }}
                    createPoster={this.createPosterData}
                />
                <View className={showPoster ? "show-poster" : "hidden-poster"} onClick={() => this.setState({ showPoster: false })}>
                    <HavegiftPoster type={posterType} show={showPoster} list={posterList} onClose={this.closePoster} />
                    <NogiftPoster type={posterType} show={showPoster} list={posterList} onClose={this.closePoster} />
                    <OtherPoster type={posterType} show={showPoster} list={posterList} onClose={this.closePoster} />
                    <View className="click-save">长按保存图片到相册</View>
                </View>

                {
                    this.state.isShare == true ? (
                        <View className='share_mask' onClick={this.closeShare}>
                            <View className='share_box'>
                                <View className='share_text text_top'>
                                    点击此按钮分享给好友
                                    </View>
                                <Image src={require('../../../assets/share_arro.png')} className='share_img' />
                            </View>
                        </View>
                    ) : null
                }
                <View
                    className="swiper-content"
                    onClick={(e) => {
                        this.setState({ imgZoom: true, imgZoomSrc: this.state.data.images[this.state.bannerImgIndex] })
                    }}>
                    <Swiper
                        onChange={(e) => {
                            this.setState({ bannerImgIndex: e.detail.current })
                        }}
                        className='appre-banner'
                        circular
                        autoplay
                    >
                        {
                            this.state.data.images.length ? this.state.data.images.map((item, index) => {
                                return (
                                    <SwiperItem className="appre-banner-swiperItem" key={item}>
                                        <Image className="appre-banner-img" src={item} />
                                    </SwiperItem>
                                )
                            }) : null
                        }
                    </Swiper>
                    <View className="banner-number-box">
                        <View className="banner-number">{accAdd(this.state.bannerImgIndex, 1)}</View>
                        <View className="banner-number">{this.state.data.images.length}</View>
                    </View>
                </View>

                {/* <View className="collect-box">
                    <Image className="collect-img" src="http://oss.tdianyi.com/front/7mXMpkiaD24hiAEw3pEJMQxx6cnEbxdX.png" />
                </View> */}
                {/* <View className="share-box">
                    <Image className="share-img" src="http://oss.tdianyi.com/front/Af5WfM7xaAjFHSWNeCtY4Hnn4t54i8me.png" />
                </View> */}

                <View className="appre-info-content">
                    <View className="appre-info-title">
                        <View className="appre-info-title-label">增值券</View>
                        <View className="appre-info-title-text">{this.state.data.name}</View>
                    </View>
                    <View className="appre-info-price">
                        <View className="appre-price-info">
                            <View className="appre-price-info-text">优惠价￥</View>
                            <View className="appre-price-info-new">{this.state.data.pay_money}</View>
                        </View>
                        <View className="appre-price-discounts">最高抵用￥{this.state.data.return_money}</View>
                    </View>

                </View>
                <Image className="appre-banner-nav" src="http://oss.tdianyi.com/front/AY8XDHGntwa8dWN3fJe4hTWkK4zFG7F3.png" />

                <View className="appre-store-info">
                    <ApplyToTheStore
                        store_id={this.state.data.store_id}
                        isTitle={true}
                        img={this.state.data.preview}
                        name={this.state.data.location_name}
                        phone={this.state.data.tel}
                        address={this.state.data.address}
                        location={{ xpoint: 111, ypoint: 222 }}
                        meter={this.state.data.distances}
                    />
                </View>

                {
                    this.state.data.gift_id ?
                        <View className="appre-gift">
                            <View className="appre-title-box">
                                <View className='appre-title-left-box'>
                                    <View className='appre-title-left'></View>
                                    <View className='appre-title'>赠送礼品</View>
                                </View>
                                <View className='appre-title-right' onClick={this.toImgList.bind(this)}>
                                    <View className='appre-title-right-info'  >查看详情</View>
                                    <Image className="appre-title-right-icon" src={"http://oss.tdianyi.com/front/SpKtBHYnYMDGks85zyxGHrHc43K5cxRE.png"} />
                                </View>
                            </View>
                            <View className='appre-gift-brief'>{this.state.data.gift.title}</View>
                            <View className='appre-gift-label-box'>
                                <View className='appre-gift-label'>{
                                    this.state.data.gift.mail_mode == 1 ? '免运费' : `运费${this.state.data.gift.postage}元`
                                }</View>
                            </View>
                            <Image className="appre-gift-img" src={this.state.data.gift_pic} mode={'widthFix'} />
                        </View> : null
                }



                <View className="appre-rules">
                    <View className="appre-title-box">
                        <View className='appre-title-left'></View>
                        <View className='appre-title'>使用说明</View>
                    </View>
                    {
                        this.state.data.type != 0 ?
                            <View className="appre-rules-item" >
                                <View className="rules-key">使用方式：</View>
                                <View className="rules-words">扫码支付时抵用</View>
                            </View> : null
                    }
                    {
                        this.state.data.type != 0 ?
                            <View className="appre-rules-item" >
                                <View className="rules-key"> 使用门槛：</View>
                                <View className="rules-words">满{this.state.data.total_fee}可用</View>
                            </View> : null
                    }
                    <View className="appre-rules-item" >
                        <View className="rules-key">有效期：</View>
                        <View className="rules-words">成团后{this.state.data.validity}日内可用</View>
                    </View>
                    {
                        this.state.data.type == 0 && description && description.length && !this.state.showMoreRules ? <View>
                            <View className="appre-rules-list-title" >使用规则：</View>                            {
                                description.length > 0 ? <View className="appre-rules-list-text" >-{description[0]}</View> : null
                            }
                            {
                                description.length > 1 ? <View className="appre-rules-list-text" >-{description[1]}</View> : null
                            }
                            {
                                description.length > 2 ? <View className="appre-rules-list-text" >-{description[2]}</View> : null
                            }
                            {
                                description.length > 3 ? <View className="appre-rules-list-text" >-{description[3]}</View> : null
                            }
                        </View> : null
                    }
                    {
                        this.state.data.type == 0 && description && description.length && description.length > 4 && this.state.showMoreRules ? <View>
                            <View className="appre-rules-list-title" >使用规则：</View>
                            {
                                description.map((item) => {
                                    return (
                                        <View className="appre-rules-list-text" >-{item}</View>
                                    )
                                })
                            }
                        </View> : null
                    }
                    {
                        this.state.data.type == 0 && description && description.length && description.length > 4 && !this.state.showMoreRules ? <View className="appre-more" onClick={() => { this.setState({ showMoreRules: true }) }} >
                            <Image className="appre-more-icon" src={"http://oss.tdianyi.com/front/GQr5D7QZwJczZ6RTwDapaYXj8nMbkenx.png"} />
                            <View className="appre-more-text" >查看更多</View>
                        </View> : null
                    }
                </View>
                {/* <View className="appre-buy-box" >
                    <View className="appre-buy-price-box" >
                        <View className="appre-buy-price-icon" >￥</View>
                        <View className="appre-buy-price-num" >{this.state.data.pay_money}</View>
                    </View>
                    <View className="appre-buy-btn-box" >
                        <View className="appre-buy-btn-left" >分享活动</View>
                        {
                            this.state.data.activity_time_status == 1 ? (
                                <View className="appre-buy-btn-right" >暂未开始</View>
                            ) : this.state.data.activity_time_status == 2 ? (
                                <View className="appre-buy-btn-right" onClick={this.goToaConfirm.bind(this)}>立即购买</View>
                            ) : this.state.data.activity_time_status == 3 ? (
                                <View className="appre-buy-btn-right">已结束</View>
                            ) : null
                        }
                    </View>
                </View> */}
                <View className="new-buy-box" >
                    <View className="new-price-box" >
                        <View className="new-price-icon" >￥</View>
                        <View className="new-price-num" >{this.state.data.pay_money}</View>
                    </View>
                    <View className="new-buy-btn-box" >
                        <View className="new-buy-btn-left" onClick={() =>
                            this.setState({ showShare: true })}>分享活动</View>
                        {
                            this.state.data.activity_time_status == 1 ? (
                                <View className="new-buy-btn-right">暂未开始</View>
                            ) : this.state.data.activity_time_status == 2 ? (
                                <View className="new-buy-btn-right" onClick={this.goToaConfirm.bind(this)}>立即购买</View>
                            ) : this.state.data.activity_time_status == 3 ? (
                                <View className="new-buy-btn-right">已结束</View>
                            ) : null
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
                        <View style={{ position: 'fixed', bottom: '80px', right: '20px', zIndex: 88, width: '80px', height: '80px' }} onClick={this.handleGoHome.bind(this)}>
                            <Image src={require('../../../assets/go-home/go_home.png')} style={{ width: '80px', height: '80px' }} />
                        </View>
                    ) : ''
                }


                <Zoom
                    src={this.state.imgZoomSrc}
                    showBool={this.state.imgZoom}
                    onChange={() => { this.setState({ imgZoom: !this.state.imgZoom }) }}
                />
            </View>
        );
    }
}
