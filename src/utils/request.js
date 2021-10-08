import Taro from '@tarojs/taro'
import { loginUrl, wxLoginUrl,uploadUrl } from '@utils/apis'

let _wxtoken=''
function updateWxToken(token) {
    _wxtoken=token
    // Taro.setStorageSync('wxtoken',token)
}
const updateToken=function(data = {}){
    Taro.setStorageSync('token',data)
}
const getToken=function(){
    try {
        let value = Taro.getStorageSync('token')
        if (value) {
            return value.token_type+' '+value.access_token
        }
      } catch (e) {
      }
      return ''
}

const getWxtoken=function(){
    return _wxtoken
    // try {
    //     let value = Taro.getStorageSync('wxtoken')
    //     if (value) {
    //      return value
    //     }
    //   } catch (e) {
    //   }
    //   console.log('object :>>getWxtoken ');
    //   return ''
}
const request=function(url,data={},method='POST',redirect=false){
    return new Promise(rr=>{
        let wxtoken=new Promise(resolve=>{
            let wx=getWxtoken()
            if(wx==''&&!url.startsWith(wxLoginUrl)){
                Taro.login({
                    success: function (res) {
                      if (res.code) {
                        request(wxLoginUrl+res.code,{},'GET').then(rsp=>{
                            if(rsp.Code==0){
                                resolve(rsp.Msg)
                            }else{
                                resolve('')
                            }
                        })
                      } else {
                        resolve('')
                      }
                    }
                  })
            }else{
                resolve(wx)
            }
        })
        Promise.all([wxtoken]).then(
            ress=>{
                console.log('ress :>> ', ress);
                console.log('ress url:>> ', url);
                const token=getToken()
                const wxToken=getWxtoken()
                const header={
                    'authorization':token,
                    'wxtoken':wxToken
                }
                if(method==='POST'){
                    header['content-type']='application/json'
                }
                return Taro.request({
                    url:url,
                    data:data,
                    method:method,
                    header:header,
                }).then(res=>{
                    Taro.stopPullDownRefresh()
                    if(res.data.Code===0){
                        if(url.startsWith(loginUrl)||url.startsWith(wxLoginUrl)){
                            if(res.data.Data){
                                updateToken(res.data.Data)
                            }
                            if(url.startsWith(wxLoginUrl)){
                                updateWxToken(res.data.Msg)
                            }
                        }
                    }
                    if((res.statusCode==401||res.statusCode==403||res.data.Code===403||res.data.Code===401)){
                        if(redirect){
                            Taro.showModal({
                                title:res.data.Msg||'无权进行该操作',
                                content:'该操作需要授权方可使用\n 点击确定去登录',
                                success:(r)=>{
                                    if (r.confirm) {
                                        Taro.navigateTo({url:'/pages/login'})
                                      } else {
                                        Taro.navigateBack({
                                            delta:1,
                                            fail:()=>{
                                                Taro.navigateTo({url:'/pages/index/index',fail:()=>{Taro.switchTab({url:'/pages/index/index'})}})
                                            }
                                        })
                                      }
                                }
                            })
                        }else{
                            rr({Code:403,Msg:'请登录'})
                        }
                        
                    }
                    if(res.data.Msg=='不是有效的微信会话'){
                        _wxtoken=''
                    }
                    rr(res.data) 
                }).catch(err=>{
                    console.log('http err :>> ', err)
                    rr({Code:-1,Msg:'网络请求失败'}) 
                })
            }
        )
    })
}

const refreshToken=function (){
    // let token=getRefreshToken()
    // return request(refreshTokenUrl+token)
}
const  upload=function(filePath,fileName){
    return Taro.uploadFile({
        url:uploadUrl,
        filePath:filePath,
        name:fileName
    }).then(res=>{
        return JSON.parse(res.data)
    }).catch(err=>{
        console.log('upload err :>> ', err)
        return {Code:-1,Msg:'网络请求失败'}
    })
}

export {
    request,
    getToken,
    refreshToken,
    upload,
    updateToken
}