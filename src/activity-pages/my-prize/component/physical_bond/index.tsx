
import './index.styl'
export default function PhysicalBond(params: any) {
  return (
    <div className='physical_bond'>
      <div className='practical_img'>
        <img src={params.list.image} alt="" />
      </div>
      <div className="detail_info">
        <div className="shop_name">
          <span>{params.list.prize_name}</span>
          {
            {
              1: <span >未使用</span>,
              2: <span >已使用</span>,
              3: <span >已过期</span>,
            }[params.list.status]
          }

        </div>
        <div>领取地点:{params.list.store_name}</div>
        <div>领取时间:{params.list.created_at}</div>
        <div>地址:{params.list.address}</div>
        <div className="location">
          {
            params.list.status == 1 ?
              <span className="allow_use" onClick={() => { this.props.onChange(params.list.id) }}> 查看二维码</span> : null
          }
        </div>
      </div>

    </div>
  )
}