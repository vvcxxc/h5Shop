import Taro, { Component, Config } from "@tarojs/taro"
import { View, Image, Text } from "@tarojs/components"
import request from '@/services/request'
import LandingBounced from '@/components/landing_bounced'
import { getUserInfo } from '@/utils/getInfo';
import Cookie from 'js-cookie'
import "./index.less"

type Props = any

interface State {
    emptyAvatar: String,
    settingShow: Boolean;
    cells: any;
    userInfo: any;
    user_img: string;
    data: string,
    activityList: Object[],
    list: Object[],
    userData: Object,
    showBounced: boolean,
    needLogin: boolean,
    mobile: number | string
}
export default class AppreActivity extends Component<Props> {
    config: Config = {
        navigationBarTitleText: "我的",
        enablePullDownRefresh: false,
        navigationBarBackgroundColor: '#ff4444',
        navigationBarTextStyle: 'white'
    };

    state: State = {
        emptyAvatar: '',
        settingShow: false,
        cells: {},
        userInfo: {},
        userData: {
            head_img: '',
            user_name: ''
        },
        user_img: '',
        data: '',
        activityList: [
            {
                des: '我的拼团活动',
                img: 'http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/JXPsxjERwiZNEeJYjBtNeEkZDenaxRsw.png',
                path: "/activity-pages/my-activity/my.activity",
            }
            , {
                des: '我的增值活动',
                img: 'http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/iKrnFcGfytkT6nGEiZYscGAwkmhwMtt4.png',
                path: "/activity-pages/my-activity/my.activity",
            },
        ],
        list: [
            {
                des: '我的邮寄礼品',
                img: 'http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/en6B6t6aYzMPTwpFTWYxE378ykzasSeC.png',
                path: "/activity-pages/my-welfare/pages/gift/welfare.gift"
            }
            ,
            {
                des: '我的到店奖品',
                img: 'http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/en6B6t6aYzMPTwpFTWYxE378ykzasSeC.png',
                path: "/activity-pages/my-prize/index"
            }
            , {
                des: '我的收货地址',
                prompt: '',
                img: 'http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/Kw2nhNTkChiWrnX3nPiMMTxy87Efmj4w.png',
                path: "/activity-pages/Shipping-address/index",
            },
            {
                des: '我的邀请列表',
                prompt: '',
                img: 'http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/PhwEi7cAeBRncA6rhHBWrtKEyGGCraJz.png',
                path: "/pages/my/invitation-list/index",
            },

        ],
        showBounced: false,//登录弹框
        needLogin: true,
        mobile: ''
    }

    componentDidShow() {
        let phone_status = Cookie.get('phone_status')
        this.handleGetUserinfo()
        request({
            url: 'v3/user/home_index'
        }).then((res: any) => {
            this.setState({
                userData: {
                    head_img: res.data.avatar,
                    user_name: res.data.user_name
                },
                emptyAvatar: res.data.emptyAvatar,
                mobile: res.data.mobile
            })
            if (res.data.mobile) {
                this.setState({ settingShow: true, needLogin: false })
            } else {
                this.setState({ settingShow: false, needLogin: true }, () => {
                    if (this.state.needLogin) {
                        this.setState({
                            userData: {
                                head_img: 'http://oss.tdianyi.com/front/ek7cPQsFbEt7DXT7E7B6Xaf62a46SCXw.png',
                                user_name: ''
                            },
                        })
                    }
                })
            }
            let myData: any = this.state.list
            myData[0].prompt = res.data.order_msg
            myData[1].prompt = res.data.gift_msg
            myData[2].prompt = res.data.activity_msg
            this.setState({ list: myData })
        })
    }

    /**
     * 获取用户信息
     */
    handleGetUserinfo = (): void => {
        const { userInfo } = this.state
        if (!userInfo.nickName) {
            const userInfo = Taro.getStorageSync("userInfo")
            if (userInfo) {
                this.setState({
                    userInfo
                })
            } else {
                // const { toMiniProgramSign } = require("../../utils/sign")
                // toMiniProgramSign(process.env.BASIC_API)
            }
        }
    }

    // 跳转路径
    jumpData = (data: string) => {
        // let phone_status = Cookie.get("phone_status")
        if (this.state.mobile) {
            Taro.navigateTo({ url: data })
            return
        }
        this.setState({ showBounced: true })
    }
    setPersonalInfo = () => {
        Taro.navigateTo({
            url: '/activity-pages/personal/index'
        })
    }
    // 手动登录跳转
    handLogin = () => {
        Taro.setStorageSync('ql_href', location.href)
        Taro.navigateTo({ url: '/pages/my/login_page/index' })
    }
    setOrderInfo = (type) => {
        Cookie.set("order_type", type)
        Taro.switchTab({
            url: '/pages/order/index'
        })
    }
    setActivityInfo = (type) => {
        Cookie.set("activity_type", type)
        Taro.navigateTo({ url: '/activity-pages/my-activity/my.activity' })
    }

    render() {
        const { showBounced, needLogin } = this.state
        return (
            <View className="my-list">
                <View className="my-list-banner">
                    {
                        this.state.settingShow ?
                            <Image className='my-list-set' src='http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/nAP8aBrDk2yGzG7AdaTrPDWey8fDB2KP.png' />
                            : null
                    }
                    <View className="my-list-info">
                        <View className="my-head">
                            <Image className="my-head-img" src={this.state.userData.head_img} />
                        </View>
                        {
                            this.state.emptyAvatar != 'Y' ?
                                <View className="my-text">
                                    <View className="my-text-top">{this.state.userData.user_name}</View>
                                </View> : null
                        }
                        {
                            this.state.emptyAvatar == 'Y' && this.state.settingShow ?
                                <View className="my-text" onClick={getUserInfo}>
                                    <View className="my-text-top">{this.state.userData.user_name}</View>
                                    <View className="my-text-bottom">一键获取用户头像~</View>
                                </View> : null
                        }
                        {
                            needLogin ? <View className="my-text" onClick={this.handLogin}>
                                <View className="my-text-top">登录手机号</View>
                                <View className="my-text-bottom">同步全渠道订单与优惠券~</View>
                            </View> : null
                        }
                    </View>

                </View>
                <View className="my-list-nav">
                    <View className="my-list-nav-title-box" onClick={this.setOrderInfo.bind(this, '待使用')}>
                        <View className="name-box">我的订单</View>
                        <View className="icon-box" >
                            <View className="icon-box-text">查看全部</View>
                            <Image className="icon-box-icon" src='http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/MWCtxcnQ6AmEpbHRedHfjeDhde2t5fr8.png' />

                        </View>
                    </View>
                    <View className="my-list-nav-btn-box">
                        <View className="nav-btn-item" onClick={this.setOrderInfo.bind(this, '待使用')}>
                            <Image className='item-img' src='http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/TThxprTzKKiDQZR2zA8zt7TH2bpGKewC.png' />
                            <View className="item-text">待使用</View>
                        </View>
                        <View className="nav-btn-item" onClick={this.setOrderInfo.bind(this, '已完成')}>
                            <Image className='item-img' src='http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/NwjXRGmCTmymnjC52J3E7btfzDX2FX7t.png' />
                            <View className="item-text">已完成</View>
                        </View>
                        <View className="nav-btn-item" onClick={this.setOrderInfo.bind(this, '已过期')}>
                            <Image className='item-img' src='http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/GfMPAZctjGhKbbr2HXjdkdAsdj3WaKTr.png' />
                            <View className="item-text">已过期</View>
                        </View>
                        <View className="nav-btn-item" onClick={this.setOrderInfo.bind(this, '已退款')}>
                            <Image className='item-img-refund' src='http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/zjbwTHQJEWZh2waG6K2xYjkAP26Gbktr.png' />
                            <View className="item-text">已退款</View>
                        </View>
                    </View>
                </View>
                <View className="my-tab-content">
                    <View className="my-tab-item" onClick={this.setActivityInfo.bind(this, '拼团')}>
                        <View className="tab-item-box">
                            <Image className='item-box-img' src='http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/JXPsxjERwiZNEeJYjBtNeEkZDenaxRsw.png' />
                            <View className="item-box-text">我的拼团活动</View>
                        </View>
                        <Image className="tab-item-icon" src='http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/MWCtxcnQ6AmEpbHRedHfjeDhde2t5fr8.png' />
                    </View>
                    <View className="my-tab-item" onClick={this.setActivityInfo.bind(this, '增值')}>
                        <View className="tab-item-box">
                            <Image className='item-box-img' src='http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/iKrnFcGfytkT6nGEiZYscGAwkmhwMtt4.png' />
                            <View className="item-box-text">我的增值活动</View>
                        </View>
                        <Image className="tab-item-icon" src='http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/MWCtxcnQ6AmEpbHRedHfjeDhde2t5fr8.png' />
                    </View>

                </View>
                <View className="my-tab-content">
                    {
                        this.state.list.map((item: any, index) => {
                            return <View className="my-tab-item" key={item} onClick={this.jumpData.bind(this, item.path)}>
                                <View className="tab-item-box">
                                    <Image className='item-box-img' src={item.img} />
                                    <View className="item-box-text">{item.des}</View>
                                </View>
                                <Image className="tab-item-icon" src='http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/MWCtxcnQ6AmEpbHRedHfjeDhde2t5fr8.png' />
                            </View>
                        })
                    }
                </View>
                {
                    showBounced ? <LandingBounced cancel={() => { this.setState({ showBounced: false }) }} confirm={() => {
                        this.setState({ showBounced: false })
                    }} /> : null
                }
            </View>
        );
    }
}
