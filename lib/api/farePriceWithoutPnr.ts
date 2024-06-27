import makeRequest from '../makeRequest';
import { IFarePriceWithoutPnr } from '@/types/bookingTicket';

function farePriceWithoutPnr({
	sessionId,
	sequenceNumber,
	securityToken,
	orgDesDetail,
	passengers,
}: IFarePriceWithoutPnr) {
	const xml = `
	<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:sec="http://xml.amadeus.com/2010/06/Security_v1" xmlns:link="http://wsdl.amadeus.com/2010/06/ws/Link_v1" xmlns:ses="http://xml.amadeus.com/2010/06/Session_v3">	
    <soap:Header xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <awsse:Session xmlns:awsse="http://xml.amadeus.com/2010/06/Session_v3" TransactionStatusCode="InSeries">
            <awsse:SessionId>${sessionId}</awsse:SessionId>
            <awsse:SequenceNumber>${sequenceNumber}</awsse:SequenceNumber>
            <awsse:SecurityToken>${securityToken}</awsse:SecurityToken>
        </awsse:Session>
        <add:MessageID xmlns:add="http://www.w3.org/2005/08/addressing">37344760-40e1-d0a4-4882-735044391cd8</add:MessageID>
        <add:Action xmlns:add="http://www.w3.org/2005/08/addressing">http://webservices.amadeus.com/TIPNRQ_18_1_1A</add:Action>
        <add:To xmlns:add="http://www.w3.org/2005/08/addressing">${
					process.env.WURI
				}/${process.env.WSAP}</add:To>
        <link:TransactionFlowLink xmlns:link="http://wsdl.amadeus.com/2010/06/ws/Link_v1">
            <link:Consumer>
                <link:UniqueID>oef5izfzuaawy3ergzk5005h</link:UniqueID>
            </link:Consumer>
        </link:TransactionFlowLink>
    </soap:Header>
    <soapenv:Body>
        <Fare_InformativePricingWithoutPNR>
						${passengers
							.map(
								(key, index) => `
						 <passengersGroup>
                <segmentRepetitionControl>
                    <segmentControlDetails>
                        <quantity>${
													key === 'ADT' ? 1 : key === 'CHD' ? 3 : 2
												}</quantity>
                        <numberOfUnits>1</numberOfUnits>
                    </segmentControlDetails>
                </segmentRepetitionControl>
                <travellersID>
                    <travellerDetails>
                        <measurementValue>${
													key === 'INF' ? 1 : index + 1
												}</measurementValue>
                    </travellerDetails>
                </travellersID>
								${
									['INF', 'CHD'].includes(key)
										? `<discountPtc>
										<valueQualifier>${key === 'CHD' ? 'CH' : 'INF'}</valueQualifier>
										${
											key === 'INF'
												? `<fareDetails>
												<qualifier>766</qualifier>
											</fareDetails>`
												: ''
										}
									</discountPtc>`
										: ''
								}
            </passengersGroup>
						`
							)
							.join('')}
							${orgDesDetail.map(
								(detail) => `
								<segmentGroup>
										<segmentInformation>
												<flightDate>
														<departureDate>${detail.depDate}</departureDate>
														<arrivalDate>${detail.arrivalDate}</arrivalDate>
												</flightDate>
												<boardPointDetails>
														<trueLocationId>${detail.origin}</trueLocationId>
												</boardPointDetails>
												<offpointDetails>
														<trueLocationId>${detail.destination}</trueLocationId>
												</offpointDetails>
												<companyDetails>
														<marketingCompany>${detail.airlineCompany}</marketingCompany>
														<operatingCompany>${detail.airlineCompany}</operatingCompany>
												</companyDetails>
												<flightIdentification>
														<flightNumber>${detail.flightIdentifier}</flightNumber>
														<bookingClass>${detail.classOfService}</bookingClass>
												</flightIdentification>
												<flightTypeDetails>
														<flightIndicator>ZZZ</flightIndicator>
												</flightTypeDetails>
										</segmentInformation>
								</segmentGroup>`
							).join('')}
            <pricingOptionGroup>
                <pricingOptionKey>
                    <pricingOptionKey>RU</pricingOptionKey>
                </pricingOptionKey>
            </pricingOptionGroup>
        </Fare_InformativePricingWithoutPNR>
    </soapenv:Body>
	</soapenv:Envelope>
	`;


	const soapAction = 'http://webservices.amadeus.com/TIPNRQ_18_1_1A';
	return makeRequest(soapAction, xml);
}

export default farePriceWithoutPnr;
