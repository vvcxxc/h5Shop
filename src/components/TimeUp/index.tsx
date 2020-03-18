import Taro, { Component } from "@tarojs/taro";
import { getTime } from '@/utils/common';

interface Props {
    itemtime: any
}
export default class TimeUp extends Component<Props>{

    state = {
        time: {
            date: '',
            display: 2
        },
        differ_time: [],
    };

    componentDidMount() {
        this.setTime();
    }
    /** 定时 */
    setTime = () => {
        // console.log('计时器')
        let timer;
        if (this.state.time.display <= 0) {
            clearTimeout(timer)
            return
        } else {
            timer = setTimeout(() => {
                clearTimeout(timer);
                let time = getTime(new Date(this.props.itemtime.replace(/-/g, "/")).getTime() / 1000);
                this.setState({
                    time
                })
                this.setTime()
            }, 1000);
        }
    }

    render() {
        return (
            <div className="timeUp" >
                {this.state.time.date}
            </div>
        );
    }
}