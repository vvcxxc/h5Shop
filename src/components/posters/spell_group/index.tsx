import Taro, { Component, Config } from "@tarojs/taro"
import { View, Image, Text } from "@tarojs/components"
import html2canvas from 'html2canvas'
import QRCode from 'qrcode';
import './index.styl'

interface Props {
  show: boolean,
  onClose: () => void,
  list: any
}
var IMAGEURL
// 拼团海报
export default class Poster extends Component<Props> {
  state = {
    imgurl: '',
    show: false,
    gift: '',
    listData: {
      image: '',
      gift_pic: '',
      gift_price: '',
      participation_money: '',
      pay_money: '',
      number: '',
      name: '',
      store_name: '',
      store_address: '',
      link: '',
      wx_img: '',
      gift:''
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.show && !this.state.show) {
      Taro.showLoading({ title: 'loading', mask: true });
      setTimeout(() => {
        Taro.hideLoading()
        this.showMyPoster();
      }, 1000);
      this.setState({ show: true})
    }
  }

  showMyPoster = () => {
    let dom = document.getElementById('spell_group')
    dom && html2canvas(dom, {                                //canvas截图生成图片
      height: dom.offsetHeight,
      width: dom.offsetWidth,
      allowTaint: false,
      useCORS: true,
    }).then((res: any) => {
      let imgurl = res.toDataURL('image/jpeg');
      Taro.hideLoading()
      this.setState({ imgurl })
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
    const { list, show} = this.props 
    const dom = <View className="spell-group-poster" id="spell_group" onClick={this.closePoster}>
      <Image className="title-img" src={require('@/assets/poster_head.png')} />
      <View className="spell-group-main">
        <View className="gift-img">
          <Image className="gift-image" src={list['image']} />
          {
            list.gift.gift_pic ? <View className="give-gift">
              <View className="give-gift-first-line">下单即送礼品</View>
              <View className="give-gift-second-line">
                <Image src={list.gift.gift_pic} />
                <Image className="test" src={require('@/assets/box_shadow.png')} />
                <Text className="giving" >赠</Text>
                <Text className="price-spell_group" style={{ color: '#fff' }}>￥<Text>{list.gift.gift_price}</Text></Text>
              </View>
            </View> : null
          }
        </View>

        <View className="project-info-spell_group">
          <View className="info-left">
            <View className="info-left-first-line">拼团价 ￥
              <Text>{list.participation_money}</Text>
              <Text>￥{list.pay_money}</Text>
            </View>
            <View className="info-left-second-line">
              <Text className="group-number">{list.number}人团</Text>
            </View>
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
            <View className="info-left-fifth-line"> 店铺地址：
            <Text className="text">
                {list.store.address && list.store.address.length > 11 ? list.store.address.slice(0, 11) + '...' : list.store.address}
              </Text>

            </View>
          </View>
          <View className="info-right-spell_group" >
            <View className="info-right-first-line">
              <Image className="qr-code" src={list.qr_code} />
            </View>
            <View className="info-right-second-line">长按查看活动详情</View>
          </View>
        </View>
      </View>
    </View>
    return show ? <View className="spell_group-ql">
      {dom}
      <Image
        onClick={this.noAllow.bind(this)} className="my-img-spell_group" src={this.state.imgurl} />
    </View>
      : null
  }
}