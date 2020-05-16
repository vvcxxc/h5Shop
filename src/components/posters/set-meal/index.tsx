import Taro, { Component, Config } from "@tarojs/taro"
import html2canvas from 'html2canvas'
import { View, Image, Text } from "@tarojs/components"
import './index.styl'


interface Props {
  show: boolean,
  onClose: () => void,
  list: any
}
// 拼团海报
export default class OtherPoster extends Component<Props> {
  state = {
    imgurl: '',
    show: false
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.show && !this.state.show) {
      Taro.showLoading({ title: 'loading', mask: true });
      this.setState({show: true})
      setTimeout(() => {
        this.showMyPoster()
        Taro.hideLoading()
      }, 1000);
    }
  }

  showMyPoster = () => {
    let dom = document.getElementById('set-meal-poster')
    dom && html2canvas(dom, {                                //canvas截图生成图片
      height: dom.offsetHeight,
      width: dom.offsetWidth,
      allowTaint: false,
      useCORS: true,
    }).then((res: any) => {
      let imgurl = res.toDataURL('image/jpeg');
      this.setState({ imgurl }, () => {
        Taro.hideLoading()
      })
    }).catch((err: any) => {
      Taro.showLoading({ title: 'loading', mask: true });
      this.showMyPoster()
    })
  }

  //关闭海报
  closePoster = () => {
    this.props.onClose()
    this.setState({
      show: false
    })
  }

  noAllow = (e: any) => {
    e.stopPropagation();
  }

  render() {
    const { list, show } = this.props
    const dom = <View className="poster-box" id="set-meal-poster" onClick={this.closePoster}>
      <Image className="title-img" src="https://oss.tdianyi.com/front/tiDd8wiT68yDJ7tsKJWbRz3W7R5DMXWP.png" />
      <View className="main">
        <View className="gift-img">
          <Image className="gift-image" src={list.image} />
        </View>
        <View className="project-info-set-meal">
          <View className="info-left" >
            <View className="info-left-first-line">优惠价 ￥
              <Text className="font">{list.pay_money}</Text>
              <Text className="original-price">￥<Text>{list.return_money}</Text></Text>
            </View>
            <View className="info-left-second-line" />
            <View className="info-left-third-line">
              {
                list.name && list.name.length > 20 ? list.name.slice(0, 23) + '...' : list.name
              }
            </View>
            <View className="info-left-fourth-line">适用店铺：
            <Text className="text">
                {list.store.name && list.store.name.length > 11 ? list.store.name.slice(0, 11) + '...' : list.store.name}
              </Text>
            </View>
            <View className="info-left-fifth-line">
              店铺地址：
              <Text className="text">
                {list.store.address && list.store.address.length > 11 ? list.store.address.slice(0, 11) + '...' : list.store.address}
              </Text>
            </View>
          </View>
          <View className="info-right-set-meal" >
            <View className="info-right-first-line">
              <Image className="qr-code" src={list.qr_code} />
            </View>
            <View className="info-right-second-line">长按查看活动详情</View>
          </View>
        </View>

      </View>
    </View>
    return show ? <View className="set-meal-ql">
      {dom}  <Image
        onClick={this.noAllow.bind(this)} className="generate-images-set-meal" src={this.state.imgurl} />
    </View>
      : null
  }
}
