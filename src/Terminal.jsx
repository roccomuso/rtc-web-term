import React, {Component} from 'react'
import {Scrollbars} from 'react-custom-scrollbars'
import SimplePeer from 'simple-peer'
import {Buffer} from 'buffer/'
import './App.css'

class Terminal extends Component {

  constructor(props) {
    super(props)
    this.state = {
      commands: {},
      history: [],
      prompt: '$ '
    }
  }

  clearHistory() {
    this.setState({history: []});
  }

  registerCommands() {
    this.setState({
      commands: {
        'signal': this.setSignal,
        'intro': this.showWelcomeMsg,
        'help': this.showHelp,
        'github': this.openLink('https://github.com/roccomuso'),
        'source': this.openLink('https://github.com/roccomuso/react-web-terminal'),
        'clear': this.clearHistory
      }
    });
  }

  setSignal(data) {
    var self = this
    var intro = /^{/.test(data)
        ? JSON.parse(data)
        : JSON.parse(atob(data))

    this.peer.signal(intro)
    this.peer.once('signal', function (data) {
      self.printOutput(['Copy and Paste this to the initiator:', btoa(JSON.stringify(data))])
    })
    this.peer.once('connect', function(){
      self.printOutput('Connected!')
    })
    this.peer.on('data', function(data){ // Uint8Array
      var buffer = Buffer.from(data)
      self.printOutput(buffer.toString())
    })
    this.peer.once('error', function(err){
      self.printOutput(err)
    })
    this.peer.once('close', function(){
      self.printOutput('Connection closed!')
    })
  }

  showWelcomeMsg() {
    this.printOutput("Hello, this web-terminal lets you take control of a remote device through web-RTC.");
    this.printOutput("Type `@help` to see how this works. Internal commands starts with a `@`.");
  }

  openLink(link) {
    return function() {
      window.open(link, '_blank');
    }
  }

  showHelp() {
    this.printOutput([
      "To start using this web-shell do the manual RTC handshake.",
      "Paste here the webRTC base64 introducer generated from your rtc-shell tool.",
      "Then press enter and do the same with the generated one on this page.",
      "Available internal commands:",
      "@signal - Paste the initiator's web-RTC signal",
      "@intro - show the welcome message",
      "@help - show this cruft",
      "@github - open the author github account",
      "@source - see the source codes",
      "@clear - clear the terminal history"
    ])
  }

  componentDidMount() {
    var term = this.term
    this.peer = new SimplePeer()

    this.registerCommands();
    this.showWelcomeMsg();
    term.focus();
  }

  componentDidUpdate() {
    this.scrollBar.scrollToBottom()
  }

  handleInput(e) {
    if (e.key === "Enter") {
      var input = this.term.value;
      this.printOutput(this.state.prompt + " " + input);

      if (input.indexOf('@') === 0) {
        // internal cmd
        input = input.slice(1).split(' ')
        var cmd = input[0]
        var arg = input[1]
        var command = this.state.commands[cmd];
        if (!command) this.printOutput("sh: command not found: " + cmd);
        else
        command.call(this, arg);
      } else {
        this.sendCmd(input + '\n');
      }

      this.clearInput();
    }
  }

  sendCmd (cmd) {
    // webRTC send cmd.
    if (this.peer && this.peer.connected) this.peer.send(Buffer.from(cmd))
    else {
      this.printOutput('Client is disconnected!')
    }
  }

  clearInput() {
    this.term.value = "";
  }

  printOutput(output) {
    var history = this.state.history;
    if (Array.isArray(output)) {
      history = history.concat(output)
    } else {
      history.push(output)
    }

    this.setState({'history': history})
  }

  handleClick() {
    var term = this.term
    term.focus()
  }

  render() {
    var output = this.state.history.map(function(op, i) {
      return <p key={i}>{op}</p>
    })

    return (
      <Scrollbars style={{ width: 715 }} autoHeight autoHeightMin={100} autoHeightMax={400} ref={elem => this.scrollBar = elem} autoHide autoHideTimeout={1000} autoHideDuration={200}>
        <div id="content">
          <div className='input-area' onClick={this.handleClick.bind(this)}>
            {output}
            <p>
              <span className="prompt">{this.state.prompt}</span>
              <input type="text" onKeyPress={this.handleInput.bind(this)} ref={elem => this.term = elem}/>
            </p>
          </div>
        </div>
      </Scrollbars>
    )
  }

}

export default Terminal
