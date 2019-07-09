import Taro  from "@tarojs/taro";
import { View ,Text ,Image } from '@tarojs/components';

import '../style.scss'

interface suitStoreProps{
    suitStoreProps:any
}




export function SuitStore( props:suitStoreProps){
    const {
          distance,
          location_address,
          store_name,
          capita,image
         } = props.suitStoreProps
   
return <View className='a_buyBox'  style={{ paddingBottom:'0' }} >
        <View className='a_one' >适用商铺</View>
        <View className='a_imgBox'  >
           <Image  src={image} />
           <View className='a_imgDes'  >
              <View>{store_name}</View>
              <View>人均：{capita}</View>
              <Text>></Text>
           </View>    
        </View>
        <View className='a_dres' >
               {distance} <Text>|</Text> {location_address.length > 15 ? location_address.length.slice(0,15) + '...' : location_address  } <Text>|</Text>
        </View>
      </View>
}