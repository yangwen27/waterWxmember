import CustomBar from '@components/CustomBar'
import Empty from '@components/Empty'
import GoTop from '@components/GoTop'
import Loading from '@components/Loading'
import { Navigator, Text, View } from '@tarojs/components'
import Taro, { Component } from '@tarojs/taro'
import { depositListUrl, depositRefundtUrl } from '@utils/apis'
import { request } from '@utils/request'
import './index.scss'

export default class Index extends Component {
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
        request(depositListUrl, {}, 'GET').then(rsp => {
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
    doRefund=(val,e)=>{
        e.stopPropagation()
        Taro.showModal({
            title: '真的要退押金吗？',
            content: `您要退回${val.Count}个桶,我们将在收回桶后退款给您`,
            success: function (res) {
              if (res.confirm) {
                request(depositRefundtUrl+val.ID).then(rsp=>{
                    if(rsp.Code==0){
                        Taro.showToast({title:'提交成功,我们将尽快给您处理',icon:'none'})
                    }else{
                        Taro.showToast({title:rsp.Msg||'网络异常',icon:'none'})
                    }
                })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
          })
    }
    render() {
        let { show2Top, isLoading, list,capsule,height } = this.state
        return (
            <View style={{ height: '100vh' }} >
                <CustomBar title='桶押金记录' isBack showHome></CustomBar>
                <View className='cu-bar bg-white ' style={{position:'fixed',zIndex:9991,left:0,right:0,top:((capsule.bottom + capsule.top)-height)+'px'}}>
                    {/* <View className='action'><Text className='cuIcon-ticket'></Text>我要退押金</View> */}
                    <View className='action'><Text className='cuIcon-question'></Text>押金说明<Text className='text-bold text-sm text-red'>请不要交现金给配送员</Text></View>
                    <Navigator hoverClass='none' url='/pages/deposit/refundlog' className='action'>退押记录</Navigator>
                </View>
                <View  style={{flex:1,paddingTop:'100rpx'}}  ></View>
                {isLoading ? <Loading isModal={false} title='正在加载...' />
                    : list.length == 0 ? <Empty title='您还没交过押金呢' />
                        : <View className='table'>
                            <View className='flex bg-green light text-center padding-sm'>
                                <View className='flex-1'>押金</View>
                                <View className='flex-1'>桶数量</View>
                                <View className='flex-2'>时间</View>
                                <View className='flex-1'>操作</View>
                            </View>
                            {
                                list.map((v, index) => <View className={['flex light text-center padding-sm', index % 2 == 1 ? 'bg-green ' : 'bg-cyan']} item={v} key={v.ID} >
                                    <View className='flex-1 price'>{v.Amount}</View>
                                    <View className='flex-1'>{v.Count}</View>
                                    <View className='flex-2'>{v.CreateTime}</View>
                                    <View className='flex-1'><View onClick={this.doRefund.bind(this,v)} className='cuIcon-ticket'>退押金</View></View>
                                </View>)
                            }
                        </View>}
                {show2Top && <GoTop />}
            </View>
        )
    }
}