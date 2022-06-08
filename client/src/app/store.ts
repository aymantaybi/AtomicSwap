import { configureStore } from '@reduxjs/toolkit';
import tradingChartReducer from '@/features/tradingChart/tradingChartSlice';
import tradingHistoryReducer from '@/features/tradingHistory/tradingHistorySlice';
import swapInterfaceReducer from '@/features/swapInterface/swapInterfaceSlice';

const store = configureStore({
    reducer: {
        tradingChart: tradingChartReducer,
        tradingHistory: tradingHistoryReducer,
        swapInterface: swapInterfaceReducer,
    },
});

export default store;

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch