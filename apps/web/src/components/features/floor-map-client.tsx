'use client'

import { Navigation } from 'lucide-react'
import { PersonPin } from './person-pin'
import type { RoomWithEvent } from '@/server/repositories/room-repository'

interface FloorMapClientProps {
  floor: number
  rooms: RoomWithEvent[]
  selectedRoomId: string | null
  onPinClick: (room: RoomWithEvent) => void
}

// 現在地: 受付ピン付近 (位置調整はここで)
const CURRENT_LOCATION = { x: 68, y: 87 }

export function FloorMapClient({ floor, rooms, selectedRoomId, onPinClick }: FloorMapClientProps) {
  const pinnedRooms = rooms.filter((r) => r.event !== null && r.pinVisible)

  return (
    <div className="relative w-full select-none">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/images/floors/floor-${floor}.png`}
        alt={`${floor}階 フロアマップ`}
        className="w-full h-auto block"
        draggable={false}
      />

      {/* 現在地マーカー (1階のみ) */}
      {floor === 1 && (
        <div
          className="absolute z-20"
          style={{
            left: `${CURRENT_LOCATION.x}%`,
            top: `${CURRENT_LOCATION.y}%`,
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className="flex flex-col items-center gap-1">
            <span className="bg-brand-700 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md whitespace-nowrap leading-tight">
              現在地
            </span>
            <div className="relative flex items-center justify-center">
              <span className="absolute w-12 h-12 rounded-full bg-brand-400 opacity-25 animate-ping" />
              <div className="relative w-8 h-8 bg-brand-700 border-2 border-white rounded-full flex items-center justify-center shadow-lg z-10">
                <Navigation className="h-4 w-4 text-white fill-white" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* イベントピン */}
      {pinnedRooms.map((room) => (
        <button
          key={room.id}
          className="absolute group focus:outline-none z-20"
          style={{
            left: `${room.pinX}%`,
            top:  `${room.pinY}%`,
            transform: 'translate(-50%, -100%)',
          }}
          onClick={() => onPinClick(room)}
          aria-label={`${room.name} のイベント情報を見る`}
        >
          {/* 人型ピン (選択中は水色) */}
          <PersonPin
            className={`relative h-9 w-6 transition-colors drop-shadow-md ${
              room.id === selectedRoomId
                ? 'text-brand-500'
                : 'text-red-600 group-hover:text-red-700'
            }`}
          />

          {/* 足元パルス */}
          <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-red-400 opacity-40 animate-ping" />

          {/* 部屋名ラベル (選択中は常時表示) */}
          <span
            className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-1 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow whitespace-nowrap pointer-events-none transition-opacity ${
              room.id === selectedRoomId
                ? 'opacity-100 bg-brand-600'
                : 'opacity-0 group-hover:opacity-100 bg-red-600'
            }`}
          >
            {room.name}
          </span>
        </button>
      ))}
    </div>
  )
}
