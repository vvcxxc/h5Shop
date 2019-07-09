import Taro, { PureComponent, ComponentOptions } from "@tarojs/taro";
import { View, Image, Text, ScrollView, Button } from "@tarojs/components";

import "./index.styl";
import { inflate } from "zlib";

interface Props {
    /**默认当前高亮的索引值 */
    status:Boolean;
    orderid:Number;
  }

class GiftItemDetails extends PureComponent<Props> {
  constructor (props) {
    super(props)
  }
  state = {
    details: {type: 2, status: false},
    shippingList: [1,1,1,3,3,3],
    status: true
  };

  static options: ComponentOptions = {
    addGlobalClass: true
  };
  onCloseDetails () {
  }
  render() {
    let details
    if (this.state.details.type === 1) {
        details = <View className="content logistics">
        <View className="flex logistics-top blg">
            <Image className="gift-image" src="http://www.w3school.com.cn/i/eg_tulip.jpg" />
            <View className="bd fs24">
                <Text className="name cdb">礼品名称</Text>
                <Text className="delivery cdb">物流公司： 圆通速度</Text>
                <Text className="num cdb">运单编号：1234567897894</Text>
            </View>
        </View>
        <ScrollView scrollY className="shipping-info">
            {this.state.shippingList.map((_)=>(
                <View className="shipping-info-cell flex">
                <View className="time fs24 tac">
                    <Text className="cdb">4.20</Text>
                    <Text className="fs18 cdb">20:50</Text>
                </View>
                <View className="right-text">
                    <Text className="cdb fs26">已签收</Text>
                    <Text className="cdb">已签收【广州市】已签收，签收人为本人。已签收【广州市】已签收，签收人为本人。已签收【广州市】已签收，签收人为本人。</Text>
                </View>
            </View>    
            ))}
        </ScrollView>    
        <View className="fs24 tac more">上滑查看更多</View>
      </View>
    }
    else if(this.state.details.type === 2) {
        details = <View className="claim-goods content">
                    <View className={this.state.details.status ? 'blg useless' : 'blg'}>
                        <View className="fs48">取货码</View>
                        <View className="imge-view">
                            <Image className="image" src="http://www.w3school.com.cn/i/eg_tulip.jpg" />
                        </View>
                        <View className="count fs48"><Text>21342354235643</Text></View>
                        <View className="fs26">*取件时向商家展示取件码即可</View>
                    </View>
                    <View className="pd35">
                        <View className="flex">
                            <Image className="gift-image" src="http://www.w3school.com.cn/i/eg_tulip.jpg" />
                            <View className="flex column">
                                <Text className="cdb">礼品名称</Text>
                                <Text className="label-cell cdb">有效期至：<Text className="val">2019.4.30</Text></Text>
                            </View>
                        </View>
                        <View className="pd33">
                            <Text className="label-cell cdb">有效期至：<Text className="val">2019.4.30</Text></Text>
                        </View>
                        <View className="pd33">
                            <Text className="label-cell cdb">取件地址：<Text className="val">北京市东城区长安街00001号门头沟拐弯三岔
            路头子口</Text></Text>
                        </View>
                        <View className="pd33">
                            <Text className="label-cell cdb">联系电话：<Text className="val">53423523523</Text></Text>
                        </View>
                    </View>
                </View>
    }
     else {
        details = <View className="past-due content ">
                    <View className="claim-goods">
                    <View className="flex">
                        <Image className="gift-image" src="http://www.w3school.com.cn/i/eg_tulip.jpg" />
                        <View className="flex column">
                            <Text className="cdb name">礼品名称</Text>
                            <Text className="label-cell cdb">有效期至：<Text className="val">2019.4.30</Text></Text>
                        </View>
                    </View>
                    </View>
                    <View >
                        <Button className="btn-order">查看我的订单</Button>
                    </View>
            </View>
     }

    return (
      <View className="gift-item-details flex">
          {details}
          <Image className="close-img" src="" onClick={this.onCloseDetails.bind(this)}
            />
      </View>
    );
  }
}
export default GiftItemDetails;
