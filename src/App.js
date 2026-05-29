import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Container, Paper, Typography } from '@mui/material';
import { tick, timerComplete } from './store/timerSlice';
import { formatTime } from './utils/timeUtils';
import ModeSelector from './components/ModeSelector';
import TimerDisplay from './components/TimerDisplay';
import ControlButtons from './components/ControlButtons';
import './App.css';

const App = () => {
  // 2. Redux / Context
  const dispatch = useDispatch();
  const isRunning = useSelector((state) => state.timer.isRunning);
  const secondsLeft = useSelector((state) => state.timer.secondsLeft);
  const mode = useSelector((state) => state.timer.mode);

  // 5. useEffect
  useEffect(() => {
    if (!isRunning) return;
    const id = setInterval(() => {
      dispatch(tick());
    }, 1000);
    return () => clearInterval(id);
  }, [isRunning, dispatch]);

  useEffect(() => {
    const MODE_LABELS = { work: '專注', shortBreak: '短休息', longBreak: '長休息' };
    document.title = `${formatTime(secondsLeft)} - ${MODE_LABELS[mode]} | 番茄鐘`;
  }, [secondsLeft, mode]);

  useEffect(() => {
    if (secondsLeft === 0 && isRunning) {
      dispatch(timerComplete());
    }
  }, [secondsLeft, isRunning, dispatch]);

  // (main)
  return (
    <Box className="app">
      <Container maxWidth="sm">
        <Typography variant="h4" className="app-title" align="center">
          番茄鐘
        </Typography>
        <Paper elevation={3} className="timer-card">
          <ModeSelector />
          <TimerDisplay />
          <ControlButtons />
        </Paper>
      </Container>
    </Box>
  );
};

export default App;
