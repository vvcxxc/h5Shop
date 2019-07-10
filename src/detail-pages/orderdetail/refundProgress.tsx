import Taro, {   useEffect  , useState } from "@tarojs/taro";
import { View , Text } from '@tarojs/components';

import request from '../../services/request'
import './style.scss'

function Index (){
    const { id } = this.$router.params
    const [ defaultData , setData ] = useState({
        apply_time:0,//申请时间
        refund_time:0,//退款时间
        refund_typ:1,//退款类型  1 全额退 2 部分
        refund_order_sn:null,//退款订单号
        schedule:1 ,// schedule 退款进度 1 未到账 2 已到
        refund_money:0,//退款金额
        coupons_log_id:null,//id
        refund_channel:4,//退款渠道 1微信，2支付宝，3快付通，4条条码，5网银在线，6快钱
    })
    let timer :any
    useEffect(()=>{
        request({
            url: "v3/user/coupons/refund/schedule",
            data: { coupons_log_id : id },
        }).then((res:any)=>{
           
               console.log(res)
               setData( Object.assign({},defaultData,res) )
           
        }).catch(()=>{
           Taro.showToast({ title:'加载失败',icon:'none' })
           timer = setTimeout(()=>{ Taro.navigateBack()  },2000)
        })
        return function(){
            if(timer)clearTimeout(timer)
        }
    },[id])
    const handerTypeReturn = ()=>{
        switch(defaultData.refund_channel*1){
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
            default :
            return ''                
        }       
    }
    return <View className='z_refundBox' >
             <View className='z_head'  >
                 ￥{ defaultData.refund_money }  { defaultData.refund_typ === 1 ? '已退款' : '部分退款'  } 
             </View>
             <View className='z_item'  >
                <Text>退款金额：</Text><Text>￥{defaultData.refund_money}</Text>
             </View>
             <View className='z_item'  >
                <Text>退款账户：</Text><Text>{handerTypeReturn()}</Text>
             </View>
             <View className='z_item'  >
                <Text>退款进程：</Text><Text>{ defaultData.schedule *1 === 1 ? '未到账' : '已到账' }</Text>
             </View>
             <View className='z_item'  >
                <Text>申请时间：</Text><Text>{defaultData.apply_time}</Text>
             </View>
             <View className='z_item'  >
                <Text>退款时间：</Text><Text>{defaultData.refund_time}</Text>
             </View>
           </View>
}

Index.config  = {
    navigationBarTitleText: '退款进度',
}  

export default Index