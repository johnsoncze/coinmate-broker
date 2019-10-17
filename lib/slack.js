const { IncomingWebhook } = require('@slack/webhook');
const config = require('../config')
const url = config.slackWebhookUrl;

const webhook = new IncomingWebhook(url, {
	icon_emoji: ':cactus:',
	username: 'Coinmate bot'
});

module.exports = {
	send: async (options) => {
		await webhook.send(options)
	}
}
