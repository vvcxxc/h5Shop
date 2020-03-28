import Taro, { Component, Config } from '@tarojs/taro';
import { View, Image, Swiper, SwiperItem, Text } from '@tarojs/components';
import './index.styl';
import { data, tabList } from './data'
import RecommendBox from '../recommendBox'
import CouponBox from '../couponBox'
import { getChannelInfo, getTabList } from '../../service'
export default class MarketingIndex extends Component<any> {
  config: Config = {
    navigationBarTitleText: '小熊敬礼',
    enablePullDownRefresh: true,
    // navigationBarBackgroundColor: '#FF4444'
  };

  state = {
    bannerTag: 1, // banner标签当前下标
    current: 0, // tab
    hotRecommendList: [], // 网红店推荐
    brandRecommendList: [], // 品牌连锁推荐
    list: [],
    id: 6, // tab的id
    city_name: '新会区',
    banner: [],
    page: 1
  }
  componentDidMount() {
    let router = JSON.parse(sessionStorage.getItem('router'))
    if(router){
      this.setState({city_name: router.city_name})
    }
    getChannelInfo().then((res: any) => {
      if (res.code == 200) {
        this.setState({
          hotRecommendList: res.data.channels.whdtj.youhui,
          brandRecommendList: res.data.channels.pplstj.youhui,
          banner: res.data.banner
        })
      }
    })
    getTabList({ channel_id: 6 }).then(res => {
      console.log(res)
      if (res.code == 200) {
        this.setState({ list: res.data.data })
      }
    })
  }

  componentWillReceiveProps(nextProps) {
    // 下拉刷新
    if(this.props.changePull != nextProps.changePull){

    }
    // 触底加载更多
    if(this.props.changeBottom != nextProps.changeBottom){
      this.setState({page: this.state.page + 1},()=> {
        getTabList({channel_id: this.state.id, page: this.state.page}).then(res => {
          if(res.code == 200){
            this.setState({list: [...this.state.list,...res.data.data]})
          }
        })
      })
    }
  }

  // 跳转 搜素城市页面
  showSelectCity = () => {
    Taro.removeStorageSync('is_one')
    Taro.navigateTo({ url: '/business-pages/select-city/index' });
  }

  // 跳转 搜索商家列表页面
  handleSearch = () => {
    Taro.navigateTo({ url: './search/index' });
  }

  // tab切换
  handlerTabChange(current, id, _this) {
    this.setState({ current,id });
    // this.setState({ meta: data })
    getTabList({ channel_id: id }).then(res => {
      if (res.code == 200) {
        this.setState({ list: res.data.data, id })
      }
    })
  }


  handleAction(item: any) {
    const { is_share } = item
    switch (is_share) {
      case 1:
        // 增值
        Taro.navigateTo({
          url: '/pages/activity/appreciation/index?id=' + item.youhui_id + '&type=1&gift_id=' + item.gift_id + '&activity_id=' + item.activity_id
        })
        break
      case 4:
        // 现金券兑换券
        if (item.youhui_type) {
          // 现金券
          Taro.navigateTo({
            url: '/business-pages/ticket-buy/index?id=' + item.youhui_id
          })
        } else {
          // 兑换券
          Taro.navigateTo({
            url: '/business-pages/set-meal/index?id=' + item.youhui_id
          })
        }
        break
      case 5:
        // 拼团
        Taro.navigateTo({
          url: '/pages/activity/group/index?id=' + item.youhui_id + '&type=5&gift_id=' + item.gift_id + '&activity_id=' + item.activity_id
        })
        break
    }
  }

  // 跳转
  goTo = (router) => {
    Taro.navigateTo({url: router})
  }

  render() {
    const { banner } = this.state
    return (
      <View className='marketing-page'>
        <Image className='head-bj' src={require('@/assets/index/head-bj.png')} />
        <View className='marketing-main'>

          {/* 搜索 */}
          <View className='search-box'>
            <View className="city" onClick={this.showSelectCity}>
              <View className='ellipsis-one flex' style='width:70%; padding-right:10px; color:#fff; display: inline-block'>
                {/* {this.state.cityName || '1广州市'} */}
                {this.state.city_name || '广州市'}
              </View>
              <Image className='down-icon' src={require('@/assets/index/down.png')} />
            </View>
            <View className='search'>
              <Image className='search-icon' src={require('@/assets/index/search.png')} />
              <View className='search-text' onClick={this.handleSearch}>
                请输入商家名称
              </View>
            </View>
          </View>

          {/* banner */}
          <View className='banner-box'>
            <Swiper
              className='marketing-banner'
              indicatorColor='#999'
              indicatorActiveColor='#333'
              circular
              onChange={e => this.setState({ bannerTag: e.detail.current + 1 })}
              // autoplay
              >
              {
                banner.map(res => {
                  return (
                    <SwiperItem style={{width: '100%', height: '100%'}}>
                      <View className='banner-img'><Image src={res} className='banner-image'/></View>
                    </SwiperItem>
                  )
                })
              }
            </Swiper>
            <View className='indicator'>
              <View className='banner-number'>{this.state.bannerTag}</View>
              <View className='banner-number'>{this.state.banner.length}</View>
            </View>
          </View>

          {/* 快报栏 */}
          <View className='bulletin-box'>
            <View className='bulletin-text'>
              <Image src={require('@/assets/index/bulletin.png')} className='bulletin-img' /> |
            </View>
            <Swiper
              className='bulletin'
              indicatorColor='#999'
              indicatorActiveColor='#333'
              circular
              vertical
              autoplay
              >
              <SwiperItem>
                <View className='bulletin-item'>小熊敬礼进驻江门新会商圈!!!<Image className='right-icon' src={require('@/assets/index/right-icon.png')} /></View>
              </SwiperItem>
              <SwiperItem>
                <View className='bulletin-item'>商家免费进驻，获取海量流量!!!<Image className='right-icon' src={require('@/assets/index/right-icon.png')} /></View>
              </SwiperItem>
            </Swiper>
          </View>

          {/* 赚钱计划 */}
          <View className='feature-box'>
            <View className='feature' onClick={this.goTo.bind(this,'/detail-pages/course/characteristic')}>
              <Image className='feature-img' src={require('@/assets/index/xiong.png')} />
              <View className='feature-text'>
                <View className='text-title'>小熊敬礼特色</View>
                <View>小熊敬礼</View>
              </View>
            </View>
            <View className='feature' onClick={this.goTo.bind(this,'/detail-pages/course/make_money_plan')}>
              <Image className='feature-img' src={require('@/assets/index/zhuan.png')} />
              <View className='feature-text'>
                <View className='text-title'>赚钱计划</View>
                <View>小熊敬礼</View>
              </View>
            </View>
          </View>

          {/* 网红店推荐 */}
          <RecommendBox type={1} list={this.state.hotRecommendList} onAction={this.handleAction} />

          {/* 图片 */}
          <View className='image-box'>
            {data.map(res => {
              return <Image className='img-item' src={res.url} onClick={this.goTo.bind(this,res.router)}/>
            })}
          </View>

          {/* 品牌连锁推荐 */}
          <RecommendBox type={2} list={this.state.brandRecommendList} onAction={this.handleAction} />

          {/* tab栏 */}
          <View className='tab-box'>
            {
              tabList.map((item: any, index) => {
                return (<View
                  key={index}
                  className={
                    "item " +
                    (this.state.current === index ? "active" : "")
                  }
                  onClick={this.handlerTabChange.bind(this, index, item.id)}
                >
                  <View className="label">{item.name}</View>
                  {
                    this.state.current === index ? <View className='active-bottom'></View> : null
                  }

                </View>)
              })
            }
          </View>

          {/* 商品列表 */}
          <View className='listBox'>
            {
              this.state.list ? this.state.list.map((res: any, index) => {
                return <CouponBox item={res} key={res.channel_id} onAction={this.handleAction} />
              }) : null
            }
          </View>

        </View>
      </View>
    )
  }
}
