const { IncomingWebhook } = require('@slack/webhook');

module.exports = (config) => {
	const url = config.slackWebhookUrl;

	const webhook = new IncomingWebhook(url, {
		icon_emoji: ':cactus:',
		username: 'Coinmate bot'
	});
	return {
		send: async (options) => {
			await webhook.send(options)
		}
	}
}
