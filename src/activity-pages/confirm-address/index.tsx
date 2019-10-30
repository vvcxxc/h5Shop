import Taro, { Component } from "@tarojs/taro";
import { AtIcon, AtToast } from "taro-ui"
import { View, Text, Image, ScrollView, Button, Input, Textarea } from "@tarojs/components";
import "./index.scss";
import "taro-ui/dist/style/components/toast.scss";
import request from '../../services/request'


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
        let data = {};
        let interval;
   
        if (this.$router.params.type == '1') {

        } else if (this.$router.params.type == '5') {
            //5开团

        } else if (this.$router.params.type == '55') {
            //55参团

        } else {
            console.log('不知道啥子类型')
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
