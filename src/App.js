import React, {Component} from 'react'
import Terminal from './Terminal.jsx'
import './App.css'

class App extends Component {

  render() {
    return (
      <div>
        <div id="bar" className='container'>
          <svg height="30" width="100">
            <circle cx="24" cy="19" r="6" fill="#bf616a"/>
            <circle cx="44" cy="19" r="6" fill="#ebcb8b"/>
            <circle cx="64" cy="19" r="6" fill="#a3be8c"/>
          </svg>
        </div>
        <div className="container" id="main">
          <div className="holder">
            <Terminal/>
          </div>
        </div>
      </div>
    )
  }
}

export default App
