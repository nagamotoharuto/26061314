import { notFound } from 'next/navigation'
import { roomService } from '@/server/services/room-service'
import { FloorPageClient } from '@/components/features/floor-page-client'

interface PageProps {
  params: { floorId: string }
}

export default async function FloorPage({ params }: PageProps) {
  const floor = parseInt(params.floorId, 10)
  if (isNaN(floor) || floor < 1 || floor > 4) notFound()

  const rooms = await roomService.getRoomsForFloor(floor)

  return <FloorPageClient floor={floor} rooms={rooms} />
}
