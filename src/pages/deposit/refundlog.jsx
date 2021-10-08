import CustomBar from '@components/CustomBar'
import Empty from '@components/Empty'
import GoTop from '@components/GoTop'
import Loading from '@components/Loading'
import { Text, View } from '@tarojs/components'
import Taro, { Component } from '@tarojs/taro'
import { depositRefundLogUrl } from '@utils/apis'
import { request } from '@utils/request'
import './index.scss'

export default class RefundLog extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isLoading: false,
            show2Top: false,
            list: [],
            capsule: {},
            height: 20,
        }
    }
    componentDidMount(){
        const info = Taro.getSystemInfoSync()
        const capsule=Taro.getMenuButtonBoundingClientRect()
        this.setState({ height: info.statusBarHeight ,capsule})
    }
    componentDidShow() {
        this.resetData()
    }
    loadData() {
        request(depositRefundLogUrl, {}, 'GET').then(rsp => {
            if (rsp.Code == 0) {
                this.setState({ list: rsp.Data })
            } else {
                Taro.showToast({ title: rsp.Msg || '获取列表失败', icon: 'none' })
            }
        })
    }
    onPullDownRefresh() {
        this.resetData()
    }
    resetData() {
        this.setState({
            list: [],
        }, this.loadData)
    }
    onReachBottom() {
        this.loadData()
    }
    onPageScroll(res) {
        this.setState({ show2Top: res.scrollTop > 50 })
    }
    
    render() {
        let { show2Top, isLoading, list,capsule,height } = this.state
        return (
            <View style={{ height: '100vh' }} >
                <CustomBar title='退押记录' isBack showHome></CustomBar>
                <View className='cu-bar bg-white ' style={{position:'fixed',zIndex:9991,left:0,right:0,top:((capsule.bottom + capsule.top)-height)+'px'}}>
                    <View className='action'><Text className='cuIcon-question'></Text>押金说明<Text className='text-bold text-sm text-red'>请不要交现金给配送员</Text></View>
                </View>
                <View  style={{flex:1,paddingTop:'100rpx'}}  ></View>
                {isLoading ? <Loading isModal={false} title='正在加载...' />
                    : list.length == 0 ? <Empty title='您还没交过押金呢' />
                        : <View className='table'>
                            <View className='flex bg-green light text-center padding-sm'>
                                <View className='flex-1'>押金</View>
                                <View className='flex-1'>桶数量</View>
                                <View className='flex-2'>时间</View>
                                <View className='flex-1'>状态</View>
                            </View>
                            {
                                list.map((v, index) => <View className={['flex light text-center padding-sm', index % 2 == 1 ? 'bg-green ' : 'bg-cyan']} item={v} key={v.ID} >
                                    <View className='flex-1 price'>{v.Amount}</View>
                                    <View className='flex-1'>{v.Count}</View>
                                    <View className='flex-2'>{v.CreateTime}</View>
                                    <View className='flex-1'>{v.Payed?'已退款':'正在处理'}</View>
                                </View>)
                            }
                        </View>}
                {show2Top && <GoTop />}
            </View>
        )
    }
}