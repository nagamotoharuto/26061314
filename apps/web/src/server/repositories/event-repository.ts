import { db } from '@/lib/db'

export type EventUpsertInput = {
  roomId:      string
  title:       string
  description: string
  startAt:     Date
  endAt?:      Date | null
}

export const eventRepository = {
  upsert(data: EventUpsertInput) {
    return db.event.upsert({
      where: { roomId: data.roomId },
      create: {
        roomId:      data.roomId,
        title:       data.title,
        description: data.description,
        startAt:     data.startAt,
        endAt:       data.endAt ?? null,
        deletedAt:   null,
      },
      update: {
        title:       data.title,
        description: data.description,
        startAt:     data.startAt,
        endAt:       data.endAt ?? null,
        deletedAt:   null,
      },
    })
  },

  deleteByRoomId(roomId: string) {
    return db.event.deleteMany({ where: { roomId } })
  },

  deleteById(id: string) {
    return db.event.delete({ where: { id } })
  },
}
