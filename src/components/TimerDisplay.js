import { Typography, Box, LinearProgress } from '@mui/material';
import { useSelector } from 'react-redux';
import { formatTime } from '../utils/timeUtils';
import { DURATIONS } from '../store/timerSlice';
import './TimerDisplay.css';

const TimerDisplay = () => {
  // 2. Redux / Context
  const secondsLeft = useSelector((state) => state.timer.secondsLeft);
  const mode = useSelector((state) => state.timer.mode);
  const completedPomodoros = useSelector((state) => state.timer.completedPomodoros);

  // 6. Logic and Utils
  const formattedTime = formatTime(secondsLeft);
  const progress = ((DURATIONS[mode] - secondsLeft) / DURATIONS[mode]) * 100;
  const tomatoIcons = '🍅'.repeat(completedPomodoros % 4 || (completedPomodoros > 0 ? 4 : 0));

  // (main)
  return (
    <Box className="timer-display">
      <Typography variant="h1" className="timer-time">{formattedTime}</Typography>
      <LinearProgress variant="determinate" value={progress} className="timer-progress" />
      {completedPomodoros > 0 && (
        <Typography variant="body2" className="timer-count">
          已完成 {completedPomodoros} 個番茄 {tomatoIcons}
        </Typography>
      )}
    </Box>
  );
};

export default TimerDisplay;
