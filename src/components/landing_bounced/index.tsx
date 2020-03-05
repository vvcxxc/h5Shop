import Taro, { Component } from "@tarojs/taro"
import { Block, View, ScrollView, Image, Text} from "@tarojs/components"
import './index.styl'

export default function PhysicalBond(params: any) {

  return (
    <Block>
      <View className="landing_bounced">
        <ul>
          <li>您还未登录</li>
          <li>登录后可享受完整的服务</li>
          <li>
            <Image src={require('../../assets/bear_logo.png')} />
          </li>
          <li>
            <Text onClick={() => params.cancel()}>暂不登录</Text>
            <Text onClick={() => {
              Taro.navigateTo({url: '/pages/my/login_page/index' })
              params.confirm()
            }}>立即登录</Text>
          </li>
        </ul>
      </View>
    </Block>
  )
}