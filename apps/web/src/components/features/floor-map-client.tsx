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

// 現在地: 1階事務局近くの階段 (位置調整はここで)
const CURRENT_LOCATION = { x: 35, y: 70 }

export function FloorMapClient({ floor, rooms, selectedRoomId, onPinClick }: FloorMapClientProps) {
  const pinnedRooms = rooms.filter((r) => r.event !== null && r.pinVisible)
  const selectedRoom = pinnedRooms.find((r) => r.id === selectedRoomId) ?? null

  return (
    <div className="relative w-full select-none">
      {/* フロアマップ画像 */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`/images/floors/floor-${floor}.png`}
        alt={`${floor}階 フロアマップ`}
        className="w-full h-auto block"
        draggable={false}
      />

      {/* ルート線 SVG (1階のみ、ピン選択時) */}
      {floor === 1 && selectedRoom && (
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
          style={{ overflow: 'visible' }}
        >
          <defs>
            <marker id="route-arrow" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill="#0369a1" opacity="0.9" />
            </marker>
          </defs>
          <line
            x1={`${CURRENT_LOCATION.x}%`}
            y1={`${CURRENT_LOCATION.y}%`}
            x2={`${selectedRoom.pinX}%`}
            y2={`${selectedRoom.pinY - 7}%`}
            stroke="#0369a1"
            strokeWidth="3"
            strokeDasharray="9,6"
            strokeLinecap="round"
            markerEnd="url(#route-arrow)"
            opacity="0.85"
          />
        </svg>
      )}

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
          <div className="flex flex-col items-center gap-0.5">
            <span className="bg-brand-700 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-md whitespace-nowrap leading-tight">
              現在地
            </span>
            <div className="relative flex items-center justify-center">
              <span className="absolute w-8 h-8 rounded-full bg-brand-400 opacity-25 animate-ping" />
              <div className="relative w-5 h-5 bg-brand-700 border-2 border-white rounded-full flex items-center justify-center shadow-lg z-10">
                <Navigation className="h-2.5 w-2.5 text-white fill-white" />
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
