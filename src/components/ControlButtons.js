import { Button, Stack } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { start, pause, reset } from '../store/timerSlice';
import './ControlButtons.css';

const ControlButtons = () => {
  // 2. Redux / Context
  const dispatch = useDispatch();
  const isRunning = useSelector((state) => state.timer.isRunning);

  // 7. Event Handlers
  const handleStart = () => dispatch(start());
  const handlePause = () => dispatch(pause());
  const handleReset = () => dispatch(reset());

  // (main)
  return (
    <Stack className="control-buttons" direction="row" spacing={2} justifyContent="center">
      {isRunning ? (
        <Button variant="contained" size="large" onClick={handlePause}>暫停</Button>
      ) : (
        <Button variant="contained" size="large" onClick={handleStart}>開始</Button>
      )}
      <Button variant="outlined" size="large" onClick={handleReset}>重置</Button>
    </Stack>
  );
};

export default ControlButtons;
