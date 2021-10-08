import { addToCart, minusCart } from '@actions/ProductOrder'
import add from '@images/add.png'
import minus from '@images/minus.png'
import { Block, Image, Text, View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import Taro,{ Component } from '@tarojs/taro'
import { fileUrl } from '@utils/apis'

@connect(state=>{return {cartItems:state.ProductOrder.cartItems}})
export default  class Product extends Component{
   
    componentDidMount(){
        if(this.props.item&&this.props.item.Skus.length>0){
            this.setState({curSku:this.props.item.Skus[0]})
        }
    }
    static options={
        addGlobalClass: true,
    }
    addto=(sku,e)=>{
        this.setState({showDialog:false})
        e.stopPropagation()
        this.props.dispatch(addToCart(sku))
    }
    minusto=(sku,e)=>{
        e.stopPropagation()
        this.props.dispatch(minusCart(sku))
    }
    selectSku=e=>{
        e.stopPropagation()
        this.setState({showDialog:true})
    }
    setCurSku=(sku,e)=>{
        e.stopPropagation()
        this.setState({curSku:sku})
    }
    hideDialog=e=>{
        e.stopPropagation()
        this.setState({showDialog:false})
    }
    stopPropagation=e=>{
        e.stopPropagation()
    }
    render(){
        let {item,cartItems}=this.props
        let {showDialog,curSku}=this.state
       
        //判断是否多规格
        let sku=null
        if(item.Skus.length==1){
            sku=item.Skus[0]
            sku=Object.assign(sku,{Count:0})
            let p=cartItems.find(x=>x.ID==sku.ID)
            if(p){

                sku=Object.assign(sku,p)
            }
        }
        return (
            item.Skus.length>0&&
            (<Block>
                <View style={{height:'240rpx',position:'relative'}} className='flex bg-white margin-top'>
                    <Image style={{height:'200rpx',width:'200rpx'}} mode='aspectFill'  src={fileUrl+item.PicId} />
                    <View style={{flex:1,position:'absolute',left:'200rpx',right:'5rpx'}} className='padding-lr'>
                        <View  className=' text-bold'>{item.Name}</View>
                        <View className='text-orange'>{item.Title}</View>
                        <View className='text-cut text-sm text-gray'> {item.SaleCount>0&&<Text>已售{item.SaleCount}份</Text>}
                            {(curSku.MinSaleCount!=null&&curSku.MinSaleCount>1)&&<Text className='padding-lr text-grey'>{curSku.MinSaleCount}件起送</Text>}
                        </View>
                        <View className='text-cut text-sm text-orange'>{(curSku.GiftName&&"赠"+curSku.GiftName)}</View>
                        {curSku.MarketPrice>0&&<View className='text-cut text-sm text-gray'>市场价<Text className='price'>{curSku.MarketPrice}</Text></View>}
                        <View className='text-cut'>
                            惠民价<Text className='price text-red'>{curSku.Price}</Text>
                            {(curSku.Limit!=null&&curSku.Limit>0)&&<Text className='padding-lr text-grey'>限购{curSku.Limit}件</Text>}
                        </View>
                    </View>
                    <View className=' text-xxl'  style={{position:'absolute',right:'20rpx',bottom:'10rpx'}}>
                        {
                            sku==null?<View onClick={this.selectSku} className='cu-tag padding-sm bg-red round'>选套餐</View>
                            :<View className='flex'>
                                <Image onClick={this.minusto.bind(this,sku)} src={minus} mode='aspectFit' style={{width:'48rpx',height:'48rpx'}} />
                                    <Text className='padding-lr text-xl'>{sku.Count}</Text>
                                <Image onClick={this.addto.bind(this,sku)} src={add} mode='aspectFit' style={{width:'48rpx',height:'48rpx'}} />
                            </View>
                        }
                    </View>
                </View>
                <View  onClick={this.hideDialog} className={['cu-modal bottom-modal',showDialog?'show':'']}>
                    <View onClick={this.stopPropagation} className='cu-dialog'>
                        <View className='cu-bar bg-white'>
                            <View className='action text-bold'>请选择套餐</View>
                            <View className='action text-blue'> <Text onClick={this.hideDialog} className='cuIcon-close'></Text></View>
                        </View>
                        <View style={{height:'200rpx',position:'relative'}} className='flex bg-white margin-top text-left'>
                            <Image style={{height:'200rpx',width:'200rpx'}}  mode='aspectFill' src={fileUrl+item.PicId} />
                            <View style={{flex:3}} className='padding'>
                                <View  className='text-cut'>{item.Name}</View>
                                <View  className='text-cut'>价格:<Text className='price'>{curSku.Price}</Text></View>
                                <View  className='text-cut'>已选:<Text>{curSku.Name+(curSku.GiftName&&",赠品:"+curSku.GiftName)} </Text></View>
                                {(curSku.Limit!=null&&curSku.Limit>0)&&<Text className='text-grey'>限购{curSku.Limit}件</Text>}
                                {(curSku.MinSaleCount!=null&&curSku.MinSaleCount>1)&&<Text className='text-grey'>{curSku.MinSaleCount}件起送</Text>}

                            </View>
                        </View>
                        <View  className='cu-bar bg-white margin-top'>
                            <View className='action text-bold'>套餐</View>
                        </View>
                       <View className='padding text-left flex-wrap flex'>
                       {
                            item.Skus.map(s=><View onClick={this.setCurSku.bind(this,s)} key={s.ID} className={['cu-btn round margin-lr',curSku.ID==s.ID?'bg-red':' bg-gray']} >
                               <Text >{s.Name}</Text>
                                {s.GiftName&&<Text className={['cu-tag bagde',curSku.ID==s.ID?'bg-red text-yellow':'bg-gray text-orange']}>赠:{s.GiftName}</Text>}
                            </View>)
                        }
                       </View>
                        <View onClick={this.addto.bind(this,curSku)} className='bg-orange margin-top text-center padding-sm text-xl'>加入购物车</View>
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
