'use client'

import { useState } from 'react'
import { EventModal } from './event-modal'
import { PersonPin } from './person-pin'
import type { RoomWithEvent } from '@/server/repositories/room-repository'

interface FloorMapClientProps {
  floor: number
  rooms: RoomWithEvent[]
}

export function FloorMapClient({ floor, rooms }: FloorMapClientProps) {
  const [selectedRoom, setSelectedRoom] = useState<RoomWithEvent | null>(null)
  const [modalOpen, setModalOpen] = useState(false)

  // イベントが設定されていて、かつ表示フラグが ON の部屋のみピン表示
  const pinnedRooms = rooms.filter((r) => r.event !== null && r.pinVisible)

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
              transform: 'translate(-50%, -100%)',
            }}
            onClick={() => handlePinClick(room)}
            aria-label={`${room.name} のイベント情報を見る`}
          >
            {/* 人型ピン */}
            <PersonPin className="relative h-9 w-6 text-red-600 group-hover:text-red-700 transition-colors drop-shadow-md" />

            {/* 部屋名ラベル */}
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
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
