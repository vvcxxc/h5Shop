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
import iNoBounce from '@/utils/inobouce';


export default class Activity extends Component<any>  {

  config: Config = {
    navigationBarTitleText: "活动中心",
    // enablePullDownRefresh: true,
  }

  state = {

    indexGroup: [],
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

  componentDidShow() {
    console.log('global', iNoBounce)
    // let u = navigator.userAgent
    // if (u.indexOf('iPhone') > -1) {
    //     console.log('iNoBounce',iNoBounce)
    //     iNoBounce.enable()
    // }
  }

  componentDidMount() {


  }

  onReachBottom() {
    const { current, flag } = this.state;
    if (!this.state.dataList.length) {
      console.log('禁止触底')
      return
    }
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

  componentWillMount = () => {
    Taro.pageScrollTo({ scrollTop: 0 })
    getLocation().then((res: any) => {
      this.setState({
        yPoint: res.latitude || '',
        xPoint: res.longitude || ''
      }, () => {
        this.getAllData()
      })
    })


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

    this.setState({
      titleList: [
        { name: '全部', id: 'all' },
        { name: '拼团', id: 'group' },
        { name: '增值', id: 'appreciation' },
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
    }).then(async (res: any) => {
      if (res.data.length != 0) {
        await this.setState({
          dataList: res.data.concat(this.state.dataList)
        })
      } else if (res.data.length == 0) {
        console.log(1)
        Taro.showToast({
          title: '暂无更多数据',
          icon: 'none',
          duration: 2000
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
    }).then(async (res: any) => {
      if (res.data.length != 0) {
        await this.setState({
          dataList: res.data.concat(this.state.dataList)
        })
      } else if (res.data.length === 0) {
        console.log(2)
        Taro.showToast({
          title: '暂无更多数据',
          icon: 'none',
          duration: 2000
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
    }).then(async (res: any) => {
      if (res.data.length != 0) {
        await this.setState({
          dataList: res.data.concat(this.state.dataList)
        })
      } else if (res.data.length == 0) {
        console.log(3)
        Taro.showToast({
          title: '暂无更多数据',
          icon: 'none',
          duration: 2000
        })
        this.setState({
          flag: false
        })
      }
      Taro.hideLoading()
    })
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
        // url: '/pages/appre-activity/index?id=' + youhui_id + '&type=1&gift_id=' + gift_id + '&activity_id=' + activity_id
        url: '/pages/activity/appreciation/index?id=' + youhui_id + '&type=1&gift_id=' + gift_id + '&activity_id=' + activity_id
      })
    } else {
      Taro.navigateTo({
        // url: '/pages/group-activity/index?id=' + youhui_id + '&type=5&gift_id=' + gift_id + '&activity_id=' + activity_id
        url: '/pages/activity/group/index?id=' + youhui_id + '&type=5&gift_id=' + gift_id + '&activity_id=' + activity_id
      })
    }
  }



  render() {
    return (
      <View className="activity_wrap">

        <View className="activity" id="activity">
          <Image onClick={this.advertOnclick} background-size="cover" src={this.state.indexImg} className="area-banner" />
        </View>

        <View className="white-space" id="whiteSpace"></View>

        <View ref="tab" className="tab2 flex" id="tab">
          {this.state.titleList.map((item: any, index) => (
            <View
              key={" "}
              className={
                "item flex center2 " +
                (this.state.current === index ? "active" : "")
              }
              onClick={this.handlerTablChange.bind(this, index, item.id)}
            >
              <View className="label" style="margin-right:30px;">{item.name}</View>
            </View>
          ))}
        </View>

        <View className="show_data" id="showData">

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
                            <View className="store_tips_item">送{item.gift_name}</View>
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
                          <View className="store_follow_name">{item.store_name}</View>
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

      </View>
    )
  }
}
