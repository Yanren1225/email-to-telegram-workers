import PostalMime from 'postal-mime';
import { htmlToText } from 'html-to-text';

export default {
	async email(message, env, ctx): Promise<void> {
		// const parse = new PostalMime.default();
		// const rawEmail = new Response(message.raw);

		const email = await PostalMime.parse(message.raw);

		const telegramMessage = `
From: ${email.from.address} (${email.from.name || 'No Name'})
To: ${email.to ? email.to.map(addr => addr.address).join(', ') : 'No To Address'}
Subject: ${email.subject}

${htmlToText(email.html ?? '')}
		`;

		console.log('Telegram message:', telegramMessage);

		const TELEGRAM_BOT_TOKEN = env.BOT_TOKEN;
		const TELEGRAM_CHAT_ID = env.CHAT_ID;

		const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

		const body = JSON.stringify({
			chat_id: TELEGRAM_CHAT_ID,
			text: telegramMessage,
			// parse_mode: 'Markdown'
		});

		const response = await fetch(telegramUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: body
		});

		if (!response.ok) {
			console.error('Failed to send message to Telegram', await response.text());
		} else {
			console.log('ok');
		}
		console.log(email);
		await message.forward(env.FORWARDING_EMAIL);
	}
} satisfies ExportedHandler<Env>;
