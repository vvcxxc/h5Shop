import Taro, { Component, Config } from '@tarojs/taro'
import {
  ScrollView, View, Block,
  Image, Text, Switch
} from '@tarojs/components'
import { AtIcon, AtActivityIndicator, AtDivider } from 'taro-ui';
import carousel from "@/static/images/img_carousel.png"
import logo from "@/assets/logo.png";
import "./activity.styl"
import { getLocation } from "@/utils/getInfo";
import request from '../../services/request';

export default class Activity extends Component {
  constructor() {
    super(...arguments)
  }

  config: Config = {
    navigationBarTitleText: "活动中心",
    // enablePullDownRefresh: true
  }

  state = {

    indexGroup: [],
    tabDistanceTop: 0,
    tabHeight: 0,
    // tab标题
    titleList: [],
    current: 0,
    // tab每个标题对应的数据
    storeList: [],
    checkBoxList: [
      // { name: '拼团', id: 0 },
      // { name: '增值', id: 1 },
      { name: '500米以内', id: 2 },
      { name: '1000米以内', id: 3 },
      { name: '2000米以内', id: 4 },
    ],

    reloadHeight: 0, // 刷新的高度
    dargStyle: {//下拉框的样式
      top: 0 + 'px',
      height: '100vh'
    },
    downDragStyle: {//下拉图标的样式
      height: 0 + 'px'
    },
    downText: '下拉刷新',
    start_p: {},
    scrollY: true,
    dargState: 0,//刷新状态 0不做操作 1刷新 -1加载更多


    // 定位
    yPoint: 0,
    xPoint: 0,
    // 数据列表
    dataList: [],
    // 分页
    page: 1,
    // 用来判断有无数据然后发请求
    flag: true,
    // 广告
    cityId: 1942,
    need_jump: 0,
    indexImgId: 0,
    adLogId: 0,
    indexImg: ''
  }

  componentDidMount = () => {
    this.requestTab();

    // 获取广告
    let data: any = Taro.getStorageSync('router')
    this.setState({
      city: data.city_id
    }, () => {
      this.getAdvertising()
    })
  }

  // 获取标题列表
  requestTab = () => {
    Taro.showLoading({
      title: 'loading',
    })


    getLocation().then((res: any) => {
      this.setState({
        yPoint: res.latitude || '',
        xPoint: res.longitude || ''
      }, () => {
        this.getAllData()
      })
    })

    this.setState({
      titleList: [
        { name: '全部', id: 'all' },
        { name: '拼团', id: 'pintuan' },
        { name: '增值', id: 'zengzhi' },
      ]
    })
  }

  handlerTablChange(current, id, _this) {
    this.setState({
      current,
      indexGroup: [],
      dataList: [],
      page: 1,
      flag: true
    }, async () => {
      if (current == 0) {
        this.getAllData()
      } else if (current == 1) {
        this.getGroupData()
      } else if (current == 2) {
        this.getAppreciationData()
      }
    });
  }


  // 获取全部的数据
  getAllData = () => {
    Taro.showLoading({
      title: 'loading'
    })
    request({
      url: 'api/wap/zero/index2',
      method: 'GET',
      data: {
        xpoint: this.state.xPoint,
        ypoint: this.state.yPoint,
        page: this.state.page
      }
    }).then(async res => {
      if (res.data.length != 0) {
        await this.setState({
          dataList: res.data.concat(this.state.dataList)
        })
      } else if (res.data.length == 0) {
        Taro.showToast({
          title: '暂无更多数据',
          icon: 'none'
        })
        this.setState({
          flag: false
        })
      }
      Taro.hideLoading()
    })
  }

  // 获取增值的数据
  getAppreciationData = () => {
    Taro.showLoading({
      title: 'loading'
    })
    request({
      url: 'api/wap/user/appreciation/getYouhuiList2',
      method: 'GET',
      data: {
        xpoint: this.state.xPoint,
        ypoint: this.state.yPoint,
        page: this.state.page
      }
    }).then(async res => {
      if (res.data.length != 0) {
        await this.setState({
          dataList: res.data.concat(this.state.dataList)
        })
      } else if (res.data.length === 0) {
        console.log('getAppreciationData:暂无更多数据')
        Taro.showToast({
          title: '暂无更多数据',
          icon: 'none'
        })
        this.setState({
          flag: false
        })
      }

      Taro.hideLoading()
    })
  }

  // 获取拼团的数据
  getGroupData = () => {
    Taro.showLoading({
      title: 'loading'
    })
    request({
      url: 'api/wap/user/getYonhuiActiveGroupList',
      method: 'GET',
      data: {
        xpoint: this.state.xPoint,
        ypoint: this.state.yPoint,
        page: this.state.page
      }
    }).then(async res => {
      if (res.data.length != 0) {
        await this.setState({
          dataList: res.data.concat(this.state.dataList)
        })
      } else if (res.data.length == 0) {
        Taro.showToast({
          title: '暂无更多数据',
          icon: 'none'
        })
        this.setState({
          flag: false
        })
      }
      Taro.hideLoading()
    })
  }



  onScrollToLower = () => {
    const { current, flag } = this.state;
    if (current == 0 && flag) {
      this.setState({
        page: ++this.state.page
      }, () => {
        this.getAllData()
      })

    } else if (current == 1 && flag) {
      this.setState({
        page: ++this.state.page
      }, () => {
        this.getGroupData()
      })

    } else if (current == 2 && flag) {
      this.setState({
        page: ++this.state.page
      }, () => {
        this.getAppreciationData()
      })
    }
  }

  onScroll = (e) => {
    let scrollView = document.getElementById('scrollView');
    let tab = document.getElementById('tab');
    let showData = document.getElementById('showData');
    let tabVal = this.refs.tab.vnode.dom.offsetTop;
    let activity = document.getElementById('activity');
    let whiteSpace = document.getElementById('whiteSpace');


    if (scrollView.scrollTop >= tabVal) {
      tab.style.cssText = "position: fixed; top: 0; z-Index: 99;";
      showData.style.marginTop = this.refs.tab.vnode.dom.scrollHeight + 'px';
    }

    if (scrollView.scrollTop < activity.offsetHeight + whiteSpace.offsetHeight) {
      tab.style.cssText = "position: static";
      showData.style.marginTop = '0px';
    }
  }

  reduction() {//还原初始设置
    const time = 0.5;
    this.setState({
      upDragStyle: {//上拉图标样式
        height: 0 + 'px',
        transition: `all ${time}s`
      },
      dargState: 0,
      dargStyle: {
        top: 0 + 'px',
        transition: `all ${time}s`,
        height: '100vh'
      },
      downDragStyle: {
        height: 0 + 'px',
        transition: `all ${time}s`
      },
      scrollY: true
    })
    setTimeout(() => {
      this.setState({
        dargStyle: {
          height: '100vh',
          top: 0 + 'px',
        },
        downText: '下拉刷新'
      })
    }, time * 1000);
  }
  touchStart(e) {
    this.setState({
      start_p: e.touches[0]
    })
  }
  touchMove(e) {
    let that = this
    let move_p = e.touches[0],//移动时的位置
      deviationX = 0.30,//左右偏移量(超过这个偏移量不执行下拉操作)
      deviationY = 70,//拉动长度（低于这个值的时候不执行）
      maxY = 100;//拉动的最大高度
    let start_x = this.state.start_p.clientX,
      start_y = this.state.start_p.clientY,
      move_x = move_p.clientX,
      move_y = move_p.clientY;
    console.log(start_x, start_y, move_x, move_y)
    //得到偏移数值
    let dev = Math.abs(move_x - start_x) / Math.abs(move_y - start_y);
    if (dev < deviationX) {//当偏移数值大于设置的偏移数值时则不执行操作
      let pY = Math.abs(move_y - start_y) / 3.5;//拖动倍率（使拖动的时候有粘滞的感觉--试了很多次 这个倍率刚好）
      if (move_y - start_y > 0) {//下拉操作
        if (pY >= deviationY) {
          this.setState({ dargState: 1, downText: '释放刷新' })
        } else {
          this.setState({ dargState: 0, downText: '下拉刷新' })
        }
        if (pY >= maxY) {
          pY = maxY
        }
        this.setState({
          dargStyle: {
            height: '100vh',
            top: pY + 'px',
          },
          downDragStyle: {
            height: pY + 'px'
          },
          scrollY: false//拖动的时候禁用
        })
      }
    }

    let q = this.refs.downDragBox.boundingClientRect();
    q.exec(res => {
      this.setState({
        reloadHeight: res[0].height
      })
    })
  }
  touchEnd(e) {
    if (this.state.dargState === 1) {
      this.down()
    }
    this.reduction()

    // 放手后重置为0
    this.setState({
      reloadHeight: 0
    })
  }
  down() {//下拉
    Taro.showToast({
      icon: 'loading',
      title: 'loading',
      mask: true
    })
    console.log('下拉')
  }

  /**
   * 搜索
   */
  handleSearch = () => {
    Taro.navigateTo({ url: '../index/search/index' });
  }

  /**
   * 切换选中checkbox
   */
  handleSelected = (id) => {
    console.log('handleSelected', id)
    if (this.state.indexGroup.includes(id)) {
      this.state.indexGroup.forEach((item, index) => {
        if (item == id) {
          this.state.indexGroup.splice(index, 1)
          this.setState({
            indexGroup: this.state.indexGroup
          })
        }
      })
    } else {
      this.setState({
        indexGroup: [
          ...this.state.indexGroup,
          id
        ]
      })
    }

  }

  // get 广告
  getAdvertising = () => {
    console.log('广告')
    request({
      url: "v3/ads",
      method: 'GET',
      data: {
        position_id: 2, //位置id
        city_id: this.state.cityId
      }
    })
      .then((res: any) => {
        // console.log(res,'res');
        if (res.code == 200) {
          this.setState({ indexImg: res.data.pic })
          this.setState({ indexImgId: res.data.id })
          this.setState({ adLogId: res.data.adLogId })
          this.setState({ need_jump: res.data.need_jump })
        }

      })

  }
  // 点击广告
  advertOnclick = () => {
    if (!this.state.need_jump) return
    // let store_id = this.$router.params.store_id || sessionStorage.getItem('storeId')
    let data = {}
    // if (store_id) {
    // data = {
    //   ad_id: this.state.indexImgId, //广告id
    //   ad_log_id: this.state.adLogId, //广告日志id
    //   store_id
    // }
    // } else {
    data = {
      ad_id: this.state.indexImgId, //广告id
      ad_log_id: this.state.adLogId //广告日志id
    }
    // }
    request({
      url: 'v3/ads/onclick',
      data
    })
      .then((res: any) => {
        let define: any = {
          [1]: '/pages/business/index?id=' + res.data.store_id,//店铺
          [2]: '/business-pages/ticket-buy/index?id=' + res.data.coupon_id,//现金券
          [3]: '/business-pages/set-meal/index?id=' + res.data.coupon_id,//兑换券
          [4]: '/pages/activity/pages/detail/detail?id=' + res.data.activity_id + '&type=1',//拼团
          [5]: '/pages/activity/pages/detail/detail?id=' + res.data.activity_id + '&type=5'//增值
        }
        Taro.navigateTo({
          url: define[res.data.popularize_type]
        })
      })
  }

  /**
   * 路由跳转
   */
  handleNavigator = (item) => {
    const { is_share, youhui_id, gift_id, activity_id } = item;
    if (is_share == 1) {
      Taro.navigateTo({
        url: '/pages/activity/appreciation/index?id=' + youhui_id + '&type=1&gift_id=' + gift_id + '&activity_id=' + activity_id
      })
    } else {
      Taro.navigateTo({
        url: '/pages/activity/group/index?id=' + youhui_id + '&type=5&gift_id=' + gift_id + '&activity_id=' + activity_id
      })
    }
  }

  render() {
    const scrollTop = 0
    const Threshold = 20
    let dargStyle = this.state.dargStyle;
    // let downDragStyle = this.state.downDragStyle;
    return (
      <Block>
        {/* <View className='downDragBox' ref="downDragBox" style={downDragStyle}>
          <View style={{ width: "100%", textAlign: "center", display: "flex", justifyContent: "center", height: "100%", lineHeight: this.state.reloadHeight + 'px', position: 'relative' }}>
            <AtActivityIndicator mode='center'></AtActivityIndicator>
          </View>
        </View> */}
        <ScrollView
          className='scrollview'
          id="scrollView"
          scrollY
          scrollWithAnimation
          scrollTop={scrollTop}
          style={dargStyle}
          lowerThreshold={Threshold}
          upperThreshold={Threshold}
          onScrollToLower={this.onScrollToLower.bind(this)}
          onScroll={this.onScroll.bind(this)}
        // onTouchStart={this.touchStart.bind(this)}
        // onTouchMove={this.touchMove.bind(this)}
        // onTouchEnd={this.touchEnd.bind(this)}
        >
          <View className="activity" id="activity">
            {/* <View className="head" id="head">
              <View className="search">
                <View className="flex center container">
                  <View className="long-string" style="margin-right:15px;" />
                  <AtIcon className="search-icon" value="search" color="#666666" size={14} />
                  <View className="item search-input" onClick={this.handleSearch}>
                    请输入商家/分类或商圈
							    </View>
                </View>
              </View>
            </View> */}
            <Image onClick={this.advertOnclick} background-size="cover" src={this.state.indexImg} className="area-banner" />
          </View>

          <View className="white-space" id="whiteSpace"></View>

          <View ref="tab" className="tab flex" id="tab">
            {this.state.titleList.map((item: any, index) => (
              <View
                key={" "}
                className={
                  "item flex center " +
                  (this.state.current === index ? "active" : "")
                }
                onClick={this.handlerTablChange.bind(this, index, item.id)}
              >
                <View className="label" style="margin-right:30px;">{item.name}</View>
              </View>
            ))}
          </View>

          <View className="show_data" id="showData">

            {/* <View className="checkBox_bar">
              {
                this.state.checkBoxList.map(item => (
                  <View className="checkBox_wrap" key={item.id} style={this.state.indexGroup.indexOf(item.id) != -1 ? { border: '1px solid #fe7d70', color: "#fe7d70" } : { border: '1px solid #ccc', color: '#ccc' }} onClick={this.handleSelected.bind(this, item.id)}>
                    <Text className="checkBox_text" style={this.state.indexGroup.indexOf(item.id) != -1 ? { color: "#fe7d70" } : { color: "#7b7b7b" }}>
                      {item.name}
                    </Text>
                    <View className={this.state.indexGroup.indexOf(item.id) != -1 ? "checkBox_isCheck" : ""}></View>
                    {
                      this.state.indexGroup.indexOf(item.id) != -1 ? (
                        <View className="checkBox_cancel">x</View>
                      ) : null
                    }
                  </View>
                ))
              }
            </View> */}


            {
              this.state.dataList.length != 0 ? this.state.dataList.map((item: any, index) => {
                return (
                  <View className="store_item" key={item} onClick={this.handleNavigator.bind(this, item)}>
                    <View className="store_img">
                      <Image background-size="cover" src={item.image} className="store_img_show" />
                    </View>
                    <View className="store_info">
                      <View className="store_desc">
                        <Text className="store_name">{item.name}</Text>
                        <View className="store_tips">
                          {
                            item.is_share == 5 ? (
                              <Text className="store_tips_item">{item.number}人团</Text>
                            ) : ''
                          }
                          {
                            item.gift_name ? (
                              <Text className="store_tips_item">{item.gift_name}</Text>
                            ) : ''
                          }
                        </View>
                      </View>
                      <View className="store_msg">
                        <View className="store_price">
                          {
                            item.is_share == 5 ? (
                              <View>
                                <Text className="store_price_new">￥{item.participation_money}</Text>
                                <Text className="store_price_old">￥{item.pay_money}</Text>
                              </View>
                            ) : (
                                <View>
                                  <Text className="store_price_new">￥{item.pay_money}</Text>
                                  <Text className="store_price_old">￥{item.return_money}</Text>
                                </View>
                              )
                          }
                        </View>
                        <View className="store_other_info">
                          <View className="store_any">
                            {/* <Text className="store_follow">关注的店 - </Text> */}
                            <Text className="store_follow_name">{item.store_name}</Text>
                          </View>
                          <View className="store_distance">
                            <Text className="store_distance_num">{item.distance}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                )
              }) : (
                  <View>
                    <View className="no_store">
                      <Text>暂时没有活动，看看其他吧</Text>
                    </View>
                  </View>
                )
            }



          </View>


          {/* <AtDivider className="divider">
            <Image background-size="cover" src={logo} style={{ width: "150px", height: "50px" }} />
          </AtDivider> */}




          {/* <View className="nearby_store">
            <View className="search_nearby">搜索附近</View>

            <View className="nearby_store_item">
              <View className="nearby_store_img">
                <Image background-size="cover" src={carousel} className="nearby_store_img_show" />
              </View>
              <View className="nearby_store_info">
                <View className="nearby_store_desc">
                  <Text className="nearby_store_name">华润万家(广州东晓南121号店)</Text>
                  <View className="nearby_store_msg">
                    <View className="nearby_store_type">便利店</View>
                    <View className="nearby_store_distance">660m</View>
                  </View>
                </View>
                <View className="nearby_store_sign">
                  <Text className="group_gift">拼团送礼</Text>
                  <Text className="appreciation_gift">增值送礼</Text>
                  <Text className="auth_user">认证用户</Text>
                </View>
              </View>
            </View>
            <View className="nearby_store_item">
              <View className="nearby_store_img">
                <Image background-size="cover" src={carousel} className="nearby_store_img_show" />
              </View>
              <View className="nearby_store_info">
                <View className="nearby_store_desc">
                  <Text className="nearby_store_name">华润万家(广州东晓南121号店)</Text>
                  <View className="nearby_store_msg">
                    <View className="nearby_store_type">便利店</View>
                    <View className="nearby_store_distance">660m</View>
                  </View>
                </View>
                <View className="nearby_store_sign">
                  <Text className="group_gift">拼团送礼</Text>
                  <Text className="appreciation_gift">增值送礼</Text>
                  <Text className="auth_user">认证用户</Text>
                </View>
              </View>
            </View>
            <View className="nearby_store_item">
              <View className="nearby_store_img">
                <Image background-size="cover" src={carousel} className="nearby_store_img_show" />
              </View>
              <View className="nearby_store_info">
                <View className="nearby_store_desc">
                  <Text className="nearby_store_name">华润万家(广州东晓南121号店)</Text>
                  <View className="nearby_store_msg">
                    <View className="nearby_store_type">便利店</View>
                    <View className="nearby_store_distance">660m</View>
                  </View>
                </View>
                <View className="nearby_store_sign">
                  <Text className="group_gift">拼团送礼</Text>
                  <Text className="appreciation_gift">增值送礼</Text>
                  <Text className="auth_user">认证用户</Text>
                </View>
              </View>
            </View>
          </View> */}


        </ScrollView>

      </Block>

    )
  }
}
