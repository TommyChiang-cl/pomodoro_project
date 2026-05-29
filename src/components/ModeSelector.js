import { Tabs, Tab } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setMode } from '../store/timerSlice';
import './ModeSelector.css';

// 0. constants
const MODES = ['work', 'shortBreak', 'longBreak'];
const MODE_LABELS = {
  work: '專注',
  shortBreak: '短休息',
  longBreak: '長休息',
};

const ModeSelector = () => {
  // 2. Redux / Context
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.timer.mode);

  // 7. Event Handlers
  const handleModeChange = (_, newMode) => {
    dispatch(setMode(newMode));
  };

  // (main)
  return (
    <Tabs
      className="mode-selector"
      value={mode}
      onChange={handleModeChange}
      centered
    >
      {MODES.map((m) => (
        <Tab key={m} label={MODE_LABELS[m]} value={m} />
      ))}
    </Tabs>
  );
};

export default ModeSelector;
