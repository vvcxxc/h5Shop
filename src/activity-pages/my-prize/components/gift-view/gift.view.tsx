import Taro, { Component } from "@tarojs/taro"
import { Block, View, Image } from "@tarojs/components"
import "./style.styl"
import QRCode from 'qrcode';
export default class GiftView extends Component<{ data: any; onAction: any }> {
  static defaultProps = {
    data: {},
    onAction: null
  }
  state = {
    codeImg: '',
  }

  componentDidMount() {
    Taro.showLoading({
      title: ""
    });
    const { data } = this.props
    let tempData: any = {};
    tempData.exceed_at = data.exceed_at;
    tempData.id = data.id;
    tempData.prize_id = data.prize_id;
    tempData.prize_name = data.prize_name;
    tempData.sign = data.sign;
    tempData.status = data.status;
    tempData.user_name = data.user_name;
    let codeData = JSON.stringify(tempData);
    console.log(codeData);
    QRCode.toDataURL(codeData)
      .then((url: any) => {
        Taro.hideLoading();
        this.setState({ codeImg: url })
      })
      .catch((err: any) => {
        Taro.hideLoading();
        Taro.showToast({ title: '获取二维码失败', icon: 'none' })
      })
  }

  /**
   * 点击事件
   */
  handleClick = (e) => {
    const { action } = e.currentTarget.dataset
    const { onAction } = this.props
    onAction(action)
  }
  render() {
    return (
      <Block>
        <View className="gift-view">
          <View className="gift-wrapper">
            <View className="prize_qrcode_box">
              <Image className="prize_qrcode" src={this.state.codeImg} />
            </View>
            <View className="close" data-action="close" onClick={this.handleClick}>
              <Image className="icon" src={require("../../../../static/images/ic_close.png")} />
            </View>
          </View>
        </View>
      </Block>
    )
  }
}
