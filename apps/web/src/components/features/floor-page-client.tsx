'use client'

import { useState } from 'react'
import Link from 'next/link'
import { X, Clock } from 'lucide-react'
import { FloorMapClient } from './floor-map-client'
import { formatDateTime } from '@/lib/utils'
import type { RoomWithEvent } from '@/server/repositories/room-repository'

interface FloorPageClientProps {
  floor: number
  rooms: RoomWithEvent[]
}

const FLOOR_DESCRIPTION: Record<number, string> = {
  1: 'カフェテリア・ものづくりシアター・体育館',
  2: 'S棟 202〜216・N253・ラーニングコモンズ',
  3: 'S棟 309〜319・メカトロ実験室・ラーニングコモンズ',
  4: '共和松井ホール',
}

export function FloorPageClient({ floor, rooms }: FloorPageClientProps) {
  const [selectedRoom, setSelectedRoom] = useState<RoomWithEvent | null>(null)

  const eventRooms = rooms.filter((r) => r.event !== null)

  function handlePinClick(room: RoomWithEvent) {
    setSelectedRoom((prev) => (prev?.id === room.id ? null : room))
  }

  function handleTableRowClick(room: RoomWithEvent) {
    setSelectedRoom((prev) => (prev?.id === room.id ? null : room))
  }

  return (
    <div className="h-screen flex flex-col bg-sky-50 overflow-hidden">
      {/* ヘッダー */}
      <header className="bg-brand-900 text-white flex-shrink-0 h-12 flex items-center px-4 gap-3 shadow-md">
        <span className="font-bold text-lg tracking-wide">三燕祭</span>
        <span className="text-sky-300 text-sm font-medium">学園祭マップ</span>
        <span className="ml-auto text-sky-200 text-sm hidden sm:block">
          {floor}階 — {FLOOR_DESCRIPTION[floor]}
        </span>
      </header>

      {/* メインエリア */}
      <div className="flex flex-1 min-h-0">
        {/* 左サイドバー: 縦フロアナビゲーション */}
        <nav className="bg-brand-900 flex flex-col items-center py-3 gap-2 w-14 shrink-0">
          <span className="text-sky-400 text-[9px] font-bold tracking-widest mb-1">フロア</span>
          {[1, 2, 3, 4].map((f) => (
            <Link key={f} href={`/floor/${f}`}>
              <div
                className={`w-10 h-12 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all select-none ${
                  f === floor
                    ? 'bg-white text-brand-900 shadow'
                    : 'bg-white/15 text-white hover:bg-white/28'
                }`}
              >
                <span className="text-lg font-bold leading-none">{f}</span>
                <span className="text-[9px] font-medium mt-0.5 opacity-70">F</span>
              </div>
            </Link>
          ))}
        </nav>

        {/* フロアマップ (中央) */}
        <div className="flex-1 min-w-0 overflow-auto bg-white">
          <FloorMapClient
            floor={floor}
            rooms={rooms}
            selectedRoomId={selectedRoom?.id ?? null}
            onPinClick={handlePinClick}
          />
        </div>

        {/* 右サイドパネル: イベント一覧テーブル */}
        <aside className="w-80 bg-white border-l border-sky-200 flex flex-col shrink-0 overflow-hidden">
          <div className="bg-brand-900 text-white text-center text-sm font-bold py-2 px-3 shrink-0 tracking-wide">
            {floor}階 イベント一覧
          </div>
          <div className="flex-1 overflow-y-auto">
            {eventRooms.length === 0 ? (
              <p className="text-gray-400 text-xs text-center py-8 px-2">
                まだイベント情報がありません
              </p>
            ) : (
              <table className="w-full text-xs">
                <thead className="sticky top-0 bg-sky-50 border-b border-sky-200 z-10">
                  <tr>
                    <th className="text-left py-1.5 px-2 text-brand-700 font-bold w-20">教室</th>
                    <th className="text-left py-1.5 px-2 text-brand-700 font-bold">イベント名</th>
                  </tr>
                </thead>
                <tbody>
                  {eventRooms.map((room) => (
                    <tr
                      key={room.id}
                      className={`border-b border-sky-100 cursor-pointer transition-colors ${
                        selectedRoom?.id === room.id
                          ? 'bg-brand-100 border-l-[3px] border-l-brand-500'
                          : 'hover:bg-sky-50'
                      }`}
                      onClick={() => handleTableRowClick(room)}
                    >
                      <td className="py-2 px-2 font-semibold text-brand-800 leading-tight align-top">
                        {room.name}
                      </td>
                      <td className="py-2 px-2 text-gray-700 leading-tight align-top">
                        {room.event?.title}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </aside>
      </div>

      {/* 下部: イベント情報パネル */}
      <div
        className={`flex-shrink-0 bg-white border-t-2 border-brand-600 shadow-xl transition-all duration-300 overflow-hidden ${
          selectedRoom ? 'max-h-36' : 'max-h-0 border-t-0'
        }`}
      >
        {selectedRoom && (
          <div className="flex items-start gap-4 px-5 py-3">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-brand-700 bg-brand-100 px-2 py-0.5 rounded-full">
                  {selectedRoom.floor}階
                </span>
                <span className="text-base font-bold text-brand-900">{selectedRoom.name}</span>
              </div>

              {selectedRoom.event ? (
                <>
                  <p className="text-lg font-bold text-gray-900">{selectedRoom.event.title}</p>
                  <p className="text-sm text-gray-600 line-clamp-2 mt-0.5">
                    {selectedRoom.event.description}
                  </p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>{formatDateTime(selectedRoom.event.startAt)}</span>
                    {selectedRoom.event.endAt && (
                      <span>〜 {formatDateTime(selectedRoom.event.endAt)}</span>
                    )}
                  </div>
                </>
              ) : (
                <p className="text-gray-400 text-sm">イベント情報なし</p>
              )}
            </div>

            <button
              onClick={() => setSelectedRoom(null)}
              className="text-gray-400 hover:text-gray-600 shrink-0 mt-0.5 p-1"
              aria-label="閉じる"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
