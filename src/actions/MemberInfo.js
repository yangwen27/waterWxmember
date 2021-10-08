import {SET_USER_INFO} from '@constants/MemberInfo.js'
import {userBaseUrl} from '@utils/apis'
import { createAction } from '@utils/redux'

// eslint-disable-next-line import/prefer-default-export
export  const  dispatchInfo=()=>createAction({url:userBaseUrl,req:{},method:'GET',type:SET_USER_INFO})
