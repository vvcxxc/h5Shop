import Taro, { Component, Config } from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import { AtIcon } from 'taro-ui';
import './index.styl';
import request from '../../services/request';
// import { connect } from '@tarojs/redux'
import { getLocation } from '../../utils/getInfo'
import VersionOne from './versionOne/index'
import VersionTwo from './versionTwo/index'
import VersionThree from './versionThree/index'

export default class Index extends Component<any> {
	/**
	 * 指定config的类型声明为: Taro.Config
	 *
	 * 由于 typescript 对于 object 类型推导只能推出 Key 的基本类型
	 * 对于像 navigationBarTextStyle: 'black' 这样的推导出的类型是 string
	 * 提示和声明 navigationBarTextStyle: 'black' | 'white' 类型冲突, 需要显示声明类型
	 */
  config: Config = {
    navigationBarTitleText: '团卖物联',
    enablePullDownRefresh: true,
  };

  state = {
    storeList: [],
    storeHeadImg: '',
    titleList: [], // title列表
    locations: { longitude: null, latitude: null },//存储地理位置
    routerId: '', //路由传递的id
    cityName: '',
    page: 1,
    meta: {},
    deal_cate_id: null,
    current: 0,
    showLine: false,
    cityId: null,
    indexImg: '',
    showGift: null,
    indexImgId: null,
    adLogId: null,
    need_jump:null,
    return_data:false
  };

  constructor(props) {
    super(props);
  }

  componentWillMount() {
  }

  componentDidMount() {
    this.showLoading();
    this.requestTab(); //经营列表
    this.localStorageData();
    this.requestLocation();
    this.showGift();
    // this.controlVersion()
  }

  requestLocation = () => {
    Taro.getStorage({ key: 'allCity' })
      .then(res => {
        return
      })
    request({ url: 'v3/district', data: { model_type: '2' } })
      .then((res: any) => {
        Taro.setStorage({ key: 'allCity', data: res.data.city_list })

      })
  }


  localStorageData = () => {
    if (Object.keys(this.$router.params).length < 1) {
      this.getLocatione();
      return
    }
    Taro.getStorage({ key: 'router' }).then((res: any) => {
      if (res.data.city_name && res.data.city_id) {
        this.setState({ cityName: res.data.city_name })
        this.setState({ cityId: res.data.city_id })
        if (this.state.deal_cate_id) {
          this.setState({ meta: { city_id: res.data.city_id, deal_cate_id: this.state.deal_cate_id } }, () => {
            this.requestHomeList(this.state.meta)
          })
        } else {
          this.setState({ meta: { city_id: res.data.city_id } }, () => {
            this.requestHomeList(this.state.meta)
          })
        }
      }
      if (res.data.xpoint || res.data.ypoint) {
        if (this.state.deal_cate_id) {
          this.setState({
            meta: {
              xpoint: res.data.xpoint,
              ypoint: res.data.ypoint,
              deal_cate_id: this.state.deal_cate_id
            }
          }, () => {
            this.requestHomeList(this.state.meta)
          })
        } else {
          this.setState({ meta: { xpoint: res.data.xpoint, ypoint: res.data.ypoint } }, () => {
            request({
              url: 'v3/city_name',
              data: { xpoint: res.data.xpoint, ypoint: res.data.ypoint }
            })
              .then((res: any) => {
                this.setState({ cityName: res.data.city })
              })
            this.requestHomeList(this.state.meta)
            this.getCityId()
          })
        }
      }
    })

  }
  // get location
  getLocatione = () => {
    getLocation().then((res: any) => {
      this.setState({ meta: { xpoint: res.longitude, ypoint: res.latitude } })
      this.setState({ locations: res }, () => {
        this.getCity();
        if (this.state.deal_cate_id == null) {
          this.requestHomeList({ xpoint: res.longitude, ypoint: res.latitude })
        } else {
          this.setState({
            meta: {
              xpoint: this.state.locations.longitude,
              ypoint: this.state.locations.latitude,
              deal_cate_id: this.state.deal_cate_id
            }
          }, () => {
            this.requestHomeList(this.state.meta)
          })
        }
      })
    })
  }

  // 获取城市
  getCity = () => {
    request({
      url: 'v3/city_name',
      data: { xpoint: this.state.locations.longitude, ypoint: this.state.locations.latitude }
    })
      .then((res: any) => {
        this.setState({ cityName: res.data.city }, () => {
          this.getCityId()
        })
      })
  }


  getCityId = () => {
    request({
      url: 'v3/citys',
      data: { keyword: this.state.cityName }
    })
      .then((res: any) => {
        this.setState({ cityId: res.data[0].id }, () => {
          this.showImage()
        })
      })
  }

  // 首页数据 初始渲染
  requestHomeList = (meta) => {
    this.showLoading();
    Taro.stopPullDownRefresh()
    request({
      url: 'v3/stores',
      data: { ...meta }
    })
      .then((res: any) => {
        Taro.hideLoading()
        this.setState({ storeList: res.data.store_info.data, storeHeadImg: res.data.banner });
      })
      .catch(() => {
        this.showLoading()
      })
  }


  onPullDownRefresh () { // 自带 下拉事件
    this.localStorageData();
    this.setState({return_data:false})
  }

  onReachBottom () { 	// 自带 触底事件
    // let return_data

    // if(return_data) return
    if(this.state.return_data) return
    this.showLoading()
    this.setState({ page: this.state.page + 1 },()=>{
      let miss = {
        ...this.state.meta, pages: this.state.page
      }
      if (this.state.deal_cate_id) {
        miss['deal_cate_id'] = this.state.deal_cate_id
      }
      request({
        url: 'v3/stores',
        data: {
          ...miss
        }
      })
        .then((res: any) => {
          Taro.stopPullDownRefresh()
          Taro.hideLoading()
          console.log(res.data.store_info.data,'data')
          if(res.data.store_info.data.length<1){
            this.setState({return_data:true})
          }else {
            this.setState({return_data:false})
          }
          this.setState({ storeList: [...this.state.storeList, ...res.data.store_info.data], storeHeadImg: res.data.banner });
        })
    })

  }

  // show loading
  showLoading = () => {
    Taro.showLoading({
      title: 'loading',
      mask: true
    })
  }

  // 获取title数据
  requestTab = () => {
    request({
      url: 'v3/manage_type'
    })
      .then((res: any) => {
        let mete = [{ name: '全部', id: 'all' }, ...res.data]
        this.setState({ titleList: mete })
      })
  }

  handleActivityClick = () => { };

  // 跳转 搜索商家列表页面
  handleSearch = () => Taro.navigateTo({ url: './search/index' });
  // 跳转 搜素城市页面
  showSelectCity = () => Taro.navigateTo({ url: '/business-pages/select-city/index' });

  handlerTablChange(current, id, _this) {
    this.setState({ current });
    if (id == 'all' || this.state.deal_cate_id == 'all') {
      this.setState({ deal_cate_id: null })
      this.requestHomeList({ ...this.state.meta })
      return
    }
    this.setState({ deal_cate_id: id })
    this.requestHomeList({ ...this.state.meta, deal_cate_id: id })
  }


  styleControl = (item) => {
    if (item.merchant) {
      if (
        item.exchange_coupon_name === null &&
        item.gift_coupon_name === null &&
        item.gift_name === null) {
        return false
      }
      return true
    }
  }


  handleClick = (_id, e) => {
    Taro.navigateTo({
      url: '/pages/business/index?id=' + _id
    })
  };

  judgeData = (value1) => {
    return typeof (value1) === 'string' ? (value1.length > 1 ? '' : 'none') : 'none'
  }

  controlPicture = (gift, coupon, preview?) => { // 控制图片显示
    if (!coupon && !gift) return false //两个图片都没有 显示门头照preview
    if (!gift) return 1 //礼品图不存在 只显示一张coupon
    return 2 //两张都显示
  }

  showGift = () => {
    request({
      url: 'v3/user/home_index'
    })
      .then((res: any) => {
        this.setState({ showGift: res.data.have_gift })
      })
  }

  showImage = () => {
    request({
      url: 'v3/ads',
      data: {
        position_id: '3',
        city_id: this.state.cityId
      }
    })
      .then((res: any) => {
        console.log(res,'res')
        this.setState({ indexImg: res.data.pic })
        this.setState({ indexImgId: res.data.id })
        this.setState({ adLogId: res.data.adLogId })
        this.setState({ need_jump: res.data.need_jump})
      })
  }

  // 跳转到我的礼品
  routerGift = () => {
    // Taro.reLaunch(
    // 	{ url: '../../pages/my/index' }
    // )
    Taro.navigateTo({ url: '/activity-pages/my-welfare/pages/gift/welfare.gift' });
  }
  gotoGroup = () => {
    Taro.navigateTo({
      url: '/pages/activity/pages/list/list?type=5'
    })
  }
  gotoAppre = () => {
    Taro.navigateTo({
      url: '/pages/activity/pages/list/list?type=1'
    })
  }

     // 点击广告
  advertOnclick = () => {
    if (!this.state.need_jump) return
    request({
      url: 'v3/ads/onclick',
      data: {
        ad_id: this.state.indexImgId, //广告id
        ad_log_id: this.state.adLogId //广告日志id
      }
    })
      .then((res: any) => {
        let define:any = {
          [1]: '/pages/business/index?id=' + res.data.store_id,//店铺
          [2]: '/business-pages/ticket-buy/index?id='+ res.data.coupon_id ,//现金券
          [3]: '/business-pages/set-meal/index?id=' + res.data.coupon_id,//兑换券
          [4]: '/pages/activity/pages/detail/detail?id=' + res.data.activity_id + '&type=1',//拼团
          [5]: '/pages/activity/pages/detail/detail?id=' + res.data.activity_id + '&type=5'//增值
        }
        Taro.navigateTo({
          url: define[res.data.popularize_type]
        })
      })
  }

// controlVersion = () => {
//   request({
//   url: 'v3/stores/pay_store/826',
//   })
//   .then((res: any) => {
//     console.log(res,'3478743285478')
//   })
//   }


  render() {
    return (
      <View className="index">
        <View className="headr">
          <View className="search">
            <View className="flex center container">
              <View className="city" style="padding-right:15px;" onClick={this.showSelectCity}>
                {this.state.cityName}
                <AtIcon
                  onClick={this.showSelectCity}
                  className="chevron-down"
                  value="chevron-down"
                  color="#313131"
                  size="12"
                />
              </View>
              <View className="long-string" style="margin-right:15px;" />
              <AtIcon className="search-icon" value="search" color="#666666" size={14} />
              <View className="item search-input" onClick={this.handleSearch}>
                请输入商家名、品类
							</View>
            </View>
          </View>
          <View className="swiper"  onClick={this.advertOnclick.bind(this)}>
            <Image

            src={
              this.state.indexImg ? this.state.indexImg : "http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/dHBc2GQi27cjhNpsYpAnQYxybxPdADHG.png"
            } className="image" />
          </View>
        </View>
        <View className="advert">
          <Image src={"http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/MfwcW2Qn5hC8T4mfJT8t5NcAEh7pTQRb.png"} onClick={this.gotoGroup}></Image>
          <Image src={"http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/wWmWHKBjWZbkxYNPGPRZAst8CKbfNsGk.png"} onClick={this.gotoAppre}></Image>
        </View>
        <View className="no_receive" style={{ display: this.state.showGift == 1 ? '' : 'none' }}
        >你还有未领取的礼品 去
					<Text style="color:#FF6654" onClick={this.routerGift}>“我的礼品”</Text>	看看
				</View>
        <View className="tab flex" style="background-color:#f6f6f6 ;white-space: nowrap; overflow-x:scroll;overflow-y: hidden; padding-left: 16px">
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
        {
          this.state.storeList.map((item: any, index: any) => {
            return <View className='merchant inset '
              style={{
                paddingBottom: this.styleControl(item) ? '5px' : '0px',
                borderRadius: this.styleControl(item) ? '' : '20px'
              }}>
              <View className="content flex" onClick={this.handleClick.bind(this, item.id)}>
                <View className="item">
                  <View className="flex" style="margin-bottom:5px;">
                    <View className="title item" style="font-weight:500;">{item.name}</View>
                    <AtIcon value="chevron-right" color="#999" size="16px" />
                  </View>

                  <View style="display:flex; justify-content:space-between; margin:5px 0px;">
                    <View style="display:flex;">
                      {
                        item.label.map((item1: any, index1: any) => {
                          return <View className="tag" key={index1} style="background-color:#fff;border: 1px solid rgba(255, 102, 84, 1);">{item1}</View>
                        })
                      }
                    </View>
                    <View>{item.distance} </View>
                  </View>
                </View>
              </View>
              <View className="content_box" onClick={this.handleClick.bind(this, item.id)}
              >
                <View className='content_img' 	>
                  <Image src={
                    this.controlPicture(item.gift_pic, item.coupon_image_url) === false ||
                      this.controlPicture(item.gift_pic, item.coupon_image_url) === 1 ?
                      item.preview : item.coupon_image_url} />
                </View>
                <View className={this.controlPicture(item.gift_pic, item.coupon_image_url) === 2 ?
                  'content_img' : 'hidden_content_img'} style="position:relative;  padding-left:2px; margin-left:5px; ">
                  <Image src={require("./border.png")} style="position:absolute; top:0px;left:0px; z-index:2" />
                  <Image src={require("./qiu.png")} style="position:absolute; top:-4px;left:41%; width:25px;height:25px; z-index:2" />
                  <Image src={item.gift_pic} />
                </View>
              </View>
              <View>
                <View className="give flex center" style={{ display: this.judgeData(item.gift_name) }}>
                  <View className="icon">礼</View>
                  <View className="title item ellipsis-one">
                    <Text>{item.gift_name}</Text>
                  </View>
                </View>
                <View className="give flex center"
                  style={{ display: typeof (item.cash_coupon_name) === 'string' ? '' : 'none' }}>
                  <View className="icon" style="background: #5d84e0">券</View>
                  <View className="title item">
                    <Text>{item.cash_coupon_name}</Text>
                  </View>
                </View>
                <View className="give flex center"
                  style={{
                    display: typeof (item.exchange_coupon_name) === 'string' ? '' : 'none'
                  }}>
                  <View className="icon" style="background: #5dd8a5">惠</View>
                  <View className="title item ellipsis-one">
                    {item.exchange_coupon_name}
                  </View>
                </View>
              </View>
            </View>
          })
        }
      </View>
    );
  }
}
