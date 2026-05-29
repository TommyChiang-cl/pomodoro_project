import { createSlice } from '@reduxjs/toolkit';

// 0. constants
export const DURATIONS = {
  work: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
};

const timerSlice = createSlice({
  name: 'timer',
  initialState: {
    mode: 'work',
    secondsLeft: DURATIONS.work,
    isRunning: false,
    completedPomodoros: 0,
  },
  reducers: {
    tick: (state) => {
      if (state.isRunning && state.secondsLeft > 0) {
        state.secondsLeft -= 1;
      }
    },
    start: (state) => {
      state.isRunning = true;
    },
    pause: (state) => {
      state.isRunning = false;
    },
    reset: (state) => {
      state.isRunning = false;
      state.secondsLeft = DURATIONS[state.mode];
    },
    setMode: (state, action) => {
      state.mode = action.payload;
      state.isRunning = false;
      state.secondsLeft = DURATIONS[action.payload];
    },
    timerComplete: (state) => {
      state.isRunning = false;
      if (state.mode === 'work') {
        state.completedPomodoros += 1;
        if (state.completedPomodoros % 4 === 0) {
          state.mode = 'longBreak';
          state.secondsLeft = DURATIONS.longBreak;
        } else {
          state.mode = 'shortBreak';
          state.secondsLeft = DURATIONS.shortBreak;
        }
      } else {
        state.mode = 'work';
        state.secondsLeft = DURATIONS.work;
      }
    },
  },
});

export const { tick, start, pause, reset, setMode, timerComplete } = timerSlice.actions;
export default timerSlice.reducer;
