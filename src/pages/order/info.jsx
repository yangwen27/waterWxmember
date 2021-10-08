import CustomBar from '@components/CustomBar'
import Empty from '@components/Empty'
import Loading from '@components/Loading'
import { Text, View } from '@tarojs/components'
import Taro, { Component } from '@tarojs/taro'
import { orderCancelUrl, orderInfoUrl, OrderPayUrl } from '@utils/apis'
import { request } from '@utils/request'

 
export default  class OrderInfo extends Component {
    constructor(props){
        super(props)
        this.state={
            info:null,
            isLoading:false,
        }
    }
    componentDidMount(){
    }
    componentDidShow(){
        this.loadData()
    }
    goPay = (sn, e) => {
        e.stopPropagation()
        request(OrderPayUrl + sn, {}, 'GET').then(rsp2 => {
            this.setState({ isLoading: false })
            if (rsp2.Code == 0) {
                let payreq = Object.assign(rsp2.Data, {
                    success: res => {
                        console.log('res :>> ', res)
                        this.loadData()
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
                        this.loadData()
                       }
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    }
    loadData(){
        this.setState({isLoading:true})
        request(orderInfoUrl+this.$router.params.id,{},'GET').then(rsp=>{
            this.setState({ isLoading: false })
            if (rsp.Code == 0) {
                this.setState({ info:rsp.Data})
            } else {
                Taro.showToast({ title: rsp.Msg || '获取列表失败', icon: 'none' })
            }
        })
    }
    config = {
        navigationBarTitleText: '一键订水',
    }
    onPullDownRefresh(){
        this.loadData()
    }
    render() {
        let {info,isLoading}=this.state
        if(info)
            return (
                <View style={{height:'100vh'}} className='index'>
                    <CustomBar isBack showHome title='订单详情'></CustomBar>
                    <View className='margin-sm'>
                        {isLoading && <Loading  title='正在加载...' />}
                        { info==null?<Empty title='找不到订单哦' />
                            :<View>
                                <View className='cu-list menu-avatar  '>
                                    <View className='cu-item'> 
                                        <View className='cu-avatar round lg  bg-green'><Text className='cuIcon-punch'></Text></View>
                                        <View className='content'>
                                            <View className='text-bold'>{info.StateText}<Text className='padding-left text-sm text-gray'>{info.IsTimeOut?'订单超时,已自动关闭':''}</Text></View>
                                            <View className='text-gray'>订单号:{info.SerialNo}</View>
                                        </View>
                                    </View>
                                </View>
                                <View className='bg-white margin-top-sm padding-sm'>
                                    {info.Items.map(v=><View key={v.ID} className='flex margin-lr padding-sm solid-bottom'>
                                        <View style={{flex:5}} className='text-bold text-cut'>{v.SkuName}</View>
                                        <View style={{flex:1}} className='padding-lr'>× {v.Count}</View>
                                        <View style={{flex:2}}  className='price'>{(v.Count*v.MarketPrice).toFixed(2)}</View>
                                        </View>)}
                                        <View className='flex margin-lr padding-sm '>
                                        <View style={{flex:1}} className=' text-right'> 实付<Text className='price text-red'>{info&&info.Amount.toFixed(2)}</Text></View>
                                        </View>
                                </View>
                                <View className='bg-white margin-top-sm padding-sm'>
                                    <View className='flex  align-center padding-top'>
                                        <View>地址</View>
                                        <View style={{flex:1}} className='flex flex-direction padding-left'>
                                            <View className='text-grey'>{info.MapName||info.Address}</View>
                                            <View className='text-grey'>{info.Linkman||''} {info.Phone}</View>
                                        </View>
                                    </View>
                                    <View className='flex align-center  padding-top'>
                                        <View>期望</View>
                                        <View style={{flex:1}} className='flex flex-direction padding-left'>
                                        {info.DeliveryTime||'尽快'} 送达
                                        </View>
                                    </View>
                                    <View className='flex  align-center  padding-top'>
                                        <View>下单时间</View>
                                        <View style={{flex:1}} className='flex flex-direction padding-left'>
                                            {info.CreateTime||''}
                                        </View>
                                    </View>
                                    <View className='flex  align-center  padding-top'>
                                        <View>订单编号</View>
                                        <View style={{flex:1}} className='flex flex-direction padding-left'>
                                            {info.SerialNo||''}
                                        </View>
                                    </View>
                                </View>
                                <View className='bg-white margin-top-sm padding-sm'>
                                    {info.Logs&&info.Logs.map(v=><View key={v.ID}>
                                        <View className='log-item'>
                                            <Text className='text-grey '>{v.CreateTime} </Text> {v.Content}
                                        </View>
                                    </View>)}
                                </View>
                                <View className='padding'></View>
                                <View className='padding'></View>
                                <View className='float-bottom '>
                                    {info.State == 0 &&
                                    <View className='padding-sm bg-grey light justify-end flex align-center'>
                                        {!info.IsTimeOut&&info.TimeOutAt&&<View style={{flex:1}} className='text-sm text-gray'>请在{info.TimeOutAt}前支付</View>}
                                        {info.IsTimeOut && <View style={{flex:1}} className='text-sm text-gray'>订单已超时</View>}
                                        <View onClick={this.cancelOrder.bind(this, info.SerialNo)} className='cu-btn padding-sm round  bg-grey'>取消订单</View>
                                        {info.IsTimeOut != true && <View onClick={this.goPay.bind(this, info.SerialNo)} className='cu-btn round margin-left bg-cyan'>立即付款</View>}
                                    </View>}
                                </View>
                            </View>}
                    </View>
                </View>
            )
        else return <View></View>
    }
}
