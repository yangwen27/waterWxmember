import CustomBar from '@components/CustomBar'
import Empty from '@components/Empty'
import Loading from '@components/Loading'
import { RichText, View } from '@tarojs/components'
import Taro, { Component } from '@tarojs/taro'
import { contentInfoUrl } from '@utils/apis'
import { request } from '@utils/request'


export default class Index extends　Component{
    constructor(props){
        super(props)
        this.state={
         info:null,
         isLoading:false
        }
    }
    componentDidShow(){
        this.loadData()
    }
    onPullDownRefresh() {
        this.loadData()
    }
    loadData(){
        if (this.$router.params.id) {
            this.setState({ isLoading: true })
            request(contentInfoUrl+this.$router.params.id).then(rsp => {
                this.setState({ isLoading: false })
                if (rsp.Code == 0) {
                    this.setState({info:rsp.Data})
                } else {
                    Taro.showToast({ title: rsp.Msg || '获取失败', icon: 'none' })
                }
            })
        }else{
            Taro.showToast({title:'无效操作',icon:'none'})
            setTimeout(()=>{Taro.navigateBack({delta:1,fail:()=>{Taro.switchTab({url:'/pages/index/index'})}})},1000)
        }

        
    }
    render(){
        let{ info,isLoading}=this.state
        return(
            <View style={{height:'100vh'}}>
            <CustomBar showHome isBack title={info==null?'帮助中心':info.Title||info.Name}></CustomBar>
            {isLoading&&<Loading />}
            {info==null
            ?<Empty />
            :<View className='cu-card article padding bg-white'>
                <RichText className=' bg-white' nodes={info.Contents}></RichText>
            </View>}
            </View>
        )
    }
}