var RpcClient = require('bitcoind-rpc')

var config = {
  protocol: 'http',
  user: 'gcoin',
  pass: 'abc123',
  host: 'oss1.diqi.us',
  port: '1126',
}

var rpc = new RpcClient(config)


function getRpc() {
  return new Promise(function(){
    rpc.getBlockchainInfo(function (err, ret) {
      if (err) {
        console.error(err)
        //return setTimeout(showNewTransactions, 10000)
      }
      else {
        console.log(ret.result)
      }
    })
  })
}

getRpc()