require('dotenv').config()
module.exports = {
	api: {
		publicKey: process.env.PUBLIC_KEY,
		privateKey: process.env.PRIVATE_KEY,
		clientId: process.env.CLIENT_ID,
		baseUrl: process.env.API_BASE_URL,
	},
	investApi: {
		baseUrl: process.env.INVEST_API_BASE_URL,
	},
	testing: process.env.TESTING,
	slackWebhookUrl: process.env.SLACK_WEBHOOK_URL,
	buyDay: parseInt(process.env.BUY_DAY),
	buyHour: parseInt(process.env.BUY_HOUR),
}
