import React, {useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function Timer({index, task, startTimer, isStarted, removeTimer, updateSeconds, seconds, updateComment, comment}) {

  const formatTime = seconds => {
    let date = new Date(null);
    date.setSeconds(seconds);
    return date.toISOString().substr(11, 8)
  }

  useEffect(() => {
    let interval = null;
    if (isStarted) {
      interval = setInterval(() => {
        updateSeconds(index);
      }, 1000)
    } else if (!isStarted && seconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
    }, [isStarted, seconds]);

  return (
  <tr>
    <td>{ task }</td>
    <td>{ formatTime(seconds) }</td>
    <td><button className="btn btn-primary" onClick={() => startTimer(index) }>Start Timer</button></td>
    <td><button className="btn btn-secondary" onClick={() => removeTimer(index) }>Remove Timer</button></td>
    <td><textarea className="text" placeholder="Comments..." onChange={e =>updateComment(index, e.target.value)}>{comment}</textarea></td>
  </tr>
  )
}

function TimerForm({ addTimer, stopAllTimers }) {
  const [value, setValue] = useState('');

  const handleSubmit = e => {
    e.preventDefault(); // As this is a submit, prevents the default behaviour from executing
    if (!value) return; // return form if its empty.
    addTimer(value);
    setValue('');
  }

  return (
    <form onSubmit={handleSubmit} className="form-inline justify-content-center">
      <label>New Task Name:</label>
      <input 
      type="text" 
      className="input" 
      value={value} 
      placeholder="Add Timer..."
      onChange={e => setValue(e.target.value)}
       />      
    </form>
  )
}

function App() {
  const [timers, setTimers] = useState([]);

  useEffect(() => {
    fetch('/tasks').then( res=> res.json())
      .then((result) => {
        setTimers([...result],
          (error) => console.log(error));
      })
  }, [])

  const addTimer = text => {
    const newTimers = [...timers, {task: text, isStarted: false, seconds: 0}];
    setTimers(newTimers);
  }

  const startTimer = index => {
    const newTimers = [...timers];
    newTimers[index].isStarted = !newTimers[index].isStarted;
    setTimers(newTimers);
  }

  const removeTimer = index => {
    const newTimers = [...timers];
    newTimers.splice(index, 1);
    setTimers(newTimers);
  }

  const updateSeconds = index => {
    const newTimers = [...timers];
    newTimers[index].seconds = newTimers[index].seconds + 1;
    setTimers(newTimers)
  }

  const updateComment = (index, text) => {
    const newTimers = [...timers];
    newTimers[index].comment = text;
    setTimers(newTimers)
  }

  const stopAllTimers = () => {
    const newTimers = [...timers];
    newTimers.forEach(timer => timer.isStarted = false);
    setTimers(newTimers)
  }

  const removeAllTimers = () => {
    setTimers([])
  }

  const loadTimers = () => {
    fetch('/tasks').then( res=> res.json())
      .then((result) => {setTimers([...result])},
          (error) => {console.log(error)})
    }

    const saveTimers = (timers) => {
      console.log(timers)
      fetch('/tasks', {
        method: 'POST',
        body: JSON.stringify(timers),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then( res=> {return res;})
        .catch(err => err);
      }
  
  return (
    <div>
      <div className="container" style={{ padding: '8px'}}>
        <div className="row">
          <div align="center" className="col-sm-6">
            <TimerForm addTimer={ addTimer } stopAllTimers={ stopAllTimers } />
          </div>
          <div className="col-sm-6">
          <button className="btn btn-primary" onClick={() => loadTimers() }>Load Timers</button>
          <button className="btn btn-primary" onClick={() => removeAllTimers() }>Remove All Timers</button>
          <button className="btn btn-primary" onClick={() => stopAllTimers() }>Stop All Timers</button>
          <button className="btn btn-primary" onClick={() => saveTimers(timers) }>Save Timers</button>
          </div>
        </div>
      </div>
      <table className="table table-hover">
        <thead style={{ backgroundColor: '#1D3557', color: 'white'}}>
          <tr>
            <td>Task name</td>
            <td>Time</td>
            <td>Start</td>
            <td>Remove</td>
            <td>Comment</td>
          </tr>
        </thead>
      <tbody>
      {timers.map((timer, index) => (
        <Timer
          key={index} 
          index={index}
          task={timer.task}
          startTimer={startTimer}
          isStarted={timer.isStarted} 
          removeTimer={removeTimer}
          updateSeconds={updateSeconds}
          seconds={timer.seconds}
          updateComment={updateComment} 
          comment={timer.comment} />
      ))}
      </tbody>
      </table>
    </div>
  )
}

export default App;
