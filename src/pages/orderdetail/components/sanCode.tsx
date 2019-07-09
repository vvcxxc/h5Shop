import Taro  from "@tarojs/taro";
import { View , Image } from '@tarojs/components';
import Code from '../img/code.png'

import '../style.scss'

interface sanCodeProps{
    code:string
    url:any
}

function SanCode (props:sanCodeProps) {
  
  const { code ,url } = props
 

  return <View  className='z_sanCodeContent' >
            <View>
                <Image src={ url ? url : Code }  />
            </View>
            <View>{code}</View>
         </View>
}

export default SanCode