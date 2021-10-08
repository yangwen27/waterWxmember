import CustomBar from '@components/CustomBar'
import { Navigator, Text, View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import Taro, { Component } from '@tarojs/taro'
import { addressDelUrl, addressListUrl } from '@utils/apis'
import { request } from '@utils/request'
import { setCurAddr } from '../../actions/ProductOrder'


@connect(state=>state.ProductOrder,)//(dispatch)=>({dispatchsetCurAddr(item){dispatch(setCurAddr(item))}})
export default class Index extends Component {
    constructor(prop){
        super(prop)
        this.state={
            fromUrl:'',
            list:[]
        }
    }
    componentDidMount(){
        if(this.$router.params.from){
            this.setState({fromUrl:this.$router.params.from})
        }
    }
    componentDidShow(){
        this.loadData()
       
    }
    loadData(){
        request(addressListUrl,{},'GET').then(rsp=>{
            console.log('rsp :>> ', rsp)
            if(rsp.Code==0){
                this.setState({list:rsp.Data})
            }
        })
    }
    onSelectAddr=(item,e)=>{
        e.stopPropagation()
        Taro.setStorageSync('curAddr',item)
        console.log('this.props :>> ', this.props)
        this.props.dispatch(setCurAddr(item))
        Taro.navigateBack({
            delta: 1
        })
    }
    onPullDownRefresh(){
        this.loadData()
    }
    delete=(v,e)=>{
        e.stopPropagation()
        Taro.showModal({
            title:'提示',
            content:'确认要删除吗?',
            success: (res)=> {
                if (res.confirm) {
                  request(addressDelUrl+v.ID).then(rsp=>{
                    if(rsp.Code==0){
                        this.loadData()
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
    render(){
        let {list,fromUrl}=this.state
        return (
            <View style={{height:'100vh'}} className='index '>
                <CustomBar title='一键订水' isBack showHome></CustomBar>
                <View className='cu-list menu solid-top'>
                {
                    fromUrl==""
                    ?(
                        list.map(v=><View className='cu-item padding flex justity-center align-center' key={v.ID} >
                            <Text className='cuIcon-location lg padding-right'></Text>
                            <View style={{flex:1}}>
                                <View>{v.MapName||v.Address}</View>
                                <View>{v.Linkman||''},{v.Phone}</View>
                            </View>
                            <View onClick={this.delete.bind(this,v)} className='cu-tag bg-orange round'>删除</View>
                        </View>)
                    )
                    :(
                        list.map(v=><View className='cu-item padding flex justity-center align-center' key={v.ID} onClick={this.onSelectAddr.bind(this,v)}>
                            <Text className='cuIcon-location lg padding-right'></Text>
                            <View  style={{flex:1}}>
                                <View>{v.MapName||v.Address}</View>
                                <View>{v.Linkman||''},{v.Phone}</View>
                            </View>
                        </View>)
                )
                }
                </View>
                <View className='float-bottom flex'>
                    <Navigator style={{flex:1}}  className='cu-btn bg-grey padding-xl text-xl' hoverClass='none' url={'/pages/address/add?from='+this.state.fromUrl} ><Text className='cuIcon-add'>添加地址</Text></Navigator>
                </View>
            </View>
        )
    }
}