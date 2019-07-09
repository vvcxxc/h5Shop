import Taro, { Component } from "@tarojs/taro";
import { View, Icon, Text, Image, Button } from "@tarojs/components";
import { AtIcon } from "taro-ui";
import "./index.styl";
import CashCoupon from '../../components/cash-coupon'
import TicketImg from '../../assets/pay-success/ticket.png'
import LuckyImg from '../../assets/pay-success/lucky.png'


export default class PaySuccess extends Component {
  config = {
    navigationBarTitleText: "支付结果"
  };

  state = {
    notice: ['恭喜XXX获取到300万无门槛红包', '恭喜XXX获取到1002万无门槛红包', '恭喜XXX获取到1032万无门槛红包'],
    draw: 1, // 当前转圈选中的值
    drwaIndex: 0, // 圈数
    drawActive: Math.floor(Math.random() * 8), // 抽中的选项
    drawStatus: false,
    drawShow: false,
  };

  componentWillMount() {
  }
  componentDidMount() {
    setInterval(() => this.noticeAminRemove(), 50);
  }
  onDraw () { // 抽奖
      if (this.state.drawStatus) return false
      this.setState({drawStatus: true})
      this.drawRandom()
  }
  drawRandom () {
        if (this.state.drwaIndex > 2 && this.state.draw == this.state.drawActive) {
        this.setState({draw: this.state.drawActive, drawShow: true})
        return false
      } else {
        this.setState({draw: this.state.draw == 8 ? 1 : this.state.draw+1}, () => {
            if (this.state.draw == 8) {
                this.setState({drwaIndex: this.state.drwaIndex + 1})
            }
        })
        setTimeout(()=> {
            this.drawRandom()
        },300)
      }
  }
  noticeAmin () {
    
  }
  noticeAminRemove () {
    let n = this.refs['notice']['vnode']['dom'];
    let l = this.refs['noticeLeft']['vnode']['dom'];
    let r = this.refs['noticeReft']['vnode']['dom'];
    if(n.scrollLeft >= l.offsetWidth){
        n.scrollLeft = 0;
    }else{
        n.scrollLeft++;
    }
  }

  render() {
    return (
        <View className="pay-success">
            <View className="success flex center">
                <Icon size='30' type='success' className="cFF6654"/>
                <Text>支付成功</Text>
            </View>
            <View className="cell-ent flex">
                <View className="cell-hd flex"><View className="icon flex center">券</View>华润万家50元现金券</View>       
                <View className="cell-ft cff6654">订单详情<AtIcon value="chevron-right" color="#999" size="16px"/></View>       
            </View>    
            <View className="welfare ">
                <View className="notice-body">
                    <View className="notice flex" ref="notice">
                        <View className="notice-view flex" ref="noticeLeft">
                            {
                                this.state.notice.map((_) => (<View className="text">{_}</View>))
                            }
                        </View>
                        <View className="notice-view flex" ref="noticeReft">
                            {
                                this.state.notice.map((_) => (<View className="text">{_}</View>))
                            }
                        </View>
                    </View>  
                </View>    
                <View className="turntable flex">
                    <View className={`prize flex center column ${this.state.draw == 1 ? 'active' : ''}`}>
                        <Image className="image prz3" src={TicketImg} /> 
                        <View className="prz3">￥100券</View>
                        <View className="keep-out"></View>   
                    </View>  
                    <View className={`prize flex center column ${this.state.draw == 2 ? 'active' : ''}`}>
                        <Image className="image prz3" src={LuckyImg} /> 
                        <View className="prz3">￥100券</View>
                        <View className="keep-out"></View>   
                    </View>  
                    <View className={`prize flex center column ${this.state.draw == 3 ? 'active' : ''}`}>
                        <Image className="image prz3" src={TicketImg} /> 
                        <View className="prz3">￥100券</View>
                        <View className="keep-out"></View>   
                    </View>  
                    <View className={`prize flex center column ${this.state.draw == 8 ? 'active' : ''}`}>
                        <Image className="image prz3" src={LuckyImg} /> 
                        <View className="prz3">￥100券</View>
                        <View className="keep-out"></View>   
                    </View>  
                    <View className="prize flex center column draw" onClick={this.onDraw.bind(this)}>
                        <View className="prz3">立即抽奖</View>
                    </View>  
                    <View className={`prize flex center column ${this.state.draw == 4 ? 'active' : ''}`}>
                        <Image className="image prz3" src={LuckyImg} /> 
                        <View className="prz3">￥100券</View>
                        <View className="keep-out"></View>   
                    </View>  
                    <View className={`prize flex center column ${this.state.draw == 7 ? 'active' : ''}`}>
                        <Image className="image prz3" src={TicketImg} /> 
                        <View className="prz3">￥100券</View>
                        <View className="keep-out"></View>   
                    </View>  
                    <View className={`prize flex center column ${this.state.draw == 6 ? 'active' : ''}`}>
                        <Image className="image prz3" src={LuckyImg} /> 
                        <View className="prz3">￥100券</View>
                        <View className="keep-out"></View>   
                    </View>  
                    <View className={`prize flex center column ${this.state.draw == 5 ? 'active' : ''}`}>
                        <Image className="image prz3" src={TicketImg} /> 
                        <View className="prz3">￥100券</View>
                        <View className="keep-out"></View>   
                    </View>  
                </View>
                <View className="rule">
                    <View className="rule-tit">抽奖规则</View>
                    <View className="rule-detail">
                        1.活动参与方式：每个用户扫码支付结束可获得1次抽奖机会；<br/>
                        2. 中奖后奖品将直接放入账户内，具体可在[个人中心]-[我的卡券]内查看，卡券可能有延迟，请耐心等待。 <br/>
                        3.中奖规则及中奖资格的排除：<br/>
                        (1)中奖用户名单由系统随机抽取，中奖结果将在活动页面实时公布。<br/>
                        (2)凡以不正当手段（包括但不限于机器刷奖、作弊、扰乱系统、实施网络攻击等）参与本次活动的用户，本公司有权终止其参与活动，取消其获奖资格(如奖励已发放，本公司有权收回)。
                    </View>
                </View>
            </View>
            {
                this.state.drawShow ? (<View className="smoking-prize flex center">
                        <View className="smoking-prize-content tac">
                            <View className="fs40">恭喜您抽中<Text className="name">洛西路店</Text> 到店红包</View>
                            <CashCoupon />
                            <View className="fs30">领取后可在“订单”中查看</View>
                            <Button className="btn-get" onClick={ () => {
                                Taro.navigateTo({ url: "/business-pages/gift/index" })
                            }}>立即领取</Button>
                        </View>
                    </View>):("")
            }
            
        </View>
    );
  }
}
