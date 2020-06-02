const list = require('./bin/list')
const monitor = require('./bin/monitor')

main()
  .catch(err => {
    console.error(err)
    process.exit(1)
  })

async function main() {
  console.log(list())

  monitor()
}
