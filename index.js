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

arm ${measureClock('arm')}
core ${measureClock('core')}
h264 ${measureClock('h264')}
isp ${measureClock('isp')}
v3d ${measureClock('v3d')}
uart ${measureClock('uart')}
pwm ${measureClock('pwm')}
emmc ${measureClock('emmc')}
pixel ${measureClock('pixel')}
hdmi ${measureClock('hdmi')}
dpi ${measureClock('dpi')}

# Volts

core ${measureVolts('core')}
sdram_c ${measureVolts('sdram_c')}
sdram_i ${measureVolts('sdram_i')}
sdram_p ${measureVolts('sdram_p')}

# Memory

arm ${getMemory('arm')}
gpu ${getMemory('gpu')}

# Temperature

${measureTemp()}

# Booloader

${getBootloaderVersion()}

# Config

${getConfig()}
    `
  }
}

function measureClock(clock = 'arm') {
  return +cp.execSync(`vcgencmd measure_clock ${clock}`)
    .toString('utf8')
    .match(/\=(\d+)/)[1]
}
function measureVolts(id = 'core') {
  return +cp.execSync(`vcgencmd measure_volts ${id}`)
    .toString('utf8')
    .match(/\=([\d+\.]+)/)[1]
}
function getConfig(type = 'int') {
  return cp.execSync(`vcgencmd get_config ${type}`)
    .toString('utf8')
}

function getMemory(type = 'arm') {
  return cp.execSync(`vcgencmd get_mem ${type}`)
    .toString('utf8')
    .match(/\=(.*)/)[1]
}

function measureTemp() {
  return cp.execSync('vcgencmd measure_temp')
    .toString('utf8')
    .match(/\=(.*)/)[1]
}
function getBootloaderVersion() {
  return cp.execSync('vcgencmd bootloader_version')
    .toString('utf8')
}
