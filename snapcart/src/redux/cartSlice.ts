import { createSlice } from "@reduxjs/toolkit";

interface IGrocery {
  _id?: string,
  name: string,
  category: string,
  price: string,
  unit: string,
  image: string,
  qty: number,
  createdAt?: Date,
  updatedAt?: Date
}

interface ICartSlice {
  cartData?: IGrocery[],
  subTotal?: number,
  deliveryCharge?: number,
  total?: number
}

const initialState: ICartSlice = {
  cartData: [],
  subTotal: 0,
  deliveryCharge: 40,
  total: 40
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      state.cartData?.push(action.payload)
      cartSlice.caseReducers.calculateTotals(state)
      cartSlice.caseReducers.saveToLocalStorage(state)
    },
    increaseQty: (state, action) => {
      const item = state.cartData?.find(cartItem => cartItem._id === action.payload)
      if(item) item.qty += 1
      cartSlice.caseReducers.calculateTotals(state)
      cartSlice.caseReducers.saveToLocalStorage(state)
    },
    decreaseQty: (state, action) => {
      const item = state.cartData?.find(cartItem => cartItem._id === action.payload)
      if(item?.qty && item.qty > 1) item.qty -= 1
      else state.cartData = state.cartData?.filter(cartItem => cartItem._id !== action.payload)
      cartSlice.caseReducers.calculateTotals(state)
      cartSlice.caseReducers.saveToLocalStorage(state)
    },
    removeFromCart: (state, action) => {
      state.cartData = state.cartData?.filter(cartItem => cartItem._id !== action.payload)
      cartSlice.caseReducers.calculateTotals(state)
      cartSlice.caseReducers.saveToLocalStorage(state)
    },
    clearCart: (state) => {
      // reset cart back to initial state values
      state.cartData = []
      state.subTotal = 0
      state.deliveryCharge = initialState.deliveryCharge
      state.total = initialState.deliveryCharge
      cartSlice.caseReducers.saveToLocalStorage(state)
    },
    calculateTotals: (state) => {
      state.subTotal = state.cartData?.reduce((sum, item) => sum + (Number(item.price) * item.qty), 0)
      state.deliveryCharge = state.subTotal && state.subTotal < 500 ? 40 : 0
      state.total = (state.subTotal || 0) + (state.deliveryCharge || 0)
    },
    hydrate: (state, action) => {
      return action.payload
    },
    saveToLocalStorage: (state) => {
      if (typeof window !== 'undefined') {
        localStorage.setItem('cart', JSON.stringify(state))
      }
    }
  }
})

export const {addToCart, increaseQty, decreaseQty, removeFromCart, clearCart, hydrate} = cartSlice.actions
export default cartSlice.reducer