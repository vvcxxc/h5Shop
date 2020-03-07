import Taro, { Component } from "@tarojs/taro"
import { Block, View, Text } from "@tarojs/components"
import './index.styl'

  const MergePrompt = (params?:any) => {
    return (
      <Block>
        {
          <View className="merge_prompt">
            <ul>
              <li>温馨提示</li>
              <li>检测到该手机号码已绑定其他微信</li>
              <li>1.选择"继续"即可把卡券同步到当前手机账号。</li>
              <li>2.选择"更换手机"可重新登录其他手机。</li>
              <li>
                <Text onClick={() => params.cancel()}>更换手机</Text>
                <Text onClick={() => params.confirm()}>继续</Text>
              </li>
            </ul>
          </View>
        }
      </Block>
    )
  }

export default MergePrompt