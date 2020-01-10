import Taro, { Component } from '@tarojs/taro'
import PhysicalBond from './component/physical_bond'
import MerchandiseCoupon from './component/merchandise_coupon'
import InputValue from './component/qilin_test'
import { AtCurtain, AtButton } from 'taro-ui'
import { Block, View, Image, Text, Button } from "@tarojs/components"
import QRCode from 'qrcode'
import request from '../../services/request'
import './index.styl'

class MyPrize extends Component {
  state = {
    index: 0,
    list: [1, 2, 3, 3, 3, 3, 3, 3, 5],
    physical_bond: [//实物券
    ],
    merchandise_coupon: [],
    codeImg: '',
    isOpened: false,
    physical_page: 1,
    
    merchandise_page: 1,
    closeLoading: false,
    merchandiseLoading:false
  }

  componentWillMount() {
    
    this.getShopData()
  }

  getShopData = () => {//得到商家列表数据
    const { physical_page, merchandise_page } = this.state
    request({
      url: 'v3/youhuiLogs',
      method: "GET",
      data: {
        page: merchandise_page
      }
    })
      .then((res: any) => {
        const { data, code } = res
        let meta = data.data
        if (code == 200) {
          Taro.hideLoading()
          this.setState({
            merchandise_coupon: merchandise_page > 1 ? [...this.state.merchandise_coupon, ...meta] : meta,
             merchandiseLoading: meta.length ? false : true
          })
        }

      })
  }

  getListData = () => {//得到实物列表数据
    const { physical_page, merchandise_page } = this.state
    request({
      url: 'v3/Lotterys/user_activity_prize',
      method: "GET",
      data: {
        page:physical_page
      }
    })
      .then((res: any) => {
        const { data, code } = res
        if (code == 200) {
          Taro.hideLoading()
          this.setState({
            physical_bond: physical_page > 1 ? [...this.state.physical_bond, ...data] : data,
            closeLoading: data.length? false :true
          })
        }
      })
  }

  tabClick = (index: number) => {
    this.setState({ index })
    switch (index) {
      case 0:
        this.getShopData()
        break;
      case 1:
        this.getListData()
        break;
      default:
        break;
    }
  }

  //使用卡券
  userCard = (data) => {
    QRCode.toDataURL(JSON.stringify({ id: data ,verificationType:"Prize"}))
      .then((url: any) => {
        Taro.hideLoading();
        this.setState({ codeImg: url, isOpened: true })
      })
      .catch((err: any) => {
        Taro.hideLoading();
        Taro.showToast({ title: '获取二维码失败', icon: 'none' })
      })
  }

  //触底函数
  onReachBottom() {
    const { closeLoading, physical_page, index, merchandise_page, merchandiseLoading} = this.state
    if (index) {
      if (closeLoading) return
      Taro.showLoading()
      this.setState({ physical_page: physical_page + 1 }, () => { this.getListData() })
    } else {
      if (merchandiseLoading) return
      Taro.showLoading()
      this.setState({ merchandise_page: merchandise_page + 1 }, () => { this.getShopData() })
    }
  }

  render() {
    const { index, list, physical_bond, merchandise_coupon } = this.state
    return (
      <div className='prize_page'>
        <header className='prize_tab'>
          <div onClick={this.tabClick.bind(this, 0)}
            className={index == 0 ? 'prize_label prize_activity' : 'prize_label'}>
            商家券
          </div>
          <div onClick={this.tabClick.bind(this, 1)}
            className={index ? 'prize_label prize_activity' : 'prize_label'}>
            实物券
          </div>
        </header>
        <main className="list_data">
          {
            index !== 0 && physical_bond.map((value) => {
              return <PhysicalBond list={value} onChange={this.userCard} />
            })
          }
          {
            index === 0 &&   merchandise_coupon.map((item) => {
              return <MerchandiseCoupon list={item} onChange={this.userCard} />
            })
          }

        </main>

        <AtCurtain
          isOpened={this.state.isOpened}
          onClose={() => { this.setState({ isOpened: false})}}
        >
          <View className="user_prompt_box">
            <View className="user_prompt">请前往 <Text>领取地址</Text> 扫码领取</View>
            <Image
              src={this.state.codeImg}
            />
          </View>
        </AtCurtain>


      </div>
    )
  }
}

export default MyPrize
