import React from 'react';
import axios from 'axios'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at

const initialState = {
  message: initialMessage,
  email: initialEmail,
  index: initialIndex,
  steps: initialSteps
}

const URL = 'http://localhost:9000/api/result'

export default class AppClass extends React.Component {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.

state = initialState
 

  getXY = () => {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    const {index} = this.state
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

  getXYMessage = () => {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
    let coordinates = this.getXY()
   return (`Coordinates (${coordinates[0]}, ${coordinates[1]})`)
  }

  reset = () => {
    // Use this helper to reset all states to their initial values.
    this.setState(initialState)
  }

  getNextIndex = (direction) => {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
   
    const {index} = this.state
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

  move = (evt) => {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    
      const direction = evt.target.id;
      const nextIndex = this.getNextIndex(direction);
  
      if (nextIndex !== this.state.index) {
        this.setState((prevState) => ({
          steps: prevState.steps + 1,
          message: '',
          index: nextIndex,
        }));
      } else {
        this.setState({ message: `You can't go ${direction}` });
      }
    }

  onChange = (evt) => {
    const emailValue = evt.target.value; 
    this.setState({ ...this.state, email: emailValue });
  }

  onSubmit = (evt) => {
    evt.preventDefault();
    const submitInfo = {
      x: this.getXY()[0],
      y: this.getXY()[1],
      steps: this.state.steps,
      email: this.state.email, 
    };

    let holdMessage

    axios
      .post(URL, submitInfo)
      .then(res => {
        holdMessage = res.data.message
        this.setState({ ...this.state, message: res.data.message }); 
      })

      .catch(err => {
        holdMessage = err.response.data.message
        this.setState({ ...this.state, message: err.response.data.message })
      })
      .finally(() => {
        console.log('hello from finally')
        this.setState({ ...this.state, message: holdMessage, email: initialState.email })
      });
  }

  render() {

    const { className } = this.props
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">{this.getXYMessage()}</h3>
          <h3 id="steps">You moved {this.state.steps} {this.state.steps === 1 ? "time" : "times"}</h3>
        </div>
        <div id="grid">
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div key={idx} className={`square${idx === this.state.index ? ' active' : ''}`}>
                {idx === this.state.index ? 'B' : null}
              </div>
            ))
          }
        </div>
        <div className="info">
          <h3 id="message">{this.state.message}</h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={this.move}>LEFT</button>
          <button id="up" onClick={this.move}>UP</button>
          <button id="right" onClick={this.move}>RIGHT</button>
          <button id="down" onClick={this.move}>DOWN</button>
          <button id="reset" onClick={this.reset}>reset</button>
        </div>
        <form onSubmit={this.onSubmit}>
          <input id="email" type="email" placeholder="type email" onChange={this.onChange} value={this.state.email}></input>
          <input id="submit" type="submit"></input>
        </form>
      </div>
    )
  }
}
