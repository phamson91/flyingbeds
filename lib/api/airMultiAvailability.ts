import makeRequest from '../makeRequest';
import getReqVar from '../getReqVar';

interface IProps {
	departure: string;
	arrival: string;
	departureDate: string;
	countTicket: string;
	airlineCode: string[];
}

function airMultiAvailability({
	departure,
	arrival,
	departureDate,
	countTicket,
	airlineCode,
}: IProps) {
	const { saltedLssPass, nonceBase64, timestamp } = getReqVar();

	const xml = `
		<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sec="http://xml.amadeus.com/2010/06/Security_v1" xmlns:link="http://wsdl.amadeus.com/2010/06/ws/Link_v1" xmlns:ses="http://xml.amadeus.com/2010/06/Session_v3">
			<soapenv:Header xmlns:wsa="http://www.w3.org/2005/08/addressing" xmlns:typ="http://xml.amadeus.com/2010/06/Types_v1" xmlns:iat="http://www.iata.org/IATA/2007/00/IATA2010.1">
					<sec:AMA_SecurityHostedUser>
							<sec:UserID POS_Type="1" RequestorType="U" PseudoCityCode="${
								process.env.LSSOfficeId
							}" AgentDutyCode="SU">
									<typ:RequestorID>
											<iat:CompanyName>${process.env.LSSOrg}</iat:CompanyName>
									</typ:RequestorID>
							</sec:UserID>
					</sec:AMA_SecurityHostedUser>
					<wsse:Security xmlns:wsse="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd" xmlns:wsu="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd">
							<wsse:UsernameToken>
									<wsse:Username>${process.env.LSSUser}</wsse:Username>
									<wsse:Password Type="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordDigest">${saltedLssPass}</wsse:Password>
									<wsse:Nonce EncodingType="http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-soap-message-security-1.0#Base64Binary">${nonceBase64}</wsse:Nonce>
									<wsu:Created>${timestamp}</wsu:Created>
							</wsse:UsernameToken>
					</wsse:Security>
					<wsa:To>${process.env.WURI}/${process.env.WSAP}</wsa:To>
					<wsa:Action>http://webservices.amadeus.com/SATRQT_19_1_1A</wsa:Action>
					<wsa:MessageID>urn:uuid:e88e9b9d-7a0f-46e0-8f01-e0cf6325cb67</wsa:MessageID>
					<link:TransactionFlowLink>
							<link:Consumer>
									<link:UniqueID>oef5izfzuaawy3ergzk5005h</link:UniqueID>
							</link:Consumer>
					</link:TransactionFlowLink>
					<ses:Session TransactionStatusCode="Start">
					</ses:Session>
			</soapenv:Header>
			<soapenv:Body>
					<Air_MultiAvailability>
							<messageActionDetails>
									<functionDetails>
											<businessFunction>1</businessFunction>
											<actionCode>44</actionCode>
									</functionDetails>
							</messageActionDetails>
							<requestSection>
									<availabilityProductInfo>
											<availabilityDetails>
													<departureDate>${departureDate}</departureDate>
											</availabilityDetails>
											<departureLocationInfo>
													<cityAirport>${departure}</cityAirport>
											</departureLocationInfo>
											<arrivalLocationInfo>
													<cityAirport>${arrival}</cityAirport>
											</arrivalLocationInfo>
									</availabilityProductInfo>
									<numberOfSeatsInfo>
											<numberOfPassengers>${countTicket}</numberOfPassengers>
									</numberOfSeatsInfo>
									<airlineOrFlightOption>
										${airlineCode
											.map(
												(item: any, index: number) => `
												<flightIdentification>
														<airlineCode>${item}</airlineCode>
												</flightIdentification>
												`
											)
											.join('\n')}
									</airlineOrFlightOption>
									<availabilityOptions>
											<typeOfRequest>TN</typeOfRequest>
											<optionInfo>
                        <option>FLO</option>
                        <optionInformation>ON</optionInformation>
                    </optionInfo>
									</availabilityOptions>
							</requestSection>
					</Air_MultiAvailability>
			</soapenv:Body>
		</soapenv:Envelope>
	`;
	const soapAction = 'http://webservices.amadeus.com/SATRQT_19_1_1A';

	return makeRequest(soapAction, xml);
}

export default airMultiAvailability;
