import { Block, Image, Text, View } from '@tarojs/components'
import Taro, { Component } from '@tarojs/taro'
import { fileUrl } from '@utils/apis'

export default  class Product extends Component{
    componentDidMount(){
        if(this.props.item&&this.props.item.Skus.length>0){
            this.setState({curSku:this.props.item.Skus[0]})
        }
    }
    static options={
        addGlobalClass: true,
    }
    selectSku=e=>{
        e.stopPropagation()
        console.log('object selectSku:>> ');
        // this.setState({showDialog:true})
        if(this.props.onSelectSku){
            this.props.onSelectSku(this.props.item)
        }
    }
    setCurSku=(sku,e)=>{
        e.stopPropagation()
        this.setState({curSku:sku})
    }
    stopPropagation=e=>{
        e.stopPropagation()
    }
    render(){
        let {item}=this.props
        let {curSku}=this.state
        return (
            item.Skus.length>0&&
            (<Block>
                <View style={{height:'240rpx',position:'relative'}} className='flex bg-white margin-top'>
                    <Image style={{height:'200rpx',width:'200rpx'}} mode='aspectFill' src={fileUrl+item.PicId} />
                    <View style={{flex:3}} className='padding'>
                        <View  className='text-cut text-bold'><Text className='cu-tag line-blue'>{item.TicketType}</Text> {item.Name}</View>
                        <View className='text-cut'>{item.Title}</View>
                        <View className='text-cut text-sm text-gray'> 已售{item.SaleCount}份</View>
                        <View className='text-cut text-sm text-orange'>{(curSku.GiftName&&"赠"+curSku.GiftName)}</View>
                        <View className='text-cut'>
                            <Text className='price text-red'>{curSku.Price}</Text>
                            {(curSku.Limit!=null&&curSku.Limit>0)&&<Text className='padding-lr text-grey'>限购{curSku.Limit}件</Text>}
                            {(curSku.MinSaleCount!=null&&curSku.MinSaleCount>1)&&<Text className='padding-lr text-grey'>{curSku.MinSaleCount}件起送</Text>}
                            
                        </View>

                        <View className=' text-xxl'  style={{position:'absolute',right:'40rpx',bottom:'40rpx'}}>
                            <View onClick={this.selectSku} className='cu-tag padding-sm bg-red round'>购买</View>
                        </View>
                    </View>
                </View>
                </Block>
            )
        
        )
    }
}
Product.defaultProps={
    item:{ID:null,
    Skus:[]}
}
