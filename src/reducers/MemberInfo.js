import {SET_USER_INFO} from '@constants/MemberInfo.js'

const Initial_state={
    info:null
}
export default function MemberInfo(state=Initial_state,action){
    switch(action.type){
        case SET_USER_INFO:
            return {
                ...state,
                info:action.payload
            }
    }
    return state
}