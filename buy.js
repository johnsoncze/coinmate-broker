const requestPromise = require('request-promise');
const crypto = require('crypto');

const config = require('./config')
const slack = require('./lib/slack')
const utils = require('./lib/utils')
const amountToBuy = process.argv[2];
if (!amountToBuy) {
	console.error('Specify amount to buy')
	process.exit(1)
}

const {clientId, publicKey, privateKey} = config.api;

const getSignature = (nonce) => {
	if (config.testing) return 'E4F27EAB0A836873CEE325A2526CC7476E2A3F2BE8026CADFB7A66B72D582DE8'
  const msg = `${nonce}${clientId}${publicKey}`;
  return crypto
    .createHmac('sha256', Buffer.from(privateKey, 'utf8'))
    .update(msg)
    .digest('hex')
    .toUpperCase();
};

const getTransaction = (orderId) => {
  const nonce = +new Date();
  return requestPromise({
    method: 'POST',
    url: `${config.api.baseUrl}/transactionHistory`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    json: true,
    body: `orderId=${orderId}&clientId=${clientId}&publicKey=${publicKey}&nonce=${nonce}&signature=${getSignature(nonce)}`
  });
};

const run = async () => {
	const nonce = +new Date();
	try {
		const { data: transactionId } = await requestPromise({
			method: 'POST',
			url: `${config.api.baseUrl}/buyInstant`,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			json: true,
			body: `total=${amountToBuy}&currencyPair=btc_czk&clientId=${clientId}&publicKey=${publicKey}&nonce=${nonce}&signature=${getSignature(nonce)}`
		});
		const { data: transactions } = await getTransaction(transactionId);
		console.log('(timestamp, price, amount, fee, spent)');
		await utils.asyncForEach(transactions, async (t) => {
			const spent = t.price * t.amount + t.fee;
			console.log(`(${new Date(t.timestamp)}, ${t.price}, ${t.amount}, ${t.fee}, ${spent})`);
			await slack.send({
				text: `I bought \`${t.amount}\` BTC for you. I spent \`${spent}\` CZK`
			})
		});
		console.log('done')
	} catch (error) {
		console.log(error)
		process.exit(1)
	}
	process.exit(0)
}

run()



