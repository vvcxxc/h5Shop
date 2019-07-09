import Taro, {   useState    } from "@tarojs/taro";
import { View ,Text  } from '@tarojs/components';


import '../style.scss'
import { handerExceedTimeLimit } from '../unit'

interface shouldKnowProps {
    buyshowknowProps :any  
}



export function BuyShouldKnow (props:shouldKnowProps){
    const {
         description ,
         begin_time , 
         end_time ,
         status,
         } = props.buyshowknowProps

    const [ isMore , showMore  ] = useState( description.length > 4 ? false : true )
    let showDes = [...description]

    function handerShowMore(){
        showMore(!isMore)
    }
   
    if(!isMore) showDes=[...description].slice(0,4) 
    return <View className='a_buyBox' >
             <View className='a_one' >购买须知 
              { handerExceedTimeLimit(end_time) && status ===1 ? <Text className='a_outTime'  >已过期</Text> : null  } 
              { status ===3 ? <Text className='a_outTime'  >已退款</Text> : null  } 
             </View>
             <View className='a_two' >有效期</View>
             <View className='a_three' >{begin_time} - {end_time}</View>
             <View className='a_four' >使用规则：</View>
             {
               showDes.map((item:string,i:number)=> <View key={i} className='a_item' > · {item} </View>)       
             }          
             <View className='a_last'  onClick={handerShowMore}  > { isMore ? '收起更多' : '查看更多' } </View> 
           </View>
}

