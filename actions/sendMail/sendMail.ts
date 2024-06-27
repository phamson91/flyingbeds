import { ReqParamsSendMail } from '@/types/sendEmail';

// Send mail request ticket to admin
export const sendMailNotice = async (params: ReqParamsSendMail) =>
	fetch('/api/send-mail/', {
		method: 'POST',
		body: JSON.stringify(params),
		headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
	}).then((res) => {
		console.log('res:', res);
		if (!res.ok) throw new Error(res.statusText);
		return res.json();
	});