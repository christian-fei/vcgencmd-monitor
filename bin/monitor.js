#!/usr/bin/env node

const http = require('http')
const cp = require('child_process')

const {
  measureClock,
  measureVolts,
  getMemory,
  measureTemp,
  getBootloaderVersion,
  getConfig
} = require('../lib')

if (require.main === module) {
  monitor()
    .catch(err => {
      console.error(err)
      process.exit(1)
    })
} else {
  module.exports = monitor
}

async function monitor() {
  const server = http.createServer((req, res) => {
    console.log('req ', req.url)
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(currentHTML());
  })

  server.listen(1234, '127.0.0.1', () => {
    console.log('listening on http://127.0.0.1:1234')
  })
}



function currentHTML() {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>vcgencmd monitor</title>
    <link rel="stylesheet" href="https://unpkg.com/purecss@2.0.3/build/pure-min.css" integrity="sha384-cg6SkqEOCV1NbJoCu11+bm0NvBRc8IYLRGXkmNrqUBfTjmMYwNKPWBTIKyw9mHNJ" crossorigin="anonymous">
</head>
<body>
  <div class="pure-g">
    <div class="pure-u-1-3">
      <h1>Temperature</h1>
      <p>${measureTemp()}</p>

      <h1>Memory</h1>
      <table class="pure-table">
        <thead>
          <tr>
            <th>type</th>
            <th>MB</th>
          </tr>
        </thead>
        <tbody>
          ${['arm', 'gpu'].map(type => `
            <tr><td>${type}</td><td>${getMemory(type)}</td></tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div class="pure-u-1-3">
      <h1>Voltages</h1>
      <table class="pure-table">
        <thead>
          <tr>
            <th>id</th>
            <th>volts</th>
          </tr>
        </thead>
        <tbody>
          ${['core', 'sdram_c', 'sdram_i', 'sdram_p'].map(id => `
            <tr><td>${id}</td><td>${measureVolts(id)}</td></tr>
          `).join('')}
        </tbody>
      </table>
    </div>

    <div class="pure-u-1-3">
      <h1>Clocks</h1>
      <table class="pure-table">
        <thead>
          <tr>
            <th>name</th>
            <th>frequency</th>
          </tr>
        </thead>
        <tbody>
          ${['arm', 'core', 'h264', 'isp', 'v3d', 'uart', 'pwm', 'emmc', 'pixel', 'hdmi', 'dpi'].map(clock => `
            <tr><td>${clock}</td><td>${measureClock(clock)}</td></tr>
          `).filter(r => !r.includes('<td>0</td>')).join('')}
        </tbody>
      </table>
    </div>
  </div>

  <div class="pure-g">
    <div class="pure-u-1-2">
      <h1>Config</h1>
      <pre>${getConfig()}</pre>
    </div>

    <div class="pure-u-1-2">
      <h1>Bootloader</h1>
      <pre>${getBootloaderVersion()}</pre>
    </div>
  </div>

</body>
</html>
  `
}
