import {AddToCart,MinusCart,DelCartItem} from '@constants/TicketOrder.js'

const Initial_state={
    cartItems:[]
}
export default function ProductOrder(state=Initial_state,action){
    switch(action.type){
        case AddToCart:
            let cartItems=state.cartItems
            let item=cartItems.find(x=>x.ID==action.payload.ID)
            if(item){
                item.Count+=1
            }else{
                let sku=Object.assign(action.payload,{Count:1})
                cartItems.push(sku)
            }
            cartItems=cartItems.map(x=>x)
            return {
                ...state,
                cartItems:cartItems
            }
        case MinusCart:
            let items2=state.cartItems.map(v=>{
                if(v.ID==action.payload.ID){
                    v.Count-=1
                }
                return v;
            })
            return {
                ...state,
                cartItems:items2.filter(v=>v.Count>0)
            }
        case DelCartItem:
            return {
                ...state,
                cartItems:state.cartItems.filter(v=>v.ID!=action.payload.ID)
            }
    }
   
    return state
}