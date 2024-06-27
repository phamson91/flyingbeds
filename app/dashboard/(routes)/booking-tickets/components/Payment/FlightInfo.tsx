import React from 'react';
import FlightDetail from '../PnrReview/FlightDetail';
import ContactDetail from '../PnrReview/ContactDetail';
import Passengers from '../PnrReview/Passengers';
import { ILocation } from '@/types/types';

interface Props {
	locations: ILocation[];
}

const FlightInfo = () => {
	return (
		<div className="w-full bg-white rounded-lg p-4 grid grid-rows-3 gap-y-2">
			{/* <FlightDetail />
			<ContactDetail />
			<Passengers /> */}
		</div>
	);
};

export default FlightInfo;
