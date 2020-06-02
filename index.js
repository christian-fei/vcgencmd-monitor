const http = require('http')
const cp = require('child_process')

main()
  .catch(err => {
    console.error(err)
    process.exit(1)
  })

async function main() {
  const server = http.createServer((req, res) => {
    console.log('req ', req.url)
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(current());
  })

  console.log(current())

  server.listen(1234, '127.0.0.1', () => {
    console.log('listening on http://127.0.0.1:1234')
  })

  function current() {
    return `
# Clocks
arm clock ${measureClock('arm')}
core clock ${measureClock('core')}
h264 clock ${measureClock('h264')}
isp clock ${measureClock('isp')}
v3d clock ${measureClock('v3d')}
uart clock ${measureClock('uart')}
pwm clock ${measureClock('pwm')}
emmc clock ${measureClock('emmc')}
pixel clock ${measureClock('pixel')}
hdmi clock ${measureClock('hdmi')}
dpi clock ${measureClock('dpi')}

currentVolts ${getCurrentVolts()}
currentTemp ${getCurrentTemp()}
bootloader ${getBootloaderVersion()}
    `
  }
}

function measureClock(clock = 'arm') {
  return +cp.execSync(`vcgencmd measure_clock ${clock}`)
    .toString('utf8')
    .match(/\=(\d+)/)[1]
}
function getCurrentVolts() {
  return +cp.execSync('vcgencmd measure_volts')
    .toString('utf8')
    .match(/\=([\d+\.]+)/)[1]
}
function getCurrentTemp() {
  return cp.execSync('vcgencmd measure_temp')
    .toString('utf8')
    .match(/\=(.*)/)[1]
}
function getBootloaderVersion() {
  return cp.execSync('vcgencmd bootloader_version')
    .toString('utf8')
}
