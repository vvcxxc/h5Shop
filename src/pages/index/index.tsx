import Taro, { Component, Config } from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import { AtIcon } from 'taro-ui';
import './index.styl';
import request from '../../services/request';
// import { connect } from '@tarojs/redux'
import { getLocation } from '../../utils/getInfo'
import VersionOne from './versionOne/index'

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
    need_jump: null,
    return_data: false,
    hahaData: {
    }
  };

  constructor(props) {
    super(props);
  }

  componentWillMount() {
  }


  componentDidMount() {
    let id = this.$router.params.id;
    if (id) {
      sessionStorage.setItem('payStore', id)
    }
    this.requestLocation();
    this.recognizer();
    this.getPayStore();//获取中奖门店信息
  }

  // 识别器
  recognizer = () => {
    this.requestTab(); //经营列表
    Taro.getStorage({ key: 'router' }).then((res: any) => {
      if (Object.keys(res.data).length < 1) {
        this.requestTab(); //经营列表
        this.getLocationxy()// 获取定位和 城市id 城市名字
        return
      }
      this.requestTab();
      if (res.data.city_id && res.data.city_name) {
        getLocation().then((res2: any) => {
          let data: any = this.state.meta
          data.xpoint = res2.longitude
          data.ypoint = res2.latitude
          data.city_id = res.data.city_id
          data.city_name = res.data.city_name
          data.page = 1
          this.setState({ cityName: res.data.city_name })
          this.setState({ meta: data }, () => {
            this.requestHomeList(data)
          })
        })
        return
      }

      if (res.data.xpoint && res.data.ypoint) {
        let data: any = this.state.meta
        data.xpoint = res.data.xpoint
        data.ypoint = res.data.ypoint
        this.getCity(data)
        data.page = 1
        this.setState({ meta: data })
      }
    }).catch((res: any) => {
      this.getLocationxy()// 获取定位和 城市id 城市名字
    })
  }

  getLocationxy = () => {
    getLocation().then((res: any) => {
      this.setState({ meta: { xpoint: res.longitude, ypoint: res.latitude } }, () => {
        // if (res.longitude.length < 1 && res.latitude.length < 1) {
        //   let data: any = this.state.meta
        //   data.city_id = 1924
        //   this.setState({ meta: data })
        //   return
        // }
        this.getCity()
      })
    })
  }

  // 获取城市
  getCity = (data?: any) => {
    let datas = data ? data : this.state.meta
    request({
      url: 'v3/city_name',
      data: datas
    })
      .then((res: any) => {
        this.setState({ cityName: res.data.city }) //城市名字
        this.setState({ // 保存了城市id 和经纬度
          meta: {
            city_id: res.data.city_id,
            xpoint: this.state.meta.xpoint,
            ypoint: this.state.meta.ypoint,
            page: this.state.page
          }
        }, () => {
          this.showImage();
          this.requestHomeList(this.state.meta)
        })
      })
  }
  requestHomeList = (data?: any) => {
    let define = data ? data : this.state.meta
    this.showLoading();
    // Taro.stopPullDownRefresh()
    request({
      url: 'v3/stores',
      data: define
    })
      .then((res: any) => {
        Taro.hideLoading()
        this.setState({ storeList: res.data.store_info.data, storeHeadImg: res.data.banner });
        if (this.state.meta.page > 1) {
          this.setState({ storeList: [...this.state.storeList, ...res.data.store_info.data], storeHeadImg: res.data.banner });
        }
      })
      .catch(() => {
        this.showLoading()
      })

    Taro.setStorage({
      key: 'router',
      data: this.state.meta
    })
  }

  // 获取所有城市列表
  requestLocation = () => {
    request({ url: 'v3/district', data: { model_type: '2' } })
      .then((res: any) => {
        Taro.setStorage({ key: 'allCity', data: res.data.city_list })
      })
  }

  // 获取title数据
  requestTab = () => {
    request({
      url: 'v3/manage_type'
    })
      .then((res: any) => {
        this.setState({ titleList: [{ name: '全部', id: 'all' }, ...res.data] })
      })
  }

  handlerTablChange(current, id, _this) {
    this.setState({ current });
    let data = this.state.meta
    data.page = 1
    this.setState({ meta: data })

    if (id == 'all' || this.state.deal_cate_id == 'all') {
      delete (this.state.meta['deal_cate_id'])
      this.requestHomeList({ ...this.state.meta })
      return
    }
    this.setState({ meta: { ...this.state.meta, deal_cate_id: id } })
    this.requestHomeList({ ...this.state.meta, deal_cate_id: id })
  }

  onPullDownRefresh() { // 自带 下拉事件
    let data = this.state.meta
    data.page = 1
    this.setState({ meta: data })
    this.requestHomeList(this.state.meta)
    setTimeout(() => {
      Taro.stopPullDownRefresh();
    }, 1000);
  }

  onReachBottom() {
    this.setState({ page: this.state.page + 1 }, () => {
      this.requestHomeList({ ...this.state.meta })
    })
    let data = this.state.meta
    data.page = data.page + 1
    this.setState({ meta: data })
  }

  showLoading = () => {
    Taro.showLoading({
      title: 'loading',
      mask: true
    })
  }

  handleActivityClick = () => { };

  // 跳转 搜索商家列表页面
  handleSearch = () => Taro.navigateTo({ url: './search/index' });
  // 跳转 搜素城市页面
  showSelectCity = () => {

    Taro.navigateTo({ url: '/business-pages/select-city/index' });
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
        this.setState({ indexImg: res.data.pic })
        this.setState({ indexImgId: res.data.id })
        this.setState({ adLogId: res.data.adLogId })
        this.setState({ need_jump: res.data.need_jump })
      })
  }

  // 跳转到我的礼品
  routerGift = () => {
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
      let data: any = this.state.storeList
      this.state.telescopic ? data[index].height = 'auto' : data[index].height = '3.2rem'
      this.setState({ storeList: data })
    })
    e.stopPropagation();
  }

  // 获取中奖门店信息
  getPayStore = async () => {
    let id = sessionStorage.getItem('payStore')
    // let id = 717
    if (id) {
      let location = await getLocation();
      // let id = this.$router.params.id;
      if (id) {
        request({
          url: 'v3/stores/pay_store/' + id,
          data: { xpoint: location.longitude, ypoint: location.latitude }
        })
          .then((res: any) => {
            this.setState({
              hahaData: res.data.store_info,
            })
          })
      }
    }
  }

  // 控制显示哪个组件
  controlVersion = () => {
    // let dome: any = {
    //   [1]: <VersionOne list={this.state.hahaData.data.info} />,
    //   [2]: <VersionTwo list={this.state.hahaData.data.info} />,
    //   [3]: <VersionThree list={this.state.hahaData.data.info}
    //     data={this.state.hahaData.data.cashCouponList} />
    // }
    // return dome[this.state.hahaData.data.view_type]

  }



  render() {
    return (
      <View className="index">
        <View className="headr">
          <View className="search">
            <View className="flex center container">
              <View className="city" style="padding-right:15px; width: 20%" onClick={this.showSelectCity}>
                <View className='ellipsis-one flex' style='width:70%; display: inline-block'>
                  {this.state.cityName}
                </View>
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
              <View className="item search-input" onClick={this.handleSearch}>请输入商家名、品类</View>
            </View>
          </View>
          <View className="swiper" onClick={this.advertOnclick.bind(this)}>
            <Image
              src={
                this.state.indexImg ? this.state.indexImg : "http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/dHBc2GQi27cjhNpsYpAnQYxybxPdADHG.png"
              } className="image" />
          </View>
        </View>
        <View className="advert">
          <Image src={require('../../assets/group.png')} onClick={this.gotoGroup}></Image>
          <Image src={require('../../assets/appre.png')} onClick={this.gotoAppre}></Image>
        </View>
        <View className="no_receive" style={{ display: this.state.showGift == 1 ? '' : 'none' }}
        >你还有未领取的礼品 去<Text style="color:#FF6654" onClick={this.routerGift}>“我的礼品”</Text> 看看
        </View>

        {
          this.state.hahaData.name ? (
            <View className="receive_box">
              <View className="receive">已领取</View>
              <View className="focus_on">关注"< a href="https://mp.weixin.qq.com/s/uPCmihwL5HZrNDE-YmfW4A">公众号</ a>"
获取更多优惠信息</View>
            </View>
          ) : null
        }
        <VersionOne list={this.state.hahaData} />
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
          this.state.storeList.map((item2: any, index: any) => {
            return <View className="new_box">
              <View className="box" style={{ paddingBottom: item2.activity ? '' : '4px' }} onClick={this.handleClick.bind(this, item2.id)}>
                <View className="box_title">
                  <View className="title_l">
                    <Image src={item2.preview} />
                  </View>
                  <View className="title_r">
                    <View className="title_r_name">{item2.name}</View>
                    <View className="title_r_distance">
                      <span>{item2.deal_cate ? item2.deal_cate : null}</span>
                      <span>{item2.distance}</span>
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
                      !this.state.storeList[index].height ?
                        item2.activity_num > 2 ? '3.2rem' : 'auto' : this.state.storeList[index].height,
                    marginBottom: item2.activity_num >= 1 ? '-0.001rem' : '15px',
                    overflow: 'hidden',
                  }}
                >
                  <View
                    onClick={this.telescopicBox.bind(this, index)}
                    style={{ position: 'absolute', top: '0px', right: '0', display: item2.activity_num > 2 ? 'flex' : 'none', }}
                    className="_child"
                  >
                    <View style={{ marginRight: '8px' }}>
                      {
                        item2.activity_num ? item2.activity_num + '个活动' : null
                      }
                    </View>
                    <Image src={
                      this.state.storeList[index].height !== 'auto' ?
                        require('../../assets/jiao_bottom.png') : require('../../assets/jiao_top.png')}
                    />
                  </View>
                  <View
                    style={{
                      display: item2.activity ? item2.activity.group ? '' : 'none' : 'none',
                      justifyContent: 'space-between',
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
                  <View style={{ display: item2.activity ? item2.activity.cash_coupon ? '' : 'none' : 'none' }}
                    className="_child"
                  >
                    <Image src={
                      item2.activity ?
                        (item2.activity.cash_coupon ? item2.activity.cash_coupon.icon : null)
                        : null}
                    />
                    <View className="ellipsis-one"
                      style={{ width: '9rem', display: 'block' }}>
                      <span className="span_center">
                        {
                          item2.activity ? (item2.activity.cash_coupon ? item2.activity.cash_coupon.activity_info : null)
                            : null
                        }
                      </span>
                    </View>
                  </View>
                  <View style={{ display: item2.activity ? item2.activity.exchange_coupon ? '' : 'none' : 'none' }}
                    className="_child">
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
                  <View style={{ display: item2.activity ? item2.activity.zeng ? '' : 'none' : 'none' }}
                    className="_child" >
                    < Image src={
                      item2.activity ?
                        (item2.activity.zeng ? item2.activity.zeng.icon : null)
                        : null}
                    />
                    <View className=" ellipsis-one"
                      style={{ width: '9rem', display: 'block' }}>
                      <span>{
                        item2.activity ? (item2.activity.zeng ? item2.activity.zeng.activity_info : null)
                          : null}</span>
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

      // <View className="index">
      //   <View className="headr">
      //     <View className="search">
      //       <View className="flex center container">
      //         <View className="city" style="padding-right:15px; width: 20%" onClick={this.showSelectCity}>
      //           <View className='ellipsis-one flex' style='width:70%; display: inline-block'>
      //             {this.state.cityName}
      //           </View>
      //           <AtIcon
      //             onClick={this.showSelectCity}
      //             className="chevron-down"
      //             value="chevron-down"
      //             color="#313131"
      //             size="12"
      //           />
      //         </View>
      //         <View className="long-string" style="margin-right:15px;" />
      //         <AtIcon className="search-icon" value="search" color="#666666" size={14} />
      //         <View className="item search-input" onClick={this.handleSearch}>
      //           请输入商家名、品类
      // 				</View>
      //       </View>
      //     </View>
      //     <View className="swiper" onClick={this.advertOnclick.bind(this)}>
      //       <Image

      //         src={
      //           this.state.indexImg ? this.state.indexImg : "http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/dHBc2GQi27cjhNpsYpAnQYxybxPdADHG.png"
      //         } className="image" />
      //     </View>
      //   </View>
      //   <View className="advert">
      //     <Image src={require('../../assets/group.png')} onClick={this.gotoGroup}></Image>
      //     <Image src={require('../../assets/appre.png')} onClick={this.gotoAppre}></Image>
      //   </View>
      //   <View className="no_receive" style={{ display: this.state.showGift == 1 ? '' : 'none' }}
      //   >你还有未领取的礼品 去
      // 		<Text style="color:#FF6654" onClick={this.routerGift}>“我的礼品”</Text>	看看
      // 	</View>


      //   <View className="receive_box">
      //     <View className="receive">已领取</View>
      //     <View className="focus_on">关注"< a href="https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzU0NTI3OTE3OQ==#wechat_redirect">公众号</ a>"
      //     获取更多优惠信息</View>
      //   </View>

      //   {/*首页 金黄色组件 */}
      //   <VersionOne list={this.state.hahaData} />

      //   <View className="tab flex" style="background-color:#f6f6f6 ;white-space: nowrap; overflow-x:scroll;overflow-y: hidden; padding-left: 16px">
      //     {this.state.titleList.map((item: any, index) => (
      //       <View
      //         key={" "}
      //         className={
      //           "item flex center " +
      //           (this.state.current === index ? "active" : "")
      //         }
      //         onClick={this.handlerTablChange.bind(this, index, item.id)}
      //       >
      //         <View className="label" style="margin-right:30px;">{item.name}</View>
      //       </View>
      //     ))}
      //   </View>

      //   {
      //     this.state.storeList.map((item2: any, index: any) => {
      //       return <View className="new_box">
      //         <View className="box" style={{ paddingBottom: item2.activity ? '' : '4px' }} onClick={this.handleClick.bind(this, item2.id)}>
      //           <View className="box_title">
      //             <View className="title_l">
      //               <Image src={item2.preview} />
      //             </View>
      //             <View className="title_r">
      //               <View className="title_r_name">{item2.name}</View>
      //               <View className="title_r_distance">
      //                 <span>{item2.deal_cate ? item2.deal_cate : null}</span>
      //                 <span>{item2.distance}</span>
      //               </View>
      //               <div className="title_r_gift">
      //                 {
      //                   item2.label.map ? item2.label.map((item3: any, index3: number) => {
      //                     return < img src={this.labelColor(item3)} alt="" />
      //                   }) : null
      //                 }
      //               </div>
      //             </View>
      //           </View>


      //           <View
      //             className="box_bottom" id="box_bottom"
      //             style={{
      //               position: 'relative',
      //               height:
      //                 !this.state.storeList[index].height ?
      //                   item2.activity_num > 2 ? '3.2rem' : 'auto' : this.state.storeList[index].height,
      //               marginBottom: item2.activity_num >= 1 ? '-0.001rem' : '15px',
      //               overflow: 'hidden',
      //             }}
      //           >
      //             <View onClick={this.telescopicBox.bind(this, index)}
      //             className="_child"
      //               style={{
      //                 position: 'absolute', top: '0', right: '0',
      //                 display: item2.activity_num > 2 ? '' : 'none',
      //               }}
      //             >
      //               <View style={{ marginRight: '8px' }}>
      //                 {
      //                   item2.activity_num ? item2.activity_num + '个活动' : null
      //                 }
      //               </View>
      //               <Image style={{ marginRight: 0 }} src={
      //                 this.state.storeList[index].height !== 'auto' ?
      //                   require('../../assets/jiao_bottom.png') : require('../../assets/jiao_top.png')}
      //               />
      //             </View>

      //             <View
      //               style={{
      //                 display: item2.activity ? item2.activity.group ? '' : 'none' : 'none',
      //                 justifyContent: 'space-between',
      //                 borderBottom: item2.activity_num === 1 ? 'none' : '1px solid #eeeeee'
      //               }}
      //             >

      //               <View className="_child">
      //                 < Image src={
      //                   item2.activity ?
      //                     (item2.activity.group ? item2.activity.group.icon : null)
      //                     : null}
      //                 />

      //                 <View className=" ellipsis-one"
      //                   style={{ width: '9rem', display: 'block' }}
      //                 >
      //                   <span>
      //                     {
      //                       item2.activity ? (item2.activity.group ? item2.activity.group.activity_info : null)
      //                         : null
      //                     }
      //                   </span>
      //                   <span style={{ color: '#C71D0B' }}>
      //                     {
      //                       item2.activity ? (item2.activity.group ? item2.activity.group.gift_info : null)
      //                         : null
      //                     }
      //                   </span>
      //                 </View>
      //               </View>

      //             </View>
      //             <View className="_child"
      //               style={{
      //                 display: item2.activity ? item2.activity.cash_coupon ? '' : 'none' : 'none',

      //               }}
      //             >
      //               <Image src={
      //                 item2.activity ?
      //                   (item2.activity.cash_coupon ? item2.activity.cash_coupon.icon : null)
      //                   : null}
      //               />
      //               <View className=" ellipsis-one"
      //                 style={{ width: '9rem', display: 'block' }}>
      //                 <span>
      //                   {
      //                     item2.activity ? (item2.activity.cash_coupon ? item2.activity.cash_coupon.activity_info : null)
      //                       : null
      //                   }
      //                 </span>
      //               </View>
      //             </View>

      //             <View
      //             className="_child"
      //               style={{ display: item2.activity ? item2.activity.exchange_coupon ? '' : 'none' : 'none' }}
      //             >
      //               <Image src={
      //                 item2.activity ?
      //                   (item2.activity.exchange_coupon ? item2.activity.exchange_coupon.icon : null)
      //                   : null}
      //               />
      //               <View className=" ellipsis-one"
      //                 style={{ width: '9rem', display: 'block' }}>
      //                 <span>
      //                   {
      //                     item2.activity ? (item2.activity.exchange_coupon ? item2.activity.exchange_coupon.activity_info : null)
      //                       : null
      //                   }
      //                 </span>
      //               </View>
      //             </View>

      //             <View
      //               className="_child"
      //               style={{ display: item2.activity ? item2.activity.zeng ? '' : 'none' : 'none' }}
      //             >
      //               < Image src={
      //                 item2.activity ?
      //                   (item2.activity.zeng ? item2.activity.zeng.icon : null)
      //                   : null}
      //               />
      //               <View className=" ellipsis-one"
      //                 style={{ width: '9rem', display: 'block' }}>
      //                 <span>
      //                   {
      //                     item2.activity ? (item2.activity.zeng ? item2.activity.zeng.activity_info : null)
      //                       : null
      //                   }
      //                 </span>
      //                 <span style={{ color: '#C71D0B' }}>
      //                   {
      //                     item2.activity ? (item2.activity.zeng ? item2.activity.zeng.gift_info : null)
      //                       : null
      //                   }
      //                 </span>
      //               </View>
      //             </View>

      //           </View>
      //         </View>
      //       </View>
      //     })
      //   }
      // </View>
    );
  }
}
