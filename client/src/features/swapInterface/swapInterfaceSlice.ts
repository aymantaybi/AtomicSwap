import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';

interface Order {
    assetIn: string,
    assetOut: string,
    amountIn: string,
    amoutOut: string,
    amoutOutMin: string,
    type: string,
    amounts: {
        in: string,
        out: string,
        outMin: string
    }
}

// Define a type for the slice state
interface SwapInterfaceState {
    orderType: string,
    orders: Order[],
    assetIn: string | null,
    assetOut: string | null,
    amountIn: string,
    amountOut: string,
    amountOutMin: string,
    amounts: {
        in: string,
        out: string,
        outMin: string
    }
}

// Define the initial state using that type
const initialState: SwapInterfaceState = {
    orderType: "MARKET",
    orders: [],
    amountIn: "0",
    amountOut: "0",
    amountOutMin: "0",
    assetIn: null,
    assetOut: null,
    amounts: {
        in: "0",
        out: "0",
        outMin: "0"
    }
}

export const swapInterfaceSlice = createSlice({
    name: 'swapInterface',
    initialState,
    reducers: {
        setOrderType: (state, action: PayloadAction<string>) => {
            state.orderType = action.payload;
        },
        setAmountIn: (state, action: PayloadAction<string>) => {
            state.amountIn = action.payload;
        },
        setAmountOut: (state, action: PayloadAction<string>) => {
            state.amountOut = action.payload;
        },
        setAmountOutMin: (state, action: PayloadAction<string>) => {
            state.amountOutMin = action.payload;
        }
    }
});

export const { setOrderType, setAmountIn, setAmountOut, setAmountOutMin } = swapInterfaceSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectSwapInterface = (state: RootState) => state.swapInterface;

export default swapInterfaceSlice.reducer