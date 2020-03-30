import Taro, { Component } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";


interface Props {
    src: string;
    showBool: boolean;
    onChange: Function
}
{/*
调用方式：  state={ imgZoom: false , imgZoomSrc: '',}
             <Image onClick={() => { this.setState({ imgZoom: true, imgZoomSrc:item.src }) }}
            <Zoom
                src={this.state.imgZoomSrc}
                showBool={this.state.imgZoom}
                onChange={() => { this.setState({ imgZoom: !this.state.imgZoom }) }}
            /> */}
export default class Zoom extends Component<Props> {

    state = {
    };

    handlerTablChange() {
        this.props.onChange && this.props.onChange();
    }

    render() {
        return (
            <View
                onClick={this.handlerTablChange.bind(this)}
                style={{ height: "100vh", width: "100vw", position: "fixed", top: "0", left: '0', background: "rgba(0,0,0,.9)", zIndex: 99, display: this.props.showBool ? "block" : "none" }}>
                <Image mode={'widthFix'} src={this.props.src} style={{ height: "auto", width: "100%", position: 'absolute', left: '0', top: '50%', transform: 'translate(0,-50%)' }} />
            </View>
        );
    }
}
