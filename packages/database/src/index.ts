import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export * from '@prisma/client';

// Add any database-related utility functions here
export async function getRecentCalls(limit: number = 10) {
  return prisma.call.findMany({
    orderBy: { callTime: 'desc' },
    take: limit,
  });
}

export async function getSourceByTag(tag: string) {
  return prisma.source.findUnique({ where: { tag } });
}