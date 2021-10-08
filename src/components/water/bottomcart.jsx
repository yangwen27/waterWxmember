import Taro, { Component } from '@tarojs/taro'
import { View, Block, Text,Image, ScrollView} from '@tarojs/components'
import minus from '@images/minus.png'
import add from '@images/add.png'
import { connect } from '@tarojs/redux'
import {addToCart,minusCart} from '@actions/ProductOrder'

@connect(state=>state.ProductOrder)
export default class BottomCart extends Component{
    //显示一个购物车图标和金额总价，点击购物车图标从底部弹出购物车，可以编辑购物车

    constructor(props){
        super(props)
        this.state={
            showList:false
        }
    }
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
    setShowList=e=>{
        e.stopPropagation()
        this.setState({showList:!this.state.showList})
    }
    addto=(sku,e)=>{
        e.stopPropagation()
        this.props.dispatch(addToCart(sku))
    }
    minusto=(sku,e)=>{
        e.stopPropagation()
        this.props.dispatch(minusCart(sku))
    }
    stopPropagation=e=>{
        e.stopPropagation()
    }
    render(){
        // let {}
        let count=0
        let amount=0
        let {showList}=this.state
        let {cartItems}=this.props
        cartItems.forEach(v=>{count+=v.Count;amount+=v.Price*v.Count})
        count=count.toFixed(0)
        amount=amount.toFixed(2)
        return (
            <Block>
                <View style={{width:'50vw'}}  onClick={this.setShowList} className=' flex cu-bar '>
                    <View style={{flex:1}} className='action text-gray flex-direction'>
                        <View className='cuIcon-cart' style={{position:'relative',fontSize:'48rpx'}}>
                            <View className='cu-tag badge'>{count}</View>
                        </View>
                        <Text className='text-sm'>购物车</Text>
                    </View>
                    <View className='action'>
                        共计:<Text className='price'>{amount}</Text>
                    </View>
                </View>
                <View onClick={this.setShowList} className={['cu-modal bottom-modal',showList?'show':'']}>
                    <View onClick={this.stopPropagation} style={{position:'relative'}} className='cu-dialog text-left'>
                        <View className='cu-bar bg-white '>
                            <View className='action text-bold'>已选商品</View>
                            <View className='action text-blue'> 
                                <Text onClick={this.setShowList} className='cuIcon-close'></Text>
                            </View>
                        </View>
                        <ScrollView scrollY style={{height:'50vh'}} >
                            <View className='cu-list menu text-left solid-top'>
                            {
                                cartItems.map(x=><View className='cu-item flex text-black' key={x.ID}>
                                    <View style={{flex:3}} className='text-cut'>{x.FullName}</View>
                                    <View style={{flex:1}} className='text-center price'>{x.Price}</View>
                                    <View className='flex'>
                                    <Image onClick={this.minusto.bind(this,x)} src={minus} mode='aspectFit' style={{width:'48rpx',height:'48rpx'}} />
                                        <Text className='padding-lr text-xl'>{x.Count}</Text>
                                    <Image onClick={this.addto.bind(this,x)} src={add} mode='aspectFit' style={{width:'48rpx',height:'48rpx'}} />
                                </View>
                                </View>)
                            }
                            </View>
                        </ScrollView>
                        <View onClick={this.setShowList} style={{position:'absolute',bottom:0,left:0,right:0}} className='bg-black flex cu-bar '>
                            <View className='action text-gray flex-direction'>
                                <View className='cuIcon-cart' style={{position:'relative',fontSize:'48rpx'}}>
                                    <View className='cu-tag badge'>{count}</View>
                                </View>
                                <Text className='text-sm'>购物车</Text>
                            </View>
                            <View className='action'>
                                共计:<Text className='price'>{amount}</Text>
                            </View>
                            <View  onClick={this.goBack} className='cu-bar padding-lr-xl bg-red submit'><Text className='padding-lr-xl'>确定</Text></View>
                        </View>
                    </View>
                </View>
            </Block>
       
        )
    }
}
