import Taro, { useState } from "@tarojs/taro";
import { View, Text } from '@tarojs/components';


import '../style.scss'
import { routeGo } from '../unit'

interface billingInfoProps {
  billingInfoProps: any
}

export function BillingInfo(props: billingInfoProps) {
  const {
    youhui_sn,
    tel,
    money,
    create_time,
    refund_time,
    confirm_time,
    status,
    cuoPonsId,
    pay_money
  } = props.billingInfoProps

  return <View className='a_buyBox' >
    <View className='a_one' >订单信息 </View>
    <View className='a_billingInfo' >
      <Text className="a_billingInfo_1" style={{ letterSpacing: '10px' }} >订单号</Text>:
      <Text  className="a_billingInfo_2" style={{ marginLeft: '9px' }}>{youhui_sn}</Text>
    </View>
    <View className='a_billingInfo' >
      <Text className="a_billingInfo_1"  style={{ letterSpacing: '10px' }}  >手机号</Text>:
      <Text className="a_billingInfo_2" style={{ marginLeft: '9px' }}>{tel}</Text>
    </View>
    <View className='a_billingInfo'  >
      <Text className="a_billingInfo_1"  style={{ letterSpacing: '22px' }} >总价</Text>:
      <Text  className="a_billingInfo_2" style={{ marginLeft: '9px', color: '#ED2424' }} >￥{money}</Text>
    </View>
    <View className='a_billingInfo'  >
      <Text className="a_billingInfo_1"  style={{ letterSpacing: '22px' }} >实付</Text>:
      <Text  className="a_billingInfo_2" style={{ marginLeft: '9px', color: '#ED2424' }} >￥{pay_money}</Text>
    </View>
    <View className='a_billingInfo' >
      <Text  className="a_billingInfo_1"  style={{ letterSpacing: '4px' }} >付款时间</Text>:
      <Text className="a_billingInfo_2" style={{ marginLeft: '9px' }}  >{create_time}</Text>
    </View>
    {
      status * 1 === 2 ?
        <View className='a_billingInfo' >
          <Text  className="a_billingInfo_1"  style={{ letterSpacing: '4px' }}>使用时间</Text>:
          <Text className="a_billingInfo_2" style={{ marginLeft: '9px' }}  >{confirm_time}</Text>
        </View> : null
    }
    {
      status * 1 === 3 ?
        <View className='a_billingInfo' >
          <Text className="a_billingInfo_1"  style={{ letterSpacing: '4px' }}>退款时间</Text>:
          <Text   className="a_billingInfo_2" style={{ marginLeft: '9px' }}  >{refund_time}</Text>
          <Text className='a_returnState' onClick={() => { routeGo('/detail-pages/orderdetail/refundProgress', cuoPonsId) }}  >退款进度</Text>
        </View> : null
    }
  </View>
}