import { ActionArgs, json } from '@remix-run/node'
import { prisma } from '#app/utils/db.server.ts'

export async function action({ request }: ActionArgs) {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 })
  }

  const body = await request.json()

  // Validate client key
  const clientKey = process.env.CLIENT_KEY
  if (clientKey && body.key !== clientKey) {
    return json({ error: 'Client not authorized' }, { status: 403 })
  }

  // Process call data
  if (body.calldata) {
    const data = body.calldata
    const sourceId = data.source

    // Handle new calls
    if (data.new && data.new.length > 0) {
      await prisma.$transaction(
        data.new.map((newCall: any) =>
          prisma.call.upsert({
            where: { cid: newCall.key },
            update: { expired: null },
            create: {
              cid: newCall.key,
              category: newCall.category,
              sourceId: sourceId,
              meta: newCall.meta,
              // Handle geocode linkage if necessary
            },
          })
        )
      )
    }

    // Handle expired calls
    if (data.expired && data.expired.length > 0) {
      await prisma.call.updateMany({
        where: { cid: { in: data.expired } },
        data: { expired: new Date() },
      })
    }

    // Handle updated calls
    if (data.updated && Object.keys(data.updated).length > 0) {
      await prisma.$transaction(
        Object.entries(data.updated).map(([cid, updates]: [string, any]) =>
          prisma.call.update({
            where: { cid },
            data: {
              category: updates.category,
              meta: {
                ...updates.meta,
              },
              // Update geocode if necessary
            },
          })
        )
      )
    }

    return json({ status: { success: true } })
  }

  // Process geocode data if provided
  if (body.geodata) {
    // Implement geocode processing logic here
  }

  return json({ status: { success: true } })
}