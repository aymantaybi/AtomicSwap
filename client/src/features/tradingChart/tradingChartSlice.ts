import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '@/app/store';
import Decimal from 'decimal.js';

interface ReservesUpdates {
  time: number,
  reserve0: string,
  reserve1: string
}

// Define a type for the slice state
interface TradingChartState {
  switched: boolean,
  reservesUpdates: ReservesUpdates[],
}

// Define the initial state using that type
const initialState: TradingChartState = {
  switched: false,
  reservesUpdates: [],
}

export const tradingChartSlice = createSlice({
  name: 'tradingChart',
  initialState,
  reducers: {
    switchTokens: (state) => {
      state.switched = !state.switched;
    },
    updateReserves: (state, action: PayloadAction<ReservesUpdates[]>) => {
      state.reservesUpdates = action.payload;
    },
  }
});

export const { switchTokens, updateReserves } = tradingChartSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectTradingChart = (state: RootState) => state.tradingChart;

export default tradingChartSlice.reducer;