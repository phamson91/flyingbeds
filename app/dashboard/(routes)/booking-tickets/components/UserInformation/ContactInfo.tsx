/* eslint-disable react-hooks/exhaustive-deps */
'use client';
import Input from '@/components/Input/Input';
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import React from 'react';

interface Props {
	form: any;
}

const ContactInfo: React.FC<Props> = ({ form }) => {
	return (
		<>
			<div className="w-full flex gap-2">
				<FormField
					control={form.control}
					name="contactInfo.fullName"
					render={({ field }) => (
						<FormItem className="w-1/2">
							<FormLabel>Full name</FormLabel>
							<FormControl>
								<Input
									placeholder="Please enter your Full name"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="contactInfo.email"
					render={({ field }) => (
						<FormItem className="w-1/2">
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input
									placeholder="Please enter your Email"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>
			<div className="w-full flex gap-2">
				<FormField
					control={form.control}
					name="contactInfo.region"
					render={({ field }) => (
						<FormItem className="w-[200px]">
							<FormLabel>Region</FormLabel>
							<FormControl>
								<Input
									placeholder="+84"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="contactInfo.phoneNumber"
					render={({ field }) => (
						<FormItem className="w-full">
							<FormLabel>Phone number</FormLabel>
							<FormControl>
								<Input
									placeholder="987654321"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>
		</>
	);
};

export default ContactInfo;
