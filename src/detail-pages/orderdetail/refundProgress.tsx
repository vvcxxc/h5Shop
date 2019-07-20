import Taro, { Component, useEffect, DependencyList, navigateBack, useReducer } from "@tarojs/taro";
import { View, Text, Image } from '@tarojs/components';

import request from '../../services/request'
import './style.scss'

export default class Orderdetail extends Component {
    config = {
        navigationBarTitleText: '订单详情'
    };

    state = {
        info: {
            apply_time: 0,//申请时间
            refund_time: 0,//退款时间
            refund_typ: 0,//退款类型  1 全额退 2 部分
            refund_order_sn: null,//退款订单号
            schedule: 0,// schedule 退款进度 1 未到账 2 已到
            refund_money: 0,//退款金额
            coupons_log_id: null,//id
            refund_channel: 0,//退款渠道 1微信，2支付宝，3快付通，4条条码，5网银在线，6快钱
        }

    };

    componentWillMount() {
        request({
            url: "v3/user/coupons/refund/schedule",
            data: { coupons_log_id: this.$router.params._logid },
        }).then((res: any) => {

            console.log(res)
            //res.data=>res
            this.setState({ info: res.data })

        }).catch(() => {
            Taro.showToast({ title: '加载失败', icon: 'none' })
            setTimeout(() => { Taro.navigateBack() }, 2000)
        })
    }
    componentDidMount() {
    }


    handerTypeReturn = () => {
        switch (this.state.info.refund_channel * 1) {
            case 1:
                return '微信'
            case 2:
                return '支付宝'
            case 3:
                return '快付通'
            case 4:
                return '条条码'
            case 5:
                return '网银在线'
            case 6:
                return '快钱'
            default:
                return ''
        }
    }

    render() {
        return (
            <View className='z_refundBox' >
                <View className='z_head'  >
                    ￥{this.state.info.refund_money}  {this.state.info.refund_typ === 1 ? '已退款' : '部分退款'}
                </View>
                <View className='z_item'  >
                    <Text className='z_item_info1'>退款金额：</Text><Text className='z_item_info2'>￥{this.state.info.refund_money}</Text>
                </View>
                <View className='z_item'  >
                    <Text className='z_item_info1'>退款账户：</Text><Text className='z_item_info2'>{this.handerTypeReturn()}</Text>
                </View>
                <View className='z_item'  >
                    <Text className='z_item_info1'>退款进程：</Text><Text className='z_item_info2'>{this.state.info.schedule * 1 == 1 ? '未到账' : '已到账'}</Text>
                </View>
                <View className='z_item'  >
                    <Text className='z_item_info1'>申请时间：</Text><Text className='z_item_info2'>{this.state.info.apply_time}</Text>
                </View>
                <View className='z_item'  >
                    <Text className='z_item_info1'>退款时间：</Text><Text className='z_item_info2'>{this.state.info.refund_time}</Text>
                </View>
            </View>
        )

    }
}







