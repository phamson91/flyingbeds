import makeRequest from '../makeRequest';

interface IProps {
	sessionId: string;
	sequenceNumber: string;
	securityToken: string;
}

function ignoreMultiAvailability({
	sessionId,
	sequenceNumber,
	securityToken,
}: IProps) {
	const xml = `
		<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sec="http://xml.amadeus.com/2010/06/Security_v1" xmlns:link="http://wsdl.amadeus.com/2010/06/ws/Link_v1" xmlns:ses="http://xml.amadeus.com/2010/06/Session_v3">
			<soap:Header xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
				<awsse:Session xmlns:awsse="http://xml.amadeus.com/2010/06/Session_v3" TransactionStatusCode="InSeries">
					<awsse:SessionId>${sessionId}</awsse:SessionId>
					<awsse:SequenceNumber>${sequenceNumber}</awsse:SequenceNumber>
					<awsse:SecurityToken>${securityToken}</awsse:SecurityToken>
				</awsse:Session>
				<add:MessageID xmlns:add="http://www.w3.org/2005/08/addressing">37344760-40e1-d0a4-4882-735044391cd8</add:MessageID>
				<add:Action xmlns:add="http://www.w3.org/2005/08/addressing">http://webservices.amadeus.com/PNRADD_21_1_1A</add:Action>
				<add:To xmlns:add="http://www.w3.org/2005/08/addressing">${process.env.WURI}/${process.env.WSAP}</add:To>
				<link:TransactionFlowLink xmlns:link="http://wsdl.amadeus.com/2010/06/ws/Link_v1">
					<link:Consumer>
						<link:UniqueID>oef5izfzuaawy3ergzk5005h</link:UniqueID>
					</link:Consumer>
				</link:TransactionFlowLink>
			</soap:Header>
			<soapenv:Body>
				<PNR_AddMultiElements>
					<pnrActions>
						<optionCode>20</optionCode>
					</pnrActions>
				</PNR_AddMultiElements>
			</soapenv:Body>
		</soapenv:Envelope>
	`;

	const soapAction = 'http://webservices.amadeus.com/PNRADD_21_1_1A';

	return makeRequest(soapAction, xml);
}

export default ignoreMultiAvailability;
