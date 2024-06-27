import makeRequest from '../makeRequest';
import { IOrgDesDetails, ITravellerInfo } from '@/types/bookingTicket';

interface IProps {
	sessionId: string;
	sequenceNumber: string;
	securityToken: string;
	travellerInfo: ITravellerInfo[];
	orgDesDetails: IOrgDesDetails[];
}

function pnrAddMultiElements({
	sessionId,
	sequenceNumber,
	securityToken,
	travellerInfo,
	orgDesDetails,
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
        <PNR_AddMultiElements>
            <pnrActions>
                <optionCode>11</optionCode>
            </pnrActions>
						${travellerInfo.reverse()
							.map(
								(item: ITravellerInfo, index: number) => `
						<travellerInfo>
							<elementManagementPassenger>
									<reference>
											<qualifier>OT</qualifier>
											<number>1</number>
									</reference>
									<segmentName>NM</segmentName>
							</elementManagementPassenger>
							<passengerData>
									<travellerInformation>
											<traveller>
													<surname>${item.surname}</surname>
													<quantity>1</quantity>
											</traveller>
											<passenger>
													<firstName>${item.firstName}</firstName>
													<type>${item.passengerType}</type>
											</passenger>
									</travellerInformation>
							</passengerData>
						</travellerInfo>`
							)
							.join('\n')}
						${orgDesDetails
							.map(
								(item: IOrgDesDetails) => `
						<originDestinationDetails>
							<originDestination>
									<origin>${item.origin}</origin>
									<destination>${item.destination}</destination>
							</originDestination>
							<itineraryInfo>
									<elementManagementItinerary>
											<segmentName>AIR</segmentName>
									</elementManagementItinerary>
									<airAuxItinerary>
											<travelProduct>
													<product>
															<depDate>${item.depDate}</depDate>
													</product>
													<boardpointDetail>
															<cityCode>${item.origin}</cityCode>
													</boardpointDetail>
													<offpointDetail>
															<cityCode>${item.destination}</cityCode>
													</offpointDetail>
													<company>
															<identification>${item.airlineCompany}</identification>
													</company>
													<productDetails>
															<identification>${item.flightIdentifier}</identification>
															<classOfService>${item.classOfService}</classOfService>
													</productDetails>
											</travelProduct>
											<messageAction>
													<business>
															<function>1</function>
													</business>
											</messageAction>
											<relatedProduct>
													<quantity>${travellerInfo.length}</quantity>
													<status>NN</status>
											</relatedProduct>
									</airAuxItinerary>
							</itineraryInfo>
						</originDestinationDetails>`
							)
							.join('\n')}
            <dataElementsMaster>
                <marker1/>
                <dataElementsIndiv>
                    <elementManagementData>
                        <reference>
                            <qualifier>OT</qualifier>
                            <number>1</number>
                        </reference>
                        <segmentName>AP</segmentName>
                    </elementManagementData>
                    <freetextData>
                        <freetextDetail>
                            <subjectQualifier>3</subjectQualifier>
                            <type>7</type>
                        </freetextDetail>
                        <longFreetext>+1234567/en/18</longFreetext>
                    </freetextData>
                </dataElementsIndiv>
                <dataElementsIndiv>
                    <elementManagementData>
                        <reference>
                            <qualifier>OT</qualifier>
                            <number>2</number>
                        </reference>
                        <segmentName>AP</segmentName>
                    </elementManagementData>
                    <freetextData>
                        <freetextDetail>
                            <subjectQualifier>3</subjectQualifier>
                            <type>P02</type>
                        </freetextDetail>
                        <longFreetext>trinhanhhuy@gmail.com</longFreetext>
                    </freetextData>
                </dataElementsIndiv>
                <dataElementsIndiv>
                    <elementManagementData>
                        <reference>
                            <qualifier>OT</qualifier>
                            <number>3</number>
                        </reference>
                        <segmentName>RM</segmentName>
                    </elementManagementData>
                    <miscellaneousRemark>
                        <remarks>
                            <type>RM</type>
                            <freetext>TDPRESERVATION A000028000</freetext>
                        </remarks>
                    </miscellaneousRemark>
                </dataElementsIndiv>
                <dataElementsIndiv>
                    <elementManagementData>
                        <reference>
                            <qualifier>OT</qualifier>
                            <number>4</number>
                        </reference>
                        <segmentName>RF</segmentName>
                    </elementManagementData>
                    <freetextData>
                        <freetextDetail>
                            <subjectQualifier>3</subjectQualifier>
                            <type>P22</type>
                        </freetextDetail>
                        <longFreetext>booking</longFreetext>
                    </freetextData>
                </dataElementsIndiv>
                <dataElementsIndiv>
                    <elementManagementData>
                        <reference>
                            <qualifier>OT</qualifier>
                            <number>5</number>
                        </reference>
                        <segmentName>TK</segmentName>
                    </elementManagementData>
                    <ticketElement>
                        <ticket>
                            <indicator>OK</indicator>
                        </ticket>
                    </ticketElement>
                </dataElementsIndiv>
                <dataElementsIndiv>
                    <elementManagementData>
                        <segmentName>RF</segmentName>
                    </elementManagementData>
                    <freetextData>
                        <freetextDetail>
                            <subjectQualifier>3</subjectQualifier>
                            <type>P22</type>
                        </freetextDetail>
                        <longFreetext>booking for QH</longFreetext>
                    </freetextData>
                </dataElementsIndiv>
            </dataElementsMaster>
        </PNR_AddMultiElements>
    </soapenv:Body>
	</soapenv:Envelope>
	`;

	const soapAction = 'http://webservices.amadeus.com/PNRADD_21_1_1A';
	return makeRequest(soapAction, xml);
}

export default pnrAddMultiElements;
