import { eventRepository } from '@/server/repositories/event-repository'
import { roomRepository } from '@/server/repositories/room-repository'
import { z } from 'zod'

export const EventUpsertSchema = z.object({
  roomId:      z.string().min(1),
  title:       z.string().min(1, 'イベント名を入力してください').max(100),
  description: z.string().min(1, 'イベント内容を入力してください').max(1000),
  startAt:     z.string().min(1, '開催日時を入力してください'),
  endAt:       z.string().optional().nullable(),
})

export const eventService = {
  async upsert(input: z.infer<typeof EventUpsertSchema>) {
    const data = EventUpsertSchema.parse(input)

    const room = await roomRepository.findById(data.roomId)
    if (!room) throw new Error('部屋が見つかりません')

    return eventRepository.upsert({
      roomId:      data.roomId,
      title:       data.title,
      description: data.description,
      startAt:     new Date(data.startAt),
      endAt:       data.endAt ? new Date(data.endAt) : null,
    })
  },

  async deleteByRoomId(roomId: string) {
    const room = await roomRepository.findById(roomId)
    if (!room) throw new Error('部屋が見つかりません')
    return eventRepository.deleteByRoomId(roomId)
  },
}
