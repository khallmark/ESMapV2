import { json } from '@remix-run/node';
import { getRecentCalls } from '~/models/call.server';

export async function loader() {
  const calls = await getRecentCalls();
  return json(calls);
}