import type { LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { prisma } from '~/ui/utils/db.server';
import { Map } from '~/ui/components/Map';
import { getCalls } from '~/ui/utils/callData.server';

export const loader: LoaderFunction = async () => {
  const calls = await getCalls();
  return json({ calls });
};

export default function MapPage() {
  const { calls } = useLoaderData<typeof loader>();

  return (
    <div style={{ height: '100vh' }}>
      <Map calls={calls} />
    </div>
  );
}