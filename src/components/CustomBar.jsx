import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

export default class CustomBar extends Component {
    constructor(props){
        super(props)
        this.state={
            height:20,
            screenWidth:411,
            capsule:{
                bottom: 58,
                height: 32,
                left: 314,
                right: 401,
                top: 26,
                width: 87}
        }
    }
    componentDidMount(){
        const info=  Taro.getSystemInfoSync()
        console.log('info :>> ', info)
        const capsule=Taro.getMenuButtonBoundingClientRect()
        console.log('capsule :>> ', capsule)
        this.setState({height:info.statusBarHeight,capsule:capsule,screenWidth:info.screenWidth})
    }
    static options={
        addGlobalClass: true,
    }
    onBack=e=>{
        e.stopPropagation()
        if(this.props.onBack){
            this.props.onBack();
        }else{
            Taro.navigateBack({delta:1})
        }
    }
    goHome=e=>{
        e.stopPropagation()
        Taro.navigateTo({url:'/pages/index/index',fail:()=>{Taro.switchTab({url:'/pages/index/index'})}})
    }
    render(){
        let {height,capsule,screenWidth}=this.state
        let {title,isBack,showHome}=this.props
        return (
            <View>
                <View className='cu-custom' style={{ height: (capsule.bottom + capsule.top - height) + 'px',zIndex:1111 }}>
                    <View className='cu-bar fixed bg-cyan' style={{ paddingTop: height + 'px', height: (capsule.bottom + capsule.top - height) + 'px' }}>
                        {(isBack && !showHome) && <View className='action' onClick={this.onBack} >
                            <Text className='cuIcon-back'>返回</Text>
                        </View>}
                        {(!isBack&&showHome)&&
                            <View className='action' onClick={this.goHome}>
                                <View className=' padding-sm round line-white shadow'>
                                    <Text className='cuIcon-homefill lg'></Text>
                                </View>
                            </View>
                        }
                        {(isBack && showHome) &&
                            <View className='action border-custom' style={{ width: capsule.width + 'px', height: capsule.height + 'px', marginLeft: 'calc('+screenWidth+'px-' + capsule.right + 'px)' }}>
                                <Text className='cuIcon-back' onClick={this.onBack}></Text>
                                <Text className='cuIcon-homefill' onClick={this.goHome}></Text>
                            </View>
                        }
                        <View className='content' style={{ top: (height) + 'px' }}>
                            <View>{title || '首页'}</View>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}