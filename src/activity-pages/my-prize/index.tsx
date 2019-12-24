import Taro, {Component} from '@tarojs/taro'
import './index.styl'

class MyPrize extends Component {
  state = {
    index: 0
  }

  tabClick = (index: number) => {
    this.setState({index})
  }

  render (){
    const { index } = this.state
    return (
      <div className='prize_page'>
        <div className='prize_tab'>
          <div onClick={this.tabClick.bind(this,0)} className={index == 0 ? 'prize_label prize_activity' : 'prize_label'}>商家券</div>
          <div onClick={this.tabClick.bind(this,1)} className={index ? 'prize_label prize_activity' : 'prize_label'}>实物券</div>
        </div>


      </div>
    )
  }
}

export default MyPrize
