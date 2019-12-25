
import  './index.styl'
export default function PhysicalBond(params: any) {
  // console.log(params.list,'list');
  
  return (
    <div className='merchandise_coupon'>
      <div className='merchandise_coupon_box'>
        <ul className="coupon_left">
          <li>{params.list.shop_name}</li>
          <li>有效期:2018.07-2018.09 拷贝</li>
          <li>到店扫码支付时抵用</li>
          {/* <li>急速退/免预约/全部商品可用</li> */}
        </ul>
        <ul className="coupon_right">
          <li className="coupon_img">
            <img src={params.list.img} alt="" />
          </li>
          {/* <li>
            ￥<span>3</span>
          </li> */}
          {
            
          }
          <li className="user_button">立即使用</li>
        </ul>
      </div>
    </div>
  )
}