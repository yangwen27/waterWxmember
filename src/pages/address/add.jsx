import CustomBar from '@components/CustomBar'
import Loading from '@components/Loading'
import UserPhone from '@components/UserPhone'
import Taro, { Component } from '@tarojs/taro'
import { View, Map, Form, Input, Button } from '@tarojs/components'
import{request,getToken} from '@utils/request'
import{MapCDN_PATH,userInfoUrl,addressAddUrl} from '@utils/apis'
import { connect } from '@tarojs/redux'
import {setCurAddr} from '@actions/ProductOrder'

// eslint-disable-next-line import/no-commonjs
let QQMapWX = require('@utils/qqmap-wx-jssdk.js')

let qqmap

@connect(state=>state.ProductOrder,{})
export default class Add extends Component {
    constructor(prop){
        super(prop)
        this.state={
            isLoading:false,
            fromUrl:'',
            isLogin:false,
            locationAddr:'',
            phone:'',
            marker:{
                id:1001,
                latitude:0,
                longitude:0,
                icon:`${MapCDN_PATH}/iconArrowRight@3x.png`
            },
            subAddr:'',
            countyCode:0,
            cityCode:0,
            provinceCode:0,
        }
    }
    componentDidMount(){
        qqmap = new QQMapWX({
            key: 'HKFBZ-6EQKF-KOFJY-NCGTS-4BWVZ-PWFG5'
        });
        if(this.$router.params.from){
            this.setState({fromUrl:this.$router.params.from})
        }
        
        if(getToken()){
            this.setState({isLogin:true})
            request(userInfoUrl,{},'GET').then(rsp=>{
                if(rsp.Code==0){
                    this.setState({phone:rsp.Data.Info.CellPhone})
                }
            })
        }else{
            this.setState({isLogin:false})
        }
    }
    componentDidShow(){
        this.getUserLocation()
    }
    onGetPhoneNumber=phone=>{
        this.setState({phone:phone})
    }
    submitForm=e=>{
        this.setState({isLoading:true})
        e.stopPropagation()
        console.log('e :>> ', e)
        request(addressAddUrl,{Entity:e.detail.value}).then(rsp=>{
            this.setState({isLoading:false})
            if(rsp.Code==0){
                if(rsp.Data.Token){
                    //?????????
                    Taro.setStorageSync('token',rsp.Data.Token)
                }
                Taro.showToast({title:'????????????'})
                if(this.state.fromUrl){
                    this.props.dispatch(setCurAddr(rsp.Data.Address))
                    Taro.setStorageSync('curAddr',rsp.Data.Address)
                    Taro.navigateTo({
                        url:this.state.fromUrl+'?addrId='+rsp.Data.Address.ID,
                        fail:err=>{
                            console.log('err :>> ', err)
                            Taro.switchTab({
                                url:this.state.fromUrl+'?addrId='+rsp.Data.Address.ID,
                            })
                        }
                    })
                }
            }else{
                Taro.showToast({title:rsp.Msg||'????????????',icon:'none'})
            }
        })

    }
    getUserLocation(){
        Taro.getLocation({
            type: 'gcj02',
            success: (res)=> {
                console.log('location',res)
                //this.
                this.setupMap({ latitude:res.latitude, longitude:res.longitude,})
            },
            fail:err=>{
                console.log('err :>> ', err)
                Taro.showModal({
                    title:'??????',
                    content:'???????????????????????????',
                    success:res=>{
                        console.log('res :>> ', res);
                        Taro.openSetting({
                            success:()=>{this.getUserLocation()}
                        })
                    }
                })
            }
        })
    }
    setupMap(center){
        let map=Taro.createMapContext('addrmap')
        let marker=Object.assign(this.state.marker,center)
        map.moveToLocation(center)
        this.setState({marker,userLocation:center})
        Taro.showLoading({title:'???????????????...'})
        qqmap.reverseGeocoder({
            location:center,
            success:res=>{
                Taro.hideLoading()
                if(res.result){
                    let result=res.result
                    console.log('reverseGeocoder res :>> ', res);
                    this.setState({
                        locationAddr:result.address,
                        subAddr:result.formatted_addresses.recommend,
                        countyCode:result.ad_info.adcode,
                        cityCode:result.ad_info.city_code.replace(result.ad_info.nation_code,''),
                        provinceCode:result.ad_info.city_code.replace(result.ad_info.nation_code,'').substring(0,2)+"0000",
                    })
                }
            },
            fail:err=>{
                Taro.hideLoading()
                Taro.showToast({title:'??????????????????',icon:'none'})
                console.log('reverseGeocoder err :>> ', err);
            }
            
        })
    }
    onMapTap=e=>{
        this.setupMap(e.detail)
    }
    render(){
        let {isLogin,isLoading,locationAddr,phone,userLocation,subAddr,marker,countyCode,cityCode,provinceCode}=this.state
        return (
            <View style={{height:'100vh'}} className='index '>
                <CustomBar title='????????????' isBack showHome></CustomBar>
                {isLoading&&<Loading />}
                <Map id='addrmap'
                  onTap={this.onMapTap}
                  markers={[marker]} 
                  style={{height:'90%',width:'100vw',margin:0 ,padding:0}}
                >
                </Map>
                <View className='float-bottom flex' style={{zIndex:99999}}>
                    <View  style={{flex:1}}  className=' margin-lr bg-white padding'>
                        <Form onSubmit={this.submitForm}>
                            <Input className='hide' name='ProvinceCode' value={provinceCode} />
                            <Input className='hide' name='CityCode' value={cityCode} />
                            <Input className='hide' name='CountyCode' value={countyCode} />
                            <Input className='hide' name='Latitude' value={userLocation.latitude} />
                            <Input className='hide' name='Longitude' value={userLocation.longitude} />
                            <Input className='hide' name='IsNew' value={!isLogin} />
                            <View className='cu-form-group'>
                                <View className='title'>??????</View>
                                <Input  name='Address' disabled placeholder='?????????????????????' value={locationAddr} />
                                <View onClick={this.getUserLocation} className='cuIcon-locationfill text-orange'></View>
                            </View>
                            <View className='cu-form-group'>
                                <Input placeholder='?????????????????????' name='MapName' value={subAddr} />
                            </View>
                            <View className='cu-form-group'>
                                <View className='title'>??????</View>
                                <Input placeholder='???????????????' name='Linkman'  />
                            </View>
                            <View className='cu-form-group'>
                                <View className='title'>??????</View>
                                {/* ???????????????????????????????????????????????????????????????????????????????????????????????? */}
                                <Input disabled={!isLogin} placeholder={isLogin?'??????????????????':'????????????????????????'} value={phone} name='Phone' />
                                <UserPhone onGetPhoneNumber={this.onGetPhoneNumber} />
                            </View>
                            <View style={{padding:'10rpx',minHeight:'20rpx'}} className='cu-form-group'></View>
                            <View className='flex'>
                                <Button style={{flex:1}} className='cu-btn lg bg-cyan' formType='submit'>??????</Button>
                            </View>
                        </Form>
                    </View>
                </View>
            </View>
        )
    }
}