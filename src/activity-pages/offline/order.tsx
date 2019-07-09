import Taro, { Component } from "@tarojs/taro"
import { Block, View, ScrollView,Text } from "@tarojs/components"
import "./style.order.styl"
import { getOfflineOrder, getQrcode ,getOrderQrcode} from "@/api"
import Qrcode from "@/components/qrcode/qrcode"
import {
  // STATUS_ALL,
  STATUS_AREADY,
  STATUS_AWAIT,
  STATUS_OVER_DUE,
  TYPE_APPRECIATION,
  ACTION_JUMP,
  ACTION_USE,
  ACTION_CLOSE
} from "@/utils/constants"
interface State {
  list: any[];
  isQrcode: boolean;
  base64: string;
}
export default class Order extends Component {
  config = {
    navigationBarTitleText: "我的订单"
  }
  state: State = {
    list: [],
    isQrcode: false,
    base64: "",
		qrcode:'123',
		display:'none'
  }
  componentDidMount() {
    this.fetchOrder()
  }

  /**
   * 获取二维码(, 使用)
   */
  async fetchQrcode(id: string) {
    const { data } = await getQrcode({ youhui_log_id: id })
    this.setState({
      isQrcode: true,
      base64: data,
			isQrcode: false
    })
  }

  /**
   * 获取订单
   */
	
  fetchOrder = async () => {
    const { data } = await getOfflineOrder()
    console.log(data)
		if(data.length == 0){
			return
		}else{
			console.log(data[0].create_time)
			for(var i=0;i < data.length; i++){
				var time = new Date(data[i].create_time * 1000)
				var year = time.getFullYear();
				var month = time.getMonth()+1;
				var day = time.getDate();
				var hours = time.getHours();
				var minute = time.getMinutes();
				var seconds = time.getSeconds();
				var createtime = year + '年' + month + '月' + day + '日' + hours + '时' + minute + '分' + seconds + '秒';
				
				data[i].create_time = createtime
			}
		}
		
    this.setState({
      list: data
    })
  }
	
	/*
	* 点击立即使用，获取二维码
	* */ 
	async fetchOrderQrcode(id: string) {
	  const {data} = await getOrderQrcode(id)
		// console.log(data.code)
		this.setState({
		  qrcode: data.code,
			 isQrcode: true,
		})
		 this.setState(prevState => ({
		  isToggleOn: !prevState.isToggleOn,
		  display: prevState.isToggleOn ? 'none': 'block'
		}));
	}


handleAction(action: string, data: any) {
    switch(action) {
      // case ACTION_JUMP: {
      //   const { type, id } = data
      //   let _url = ""
      //   if (type === TYPE_APPRECIATION) {
      //     _url = "/pages/activity/pages/appreciation/appreciation"
      //   }
      //   Taro.navigateTo({
      //     url: `${_url}?id=${id}`
      //   })
      //   break
      // }
      case ACTION_CLOSE:
        this.setState({
          isQrcode: false
        })
        break
      case ACTION_USE: {
        const { id } = data
        this.fetchQrcode(id)
        break
      }
      default:
        console.log("no~action")
    }
  }

	handleClick(e: any) {
	  const { action } = e.currentTarget.dataset
	  this.handleAction(action, null)
	}
	
  render() {
    const { list,isQrcode } = this.state
    return (
      <Block>
        <View className="order">
        <ScrollView scrollY className="container-wrapper">
            <View className="container">
            {
              list.map((item, index) => {
                return (
                  <View className="weui-cell__hd">
                   
										<View className='nameandmoney'>
											<Text className="storename">店铺名: {item.store_name}</Text>
											<Text className="money">金额: {item.amount}</Text>
										</View>
										 <Text className="ordernum">订单号: {item.order_sn}</Text> 
                    <Text className="ordertime">创建时间: {item.create_time}</Text>
										{
											item.is_delivery == 1 ? <View className="list_btn">已核销</View>
											: <View className="list_btn" onClick={this.fetchOrderQrcode.bind(this,item.id)}>核销</View>
										}
										
                  </View>
                )
              })
            }
            </View>
						
						 
						{isQrcode && <Qrcode data={this.state.qrcode} onAction={this.handleClick} style={{display:this.state.display}}/>}
						
          </ScrollView>
        </View>
      </Block>
    )
  }
}
