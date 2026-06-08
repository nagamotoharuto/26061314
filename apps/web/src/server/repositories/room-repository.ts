import { db } from '@/lib/db'
import type { Prisma } from '@prisma/client'

export type RoomWithEvent = Prisma.RoomGetPayload<{
  include: { event: true }
}>

export const roomRepository = {
  findByFloor(floor: number): Promise<RoomWithEvent[]> {
    return db.room.findMany({
      where: { floor },
      include: { event: true },
      orderBy: { name: 'asc' },
    })
  },

  findAll(): Promise<RoomWithEvent[]> {
    return db.room.findMany({
      include: { event: true },
      orderBy: [{ floor: 'asc' }, { name: 'asc' }],
    })
  },

  findById(id: string): Promise<RoomWithEvent | null> {
    return db.room.findUnique({
      where: { id },
      include: { event: true },
    })
  },

  updatePin(id: string, pinX: number, pinY: number) {
    return db.room.update({
      where: { id },
      data: { pinX, pinY },
      include: { event: true },
    })
  },

  updatePinVisible(id: string, pinVisible: boolean) {
    return db.room.update({
      where: { id },
      data: { pinVisible },
      include: { event: true },
    })
  },
}
