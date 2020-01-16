
import './index.styl'
import dayjs from 'dayjs'
export default function PhysicalBond(params: any) {
  const { list } = params
  return (
    <div className='merchandise_coupon'>
      {
        // 现金券
        list.youhui_type ? <div className='merchandise_coupon_box' style={{
          backgroundPositionY:
            list.expire_time < new Date().getTime() / 1000 ?'-9.6rem'
            :['0rem', '-4.8rem'][list.status - 1]
        }}>
          <ul className="coupon_left">
            <li ><span>{['兑换券', '现金券'][list.youhui_type]}</span>
              { list.shop_name}
            </li>
            <li>有效期至:{list.expire_date}</li>
            <li>到店扫码支付时抵用</li>
            {
              list.status === 2 ? <li>使用时间:{dayjs(list.confirm_time*1000).format('YYYY-MM-DD')}</li>:null
            }
          </ul>
          <ul className="coupon_right">
            <li className="denomination">
              <span>￥</span>
              <span style={{
                fontSize: Number(list.return_money) >= 1000 ? '0.7rem' : '1rem'
              }}>{list.return_money}</span>
            </li>
            <li className="threshold"><span>满{list.total_fee}可用</span></li>
           
          </ul>
        </div> : <div className='merchandise_coupon_box'
            style={{ 
              backgroundPositionY: list.expire_time < new Date().getTime() / 1000 ? '-9.6rem'
                : ['0rem', '-4.8rem'][list.status - 1]
           }}>
            <ul className="coupon_left">
              <li ><span>{['兑换券', '现金券'][list.youhui_type]}</span>{list.shop_name}</li>
              <li>{list.name}</li>
              <li>有效期至:{list.expire_date}</li>
            </ul>
            <ul className="coupon_right">
              <li className="coupon_img">
                <img src={list.icon} alt="" />
              </li>
              <li className="user_button" onClick={() => { this.props.onChange(params.list.youhui_sn,true) }}>立即使用</li>
            </ul>
          </div>
      }

    </div>
  )
}