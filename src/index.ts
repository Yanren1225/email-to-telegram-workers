import PostalMime from 'postal-mime';
import { htmlToText } from 'html-to-text';

export default {
	async email(message, env, ctx): Promise<void> {
		const email = await PostalMime.parse(message.raw);

		// 为每封邮件生成唯一 ID
		const mailId = `#${crypto.randomUUID().toString().slice(2, 8)}`;

		const telegramMessage = `
${mailId}
From: ${email.from.address} (${email.from.name || 'No Name'})
To: ${email.to ? email.to.map(addr => addr.address).join(', ') : 'No To Address'}
Subject: ${email.subject}

${email.text ?? htmlToText(email.html ?? '')}
		`;

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

		// 发送附件到 Telegram
		if (email.attachments && email.attachments.length > 0) {
			for (const attachment of email.attachments) {
				const formData = new FormData();
				formData.append('chat_id', TELEGRAM_CHAT_ID);
				formData.append('caption', `${mailId}\n${attachment.filename || 'Attachment'}`);
				// Telegram 需要 Blob 或 File，这里用 Blob 包装
				const blob = new Blob([attachment.content], { type: attachment.mimeType || 'application/octet-stream' });
				formData.append('document', blob, attachment.filename || 'attachment');

				const docResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`, {
					method: 'POST',
					body: formData
				});
				if (!docResponse.ok) {
					console.error('Failed to send attachment to Telegram', await docResponse.text());
				} else {
					console.log('Attachment sent');
				}
			}
		}
		console.log(email);
		await message.forward(env.FORWARDING_EMAIL);
	}
} satisfies ExportedHandler<Env>;
