import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextRequest, NextResponse } from 'next/server';
import { Database } from './types/types_db';
import { EUserType } from './types/user';
import { PATHS } from './lib/paths';

export async function middleware(req: NextRequest) {
	const res = NextResponse.next();
	const { pathname } = req.nextUrl;
	const supabase = createMiddlewareClient<Database>({ req, res });
	const {
		data: { session },
	} = await supabase.auth.getSession();

	const { data } = await await supabase
		.from('users')
		.select('*')
		.eq('id', session?.user.id as any)
		.single();

	if (!session) {
		return NextResponse.redirect(new URL('/', req.url));
	}

	if (
		data?.admin_role === EUserType.ADMIN_TICKETING &&
		[PATHS.ADMIN, PATHS['ADMIN_ACTION-BOOKING']].includes(pathname as PATHS)
	) {
		return res;
	}
	if (pathname.startsWith('/admin') && session.user.role !== 'service_role') {
		return NextResponse.redirect(new URL('/', req.url));
	}

	return res;
}

export const config = {
	matcher: [
		'/dashboard/:path*',
		'/admin/:path*',
		'/emails/:path*',
		'/api/((?!cron-job).*)',
	],
};
