#!/usr/bin/env node

const {
  measureClock,
  measureVolts,
  getMemory,
  measureTemp,
  getBootloaderVersion,
  getConfig
} = require('../lib')

if (require.main === module) {
  console.log(currentTxt())
  process.exit(0)
} else {
  module.exports = currentTxt
}

function currentTxt() {
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