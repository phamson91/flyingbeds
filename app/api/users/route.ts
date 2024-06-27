import { Database } from '@/types/types_db';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

interface UpdateAgentData {
	email: string;
	password: string;
	companyName: string;
	phone: string;
	phonePrefix: string;
	creditLimit: number;
	adminRole: string;
	isAddNewUser: boolean;
	isNewPassword: boolean;
	userId?: string;
}

export async function POST(request: Request) {
	try {
		const supabase = createServerActionClient<Database>(
			{ cookies },
			{ supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY }
		);
		const body = await request.json();
		const {
			email,
			password,
			companyName,
			phone,
			creditLimit,
			phonePrefix,
			adminRole,
			isAddNewUser,
			isNewPassword,
			userId,
		}: UpdateAgentData = body;

		if (creditLimit < 0) {
			return new NextResponse(
				JSON.stringify({ error: 'Credit cannot be negative' }),
				{
					status: 400,
				}
			);
		}

		if (isAddNewUser) {
			const { error } = await supabase.auth.admin.createUser({
				email,
				email_confirm: true,
				password,
				phone: `${phonePrefix}${phone}`,
				phone_confirm: true,
				user_metadata: {
					companyName,
					creditLimit,
					adminRole,
				},
			});
			if (error) {
				return new NextResponse(JSON.stringify({ error: error.message }), {
					status: error.status,
				});
			}
		} else {
			const { error } = isNewPassword
				? await supabase.auth.admin.updateUserById(userId!, {
						email,
						email_confirm: true,
						password,
						phone: `${phonePrefix}${phone}`,
						phone_confirm: true,
				  })
				: await supabase.auth.admin.updateUserById(userId!, {
						email,
						email_confirm: true,
						phone: `${phonePrefix}${phone}`,
						phone_confirm: true,
				  });

			if (error) {
				return new NextResponse(JSON.stringify({ error: error.message }), {
					status: error.status,
				});
			}

			await supabase
				.from('users')
				.update({
					company_name: companyName,
					max_credit: creditLimit,
					admin_role: adminRole,
				})
				.eq('id', userId!);
		}

		return new NextResponse(
			JSON.stringify({
				message: isAddNewUser ? 'User created' : 'User updated',
			}),
			{
				status: 201,
			}
		);
	} catch (error: any) {
		return new NextResponse(JSON.stringify({ error: error.message }), {
			status: error.status,
		});
	}
}
