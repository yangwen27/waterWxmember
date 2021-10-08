import Loading from '@components/Loading'
import { Block, Navigator, Text, View } from '@tarojs/components'
import Taro, { Component } from '@tarojs/taro'
import { fileUrl, ticketCancelOrderUrl, ticketOrderPayUrl } from '@utils/apis'
import { request } from '@utils/request'
import PropTypes from 'prop-types'
import './ticket.scss'

export default class OrderItem extends Component {
    static options = {
        addGlobalClass: true,
    }
    goPay = (sn, e) => {
        e.stopPropagation()
        request(ticketOrderPayUrl + sn, {}, 'GET').then(rsp2 => {
            this.setState({ isLoading: false })
            if (rsp2.Code == 0) {
                let payreq = Object.assign(rsp2.Data, {
                    success: res => {
                        console.log('res :>> ', res)
                        Taro.showToast({ title: '支付成功', icon: 'none' })
                        setTimeout(() => {
                            Taro.navigateTo({url:'/pages/ticket/myticket'})
                        }, 1500);
                    },
                    fail: res => {
                        console.log('res :>> ', res)
                        Taro.showToast({ title: '支付失败', icon: 'none' })
                        setTimeout(() => {
                            Taro.navigateTo({url:'/pages/ticket/myticket'})
                        }, 1500);
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
                    request(ticketCancelOrderUrl + sn, {}, 'GET').then(rsp => {
                        Taro.showToast({ title: rsp.Msg, icon: 'none' })
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
        let{isLoading,model}=this.state
        item=Object.assign(item,model)
        return (
            item != null && <Block>
                {isLoading&&<Loading />}
                <View className='cu-item bg-white padding-sm' >
                    <View className='cu-avatar llg'
                      style={{ backgroundImage: 'url(' + (fileUrl + item.Ticket.PicId) + ')' }}
                    ></View>
                    <View className='content'>
                        <View className='text-grey'>
                            {item.Name || (item.TicketName + item.SkuName)}
                        </View>
                        <View className='text-gray text-sm flex flex-direction'>

                            <View className='text-cut'>
                                价格：<Text className='price'>{item.Price}</Text> ,可用次数:{item.AvailableTime}
                            </View>
                            <View className='text-cut'>
                                订单号：{item.SerialNo}
                            </View>
                            <View className='text-cut'>
                                时间：{item.CreateTime}
                            </View>
                            {item.State == 0 && <View>
                                {item.IsTimeOut ? <Text className=' text-red'>订单超时</Text>
                                    : <View className='text-cut'>超时:{item.TimeOutAt}</View>}
                            </View>}
                        </View>
                    </View>
                    <View className='botom-action padding-sm'>
                        {item.State == 1 && item.AvailableTime > 0 && <Navigator hoverClass='none' url={`/pages/ticket/waterorder?sn=${item.SerialNo}`} className='cu-btn round  bg-cyan' >订水</Navigator>}
                        {item.State == 0 && <View onClick={this.cancelOrder.bind(this, item.SerialNo)} className='cu-btn round  bg-gray'>取消</View>}
                        {item.State == 0 && item.IsTimeOut != true && <View onClick={this.goPay.bind(this, item.SerialNo)} className='cu-btn round  bg-cyan'>付款</View>}
                    </View>
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
