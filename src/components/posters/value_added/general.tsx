// import React, { Component } from 'react'
import Taro, { Component, Config } from "@tarojs/taro"
import html2canvas from 'html2canvas'
import QRCode from 'qrcode';
import { View, Image, Text } from "@tarojs/components"
import './general.styl'


interface Props {
  show: boolean,
  close: () => void,
  details: any
}
// 拼团海报
export default class PosterGeneral extends Component<any> {
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
  // total_fee 使用门槛
  // pay_money 购买劵的价格
  // poster_pay_money 活动价
  // poster_max_money 增值最大金额
  showMyPoster = () => {
    console.log('触发')
    let dom = document.getElementById('poster')
    QRCode.toDataURL(this.props.list.link)                  // 网络链接转化为二维码
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
    const dom = <View className="poster-box" id="poster" onClick={this.closePoster}>
      <Image className="title-img" src={require('@/assets/poster_head2.png')} />
      <View className="main">
        <View className="gift-img">
          <Image className="gift-image" src={list.big_pic} />
          {/* 赠送礼品 */}
          {
            list.gift_id ?
              <View className="give-gift">
                <View className="give-gift-first-line">下单即送礼品</View>
                <View className="give-gift-second-line">
                  <Image src={list.git_img} />
                  <Image className="test" src={require('@/assets/box_shadow.png')} />
                  <Text className="giving" >赠</Text>
                  <Text className="price" style={{ color: '#fff' }}>￥
                    {list.gif_integral}
                  </Text>
                </View>
              </View> : null
          }
        </View>

        <View className="project-info">
          <View className="info-left" >
            <View className="info-left-first-line">活动价 ￥<Text>{list.active_money}</Text></View>
            <View className="info-left-second-line"><Text>最高可抵{list.max_money}元</Text></View>
            <View className="info-left-third-line">
              {
                list.activity_name && list.activity_name.length > 20 ? list.activity_name.sViewce(0, 24) + '...' : list.activity_name
              }
            </View>
            <View className="info-left-fourth-line">适用店铺：
              {list.name && list.name.length > 11 ? list.name.sViewce(0, 11) + '...' : list.name}
            </View>
            <View className="info-left-fifth-line"> 店铺地址：{list.address && list.address.length > 11 ? list.address.sViewce(0, 11) + '...' : list.address}
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
      <View className="hidden-page">{dom}</View>
      <Image onClick={this.noAllow.bind(this)} className="generate-images" src={this.state.imgurl}/> 
      {/* <Image className="my_img" src={this.state.imgurl}/> */}
       {/* <View className="user_button">长按保存图片到相册</View> */}
    </main>
  }
}