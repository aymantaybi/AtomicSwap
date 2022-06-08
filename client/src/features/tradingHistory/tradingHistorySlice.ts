import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';

interface Trade {
    amountIn: string,
    amountOutMin: string,
    path: Array<string>,
    sender: string,
    transactionHash: string,
    transactionIndex: number,
    blockNumber: number,
    timestamp: number,
    amountOut: string
}
// Define a type for the slice state
interface TradingHistoryState {
  trades: Trade[],
}

// Define the initial state using that type
const initialState: TradingHistoryState = {
  trades:[]
}

export const tradingHistorySlice = createSlice({
  name: 'tradingHistory',
  initialState,
  reducers: {
    updateTrades: (state, action: PayloadAction<Trade[]>) => {
      state.trades = action.payload;
    },
  }
});

export const { updateTrades } = tradingHistorySlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectTradingHistory = (state: RootState) => state.tradingHistory;

export default tradingHistorySlice.reducer