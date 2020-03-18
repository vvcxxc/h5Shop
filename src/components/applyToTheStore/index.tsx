import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import "./index.styl";

interface Location {
  xpoint: number;
  ypoint: number;
}

interface Props {
  isTitle?: boolean; // 是否展示店铺名
  img: string; // 店铺图片
  name: string; // 店铺名称
  phone: string; // 店铺电话
  address: string; // 店铺地址
  location: Location;
}
export default class ApplyToTheStore extends Component<Props> {
  ApplyToTheStore.defaultProps = {
    isTitle: false, // 是否展示店铺名
    img: '', // 店铺图片
    name: '', // 店铺名称
    phone: null, // 店铺电话
    address: '', // 店铺地址
    location: {
      xpoint: null,
      ypoint: null
    },
  }
  state = {
  }

  render() {
    return (
      <View className='apply-page'>
        {
          this.props.isTitle ? <View className='apply-title-box'>
            <View className='apply-title-left'></View>
            <View className='apply-title'>适用店铺</View>
          </View> : null
        }

        <View className='apply-main'>
          <Image className='store-img' src={this.props.img} />
          <View className='store-detail'>
            <View className='store-name-box'>
              <View className='store-name'>{this.props.name}</View>
              <View className='store-icon'>
                <Image className='icon phone' src={require('@/assets/store/phone.png')} />
                <Image className='icon' src={require('@/assets/store/address.png')} />
              </View>
            </View>
            <View className='store-text'>
              联系电话：{this.props.phone}
            </View>
            <View className='store-text'>
              {this.props.address}
            </View>
          </View>
        </View>
      </View>
    )
  }
}
