import Taro, { Component, Config } from '@tarojs/taro';
import './index.styl';
import { View, Image, Swiper, SwiperItem, Text } from '@tarojs/components';
import { accSubtr } from '@/utils/common'
interface Props {
  type: number; // 类型：1 网红 2 品牌
  list: Array<object>;
  onAction: any;
}
export default class RecommendBox extends Component<Props> {
  static defaultProps = {
    list: [],
    type: 1
  }
  state = {
    list: [1, 2, 3, 4, 5, 6, 7],
    result: [[]]
  }
  componentDidMount() {
  }
  componentWillReceiveProps(nextProps) {
    if(this.props.list.length != nextProps.list.length){
      let list = nextProps.list
      let result = []
      if (list.length) {
        for (let i = 0; i < list.length; i += 3) {
          result.push(list.slice(i, i + 3));
        }
      }
      this.setState({ result })
    }

  }
  handleClick(item) {
    this.props.onAction(item)
  }
  goTo = () => {
    let id = this.props.type == 1 ? 1 : 5
    Taro.navigateTo({url: '/activity-pages/activity-list/index?id=' + id})
  }

  render() {
    const { result } = this.state
    return (
      <View className='recommend-box'>
        <View className='recommend-title-box'>
          {/* <View className='recommend-title'> */}
            {
              this.props.type == 1? (
                <View className='recommend-title'>
                  <Image className='recommend-title-img' src={require('@/assets/index/recommend-hot.png')} />
                  <View className='recommend-label'>网红推荐网络爆款</View>
                </View>
              ) : (
                <View className='recommend-title'>
                <Image className='recommend-title-img brand' src={require('@/assets/index/recommend-brand.png')} />
                <View className='recommend-label'>品牌推荐放心购物</View>
              </View>
              )
            }

          {/* </View> */}
          <View className='look-more' onClick={this.goTo}>查看更多</View>
        </View>
        <View>
          <Swiper
            className='coupon-list'
            indicatorColor='#999'
            indicatorActiveColor='#333'
            circular
            indicatorDots
            autoplay
            >
            {
              result.length ? result.map((res: any) => {
                return (
                  <SwiperItem>
                    <View className='coupon-list-item'>
                      {
                        res.map((item: any, index: any) => (
                          <View className='recommend-coupon-box' onClick={this.handleClick.bind(this,item)} key={item.channel_id}>
                            <Image src={'http://oss.tdianyi.com/'+ item.icon} className='recommend-coupon-img' />
                            <View className='recommend-coupon-name ellipsis-one'>
                              {item.name}
                            </View>
                            <View className='recommend-coupon-label ellipsis-one'>
                              已优惠￥{ item.is_share == 5 ? accSubtr(item.pay_money,item.participation_money) : accSubtr(item.return_money, item.pay_money)}
                            </View>
                            <View className='recommend-coupon-money ellipsis-one'>
                              <View className='recommend-new-money'>￥{item.is_share == 5 ? item.participation_money : item.pay_money}</View>
                              <View className='recommend-old-money'>￥{item.is_share == 5 ? item.pay_money : item.return_money}</View>
                            </View>
                          </View>
                        )

                      }
                    </View>
                  </SwiperItem>
                )
              }) : null
            }

          </Swiper>
        </View>
      </View>
    )
  }
}
