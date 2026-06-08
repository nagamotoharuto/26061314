'use client'

import { useState } from 'react'
import { MapPin } from 'lucide-react'
import { EventModal } from './event-modal'
import type { RoomWithEvent } from '@/server/repositories/room-repository'

interface FloorMapClientProps {
  floor: number
  rooms: RoomWithEvent[]
}

export function FloorMapClient({ floor, rooms }: FloorMapClientProps) {
  const [selectedRoom, setSelectedRoom] = useState<RoomWithEvent | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  // イベントが設定されている部屋のみピン表示
  const pinnedRooms = rooms.filter((r) => r.event !== null)

  function handlePinClick(room: RoomWithEvent) {
    setSelectedRoom(room)
    setModalOpen(true)
  }

  return (
    <>
      <div className="relative w-full select-none">
        {/* フロアマップ画像 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/images/floors/floor-${floor}.png`}
          alt={`${floor}階 フロアマップ`}
          className="w-full h-auto block"
          draggable={false}
        />

        {/* ピン */}
        {pinnedRooms.map((room) => (
          <button
            key={room.id}
            className="absolute group focus:outline-none"
            style={{
              left: `${room.pinX}%`,
              top:  `${room.pinY}%`,
              transform: 'translate(-50%, -50%)',
            }}
            onClick={() => handlePinClick(room)}
            aria-label={`${room.name} のイベント情報を見る`}
          >
            {/* パルスアニメーション */}
            <span className="absolute inset-0 rounded-full bg-red-400 opacity-40 animate-ping" />

            {/* ピン本体 */}
            <span className="relative flex items-center gap-1 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg whitespace-nowrap group-hover:bg-red-700 transition-colors">
              <MapPin className="h-3 w-3 shrink-0" />
              {room.name}
            </span>
          </button>
        ))}
      </div>

      <EventModal
        room={selectedRoom}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />
    </>
  )
}
