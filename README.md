# rtc-web-term <span class="badge-patreon"><a href="https://patreon.com/roccomuso" title="Donate to this project using Patreon"><img src="https://img.shields.io/badge/patreon-donate-yellow.svg" alt="Patreon donate button" /></a></span>

Cool Web-RTC web-terminal that works well with the [rtc-shell](https://github.com/roccomuso/rtc-shell) utility to enstablish a P2P connection.

![img](demo.png)

## How this works

An "offer" will be generated by the initiator (rtc-shell). Paste this into the web-terminal hit enter.
The web-terminal generates an "answer". Paste this into the initiator's form and hit enter.

Now you have a direct P2P connection between the shell and the browser web-page!

## Enhancement

In a real-world application, you would never do this.
A "signaling server" (usually implemented with websockets) would be used to exchange signaling data between the two browsers until a peer-to-peer connection is established.
Avoiding a manual handshake.

## Author

Rocco Musolino ([@roccomuso](https://twitter.com/roccomuso))
