import Taro, { Component, setStorageSync } from "@tarojs/taro"
import { Block, View, Image, Text } from "@tarojs/components"
import './index.styl'

interface Params {
  cancel: () => void,//暂不登录
  confirm: () => void,//立即登录
  }
const PhysicalBond = (params: Params)=> {
  return (
    <Block>
      {
         <View className="landing_bounced">
          <ul>
            <li>您还未登录</li>
            <li>登录后可享受完整的服务</li>
            <li>
              <Image src={require('../../assets/bear_logo.png')} />
            </li>
            <li>
              <Text onClick={() =>  params.cancel()}>暂不登录</Text>
              <Text onClick={() => {
                Taro.setStorageSync('ql_href', location.href)
                Taro.navigateTo({ url: '/pages/my/login_page/index' })
                params.confirm()
              }}>立即登录</Text>
            </li>
          </ul>
        </View>
      }
    </Block>
  )
}

export default PhysicalBond
