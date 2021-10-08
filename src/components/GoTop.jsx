import Taro, { Component } from '@tarojs/taro'
import { View, } from '@tarojs/components'

export default class GoTop extends Component{

    static options={
        addGlobalClass: true,
    }
    toTop=e=>{
        e.stopPropagation()
        Taro.pageScrollTo({
            scrollTop:0,
            duration:300
        })
    }
    render(){
        return (
        <View style={{zIndex:1025,display:'none'}}  onClick={this.toTop} className='float-rb-btn padding-sm round bg-cyan light text-center'>
            <View className='cuIcon-top text-xl lg'> </View>
        </View>
        )
    }
}
