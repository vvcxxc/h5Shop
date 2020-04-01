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
    result: [[]],
    flag: false,
    current: 0
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
      this.setState({ result, flag: true })
    }

  }
  handleClick(item) {
    this.props.onAction(item)
  }
  goTo = () => {
    let id = this.props.type == 1 ? 1 : 5
    Taro.navigateTo({url: '/activity-pages/activity-list/index?id=' + id})
  }

  handleChange(e){
    if(this.state.result.length == e.detail.current+1){
      setTimeout(()=>{
        this.setState({current: this.state.current+1})
      },5000)
    }
    // this.setState({current: e.detail.current})
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
          {
            result.length ? (
              <Swiper
            className='coupon-list'
            indicatorColor='#999'
            indicatorActiveColor='#333'
            circular
            // indicatorDots
            interval={5000}
            autoplay
            key={this.state.current}
            onChange={this.handleChange.bind(this)}
            >
            {
              this.state.flag ? result.map((res: any,idx) => {
                return (
                  <SwiperItem key={idx}>
                    <View className='coupon-list-item'>
                      {
                        res.map((item: any, index: any) => (
                          <View className='recommend-coupon-box' key={item.id} onClick={this.handleClick.bind(this,item)} key={item.channel_id}>
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
            ) : null
          }

        </View>
      </View>
    )
  }
}
