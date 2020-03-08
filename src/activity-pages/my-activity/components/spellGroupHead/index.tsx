import Taro from '@tarojs/taro';
import { Block, View, Image, Text } from "@tarojs/components"
import './index.styl';

export default function SpellGroupHead(params: any) {

  let imglist = [
    'http://oss.tdianyi.com/front/ATDhJFbKfRYidDPnhak8QsTxWGB57HJ4.png',
    'http://oss.tdianyi.com/front/ATDhJFbKfRYidDPnhak8QsTxWGB57HJ4.png',
    'http://oss.tdianyi.com/front/ATDhJFbKfRYidDPnhak8QsTxWGB57HJ4.png',
    'http://oss.tdianyi.com/front/ATDhJFbKfRYidDPnhak8QsTxWGB57HJ4.png',
    'http://oss.tdianyi.com/front/ATDhJFbKfRYidDPnhak8QsTxWGB57HJ4.png'
  ]

  const { data, hasJoined, peopleNeed } = params
  const list = imglist.unshift(...data)//前添加
  return (
    <View className='spellGroupHead'>
      {
        imglist.map((item: string, _: number) => {
          return (
            _ > 5 || _ >= peopleNeed ? null:
              <View className='smallBox' style={{ zIndex: 5 - _ }}>
                <View className={_ ? 'participants' : 'open_group'} >
                  <Image src={item} />
                  {_ == 0 ? <Text >团长</Text> : null}
                </View>
              </View> 
          )
        })
      }
    </View>

  )
}