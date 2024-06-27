import * as postgres from 'https://deno.land/x/postgres@v0.14.2/mod.ts';
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import {
	SupabaseClient,
	createClient,
} from 'https://esm.sh/@supabase/supabase-js@2.31.0';
// import { Database } from '../../../types/types_db.ts';
import { Database } from '@/types/types_db.js'

interface IUsersStatement {
	user_id: string;
	initial_balance: number;
	ending_balance: number;
	start_date: string;
	end_date: string;
}

interface IUserTransactions {
	receiver_user: string;
}

interface IUsers {
	id: string;
	balance: number;
}

// Get the connection string from the environment variable "SUPABASE_DB_URL"
const databaseUrl = Deno.env.get('SUPABASE_DB_URL')!;

// Create a database pool with three connections that are lazily established
const pool = new postgres.Pool(databaseUrl, 10, true);

/**
 * Get the last statement end date from the Supabase database.
 */
async function getLastStatementEndDate(connection: postgres.PoolClient) {
	const result = await connection.queryObject<{
		end_date: string;
	}>`SELECT end_date FROM statements ORDER BY end_date DESC LIMIT 1`;
	const data = result.rows;

	if (data && data.length > 0) return data[0].end_date;
	return null;
}

/**
 * The start date is set to 00:00, 7 days ago, and the end date is set to 23:55, today.
 * @returns An object containing the start and end dates of the current statement week.
 * NOTE: 00:00 and 23:55 are in the Australia/Sydney timezone.
 */
function getStatementWeekRange(lastStatementEndDate: Date | string | null) {
	let startDate;
	if (lastStatementEndDate) {
		const dateInUTC = new Date(lastStatementEndDate);
		//Sets the start date to 00:00 in the Australia/Sydney timezone
		//00:00 - 10 giờ = 14:00 as DB timezone in UTC same day
		startDate = new Date(dateInUTC.setUTCHours(14, 0, 0, 0));
	} else {
		// startDate = utcToZonedTime(new Date(), 'Australia/Sydney');
		const dateInUTC = new Date();
		//Sets the start date to 00:00 in the Australia/Sydney timezone, 6 days ago.
		//00:00 - 10 giờ = 14:00 as DB timezone in UTC same day
		dateInUTC.setUTCHours(14, 0, 0, 0);

		//minus extra 1 day because 00h Australia/Sydney is 14h UTC previous day
		startDate = new Date(dateInUTC.setDate(dateInUTC.getDate() - 7));
	}

	const dateInUTC = new Date();
	//Sets the end date to 23:55 in the Australia/Sydney timezone.
	//23:55 - 10 giờ = 13:55 as DB timezone is UTC
	const endDate = new Date(dateInUTC.setUTCHours(13, 55, 0, 0));

	return { startDate, endDate };
}

/**
 * Checks a statement week already exists in the Supabase database.
 */
async function checkStatementWeekExist(
	connection: postgres.PoolClient,
	startDate: Date,
	endDate: Date
) {
	if (startDate > endDate) {
		throw new Error('Start date must be before end date!');
	}
	const result =
		await connection.queryObject`SELECT * FROM statements WHERE start_date >= ${startDate} AND end_date <= ${endDate}`;
	const data = result.rows;
	const count = data.length;
	// If a statement week already exists in the Supabase database, throw an error.
	if (count && count >= 1) {
		throw new Error('Statement week already exists!');
	}
}

/**
 * Retrieves all user transactions that occurred within a specified time range.
 */
async function checkUsersInTransactionTimeRange(
	connection: postgres.PoolClient,
	startDate: Date,
	endDate: Date
): Promise<IUserTransactions[]> {
	const result =
		await connection.queryObject<IUserTransactions>`SELECT DISTINCT receiver_user FROM transactions WHERE created_at >= ${startDate} AND created_at <= ${endDate}`;
	const data = result.rows;

	return data;
}

/**
 * Retrieves the balance of users who executed transactions in the current statement week.
 */
async function balanceOfUsersInTransaction(
	supabase: SupabaseClient<Database>,
	usersInTransaction: IUserTransactions[]
): Promise<IUsers[]> {
	const userIds = usersInTransaction.map((user) => user.receiver_user);
	const { data, error } = await supabase
		.from('users')
		.select('id, balance')
		.in('id', userIds);

	if (error) {
		throw new Error(error.message);
	}

	return data;
}

/**
 * Retrieves the ending balance of the last statement for a given user.
 */
async function getInitialBalance(
	connection: postgres.PoolClient,
	userId: string
): Promise<number> {
	const result = await connection.queryObject<{
		ending_balance: number;
	}>`SELECT ending_balance FROM statements WHERE user_id=${userId} ORDER BY end_date DESC LIMIT 1`;
	const data = result.rows;

	if (data && data.length > 0) return data[0].ending_balance;
	return 0;
}

/**
 * Inserts an array of user statements into the Supabase database.
 */
async function insertUserStatement(
	supabase: SupabaseClient<Database>,
	users: IUsersStatement[]
) {
	const { data, error } = await supabase.from('statements').insert(users);

	if (error) {
		throw new Error(error.message);
	}

	return data;
}

/**
 *Format users data to be inserted into the statements table.
 */
async function formatAndInsertUserStatement(
	connection: postgres.PoolClient,
	supabase: SupabaseClient<Database>,
	users: IUsers[],
	startDate: string,
	endDate: string
) {
	const usersFormat = users.map(async (user) => ({
		user_id: user.id,
		initial_balance: await getInitialBalance(connection, user.id),
		ending_balance: user.balance,
		start_date: startDate,
		end_date: endDate,
	}));

	const usersStatement: IUsersStatement[] = await Promise.all(usersFormat);
	// Insert user statement.
	await insertUserStatement(supabase, usersStatement);
}

serve(async (_req) => {
	try {
		// Create a Supabase client with the Auth context of the logged in user.
		const supabaseClient = createClient(
			// Supabase API URL - env var exported by default.
			Deno.env.get('SUPABASE_URL') ?? '',
			// Supabase API ANON KEY - env var exported by default.
			Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
		);
		//Now we can get the session or user object
		await supabaseClient.auth.getUser();

		// Grab a connection from the pool
		const connection = await pool.connect();

		try {
			await connection.queryObject`update public.users set is_operating=false`;
			const lastStatementEndDate = await getLastStatementEndDate(connection);

			//Get the start and end dates of the current statement week.
			const { startDate, endDate } = await getStatementWeekRange(
				lastStatementEndDate
			);

			//Checks if a statement week already exists in the Supabase database to notification error.
			await checkStatementWeekExist(connection, startDate, endDate);

			//Get users execute transactions in the current statement week.
			const usersInTransaction: IUserTransactions[] =
				await checkUsersInTransactionTimeRange(connection, startDate, endDate);

			// //Get balance of users who executed transactions in the current statement week.
			const users: IUsers[] = await balanceOfUsersInTransaction(
				supabaseClient,
				usersInTransaction
			);

			//Insert user statement.
			if (users && users.length > 0) {
				await formatAndInsertUserStatement(
					connection,
					supabaseClient,
					users,
					startDate.toISOString(),
					endDate.toISOString()
				);
			}

			// Return the response with the correct content type header
			return new Response('success', {
				status: 200,
				headers: {
					'Content-Type': 'application/json; charset=utf-8',
				},
			});
		} finally {
			// Release the connection back into the pool
			connection.release();
		}
	} catch (err) {
		console.error(err);
		return new Response(String(err?.message ?? err), { status: 500 });
	}
});
