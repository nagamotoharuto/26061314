import { roomRepository } from '@/server/repositories/room-repository'
import { z } from 'zod'

export const PinUpdateSchema = z.object({
  pinX: z.number().min(0).max(100),
  pinY: z.number().min(0).max(100),
})

export const roomService = {
  getRoomsForFloor(floor: number) {
    return roomRepository.findByFloor(floor)
  },

  getAllRooms() {
    return roomRepository.findAll()
  },

  async updatePin(id: string, input: z.infer<typeof PinUpdateSchema>) {
    const data = PinUpdateSchema.parse(input)
    const room = await roomRepository.findById(id)
    if (!room) throw new Error('部屋が見つかりません')
    return roomRepository.updatePin(id, data.pinX, data.pinY)
  },
}
