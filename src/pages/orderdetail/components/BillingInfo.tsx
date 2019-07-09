import Taro , { useState }  from "@tarojs/taro";
import { View ,Text  } from '@tarojs/components';


import '../style.scss'
import {  routeGo } from '../unit'

interface billingInfoProps{
    billingInfoProps:any
}

export function BillingInfo (props:billingInfoProps){
    const {
        youhui_sn ,
        tel ,
        money , 
        create_time ,
        refund_time,
        confirm_time,
        status,
        cuoPonsId,
        } = props.billingInfoProps
  
    return <View  className='a_buyBox' >
             <View className='a_one' >订单信息 </View>
             <View className='a_billingInfo' >
               <Text style={{ letterSpacing : '10rpx' }} >订单号:</Text><Text>{youhui_sn}</Text>  
             </View>
             <View className='a_billingInfo' >
               <Text style={{ letterSpacing : '10rpx' }}  >手机号:</Text><Text>{tel}</Text>  
             </View>
             <View className='a_billingInfo'  >
               <Text style={{ letterSpacing : '28rpx' }} >总价:</Text><Text style={{ marginLeft:'18rpx',color:'#ED2424' }} >￥{money}</Text>   
             </View>
             <View   className='a_billingInfo' >
               <Text>付款时间:</Text><Text style={{ marginLeft:'48rpx' }}  >{create_time}</Text>
              </View>
              {
                status*1 === 2 ? 
                <View   className='a_billingInfo' >
                 <Text>使用时间:</Text><Text style={{ marginLeft:'48rpx' }}  >{confirm_time}</Text>
                </View>  :null
              }
               {
                status*1 === 3 ? 
                <View   className='a_billingInfo' >
                 <Text>退款时间:</Text><Text style={{ marginLeft:'48rpx' }}  >{refund_time}</Text>
                 <Text className='a_returnState' onClick={()=>{  routeGo('/pages/orderdetail/refundProgress',cuoPonsId) }}  >退款进度</Text>
                </View>  :null
              }
          </View>    
}