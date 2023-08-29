import React,  {useState} from 'react';
import axios from 'axios'

// Suggested initial states
const initialFormValues = {
   initialMessage: '',
   initialEmail: '',
   initialSteps: 0,
   initialIndex: 4, 
}
// the index the "B" is at


export default function AppFunctional(props) {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
 

 const [steps, setSteps] = useState(initialFormValues.initialSteps)
 const [message, setMessage] = useState(initialFormValues.initialMessage)
 const [index, setIndex] = useState(initialFormValues.initialIndex)
 const [email, setEmail] = useState(initialFormValues.initialEmail)

  function getXY() {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    const x = ((index % 3) + 1)
    let y = null
    if(index < 3){
      y = 1
    }else if(index >= 3 && index < 6){
      y = 2
    }else if(index >= 6){
      y = 3
    }
  return [x,y]
  }

  

  function getXYMessage() {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
   let coordinates = getXY()
   console.log(coordinates)
   return (`Coordinates ${coordinates[0]},${coordinates[1]}`)
  }

  function reset() {
    // Use this helper to reset all states to their initial values.
    setMessage("")
    setSteps(0)
    setIndex(4)
    setEmail('')
  }

  function getNextIndex(direction) {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    switch(direction){
      case 'up': 
        return (index < 3) ? index : index - 3
      case 'down':
        return (index > 5) ? index : index + 3
      case 'left':
        return (index % 3 === 0) ? index : index - 1
      case 'right':
        return ((index - 2) % 3 === 0) ? index : index + 1 
    }
  }

  function move(evt) {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
   const direction = evt.target.id
   const nextIndex = getNextIndex(direction)
   if(nextIndex !== index){
    setSteps(steps + 1)
    setMessage('')
    setIndex(nextIndex)
   }else{
    setMessage(`You can't go ${direction}`)
   }
  }

  function onChange(evt) {
    // You will need this to update the value of the input.
   setEmail(evt.target.value)
  }

  const submitInfo = {
    x: getXY()[0],
    y: getXY()[1],
    steps: steps,
    email: email
  }

  function onSubmit(evt) {
    // Use a POST request to send a payload to the server.
    evt.preventDefault()
    axios
      .post('http://localhost:9000/api/result', submitInfo)
      .then(res => {
        console.log(res.data.message)
        setMessage(res.data.message) 
      })
      .catch(err => console.error(err)) 
      .finally(() => setEmail(''))
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">You moved {steps} times</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
              {idx === index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={move}>LEFT</button>
        <button id="up" onClick={move}>UP</button>
        <button id="right" onClick={move}>RIGHT</button>
        <button id="down" onClick={move}>DOWN</button>
        <button id="reset" onClick={reset}>reset</button>
      </div>
      <form onSubmit = {onSubmit}>
        <input id="email" type="email" placeholder="type email" value={email} onChange={onChange}></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}
