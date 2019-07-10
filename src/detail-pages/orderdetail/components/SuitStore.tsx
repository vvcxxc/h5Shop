import Taro from "@tarojs/taro";
import { View, Text, Image } from '@tarojs/components';

import '../style.scss'

interface suitStoreProps {
   suitStoreProps: any
}

// const handleClick2 = (_id, e) => {
//    Taro.navigateTo({
//       url: '/pages/business/index?id=' + _id
//    })
// };


export function SuitStore(props: suitStoreProps) {
   const {
      distance,
      location_address,
      store_name,
      capita,
      image,
      supplier_id
   } = props.suitStoreProps
   // console.log(props.suitStoreProps);
   return <View className='a_buyBox' style={{ paddingBottom: '0' }}
      onClick={() => {
         Taro.navigateTo({
            url: '/pages/business/index?id='+supplier_id
         })
      }}
   >
      <View className='a_one' >适用商铺</View>
      <View className='a_imgBox'  >
         <Image src={image} />
         <View className='a_imgDes'  >
            <View>{store_name}</View>
            <View>人均：{capita}</View>
            <Text>></Text>
         </View>
      </View>
      <View className='a_dres' >
         <View className='_address_distance'>{distance}</View>
         {/* <Text>|</Text> */}
         <View className='_address_icon'>|</View>
         <View className='_address' >{location_address}</View>
         <View className='_address_icon'>|</View>
         {/* {location_address.length > 15 ? location_address.length.slice(0, 15) + '...' : location_address}
         <Text>|</Text> */}
      </View>
   </View>
}