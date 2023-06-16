const nodemailer = require('nodemailer');
import config from 'config';
import logger from '../utils/logger';
import { Transporter } from 'nodemailer';

const smtpConfig = config.get<{ host: string; port: number }>('smtp');

export default async function sendMail(
	mailTo: string,
	subject: string,
	content: string
): Promise<boolean> {
	return new Promise((resolve, reject) => {
		try {
			let transporter: Transporter = nodemailer.createTransport({
				host: smtpConfig.host,
				pool: true,
				secure: false,
				port: smtpConfig.port,
				tls: {
					rejectUnauthorized: false,
				},
			});

			const mailOptions = {
				from: 'Kart Basım <kartbasimapp@bilesim.net.tr>',
				to: process.env.NODE_ENV?.trim() === 'dev' ? 'salih.ayazdir@bilesim.net.tr' : mailTo,
				subject,
				html: `<div>${content}<br/><div>bileşim kart basım</div></div>`,
			};

			transporter.sendMail(mailOptions, (err, info) => {
				if (err) {
					logger.error(err);
					reject(false);
				} else {
					logger.info(info);
					resolve(true);
				}
				transporter.close();
			});
			return {
				success: true,
				info: mailOptions,
			};
		} catch (err) {
			logger.error(err);
			return {
				success: false,
				info: err,
			};
		}
	});
}
