// import React, { Component } from 'react'
import Taro, { Component, Config } from "@tarojs/taro"
import { View, Image, Text } from "@tarojs/components"

import html2canvas from 'html2canvas'
import QRCode from 'qrcode';
import './category.styl'


interface Props {
  show: boolean,
  close: () => void,
  details: any
}

// 增值海报
export default class PosterCategory extends Component<any> {

  state = {
    imgurl: '',
    show: false,
    gift: '',
    refs: ''
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
    let dom = document.getElementById('poster')
    QRCode.toDataURL(this.props.list.link)                                      // 网络链接转化为二维码
      .then((url: any) => {
        this.setState({ gift: url }, () => {
          html2canvas(dom, {
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
    const dom = <View
      className={list.gift_id ? "poster_have_gift" : "poster_no_gift"} id="poster" >
      <Image className="title_img" src={require('@/assets/poster_head2.png')} />
      <View className="main">
        <View className="gift_img">

          <View className="gift-img-first-line">
            <Image
              src="https://oss.tdianyi.com/front/ExebSGpSecxPwNFa43i7wRxwJjZftasn.png"
            />
            <View className="max_money">最高抵用{list.max_money}8777元</View>
          </View>
          <View className="gift-img-second-line">
            <Image src={require('@/assets/progress_bar.png')} />
          </View>

          <View className="gift-img-third-line">
            <View className="small-box">
              <View className="price-box">
                <Text className="symbol"> ￥</Text>
                <Text className="price">{list.max_money}</Text>
              </View>
              <View className="doorsill-box">
                <Text className="type">通用券</Text>
                <Text className="doorsill">满{list.total_fee}元可用</Text>
              </View>
            </View>
          </View>


          <View className="gift-img-fourth-line">
            <View>使用时间：<Text>{list.use_tim}</Text></View>
          </View>
        </View>

        <View className="info">
          {
            list.gift_id ? <View className="gift_box">
              <View className="left">
                <Text className="giving">赠</Text>
                <Image src={list.git_img} />
              </View>
              <View className="right">
                <View className="right-first-line">
                  <View>{list.gif_name}</View>
                </View>
                <View className="price">￥<Text>
                  {list.gif_integral}
                </Text></View>
              </View>
            </View> : null
          }
          <View className="project_info">
            <View className="info_left">
              <View className="info-left-first-line">
                活动价 ￥
                <Text className="active_money">99{list.active_money}</Text>
              </View>
              <View className="info-left-second-line" id="myhidden">
                  {
                    list.activity_name && list.activity_name.length > 20 ? list.activity_name.slice(0, 24) + '...' : list.activity_name
                  }
                </View>
              <View className="info-left-third-line"> 适用店铺：
                  {list.name && list.name.length > 11 ? list.name.slice(0, 11) + '...' : list.name}
                </View>
              <View className="info-left-fourth-line">店铺地址：
                {list.address && list.address.length > 11 ? list.address.slice(0, 11) + '...' : list.address}
                </View>
            </View>
            <View className="info_right">
              <Image src={this.state.gift} />
              <View className="look-details">长按查看活动详情</View>
            </View>
          </View>
        </View>
      </View>
    </View>
    return <main className="poster_main" onClick={this.closePoster.bind(this)} style={{ display: this.state.show ? '' : 'none' }}>
      <View className="hidden_page">{dom}</View>
      {/* <Image
        onClick={this.noAllow.bind(this)} className={list.gift_id ?"img_have_gift" : "img_no_gift"} src={this.state.imgurl} /> */}
      {/* <View className="user_button">长按保存图片到相册</View> */}
    </main>
  }
}