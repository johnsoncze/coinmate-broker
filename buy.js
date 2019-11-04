const config = require('./config')
const slack = require('./service/slack')(config)
const utils = require('./lib/utils')
const coinmate = require('./service/coinmate')(config)
const logger = require('./service/logger')

const amountToBuy = process.argv[2];
if (!amountToBuy) {
	logger('Specify amount to buy')
	process.exit(1)
}

(async () => {
	try {
		const transactionId = await coinmate.buy(amountToBuy)
		const transactions = await coinmate.getTransactions(transactionId);
		logger('(timestamp, price, amount, fee, spent)');
		await utils.asyncForEach(transactions, async (t) => {
			const spent = t.price * t.amount + t.fee;
			logger(`(${new Date(t.timestamp)}, ${t.price}, ${t.amount}, ${t.fee}, ${spent})`);
			await slack.send({
				text: `I bought \`${t.amount}\` BTC for you. I spent \`${spent}\` CZK`
			})
		});
		logger('done')
	} catch (error) {
		logger(error)
		process.exit(1)
	}
	process.exit(0)
})()
