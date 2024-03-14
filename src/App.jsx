import { useState, useEffect } from "react";

const App = () => {
  // Variables
  const [isRunning, setIsRunning] = useState(false);
  const [milliseconds, setMilliseconds] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [previousLap, setPreviousLap] = useState(null);
  const [lapList, setLapList] = useState([]);

  // UseEffect Method
  useEffect(() => {
    let intervalId;

    if (isRunning) {
      const stopWatch = () => {
        setMilliseconds((state) => state + 1);
        if (milliseconds === 100) {
          setSeconds((state) => state + 1);
          setMilliseconds(0);
        }
        if (seconds === 60) {
          setMinutes((state) => state + 1);
          setSeconds(0);
        }
        if (minutes === 60) {
          setMinutes(0);
          setSeconds(0);
        }
      };
      intervalId = setInterval(stopWatch, 10);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, seconds, milliseconds, minutes]);

  // Additional Methods
  const startStop = () => {
    setIsRunning(!isRunning);
  };

  const reset = () => {
    setIsRunning(false);
    setMilliseconds(0);
    setSeconds(0);
    setMinutes(0);
    setLapList([]);
    setPreviousLap(null);
  };

  // Function that Calculates the Previous and Current Lap
  const calculateDifference = (previousLap, currentLap) => {
    let lapDifference = {
      minutes: currentLap.minutes - previousLap.minutes,
      seconds: currentLap.seconds - previousLap.seconds,
      milliseconds: currentLap.milliseconds - previousLap.milliseconds,
    };
    if (lapDifference.milliseconds < 0) {
      lapDifference.seconds -= 1;
      lapDifference.milliseconds += 100;
    }
    if (lapDifference.seconds < 0) {
      lapDifference.minutes -= 1;
      lapDifference.seconds += 60;
    }
    return lapDifference;
  };

  const createLap = () => {
    const currentLap = { minutes, seconds, milliseconds };

    if (previousLap !== null) {
      const lapDifference = calculateDifference(previousLap, currentLap);
      setLapList([...lapList, { currentLap, lapDifference }]);
      console.log(lapList);
    } else {
      const lapDifference = { minutes: 0, seconds: 0, milliseconds: 0 };
      setPreviousLap(currentLap);
      setLapList((prevLapList) => [
        ...prevLapList,
        { currentLap, lapDifference },
      ]);
      console.log(lapList);
    }
  };

  // Display Logic
  const minutesDigit = `${minutes < 10 ? "0" + minutes : minutes}`;
  const secondsDigit = `${seconds < 10 ? "0" + seconds : seconds}`;
  const milliSecondsDigit =
    milliseconds < 10
      ? "0" + milliseconds
      : milliseconds === 100
      ? "00"
      : milliseconds;

  return (
    <div className="container">
      <div className="timebox">
        <h1>Stopwatch Web App</h1>

        {/* Timer Section */}
        <div className="timer">
          <div className="minutes">
            <h2>{minutesDigit}</h2>
            <p>Minutes</p>
          </div>

          <p>:</p>

          <div className="seconds">
            <h2>{secondsDigit}</h2>
            <p>Seconds</p>
          </div>

          <p>:</p>

          <div className="miliseconds">
            <h2>{milliSecondsDigit}</h2>
            <p>MiliSeconds</p>
          </div>
        </div>

        {/* Buttons Group */}
        <div className="buttons-group">
          <button onClick={startStop}>{isRunning ? "Pause" : "Start"}</button>
          <button onClick={reset}>Reset</button>
          <button
            onClick={() => {
              milliseconds ? createLap() : null;
            }}
          >
            Lap
          </button>
        </div>

        {/* Time Lapse */}
        <div className="lapList">
          {lapList.map(
            (
              {
                currentLap: { minutes, seconds, milliseconds },
                lapDifference: {
                  minutes: minutesDiff,
                  seconds: secondsDiff,
                  milliseconds: millisecondsDiff,
                },
              },
              index
            ) => (
              <div key={index + 1} className="lapItem">
                <p>{index + 1}</p>
                <p>
                  +{minutesDiff < 10 ? "0" + minutesDiff : minutesDiff}:
                  {secondsDiff < 10 ? "0" + secondsDiff : secondsDiff}:
                  {millisecondsDiff < 10
                    ? "0" + millisecondsDiff
                    : millisecondsDiff}
                </p>
                <p>
                  {minutes < 10 ? "0" + minutes : minutes}:
                  {seconds < 10 ? "0" + seconds : seconds}:
                  {milliseconds < 10 ? "0" + milliseconds : milliseconds}
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
