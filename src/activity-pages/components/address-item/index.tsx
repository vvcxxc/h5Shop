import Taro, { Component } from "@tarojs/taro"
import { View, Image } from "@tarojs/components"
import "./index.scss"
interface TabProp {
    itemId: string | number;
    userName: string;
    userPhone: string | number;
    defaultAddress?: Boolean;
    userAddress: string;
    onEditor?: (any) => any;
}

export default class AddressItem extends Component<TabProp> {
    state: {

    }

    onhandleClick = () => {
        //返回要更改的地址的id
        this.props.onEditor && this.props.onEditor(this.props.itemId)
    }

    render() {
        return (
            <View className="address-box">
                <View className="address-msgBox">
                    <View className="address-msgBox_userBox">
                        <View className="address-msgBox_box1">
                            <View className="address-msgBox_userBox_name">{this.props.userName} </View>
                            <View className="address-msgBox_userBox_phone">{this.props.userPhone}</View>
                        </View>
                        {
                            this.props.defaultAddress ? <View className="address-msgBox_userBox_choose">默认 </View> : null
                        }
                    </View>
                    <View className="address-msgBox_address"> {this.props.userAddress}</View>
                </View>
                <View className="address-changeIcon_img_box" onClick={this.onhandleClick}>
                    <Image className="address-changeIcon_img" src="http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/nYFTGYptxHKZwWDCiJHRy5BniRkkDQJQ.png" />
                </View>

            </View>
        )
    }
}
