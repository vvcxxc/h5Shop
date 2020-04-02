import Taro, { Component, Config } from "@tarojs/taro"
import html2canvas from 'html2canvas'
import QRCode from 'qrcode';
import { View, Image, Text } from "@tarojs/components"
import './other.styl'


interface Props {
  show: boolean,
  onClose: () => void,
  list: any,
  type:string
}
// 拼团海报
export default class OtherPoster extends Component<Props> {
  state = {
    imgurl: '',
    show: false,
    gift: '',

    listData: {
      image: '',
      pay_money: '',
      return_money: '',
      name: '',
      store_name: '',
      store_address: '',
      link: '',
      wx_img: '',
      gift_pic: '',
      gift_price: ''
    }
  }

  componentWillReceiveProps(nextProps) {

    if (nextProps.show && !this.state.show) {
      const { list, show ,type} = nextProps
      list.youhui_type == 0 && type =='Other' ? Taro.showLoading({ title: 'loading', mask: true }):null
      this.setState({
        show: list.youhui_type == 0 && type == 'Other' ? true : false,
        listData: {
          image: list.image,
          pay_money: list.pay_money,
          return_money: list.return_money,
          name: list.name,
          store_name: list.store.name,
          store_address: list.store.address,
          link: list.link,
          wx_img: list.wx_img,
          gift_pic: list.gift.gift_pic,
          gift_price: list.gift.gift_price,
        }
      }, () => {
          setTimeout(() => {
            list.youhui_type == 0 && type == 'Other' ?    Taro.hideLoading():null
            this.showMyPoster()
          }, 800);
      })

    }
  }

  showMyPoster = () => {
    let dom = document.getElementById('other-poster')
    QRCode.toDataURL(this.props.list.link)                  // 网络链接转化为二维码
      .then((url: any) => {
        this.setState({ gift: url }, () => {
          dom && html2canvas(dom, {                                //canvas截图生成图片
            height: dom.offsetHeight,
            width: dom.offsetWidth,
            allowTaint: false,
            useCORS: true,
          }).then((res: any) => {
            let imgurl = res.toDataURL('image/jpeg');
            this.setState({ imgurl })
          })
        })
      })
      .catch((err: any) => { })
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
    const { listData, gift } = this.state
    const dom = <View className="poster-box" id="other-poster" onClick={this.closePoster}>
      <Image className="title-img" src={require('@/assets/poster_head2.png')} />
      <View className="main">
        <View className="gift-img">
          <Image className="gift-image" src={listData.image} />
          {/* 赠送礼品 */}
          {
            listData.gift_pic ?
              <View className="give-gift">
                <View className="give-gift-first-line">下单即送礼品</View>
                <View className="give-gift-second-line">
                  <Image src={listData.gift_pic} />
                  <Image className="test" src={require('@/assets/box_shadow.png')} />
                  <Text className="giving" >赠</Text>
                  <Text className="price" style={{ color: '#fff' }}>￥
                    {listData.gift_price}
                  </Text>
                </View>
              </View> : null
          }
        </View>

        <View className="project-info">
          <View className="info-left" >
            <View className="info-left-first-line">活动价 ￥
              <Text className="font">{listData.pay_money}</Text>
            </View>
            <View className="info-left-second-line">
              <Text className="font">最高可抵{listData.return_money}元</Text>
            </View>
            <View className="info-left-third-line">
              {
                listData.name && listData.name.length > 20 ? listData.name.slice(0, 24) + '...' : listData.name
              }
            </View>
            <View className="info-left-fourth-line">适用店铺：
              <Text className="text">{listData.store_name && listData.store_name.length > 11 ? listData.store_name.slice(0, 11) + '...' : listData.store_name}
              </Text>
            </View>
            <View className="info-left-fifth-line">
              店铺地址：<Text className="text">
                {listData.store_address && listData.store_address.length > 11 ? listData.store_address.slice(0, 11) + '...' : listData.store_address}
              </Text>
            </View>
          </View>
          <View className="info-right" >
            <View className="info-right-first-line">
              <Image className="qr-code" src={gift} />
            </View>
            <View className="info-right-second-line">长按查看活动详情</View>
          </View>
        </View>

      </View>
    </View>
    return  this.state.show ? <View className="value_added-other-ql">
      {dom}  <Image
        onClick={this.noAllow.bind(this)} className="generate-images" src={this.state.imgurl} />
    </View>
      : null
  }
}