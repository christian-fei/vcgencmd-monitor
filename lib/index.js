const cp = require('child_process')

module.exports = {
    measureClock,
    measureVolts,
    getConfig,
    getMemory,
    measureTemp,
    getBootloaderVersion
}
function measureClock(clock = 'arm') {
    return +cp.execSync(`vcgencmd measure_clock ${clock}`)
      .toString('utf8')
      .match(/\=(\d+)/)[1]
  }
  function measureVolts(id = 'core') {
    return cp.execSync(`vcgencmd measure_volts ${id}`)
      .toString('utf8')
      .match(/\=(.*)/)[1]
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
  