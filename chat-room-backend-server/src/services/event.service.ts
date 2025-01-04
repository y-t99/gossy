import { prisma } from 'src/dbs';
import { timelinePoint2UnixTimestamp } from '../utils';

const TIMELINE_LIMIT = 100;

export async function getClientEventsSince(client: string, since?: string) {
  return await prisma.event.findMany({
    where: {
      sender: client,
      originServerTs: {
        gt: since ? new Date(timelinePoint2UnixTimestamp(since)) : undefined,
      },
    },
    orderBy: [
      {
        originServerTs: 'desc',
      },
      {
        id: 'desc',
      },
    ],
    take: TIMELINE_LIMIT,
  });
}
