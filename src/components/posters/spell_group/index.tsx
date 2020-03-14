import Taro, { Component, Config } from "@tarojs/taro"
import { View, Image, Text } from "@tarojs/components"
import html2canvas from 'html2canvas'
import QRCode from 'qrcode';
import './index.styl'

interface Props {
  show: boolean,
  close: () => void,
  details: any
}
// 拼团海报
export default class Poster extends Component<any> {
  state = {
    imgurl: '',
    show: false,
    gift: ''
  }

  shouldComponentUpdate(nextProps: Props, nextState: Props) {
    if (nextProps.show !== nextState.show) {
      if (!this.state.show) {
        this.setState({ show: true })
        this.state.imgurl.length < 1 && this.showMyPoster()
      }
    }
    return true
  }

  showMyPoster = () => {
    let dom = document.getElementById('metas')
    QRCode.toDataURL(this.props.list.link)                                      // 网络链接转化为二维码
      .then((url: any) => {
        this.setState({ gift: url }, () => {
          html2canvas(dom, {                                //canvas截图生成图片
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
    this.props.close()
    this.setState({
      show: false
    })
  }

  noAllow = (e: any) => {
    e.stopPropagation();
  }

  render() {
    const { list } = this.props
    const { gift } = this.state
    const dom = <View className="poster-box" id="metas" onClick={this.closePoster}>
      <Image className="title-img" src={require('@/assets/poster_head.png')} />
      <View className="main">
        <View className="gift-img">
          <Image className="gift-image" src={list.big_pic} />
          { //礼品id不能为0
            list.gift_id ? <View className="give-gift">
              <View className="give-gift-first-line">下单即送礼品</View>
              <View className="give-gift-second-line">
                <Image src={list.gif_pic} />
                <Image className="test" src={require('@/assets/box_shadow.png')} />
                <Text className="giving" >赠</Text>
                <Text className="price" style={{ color: '#fff' }}>￥{list.gift_money}</Text>
              </View>
            </View> : null
          }
        </View>

        <View className="project-info">
          <View className="info-left">
            {/* className="poster_box" */}
            <View className="info-left-first-line">拼团价 ￥<Text>{list.group_money}</Text></View>
            {/* className="poster_box" */}
            <View className="info-left-second-line">
              <Text>￥{list.pay_money}</Text>
              <Text className="group-number">{list.coupons_number}人团</Text>
            </View>
            <View className="info-left-third-line">
              {
                list.activity_name && list.activity_name.length > 20 ? list.activity_name.slice(0, 24) + '...' : list.activity_name
              }
            </View>
            <View className="info-left-fourth-line">适用店铺：
              {list.name && list.name.length > 11 ? list.name.slice(0, 11) + '...' : list.name}
            </View>
            <View className="info-left-fifth-line"> 店铺地址：{list.address && list.address.length > 11 ? list.address.slice(0, 11) + '...' : list.address}
            </View>
          </View>
          <View className="info-right" >
            <Image className="info-right-first-line" src={gift} />
            <View className="info-right-second-line">长按查看活动详情</View>
          </View>
        </View>
      </View>
    </View>
    return <main className="poster-main" style={{ display: this.state.show ? '' : 'none' }} onClick={this.closePoster}>
      <View className="hidden-page" >{dom}</View>
      <Image className="my-img" onClick={this.noAllow.bind(this)} src={this.state.imgurl} />
      {/* <View className="user-button">长按保存图片到相册</View> */}
    </main>
  }
}