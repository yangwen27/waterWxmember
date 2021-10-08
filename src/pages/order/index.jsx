import CustomBar from '@components/CustomBar'
import Empty from '@components/Empty'
import Loading from '@components/Loading'
import OrderItem from '@components/order/OrderItem'
import { ScrollView, View } from '@tarojs/components'
import Taro, { Component } from '@tarojs/taro'
import { orderListUrl, orderStatesUrl } from '@utils/apis'
import { request } from '@utils/request'



export default class Index extends Component {
    constructor(props){
        super(props)
        this.state={
            show2Top:false,
            contents:[],
            contentLoading:true,
            states:[],
            curState:null,
            height:20,
            capsule:{},
        }
    }
    componentDidMount(){
        const info = Taro.getSystemInfoSync()
        const capsule=Taro.getMenuButtonBoundingClientRect()
        this.setState({ height: info.statusBarHeight ,capsule})
        this.getStates()
        
    }
    componentDidShow(){
        this.resetData()
    }
    getStates(){
        request(orderStatesUrl,{},"GET").then(rsp=>{
            if(rsp.Code==0){
                let states=[{Text:'全部',Value:null}]
                this.setState({states:states.concat(rsp.Data)})

            }else{
                Taro.showToast({title:rsp.Msg||'网络异常',icon:'none'})
            }
        })
    }
    resetData(){
        this.setState(prevState=>{
            return {
                ...prevState,
                Page: 0,
                Limit: 10,
                PageCount: 1,
                Count: 0,
                list: [],
                curState:null
            }
        },this.loadData)
    }
    loadData(){
        if (this.state.Page >= this.state.PageCount) {
            return
        }
        let req = {
            Page: this.state.Page + 1,
            Limit: this.state.Limit,
            State:this.state.curState,
        }
        this.setState({isLoading:true})
        request(orderListUrl,req).then(rsp=>{
            this.setState({ isLoading: false })
            if (rsp.Code == 0) {
                this.setState({ list: this.state.list.concat(rsp.Data), Page: rsp.Page, PageCount: rsp.PageCount, Count: rsp.Count })
            } else {
                Taro.showToast({ title: rsp.Msg || '获取列表失败', icon: 'none' })
            }
        })
    }
    config = {
        navigationBarTitleText: '一键订水',
    }
    onPageScroll(res){
        this.setState({show2Top:res.scrollTop>50})
    }
    setCurTab=(val,e)=>{
        e.stopPropagation()
        this.setState(prevState=>{
            return {
                ...prevState,
                Page: 0,
                Limit: 10,
                PageCount: 1,
                Count: 0,
                list: [],
                curState:val
            }
        },this.loadData)
    }
    onReachBottom(){
        this.loadData()
    }
    onPullDownRefresh(){
        this.resetData()
    }
    onItemChange(){
        this.resetData()
    }
    render() {
        let {height,capsule,states,curState,list,isLoading}=this.state
        return (
            <View style={{height:'100vh'}} className='index'>
                <CustomBar title='我的订单'></CustomBar>
                <ScrollView   style={{position:'fixed',zIndex:9991,left:0,right:0,top:(capsule.bottom + capsule.top - height)+'px'}} scrollX className='nav bg-white fit solid-bottom'>
                    <View className='flex  text-center'>
                    {states.map(v=>
                        <View key={v.Value} onClick={this.setCurTab.bind(this,v.Value)} className={'cu-item  flex-sub ' + (curState == v.Value ? ' text-cyan cur' : ' text-sm')}>{v.Text}</View>)}
                    </View>
                </ScrollView>
                <View style={{paddingTop:(capsule.bottom + capsule.top - height)+'px'}}>
                    {isLoading && <Loading isModal={false} title='正在加载...' />}
                     { list&&(list.length==0?<Empty title='没有订单哦！' />
                        :list.map(v=><OrderItem key={v.ID} item={v}></OrderItem>))}
                </View>
            </View>
        )
    }
}
