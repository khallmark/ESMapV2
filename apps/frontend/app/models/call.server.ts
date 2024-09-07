import { prisma } from '~/utils/db.server';
import type { Call } from '@esmapv3/types';

export async function getRecentCalls(): Promise<Call[]> {
  const calls = await prisma.call.findMany({
    where: {
      OR: [
        { expired: null },
        { expired: { gte: new Date(Date.now() - 60 * 60 * 1000) } }, // Last hour
      ],
    },
    include: {
      source: true,
      geocode: true,
    },
    orderBy: { added: 'desc' },
    take: 100,
  });

  return calls.map((call) => ({
    id: call.id,
    source: call.source.tag,
    cid: call.cid,
    category: call.category,
    location: call.geocode?.location || '',
    description: call.meta.description,
    callTime: call.added.toISOString(),
    closedTime: call.expired?.toISOString() || null,
  }));
}