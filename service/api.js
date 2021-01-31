const requestPromise = require('request-promise');

module.exports = (config) => {

	const {baseUrl} = config.investApi;

	const saveTransaction = async (total, amount, date, currency) => {
		const nonce = +new Date();
		const { data: order } = await requestPromise({
			method: 'POST',
			url: `${baseUrl}/orders`,
			headers: {
				'Content-Type': 'application/json'
			},
			json: true,
			body: {
				total,
				amount,
				date,
				currency
			}
		});
		return order;
	};

	return {
		saveTransaction,
	}
}

