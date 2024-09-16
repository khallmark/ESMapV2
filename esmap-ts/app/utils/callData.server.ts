import { prisma } from '~/utils/db.server';

export async function getCalls() {
  const calls = await prisma.calls.findMany({
    include: {
      // Include related data if necessary
    },
  });
  // Process data as needed to extract latitude and longitude
  return calls.map(call => ({
    id: call.id,
    latitude: /* extract latitude */,
    longitude: /* extract longitude */,
    description: call.meta, // or another field
    category: call.category,
  }));
}