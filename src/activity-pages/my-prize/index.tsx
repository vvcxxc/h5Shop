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
    merchandise_coupon: [//商家券
      {
        img: 'https://img14.360buyimg.com/n7/jfs/t1/27385/12/12617/203546/5c98ca37Eff3ca839/b32de2a2d04984c7.jpg',
        name: 'HU植物护理洗护套装AWEI',
        shop_name: '洛溪店',
        time: '有效期:2018.07-2018.09',
        type: 1, //根据type值判断  1 立即使用  2已使用 3 已过期 
      },
      {
        img: 'https://img14.360buyimg.com/n7/jfs/t1/27385/12/12617/203546/5c98ca37Eff3ca839/b32de2a2d04984c7.jpg',
        shop_name: '洛溪店',
        name: 'HU植物护理洗护套装AWEI',
        time: '有效期:2018.07-2018.09',
        type: 2,
        des: '到店扫码支付时抵用',//描述
        user_astrict: '急速退/免预约/全部商品可用',//使用限制
        money: '2'
      },
      {
        img: 'https://img14.360buyimg.com/n7/jfs/t1/27385/12/12617/203546/5c98ca37Eff3ca839/b32de2a2d04984c7.jpg',
        shop_name: '洛溪店',
        name: 'HU植物护理洗护套装AWEI',
        time: '有效期:2018.07-2018.09',
        type: 3,
        des: '到店扫码支付时抵用',//描述
        user_astrict: '急速退/免预约/全部商品可用',//使用限制
        money: '2'
      }
    ],
    codeImg: '',
    isOpened: false,
    physical_page:1,
    merchandise_page: 1,
    closeLoading:false
  }

  componentWillMount() {
    this.getListData()
  }

  getListData = () => {//得到列表数据
    const { physical_page } = this.state
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
  }

  //使用卡券
  userCard = (data) => {
    QRCode.toDataURL(JSON.stringify({ id: data}))
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
    const { closeLoading, physical_page } = this.state
    if (closeLoading) return
    Taro.showLoading()
    this.setState({ physical_page: physical_page + 1 }, () => { this.getListData() })
    
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
          {/* <InputValue></InputValue> */}
          {
            index !== 0 && physical_bond.map((value) => {
              return <PhysicalBond list={value} onChange={this.userCard} />
            })
          }
          {
            index === 0 && merchandise_coupon.map((item) => {
              return <MerchandiseCoupon list={item} />
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
