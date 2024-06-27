import { useTimer } from 'react-timer-hook';

interface TimerProps {
  expiryTimestamp: Date;
  resetForm: () => void;
}

const Timer: React.FC<TimerProps> = ({ expiryTimestamp, resetForm }) => {
  const { seconds, minutes } = useTimer({
    expiryTimestamp,
    onExpire: resetForm,
  });

  return (
    <div className="text-right text-xs font-semibold text-green-700 px-4 py-2 absolute right-20 shadow-xl">
      <span>{minutes}m</span>:<span> {seconds}s</span>
      <span> Remaining</span>
    </div>
  );
};

export default Timer;
