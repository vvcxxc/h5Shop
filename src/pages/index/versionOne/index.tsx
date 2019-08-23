import Taro, { Component } from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import { AtIcon } from 'taro-ui';
import './index.styl'
interface Props {
  list?: any;
  // onClick: (id: any) => any;
}
export default class VersionOne extends Component<Props> {

  state = {
    listData: [],
    hahaData: {},
    telescopic: ''
  }
  componentWillMount() {
  }
  componentDidMount() {
  }

  handleClick = (id: any) => {
    Taro.navigateTo({
      url: '/pages/business/index?id=' + id
    })
  }

  judgeData = (value1) => {
    return typeof (value1) === 'string' ? (value1.length > 1 ? '' : 'none') : 'none'
  }

  controlPicture = (gift, coupon, preview?) => { // 控制图片显示
    if (!coupon && !gift) return false //两个图片都没有 显示门头照preview
    if (!gift) return 1 //礼品图不存在 只显示一张coupon
    return 2 //两张都显示
  }

  // 点击展开或者收回
  telescopicBox = (index: number, e) => {
    this.setState({ telescopic: !this.state.telescopic }, () => {
      let data: any = this.props.list
      this.state.telescopic ? data.height = 'auto' : data.height = '3.2rem'
      this.setState({ storeList: data })
    })
    e.stopPropagation();
  }

  labelColor = (color: any) => {
    let data: any = {
      ['拼团送礼']: 'http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/e78pJkim5TSZdQzBcPHSbz5aDPtM32nC.png',
      ['增值送礼']: 'http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/7KyKnTjB7rSMktxap7Q3hFQaAyc3nG5j.png',
      ['认证商户']: 'http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/HF5kJnteArYMzH5dQxFAydwd8MsBriEY.png'
    }
    return data[color]
  }

  render() {
    let that = this.props.list

    return (
      <View className="new_box" style={{ display: that.name ? '' : 'none' }}>
        <View className="box_two" style={{ paddingBottom: that.activity ? '' : '4px' }} onClick={this.handleClick.bind(this, that.id)}>
          <View className="box_title">
            <View className="title_l">
              <Image src={that.preview} />
            </View>
            <View className="title_r_two">
              <View>{that.name}</View>
              <View>
                <span>
                  {
                    that.deal_cate ? that.deal_cate : null
                  }
                </span>
                <span>{that.distance}</span>
              </View>
              <div className="title_r_gift">
                {
                   that.label ?  that.label.map((item3: any, index3: number) => {
                    return < img src={this.labelColor(item3)} alt="" />
                  }) : null
                }
              </div>
            </View>
          </View>


          <View
            className="box_bottom_two" id="box_bottom"
            style={{
              position: 'relative',
              height:
                !that.height ?
                  that.activity_num > 2 ? '3.2rem' : 'auto' : that.height,
              marginBottom: that.activity_num >= 1 ? '-0.001rem' : '15px',
              overflow: 'hidden',
            }}
          >
            <View onClick={this.telescopicBox.bind(this, '1')}
             className="_child_two"
              style={{
                position: 'absolute', top: '0', right: '0',
                display: that.activity_num > 2 ? '' : 'none',
              }}
            >
              <View style={{ marginRight: '8px' }}>
                <span style={{ color: '#7C4310' }}>
                  {
                    that.activity_num ? that.activity_num + '个活动' : null
                  }
                </span>
              </View>
              <Image src={
                     that.height !== 'auto' ?
                     require('../../../assets/san_bottom.png') : require('../../../assets/san_top.png')}
                    />
              {/* <img src={
                that.height !== 'auto' ?
                  require('../../../assets/san_bottom.png')
                  :
                  require('../../../assets/san_top.png')} alt="" /> */}
            </View>

            <View
              style={{
                display: that.activity ? that.activity.group ? '' : 'none' : 'none',
                justifyContent: 'space-between',
                borderBottom: that.activity_num === 1 ? 'none' : '0.5px solid #f0b068'
              }}
            >
              <View  className="_child_two">
                < Image src={
                  that.activity ?
                    (that.activity.group ? that.activity.group.icon : null)
                    : null}
                />
                <View className=" ellipsis-one"
                  style={{ width: '9rem', display: 'block' }}
                >
                  <span>
                    {
                      that.activity ? (that.activity.group ? that.activity.group.activity_info : null)
                        : null
                    }
                  </span>
                  <span style={{ color: '#C71D0B' }}>
                    {
                      that.activity ? (that.activity.group ? that.activity.group.gift_info : null)
                        : null
                    }
                  </span>
                </View>
              </View>
            </View>
            <View
             className="_child_two"
              style={{
                display: that.activity ? that.activity.cash_coupon ? '' : 'none' : 'none',

              }}
            >
              <Image src={
                that.activity ?
                  (that.activity.cash_coupon ? that.activity.cash_coupon.icon : null)
                  : null}
              />
              <View className=" ellipsis-one"
                style={{ width: '9rem', display: 'block' }}>
                <span>
                  {
                    that.activity ? (that.activity.cash_coupon ? that.activity.cash_coupon.activity_info : null)
                      : null
                  }
                </span>
              </View>
            </View>

            <View
            className="_child_two"
              style={{ display: that.activity ? that.activity.exchange_coupon ? '' : 'none' : 'none' }}
            >
              <Image src={
                that.activity ?
                  (that.activity.exchange_coupon ? that.activity.exchange_coupon.icon : null)
                  : null}
              />
              <View className=" ellipsis-one"
                style={{ width: '9rem', display: 'block' }}>
                <span>
                  {
                    that.activity ? (that.activity.exchange_coupon ? that.activity.exchange_coupon.activity_info : null)
                      : null
                  }
                </span>
              </View>
            </View>

            <View
              className="_child_two"
              style={{ display: that.activity ? that.activity.zeng ? '' : 'none' : 'none' }}
            >
              < Image src={
                that.activity ?
                  (that.activity.zeng ? that.activity.zeng.icon : null)
                  : null}
              />
              <View className=" ellipsis-one"
                style={{ width: '9rem', display: 'block' }}>
                <span>
                  {
                    that.activity ? (that.activity.zeng ? that.activity.zeng.activity_info : null)
                      : null
                  }
                </span>
                <span style={{ color: '#C71D0B' }}>
                  {
                    that.activity ? (that.activity.zeng ? that.activity.zeng.gift_info : null)
                      : null
                  }
                </span>
              </View>
            </View>

          </View>
        </View>
      </View>
    )
  }
}
