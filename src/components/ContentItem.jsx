import Taro, { Component } from '@tarojs/taro'
import{imgUrl} from '@utils/apis'
import { Navigator,View, Image } from '@tarojs/components'

export default class ComtentItem extends Component{

    static options={
        addGlobalClass:true
    }
    render(){
        let{itemId,itemTitle,createAt,itemSubtitle,itemPic}=this.props
        return(
            <Navigator hoverClass='none' className='cu-card article' url={'/pages/content/info?id='+itemId}>
                <View style={{margin:'10rpx 20rpx'}} className='cu-item shadow'>
                    <View className='title'><View className='text-cut'>{itemTitle}</View></View>
                    <View className='content'>
                        <Image mode='aspectFill' src={imgUrl+itemPic} />
                        <View className='desc'>
                            <View className='text-content'>
                                {itemSubtitle}
                            </View>
                            <View>
                                <View className='cu-tag bg-grey light sm round'>{createAt}</View>
                            </View>
                        </View>
                    </View>
                </View>
            </Navigator>
        )
    }
}