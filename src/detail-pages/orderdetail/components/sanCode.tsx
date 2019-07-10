import Taro from "@tarojs/taro";
import { View, Image } from '@tarojs/components';
// import Code from '../img/code.png'

import '../style.scss'

interface sanCodeProps {
    code: string
    url: any
    status: any
}

function SanCode(props: sanCodeProps) {

    const { code, url, status } = props


    return <View className='z_sanCodeContent' >
        <View>
            {/* <Image src={ url ? url : Code }  /> */}
            <Image src={url} />
        </View>
        <View style={{ textDecoration: status == "1" ? "none" : "line-through" }} >{code}</View>
    </View>
}

export default SanCode