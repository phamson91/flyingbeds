import soapRequest from 'easy-soap-request';
import { parseStringPromise } from 'xml2js';

async function makeRequest(soapAction: string, xml: string) {
	const url = `${process.env.WURI}/${process.env.WSAP}`;
	const sampleHeaders = {
		'Content-Type': 'text/xml; charset=utf-8',
		'SOAPAction': soapAction,
	};

	const { response } = await soapRequest({
		url: url,
		headers: sampleHeaders,
		xml: xml,
		timeout: 10000,
	});
	const { headers, body, statusCode } = response;

	// console.log('HEADERS: ' + headers);
	// console.log('BODY: ' + body);
	// console.log('STATUS CODE: ' + statusCode);

	const result = await parseStringPromise(body);

	const session =
		result['soapenv:Envelope']['soapenv:Header'][0]['awsse:Session'][0];
	const newSessionId = session['awsse:SessionId'][0];
	const newSequenceNumber = session['awsse:SequenceNumber'][0];
	const newSecurityToken = session['awsse:SecurityToken'][0];
	// process.env.SessionId = sessionId;
	// process.env.SequenceNumber = sequenceNumber;
	// process.env.SecurityToken = securityToken;
	const resultBody = result['soapenv:Envelope']['soapenv:Body'][0];
	return { resultBody, newSessionId, newSequenceNumber, newSecurityToken };
}

export default makeRequest;
