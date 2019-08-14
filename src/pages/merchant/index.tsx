import Taro, { Component, hideToast } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';
import { AtSearchBar } from 'taro-ui';
import './index.styl';
import request from '../../services/request';
import List from './list'
import { getLocation } from '../../utils/getInfo'

import FilterTotal from "@/components/filter-total";
interface defineType {
  deal_cate_id?: number,
  distance_id?: number,
  sort_id?: number,
  page?: number,
  keyword?: number | string
}
export default class MerChantPage extends Component {
  config = {
    navigationBarTitleText: '商家'
  };

  state = {
    search: '',
    stores: [],
    filter: [],
    locationPosition: { xpoint: '', ypoint: '' },//存储获取到的地理位置
    select: [],
    selectData: { name: '', type: "" },
    page: 1,
    deal_cate_id: null,
    distance_id: null,
    sort_id: null,
    show_bottom: false,
    close:false
  };

  constructor(props) {
    super(props);
  }
  componentWillMount() {
    Taro.pageScrollTo({scrollTop: 0})
    this.getPosition();// 经纬度
    Taro.showLoading({ title: 'loading', mask: true })//显示loading
  }

  componentDidMount() {
  }

  // 搜索赋值
  handlerSearch = (value) => {
    this.setState({ search: value });
  }
  getPosition() {
    // Taro.getStorage({ key: 'router' }).then((res: any) => {
    //   let data: any = this.state.locationPosition
    //   data.xpoint = res.data.xpoint
    //   data.ypoint = res.data.ypoint
    //   data.city_id = res.data.city_id
    //   data.pages = 1
    //   this.setState({ locationPosition: data }, () => {
    //     if (this.$router.params.value) {
    //       console.log('走这里：' + this.$router.params.value)
    //       this.setState({ search: this.$router.params.value })
    //       this.requestSearch(this.$router.params.value)//路由渲染
    //     } else {
    //       this.requestData(this.state.locationPosition)
    //     }
    //   })
    // })
    let router = JSON.parse(sessionStorage.getItem('router'));
    if(router){
      let res = {
        data:router
      }
      let data: any = this.state.locationPosition
      data.xpoint = res.data.xpoint
      data.ypoint = res.data.ypoint
      data.city_id = res.data.city_id
      data.pages = 1
      this.setState({ locationPosition: data }, () => {
        if (this.$router.params.value) {
          console.log('走这里：' + this.$router.params.value)
          this.setState({ search: this.$router.params.value })
          this.requestSearch(this.$router.params.value)//路由渲染
        } else {
          this.requestData(this.state.locationPosition)
        }
      })
    }
  }

  //处理 路由跳转 和 搜索
  requestSearch = (search) => {
    if (!search) return
    Taro.showLoading({ title: 'loading', mask: true })
    request({
      url: 'v3/stores',
      data: {
        xpoint: this.state.locationPosition.xpoint,
        ypoint: this.state.locationPosition.ypoint,
        keyword: search
      },
    })
      .then((res: any) => {
        this.setState({ stores: res.data.store_info.data })
        Taro.hideLoading()
      });
  }

  // 首页页面渲染
  requestData = (data, search?) => {
    if (search) return
    request({
      url: 'v3/stores',
      data
    })
      .then((res: any) => {
        Taro.stopPullDownRefresh()
        this.setState({ stores: res.data.store_info.data })
        Taro.hideLoading()
      })
  }


  filterClick(index, id1?, id2?, id3?) {

    // let define: defineType = {}
    let define: any = this.state.locationPosition
    if (id1) {
      define.deal_cate_id = id1
      this.setState({ deal_cate_id: id1 })
    } else {
      this.setState({ deal_cate_id: null })
    }
    if (id2) {
      define.distance_id = id2
      this.setState({ distance_id: id2 })
    } else {
      this.setState({ distance_id: null })
    }
    if (id3) {
      define.sort_id = id3
      this.setState({ sort_id: id3 })
    } else {
      this.setState({ sort_id: null })
    }
    if (this.$router.params.value) {
      define.keyword = this.$router.params.value
      this.setState({ search: this.$router.params.value })
    }
    if (this.state.search) {
      define.keyword = this.state.search
    } else {
      delete define['keyword']
    }

    if (!id1 && !id2 && !id3) {
      if (define.deal_cate_id) delete define['deal_cate_id']
      if (define.distance_id) delete define['distance_id']
      if (define.sort_id) delete define['sort_id']
    }
    define.pages = this.state.page
    this.setState({
      locationPosition: define
    })
    request({
      url: 'v3/stores',
      data: define
    })
      .then((res: any) => {
        if (res.data.store_info.data.length < 1) {
          this.setState({ show_bottom: true })
        } else {
          this.setState({ show_bottom: false })
        }
        if (index === 1) {
          this.setState({ stores: [...this.state.stores, ...res.data.store_info.data], storeHeadImg: res.data.banner });
        } else {
          this.setState({ page: 1 })
          this.setState({ stores: res.data.store_info.data })
        }
        Taro.hideLoading()
      })
  }

  // // 微信自带监听 滑动事件
  // onPullDownRefresh  () {
  //   this.requestData(this.state.locationPosition.longitude, this.state.locationPosition.latitude) //渲染页面
  //   this.setState({show_bottom:false})
  // }

  // // 触底事件
  // onReachBottom () {
  //   if(this.state.show_bottom) return
  //   Taro.showLoading({ title: 'loading', mask: true })//显示loading
  // 	this.setState({ page: this.state.page + 1 }, ()=> {
  // 		this.filterClick(1, this.state.deal_cate_id, this.state.distance_id, this.state.sort_id)
  // 	})
  // }


  // 微信自带监听 滑动事件
  onPullDownRefresh() {
    this.setState({ show_bottom: false })
    this.setState({ page: 1 }, () => {
      let data: any = this.state.locationPosition
      data.pages = 1
      this.setState({ locationPosition: data }, () => {
        this.requestData(this.state.locationPosition)
      })
    }
    )
  }

  // 触底事件
  onReachBottom() {
    if (this.state.show_bottom) return
    Taro.showLoading({ title: 'loading', mask: true })//显示loading
    this.setState({ page: this.state.page + 1 }, () => {
      this.filterClick(1, this.state.deal_cate_id, this.state.distance_id, this.state.sort_id)
    })
  }

  // 标题点击
  titleOnClick = (index, deal_cate_id, distance_id, sort_id) => { // 点击事件
    this.setState({ page: 1 }, () => {
      this.filterClick(0, deal_cate_id, distance_id, sort_id)
    })
  }

  // 点击搜索触发
  onActionClick = () => {
    this.$router.params.value = null
    this.setState({ page: 1 }, () => {
      this.filterClick(0, this.state.deal_cate_id, this.state.distance_id, this.state.sort_id)
    })
  }
  onClearSearch = () => {
    this.setState({ search: '' }, () => {
      this.$router.params.value = null
      this.setState({ page: 1 }, () => {
        this.filterClick(0, this.state.deal_cate_id, this.state.distance_id, this.state.sort_id)
      })
    });
  }
  // onActionClick
  // 跳转详情
  handleClick = id => {
    Taro.navigateTo({
      url: '/pages/business/index?id=' + id
    })
  };
  labelColor = (color: any) => {
    let data: any = {
      ['拼团送礼']: 'http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/e78pJkim5TSZdQzBcPHSbz5aDPtM32nC.png',
      ['增值送礼']: 'http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/7KyKnTjB7rSMktxap7Q3hFQaAyc3nG5j.png',
      ['认证商户']: 'http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/7njShRycfEmZXnDncSBYiyyFdsKDPp5w.png'
    }
    return data[color]
  }
  // 点击展开或者收回
  telescopicBox = (index: number, e) => {
    this.setState({ telescopic: !this.state.telescopic }, () => {
      let data: any = this.state.stores
      this.state.telescopic ? data[index].height = 'auto' : data[index].height = '3.2rem'
      this.setState({ stores: data })
    })
    e.stopPropagation();
  }

  // 点击空白处，筛选的格子也会消失
  clearClick=()=>{
    console.log('出发')
    this.setState({close:true})
  }

  render() {
    return (
      <View>
        <AtSearchBar
          value={this.state.search}
          onActionClick={this.onActionClick.bind(this)}
          onClear={this.onClearSearch.bind(this)}
          onChange={this.handlerSearch.bind(this)}
        />
        <FilterTotal onClick={this.titleOnClick.bind(this, 0)}  />
        <View className="merchant-list" style="background-color:#fff;">
          {/* <List onClick={this.handleClick} list={
            this.state.stores
          } /> */}

          <View style={{ minHeight: '100vh', height: 'auto', background: '#ededed', overflow: 'hidden' }} onClick={this.clearClick}>
            {
              this.state.stores.map((item2: any, index: any) => {
                return <View className="new_box">
                  <View className="box" style={{ paddingBottom: item2.activity ? '' : '4px' }} onClick={this.handleClick.bind(this, item2.id)}>
                    <View className="box_title">
                      <View className="title_l">
                        <Image src={item2.preview} />
                      </View>
                      <View className="title_r">
                        <View className="title_r_name ellipsis-one">{item2.name}</View>
                        <View className="title_r_distance">
                          <View style={{ fontWeight: 'normal' }}>
                            {
                              item2.deal_cate ? item2.deal_cate : null
                            }
                          </View>
                          <View>{item2.distance}</View>
                        </View>
                        <div className="title_r_gift">
                          {
                            item2.label.map ? item2.label.map((item3: any, index3: number) => {
                              return < img src={this.labelColor(item3)} alt="" />
                            }) : null
                          }
                        </div>
                      </View>
                    </View>
                    <View
                      className="box_bottom" id="box_bottom"
                      style={{
                        position: 'relative',
                        height:
                          !this.state.stores[index].height ?
                            item2.activity_num > 2 ? '3.2rem' : 'auto' : this.state.stores[index].height,
                        marginBottom: item2.activity_num >= 1 ? '-0.001rem' : '15px',
                        overflow: 'hidden',
                      }}
                    >
                      <View onClick={this.telescopicBox.bind(this, index)}
                        className="_child"
                        style={{
                          position: 'absolute', top: '0', right: '0',
                          display: item2.activity_num > 2 ? '' : 'none'
                        }}
                      >
                        <View style={{ marginRight: '8px' }}>{item2.activity_num ? item2.activity_num + '个活动' : null}</View>
                        <Image
                          style={{ marginRight: 0 }}
                          src={
                            this.state.stores[index].height !== 'auto' ? require('../../assets/jiao_bottom.png') : require('../../assets/jiao_top.png')}
                        />
                      </View>


                      <View
                        style={{
                          display: item2.activity ? item2.activity.group ? '' : 'none' : 'none',
                          justifyContent: 'space-between',
                          borderBottom: item2.activity_num === 1 ? 'none' : '0.5px solid #eeeeee'
                        }}
                      >

                        <View className="_child">
                          < Image src={
                            item2.activity ?
                              (item2.activity.group ? item2.activity.group.icon : null)
                              : null}
                          />

                          <View className="ellipsis-one"
                            style={{ width: '9rem', display: 'block' }}
                          >
                            <span>
                              {
                                item2.activity ? (item2.activity.group ? item2.activity.group.activity_info : null)
                                  : null
                              }
                            </span>
                            <span style={{ color: '#C71D0B' }}>
                              {
                                item2.activity ? (item2.activity.group ? item2.activity.group.gift_info : null)
                                  : null
                              }
                            </span>
                          </View>
                        </View>

                      </View>
                      <View
                        className="_child"
                        style={{ display: item2.activity ? item2.activity.cash_coupon ? '' : 'none' : 'none', }}
                      >
                        <Image src={
                          item2.activity ?
                            (item2.activity.cash_coupon ? item2.activity.cash_coupon.icon : null)
                            : null}
                        />
                        <View className=" ellipsis-one"
                          style={{ width: '9rem', display: 'block' }}>
                          <span>
                            {
                              item2.activity ? (item2.activity.cash_coupon ? item2.activity.cash_coupon.activity_info : null)
                                : null
                            }
                          </span>
                        </View>
                      </View>

                      <View
                        className="_child"
                        style={{ display: item2.activity ? item2.activity.exchange_coupon ? '' : 'none' : 'none' }}
                      >
                        <Image src={
                          item2.activity ?
                            (item2.activity.exchange_coupon ? item2.activity.exchange_coupon.icon : null)
                            : null}
                        />
                        <View className=" ellipsis-one"
                          style={{ width: '9rem', display: 'block' }}>
                          <span>
                            {
                              item2.activity ? (item2.activity.exchange_coupon ? item2.activity.exchange_coupon.activity_info : null)
                                : null
                            }
                          </span>
                        </View>
                      </View>

                      <View
                        className="_child"
                        style={{ display: item2.activity ? item2.activity.zeng ? '' : 'none' : 'none' }}
                      >
                        < Image src={
                          item2.activity ?
                            (item2.activity.zeng ? item2.activity.zeng.icon : null)
                            : null}
                        />
                        <View className=" ellipsis-one"
                          style={{ width: '9rem', display: 'block' }}>
                          <span>
                            {
                              item2.activity ? (item2.activity.zeng ? item2.activity.zeng.activity_info : null)
                                : null
                            }
                          </span>
                          <span style={{ color: '#C71D0B' }}>
                            {
                              item2.activity ? (item2.activity.zeng ? item2.activity.zeng.gift_info : null)
                                : null
                            }
                          </span>
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              })
            }
          </View>

        </View>
      </View>
    );
  }
}
