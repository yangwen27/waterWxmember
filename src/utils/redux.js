/* eslint-disable import/prefer-default-export */
import {request} from '@utils/request'

export function createAction(options){
    let {url,req,method,type}=options
    return (dispatch)=>{
        return request(url,req,method).then(rsp=>{
            if(rsp.Code==0){
                dispatch({type,payload:rsp.Data})
            }
            return rsp
        })
    }
}