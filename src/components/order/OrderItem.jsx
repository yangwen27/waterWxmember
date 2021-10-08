import Loading from '@components/Loading'
import { Block, Navigator, Text, View } from '@tarojs/components'
import Taro, { Component } from '@tarojs/taro'
import { orderCancelUrl, OrderPayUrl } from '@utils/apis'
import { request } from '@utils/request'
import PropTypes from 'prop-types'
import './order.scss';

class OrderItem extends Component {
    constructor(props){
        super(props)
        this.state={
            model:{}
        }
    }
    static options = {
        addGlobalClass: true,
    }
    goPay = (sn, e) => {
        e.stopPropagation()
        request(OrderPayUrl + sn, {}, 'GET').then(rsp2 => {
            this.setState({ isLoading: false })
            if (rsp2.Code == 0) {
                let payreq = Object.assign(rsp2.Data, {
                    success: res => {
                        console.log('res :>> ', res)
                        Taro.showToast({ title: '支付成功', icon: 'none' })
                    },
                    fail: res => {
                        console.log('res :>> ', res)
                        Taro.showToast({ title: '支付失败', icon: 'none' })
                    }
                })
                Taro.requestPayment(payreq)
            } else {
                Taro.showToast({ title: rsp2.Msg, icon: 'none' })
            }
        })
    }
    cancelOrder = (sn, e) => {
        e.stopPropagation()
        Taro.showModal({
            title: '提示',
            content: '确定取消该订单吗？',
            success: res => {
                if (res.confirm) {
                    request(orderCancelUrl + sn, {}, 'GET').then(rsp => {
                        Taro.showToast({ title: rsp.Msg, icon: 'none' })
                       // this.resetData()
                       if(rsp.Code==0){
                           this.setState({model:{State:5,StateText:'已取消'}})
                       }
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    }
    render() {
        let { item } = this.props
        if(item==null){
            return <Loading />
        }
        let {model,isLoading}=this.state
        let order=Object.assign(item,model)
        return (
            item != null && <Block>
                {isLoading&&<Loading />}
                <View className='order-item margin-sm bg-white' >
                    <View className={'superscript text-sm ' + ((order.State == 5 || order.State == 6) ? 'bg-grey' : 'bg-red')}>{order.StateText}</View>
                    <Navigator url={'/pages/order/info?id='+order.ID} hoverClass='none' className='padding-tb margin-top'>
                        {order.Items.map(v=><View key={v.ID} className='flex margin-lr'>
                            <View style={{flex:1}} className='text-bold text-cut'>{v.SkuName}</View>
                            <View className='padding-lr'>× {v.Count}</View>
                        </View>)}
                    </Navigator>
                    <View className='text-right padding-sm solid-top'>
                        共{order.Items.length}件商品,实付<Text className='price'>{order.Amount}</Text>
                    </View>
                    {order.State == 0 &&
                        <View className='padding-sm bg-grey light justify-end flex align-center'>
                            {!order.IsTimeOut&&order.TimeOutAt&&<View style={{flex:1}} className='text-sm text-gray'>请在{order.TimeOutAt}前支付</View>}
                            {order.IsTimeOut && <View style={{flex:1}} className='text-sm text-gray'>订单已超时</View>}
                            <View onClick={this.cancelOrder.bind(this, order.SerialNo)} className='cu-btn padding-sm round  bg-grey'>取消订单</View>
                            {order.IsTimeOut != true && <View onClick={this.goPay.bind(this, order.SerialNo)} className='cu-btn round margin-left bg-cyan'>立即付款</View>}
                        </View>}
                        {order.State!=0&&
                        <View className='padding-sm bg-grey light justify-end flex align-center'>
                              <Navigator className='cu-btn padding-sm round  bg-gray' url={'/pages/order/info?id='+order.ID} hoverClass='none' >查看订单</Navigator>
                            </View>}
                </View>
            </Block>
        )
    }
}
OrderItem.propTypes = {
    item: PropTypes.object.isRequired
}

OrderItem.defaultProps = {
    item: null
}
export default OrderItem