import Taro, { Component, Config, useEffect } from "@tarojs/taro"
import { View, Image, Text } from "@tarojs/components"
import html2canvas from 'html2canvas'
import QRCode from 'qrcode';
import './have-gift.styl'


interface Props {
  show: boolean,
  onClose: () => void,
  list: any
}

// 增值海报
export default class HavegiftPoster extends Component<Props> {

  state = {
    imgurl: '',
    show: false,
    gift: '',
    refs: '',
    listData: {
      return_money: '',
      total_fee: '',
      expire_day: '',
      gift_pic: '',
      name: '',
      gift_price: '',
      pay_money: '',
      store_name: '',
      store_address: '',
      link: '',
      gift_name: '',
      wx_img: '',
      youhui_type: ''
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.show && !this.state.show) {
      const { list, show } = nextProps
      this.setState({
        show: list.youhui_type && list.gift.gift_pic ? true : false,
        listData: {
          return_money: list.return_money,
          total_fee: list.total_fee,
          expire_day: list.expire_day,
          gift_pic: list.gift.gift_pic,
          name: list.name,
          gift_price: list.gift.gift_price,
          pay_money: list.pay_money,
          store_name: list.store.name,
          store_address: list.store.address,
          link: list.link,
          gift_name: list.gift.gift_name,
          wx_img: list.wx_img,
          youhui_type: list.youhui_type
        }
      }, () => {
        this.showMyPoster()
      })
    }
  }

  showMyPoster = () => {
    let dom = document.getElementById('have-gift-poster')
    QRCode.toDataURL(this.props.list.link)                                      // 网络链接转化为二维码
      .then((url: any) => {
        this.setState({ gift: url }, () => {
          dom && html2canvas(dom, {
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
    const dom = <View
      className="have-gift-poster" id="have-gift-poster" >
      <Image className="title_img" src={require('@/assets/poster_head2.png')} />
      <View className="poster-have-gift-main">
        <View className="gift_img">
          <View className="gift-img-first-line">
            <Image
              src="https://oss.tdianyi.com/front/ExebSGpSecxPwNFa43i7wRxwJjZftasn.png"
            />
            <View className="max_money">最高抵用{listData.return_money}元</View>
          </View>
          <View className="gift-img-second-line">
            <Image src={require('@/assets/progress_bar.png')} />
          </View>

          <View className="gift-img-third-line">
            <View className="small-box">
              <View className="price-box">
                <Text className="symbol"> ￥</Text>
                <Text className="price">{listData.gift_price}</Text>
              </View>
              <View className="doorsill-box">
                <Text className="type">通用券</Text>
                <Text className="doorsill">满{listData.total_fee}元可用</Text>
              </View>
            </View>
          </View>
          <View className="gift-img-fourth-line">
            <View>使用时间：领券后<Text>{listData.expire_day}</Text>天有效</View>
          </View>
        </View>

        <View className="info-have-gift">
          <View className="gift_box">
            <View className="left">
              <Text className="giving">赠</Text>
              <Image src={listData.gift_pic} />
            </View>
            <View className="right">
              <View className="right-first-line">
                <View>{listData.gift_name}</View>
              </View>
              <View className="price">￥
                  <Text>{listData.gift_price}</Text>
              </View>
            </View>
          </View>
          <View className="project_info-have-gift">
            <View className="info_left">
              <View className="info-left-first-line">
                活动价 ￥
                <Text className="active_money">{listData.pay_money}</Text>
              </View>
              <View className="info-left-second-line" id="myhidden">
                {
                  listData.name && listData.name.length > 20 ? listData.name.slice(0, 24) + '...' : listData.name
                }
              </View>
              <View className="info-left-third-line"> 适用店铺：
                  {listData.store_name && listData.store_name.length > 11 ? listData.store_name.slice(0, 11) + '...' : listData.store_name}
              </View>
              <View className="info-left-fourth-line">店铺地址：
                {listData.store_address && listData.store_address.length > 11 ? listData.store_address.slice(0, 11) + '...' : listData.store_address}
              </View>
            </View>
            <View className="info-right-have-gift" >
              <View className="info-right-first-line">
                <Image className="qr-code" src={gift} />
              </View>
              <View className="info-right-second-line">长按查看活动详情</View>
            </View>

          </View>
        </View>
      </View>
    </View>
    return  this.state.show ?
      !this.state.imgurl ? dom : <Image
        onClick={this.noAllow.bind(this)} className="have-gift-img" src={this.state.imgurl} />
      : null

  }
}