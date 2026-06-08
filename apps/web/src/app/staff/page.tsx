import { redirect } from 'next/navigation'
import { getStaffSession } from '@/lib/auth'
import { roomService } from '@/server/services/room-service'
import { StaffDashboard } from '@/components/features/staff/staff-dashboard'

export default async function StaffPage() {
  const session = await getStaffSession()
  if (!session.isStaff) redirect('/staff/login')

  const rooms = await roomService.getAllRooms()

  return <StaffDashboard initialRooms={rooms} />
}
