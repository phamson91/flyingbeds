import { kv } from '@vercel/kv';

const redis = {
	get: async (key: string) => {
		const res = await kv.get(key);
		return res;
	},
	set: async (key: string, value: string) => {
		const res = await kv.set(key, value);
		return res;
	},
	setex: async (key: string, ttl: number, value: string) => {
		const res = await kv.setex(key, ttl, value);
		return res;
	},
	del: async (key: string) => {
		const res = await kv.del(key);
		return res;
	},
	getKeys: async (prefix: string) => {
		const keys = await kv.keys(prefix);
		return keys;
	},
	mget: async (keys: string[]) => {
		const res = await kv.mget(...keys);
		return res;
	},
};

export default redis;
