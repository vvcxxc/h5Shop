/**title: 我的账单 */
import Taro, { Component, Config } from "@tarojs/taro"

import { View, Text, Image, ScrollView } from '@tarojs/components';

import './index.less';

import request from "@/services/request";

export default class MyCardTicket extends Component {

    config: Config = {
        navigationBarTitleText: "我的账单",
        disableScroll:true
    };

    state = {
        flag: false,

        list: [],

        orderItem: {},

        page: 1
    }

    handleClick = async (id) => {
        Taro.showLoading({
            title: 'loading',
            mask: true
        })
        await request({
            url: 'api/wap/orderGift/code',
            data: {
                id: id
            }
        }).then(res => {
            Taro.hideLoading()
            this.setState({
                orderItem: res.data,
                flag: true
            })
        })
    }

    handleScrollToLower = () => {
        this.setState({
            page: ++this.state.page
        }, () => {
            this.getData()
        })
    }

    handleClose = () => {
        this.setState({
            flag: false
        })
    }

    getData = () => {
        Taro.showLoading({
            title: 'loading',
            mask: true
        })
        request({
            url: 'api/wap/orderGift/list',
            data: {
                page: this.state.page
            }
        }).then(res => {
            this.setState({
                list: this.state.list.concat(res.data)
            }, () => {
                Taro.hideLoading()
            })
        })
    }

    componentDidMount() {
        this.getData()
    }

    render() {
        const { storeName, orderSn, code } = this.state.orderItem;
        return (

            <View className="card_ticket_wrap">
                {/* <View className="bg_img"></View> */}
                <Image src={require("../../assets/service/bg.png")} style={{ width: '100%', height: '100vh' }} />
                <ScrollView
                    scrollY
                    className="card_content"
                    onScrollToLower={this.handleScrollToLower.bind(this)}
                    lowerThreshold={30}
                >
                    {/* 券 */}
                    {
                        this.state.list.length != 0 ? this.state.list.map((item, index) => (
                            <View>
                                {
                                    item.is_delivery == 0 ? (
                                        <View className="card_ticket">
                                            <View className="card_ticket_info">
                                                <View className="store_name"><Text>{item.store_name}</Text></View>
                                                <View className="ticket_price"><Text>￥{item.amount}</Text></View>
                                                <View className="ticket_date"><Text>{item.create_time}</Text></View>
                                            </View>
                                            <View className="card_ticket_use_btn">
                                                <View className="use_btn_wrap">
                                                    <View className="btn_status" onClick={this.handleClick.bind(this, item.id)}>
                                                        <View className="btn_text">
                                                            <Text>立即使用</Text>
                                                        </View>
                                                        {/* <View className="btn_arrow"><Text>></Text></View> */}
                                                        {/* <View className='btn_arrow at-icon at-icon-chevron-right'></View> */}
                                                        <View>
                                                            <Image src={require("../../assets/service/arrow.png")} className="arrow_logo" />
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    ) : (
                                            <View className="card_ticket_isdelivery">
                                                <View className="card_ticket_info">
                                                    <View className="store_name"><Text>{item.store_name}</Text></View>
                                                    <View className="ticket_price"><Text>￥{item.amount}</Text></View>
                                                    <View className="ticket_date"><Text>{item.create_time}</Text></View>
                                                </View>
                                                <View className="card_ticket_use_btn_isdelivery">
                                                    <View className="use_btn_wrap">
                                                        <View className="btn_status">
                                                            <View className="btn_text"><Text>已领取</Text></View>
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        )
                                }
                            </View>
                        )) : (
                                <View className="no_data">
                                    <View className="imgBox">
                                        <Image className="logo" src={require("../../assets/service/logo.png")} />
                                        <View className="_msg">未发现支付账单</View>
                                    </View>
                                </View>
                            )
                    }
                </ScrollView>


                {/* modal */}
                {
                    this.state.flag ? (
                        <View id="modal" className="modal">
                            <View className="modal_content">
                                <View className="qr_code_content" style={{ flex: 8 }}>
                                    <View className="store_name"><Text>{storeName}</Text></View>
                                    <Image className="qr_code" src={code} alt="" />
                                    <View className="order_num">订单号：{orderSn}</View>
                                    <View className="gift_step">请向工作人员展示二维码领取礼品</View>
                                </View>
                                <View style={{ flex: 1 }}></View>
                                <View style={{ flex: 1 }}>
                                    {/* <View className="close_modal" onClick={this.handleClose.bind(this)}> x </View> */}
                                    <View className='close_modal at-icon at-icon-close' onClick={this.handleClose.bind(this)}></View>
                                </View>
                            </View>
                        </View>
                    ) : ''
                }
            </View>

        )
    }
} 