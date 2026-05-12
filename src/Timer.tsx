import React, { useState, useEffect, useRef } from 'react';

function Timer() {
  type TimerState = 'initial' | 'work' | 'break' | 'pausedWork' | 'pausedBreak';
  const [timerState, setTimerState] = useState<TimerState>('initial');
  const timerId = useRef<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const intervalStartTime = useRef(0);
  const intervalTimeLeft = useRef(0);
  const intervalRef = useRef(1);
  const isRunning = timerState === 'work' || timerState === 'break';

  useEffect(() => {
    if (timeLeft === 0) {
      if (timerState === 'work') {
        setTimerState('pausedBreak');
        intervalRef.current += 1;

        if (intervalRef.current % 4 === 0) setTimeLeft(15 * 60);
        else setTimeLeft(5 * 60);

        clearInterval(timerId.current as number);
        timerId.current = null;
      }

      if (timerState === 'break') {
        setTimerState('pausedWork');
        setTimeLeft(25 * 60);
        clearInterval(timerId.current as number);
        timerId.current = null;
      }
    }
  }, [timeLeft]);

  function start() {
    if (timerId.current === null) {
      intervalStartTime.current = Date.now();
      intervalTimeLeft.current = timeLeft;
      timerId.current = setInterval(() => {
        setTimeLeft(
          Math.max(
            0,
            Math.floor(
              intervalTimeLeft.current -
                (Date.now() - intervalStartTime.current) / 1000
            )
          )
        );
      }, 100);
    }

    if (timerState === 'initial' || timerState === 'pausedWork')
      setTimerState('work');

    if (timerState === 'pausedBreak') setTimerState('break');
  }

  function pause() {
    if (timerState === 'work') setTimerState('pausedWork');
    if (timerState === 'break') setTimerState('pausedBreak');

    clearInterval(timerId.current as number);
    timerId.current = null;
  }

  function skip() {
    if (timerState === 'work' || timerState === 'pausedWork') {
      setTimerState('pausedBreak');
      intervalRef.current += 1;

      if (intervalRef.current % 4 === 0) setTimeLeft(15 * 60);
      else setTimeLeft(5 * 60);
    }

    if (timerState === 'break' || timerState === 'pausedBreak') {
      setTimerState('pausedWork');
      setTimeLeft(25 * 60);
    }

    clearInterval(timerId.current as number);
    timerId.current = null;
  }

  function formatTime() {
    const minutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
    const seconds = String(timeLeft % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  return (
    <div className="timer">
      <div className="display">{formatTime()}</div>
      <div className="controls">
        <button
          style={{ display: isRunning ? 'none' : 'block' }}
          onClick={start}
          className="start-btn"
        >
          Start
        </button>
        <button
          style={{ display: isRunning ? 'inline-block' : 'none' }}
          onClick={pause}
          className="pause-btn"
        >
          Pause
        </button>
        <button
          style={{ display: isRunning ? 'inline-block' : 'none' }}
          onClick={skip}
          className="skip-btn"
        >
          Skip
        </button>
      </div>
    </div>
  );
}

export default Timer;
