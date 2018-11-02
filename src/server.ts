if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load();
}

console.log('starting...');

const cron = require('node-cron');
const axios = require('axios');
const Eos = require('eosjs');

const eosJS = Eos({
  keyProvider: process.env.PRIVATE_KEY,
  httpEndpoint: process.env.ENDPOINT,
  chainId: process.env.CHAIN_ID
});

cron.schedule('*/5 * * * *', () => {
  axios
    .get('https://api.bitfinex.com/v2/ticker/' + process.env.PAIR)
    .then((response: any) => {
      const pair = parseFloat(response.data[6]).toFixed(4);
      console.log(pair);
      eosJS.transaction({
        actions: [
          {
            account: process.env.NEBULA_ACCOUNT,
            authorization: [
              { actor: process.env.ACCOUNT, permission: process.env.PERMISSION }
            ],
            data: {
              account: process.env.ACCOUNT,
              base: process.env.BASE,
              quote: pair + ' ' + process.env.QUOTE,
              exchange: process.env.EXCHANGE,
              volume: 0,
              timeframe: 300
            },
            name: 'addquote'
          }
        ]
      }).catch((error: any) => {
        console.error(error);
      })
    });
});
