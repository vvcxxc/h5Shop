import Taro, { Component, Config } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { AtTabs, AtTabsPane, AtIcon } from 'taro-ui'
import "taro-ui/dist/style/components/tabs.scss";
import CashCoupon1 from "./cash-coupon1/index";
import CashCoupon2 from "./cash-coupon2/index";

import "./index.styl";
import request from "../../services/request";
import img1 from "./1.png";
import img2 from "./2.png";
import img3 from "./3.png";
import img4 from "./4.png";


export default class Order extends Component {
  config: Config = {
    navigationBarTitleText: "我的订单"
  };
  constructor(props) {
    super(props);
    Object.assign(this.state, this.props)
    this.showcode = this.showcode.bind(this)
  }
  state = {
    _codeinfo: "",
    _codeimg: "",
    _codeshow: false,
    current: 0,//taro组件用的
    coupon: [],//taro组件用的
    coupon1: [
      {
        coupons_log_id: "",
        coupons_id: "",
        expiration: "",
        coupons_name: "",
        money: "",
        suppliername: "",
        image: "",
        coupons_type: "",
        confirm_time: "",
        total_fee: "",
      }
    ],//4个tab的数据分开算
    coupon2: [{
      coupons_log_id: "",
      coupons_id: "",
      expiration: "",
      coupons_name: "",
      money: "",
      suppliername: "",
      image: "",
      coupons_type: "",
      confirm_time: "",
      total_fee: ""
    }],
    coupon3: [{
      coupons_log_id: "",
      coupons_id: "",
      expiration: "",
      coupons_name: "",
      money: "",
      suppliername: "",
      image: "",
      coupons_type: "",
      confirm_time: "",
      total_fee: ""
    }],
    coupon4: [{
      coupons_log_id: "",
      coupons_id: "",
      expiration: "",
      coupons_name: "",
      money: "",
      suppliername: "",
      image: "",
      coupons_type: "",
      confirm_time: "",
      total_fee: ""
    }],
    page1: 1,
    page2: 1,
    page3: 1,
    page4: 1,
    loading: false
  };

  componentWillMount() {
    this.getData();
  }

  // 触底事件
  onReachBottom = () => {
    Taro.showLoading({
      title: 'loading',
      mask: true
    })
    // console.log(this.state.current);
    this.state.current == 1 ? this.getData1() : (
      this.state.current == 2 ? this.getData2() : (
        this.state.current == 3 ? this.getData3() : (
          this.state.current == 4 ? this.getData2() : "")))
    Taro.hideLoading()
  }
  //页面加载统一获取一次
  getData() {
    request({
      url: "v3/user/coupons",
      data: {
        coupons_status: 1,
        page: this.state.page1
      }
    })
      .then((res: any) => {
        this.setState({ coupon: res, coupon1: res, loading: false })
      })
      .catch(() => this.setState({ loading: false }));
    request({
      url: "v3/user/coupons",
      data: {
        coupons_status: 2,
        page: this.state.page2
      }
    })
      .then((res: any) => {
        this.setState({ coupon2: res, loading: false })
      })
      .catch(() => this.setState({ loading: false }));
    request({
      url: "v3/user/coupons",
      data: {
        coupons_status: 3,
        page: this.state.page3
      }
    })
      .then((res: any) => {
        this.setState({ coupon3: res, loading: false })
      })
      .catch(() => this.setState({ loading: false }));
    request({
      url: "v3/user/coupons",
      data: {
        coupons_status: 4,
        page: this.state.page4
      }
    })
      .then((res: any) => {
        this.setState({ coupon4: res, loading: false })
      })
      .catch(() => this.setState({ loading: false }));


  }

  getData1() {
    this.setState({ loading: true, page1: this.state.page1 + 1 });
    request({
      url: "v3/user/coupons",
      data: {
        coupons_status: 1,
        page: this.state.page1
      }
    })
      .then((res: any) => {
        let temp = this.state.coupon1.concat(res);

        this.setState({ coupon: temp, coupon1: temp, loading: false })
      })
      .catch(() => this.setState({ loading: false }));
  }

  getData2() {
    this.setState({ loading: true, page2: this.state.page2 + 1 });
    request({
      url: "v3/user/coupons",
      data: {
        coupons_status: 2,
        page: this.state.page2
      }
    })
      .then((res: any) => {
        let temp = this.state.coupon2.concat(res);
        this.setState({ coupon: temp, coupon2: temp, loading: false })
      })
      .catch(() => this.setState({ loading: false }));
  }
  getData3() {
    this.setState({ loading: true, page3: this.state.page3 + 1 });
    request({
      url: "v3/user/coupons",
      data: {
        coupons_status: 3,
        page: this.state.page3
      }
    })
      .then((res: any) => {
        let temp = this.state.coupon3.concat(res);
        this.setState({ coupon: temp, coupon3: temp, loading: false })
      })
      .catch(() => this.setState({ loading: false }));
  }
  getData4() {
    this.setState({ loading: true, page4: this.state.page4 + 1 });
    request({
      url: "v3/user/coupons",
      data: {
        coupons_status: 4,
        page: this.state.page4
      }
    })
      .then((res: any) => {
        let temp = this.state.coupon4.concat(res);
        this.setState({ coupon: temp, coupon4: temp, loading: false })
      })
      .catch(() => this.setState({ loading: false }));
  }
  handleClick0(value) {
    this.setState({
      current: value
    })
    console.log(this.state.coupon.length)
  }

  showcode(_id) {
    // console.log("爸爸" + _id);
    Taro.showLoading({
      title: 'loading',
      mask: true
    })
    request({
      url: "v3/user/coupons/info",
      data: { coupons_log_id: _id, xpoint: '', ypoint: '' }
    })
      .then((res: any) => {
        // console.log(res.youhui_sn);
        this.setState({ _codeinfo: res.youhui_sn });
      })
    request({
      url: 'api/wap/coupon/showCode',
      data: { coupons_log_id: _id },
    })
      .then((res: any) => {
        // console.log(res);
        this.setState({ _codeimg: res });
      })
    this.setState({ _codeshow: true });
    Taro.hideLoading();
  }

  render() {
    const tabList = [{ title: '未使用' }, { title: '已使用' }, { title: '已过期' }, { title: '已退款' }]
    return (
      <View className="order flex column"  >

        {this.state._codeshow ?
          <View className="code_show" onClick={() => { this.setState({ _codeshow: false }) }}>
            <View className="code_background"> </View>
            <View className="codeBox" >
              <View className="codeBox_info">商家扫码/输码验证即可消费</View>
              <View className="codeBox_img">
                <Image className="code_img" src={this.state._codeimg} />
              </View>
              <View className="codeBox_msg">{this.state._codeinfo}</View>
            </View>
          </View>
          : ""
        }

        <View>
          {
            (this.state.current == 0 && this.state.coupon1.length == 0) ?
              <View className="msgBox">
                <View className="imgBox">
                  <Image className="logo" src={img1} />
                </View>
                <View className="_msg">没有可使用的订单，快去逛逛吧！</View>
                <View className="toHome"
                  onClick={() => {
                    Taro.switchTab({
                      url: '../../pages/index/index'
                    })
                  }}>去首页</View>
              </View> : ((this.state.current == 1 && this.state.coupon2.length == 0) ? <View className="msgBox">
                <View className="imgBox">
                  <Image className="logo" src={img2} />
                </View>
                <View className="_msg">您还没有使用过的订单哦</View>
              </View> : ((this.state.current == 2 && this.state.coupon3.length == 0) ?
                <View className="msgBox">
                  <View className="imgBox">
                    <Image className="logo" src={img3} />
                  </View>
                  <View className="_msg">您还没有已过期的订单哦</View>
                </View> : ((this.state.current == 3 && this.state.coupon4.length == 0) ? <View className="msgBox">
                  <View className="imgBox">
                    <Image className="logo" src={img4} />
                  </View>
                  <View className="_msg">您还没有已退款的订单哦</View>
                </View> : "")
                ))
          }
        </View>

        <AtTabs current={this.state.current} tabList={tabList} onClick={this.handleClick0.bind(this)} >
          <AtTabsPane current={this.state.current} index={0} >
            <View className="tiket_box">
              {
                this.state.coupon1.map((item) => (
                  item.coupons_type.toString() == "1" ? <View key={item.coupons_log_id}>
                    <CashCoupon2 bg_img_type={1} type={0} _id={item.coupons_log_id} return_money={item.money} _total_fee={item.total_fee} youhui_type={item.coupons_type} timer={item.confirm_time} sname={item.coupons_name} list_brief={item.suppliername} expiration={item.expiration}/>
                  </View> : ""
                ))
              }
              {
                this.state.coupon1.map((item) => (
                  item.coupons_type.toString() == "0" ? <View key={item.coupons_log_id}>
                    <CashCoupon1 bg_img_type={0} type={1} _id={item.coupons_log_id} return_money={item.money} youhui_type={item.coupons_type} timer={item.confirm_time} sname={item.coupons_name} list_brief={item.suppliername} _image={item.image} clickcode={this.showcode}  expiration={item.expiration}/>
                  </View> : ""
                ))
              }
            </View>
          </AtTabsPane>
          <AtTabsPane current={this.state.current} index={1}>
            <View className="tiket_box">
              {
                this.state.coupon2.map((item) => (
                  item.coupons_type.toString() == "1" ? <View key={item.coupons_log_id}>
                    <CashCoupon2 bg_img_type={2} type={0} _id={item.coupons_log_id} return_money={item.money} _total_fee={item.total_fee} youhui_type={item.coupons_type} timer={item.confirm_time} sname={item.coupons_name} list_brief={item.suppliername}  expiration={item.expiration}/>
                  </View> : ""
                ))
              }
              {
                this.state.coupon2.map((item) => (
                  item.coupons_type.toString() == "0" ? <View key={item.coupons_log_id}>
                    <CashCoupon1 bg_img_type={1} type={0} _id={item.coupons_log_id} return_money={item.money} youhui_type={item.coupons_type} timer={item.confirm_time} sname={item.coupons_name} list_brief={item.suppliername} _image={item.image} clickcode={null}  expiration={item.expiration}/>
                  </View> : ""
                ))
              }
            </View>
          </AtTabsPane>
          <AtTabsPane current={this.state.current} index={2}>
            <View className="tiket_box">
              {
                this.state.coupon3.map((item) => (
                  item.coupons_type.toString() == "1" ? <View key={item.coupons_log_id}>
                    <CashCoupon2 bg_img_type={0} type={0} _id={item.coupons_log_id} return_money={item.money} _total_fee={item.total_fee} youhui_type={item.coupons_type} timer={item.confirm_time} sname={item.coupons_name} list_brief={item.suppliername}  expiration={item.expiration}/>
                  </View> : ""
                ))
              }
              {
                this.state.coupon3.map((item) => (
                  item.coupons_type.toString() == "0" ? <View key={item.coupons_log_id}>
                    <CashCoupon1 bg_img_type={0} type={0} _id={item.coupons_log_id} return_money={item.money} youhui_type={item.coupons_type} timer={item.confirm_time} sname={item.coupons_name} list_brief={item.suppliername} _image={item.image} clickcode={null}  expiration={item.expiration}/>
                  </View> : ""
                ))
              }
            </View>
          </AtTabsPane>
          <AtTabsPane current={this.state.current} index={3}>
            <View className="tiket_box">
              {
                this.state.coupon4.map((item) => (
                  item.coupons_type.toString() == "1" ? <View key={item.coupons_log_id}>
                    <CashCoupon2 bg_img_type={1} type={1} _id={item.coupons_log_id} return_money={item.money} _total_fee={item.total_fee} youhui_type={item.coupons_type} timer={item.confirm_time} sname={item.coupons_name} list_brief={item.suppliername}  expiration={item.expiration}/>
                  </View> : ""
                ))
              }
              {
                this.state.coupon4.map((item) => (
                  item.coupons_type.toString() == "0" ? <View key={item.coupons_log_id}>
                    <CashCoupon1 bg_img_type={0} type={2} _id={item.coupons_log_id} return_money={item.money} youhui_type={item.coupons_type} timer={item.confirm_time} sname={item.coupons_name} list_brief={item.suppliername} _image={item.image} clickcode={null}  expiration={item.expiration}/>
                  </View> : ""
                ))
              }
            </View>
          </AtTabsPane>
        </AtTabs>
      </View>
    );
  }
}
