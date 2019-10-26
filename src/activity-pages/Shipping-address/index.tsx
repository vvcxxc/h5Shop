import Taro, { Component } from "@tarojs/taro";
import { AtIcon, AtToast } from "taro-ui"
import { View, Text, Image, ScrollView, Button, Input, Textarea } from "@tarojs/components";
import "./index.scss";
import "taro-ui/dist/style/components/toast.scss";
import AddressItem from '../components/address-item/index'
import request from '../../services/request'

interface Props {
  store_id: any;
}

export default class ShippingAddress extends Component<Props> {
  config = {
    navigationBarTitleText: "我的收货地址"
  };

  state = {
    myAddressList: [
      // {
      //   id: 1,
      //   name: "",
      //   mobile: "",
      //   province_id: 2,
      //   province: "",
      //   city_id: 2,
      //   city: "",
      //   district_id: 2,
      //   district: "",
      //   detail: "",
      //   is_default: 0,
      //   address: ""
      // }
    ],

  };

  componentDidMount() {
    Taro.showLoading({
      title: ""
    });
    request({
      url: 'v3/address',
      method: "GET",
    })
      .then((res: any) => {
        Taro.hideLoading();
        this.setState({ myAddressList: res.data })
      })
  }

  componentDidShow() {
    Taro.showLoading({
      title: ""
    });
    request({
      url: 'v3/address',
      method: "GET",
    })
      .then((res: any) => {
        Taro.hideLoading();
        this.setState({ myAddressList: res.data })
      })
  }


  editorAddress = (query: any) => {
    Taro.navigateTo({
      url: '/activity-pages/Shipping-address/editor?type=editorItem&editorId=' + query
    })
  }

  goToEditor = () => {
    Taro.navigateTo({
      url: '/activity-pages/Shipping-address/editor?type=addItem'
    })
  }

  render() {
    return (

      <View className="Shipping-address">
        {
          this.state.myAddressList.length == 0 ? <View className="Shipping-noAddress_box">
            <Image className="noAddress_img" src="http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/ZAtsKCjGrhhsrf7C7Z4dMhwpFJDY2t3f.png" />
          </View> : null
        }

        <View className="address-box_content">
          {
            this.state.myAddressList && this.state.myAddressList.length > 0 ? this.state.myAddressList.map((item: any, index: any) => {
              return (
                <View key={item.id}>
                  <AddressItem
                    itemId={item.id}
                    userName={item.name}
                    userPhone={item.mobile}
                    defaultAddress={item.is_default ? true : false}
                    userAddress={item.address}
                    onEditor={this.editorAddress}
                  />
                </View>
              )
            }) : null
          }
          {/* <View className="address-box">
            <View className="address-msgBox">
              <View className="address-msgBox_userBox">
                <View className="address-msgBox_box1">
                  <View className="address-msgBox_userBox_name">杨大富 </View>
                  <View className="address-msgBox_userBox_phone">13546987455</View>
                </View>
                <View className="address-msgBox_userBox_choose">默认 </View>
              </View>
              <View className="address-msgBox_address">555IG还干哈UI大股东dsfsdgf但是感觉都是佛广东省佛贵司为啥sdfgi的花费更多s对符合规定dfihi快速丢失啥快递不上课</View>
            </View>
            <Image className="address-changeIcon_img" src="http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/nYFTGYptxHKZwWDCiJHRy5BniRkkDQJQ.png" />
          </View> */}
        </View>
        <View className="bottom_btn_box">
          <View className="bottom_btn_submit" onClick={this.goToEditor.bind(this)} >添加新地址</View>
        </View>
      </View>
    );
  }
}
