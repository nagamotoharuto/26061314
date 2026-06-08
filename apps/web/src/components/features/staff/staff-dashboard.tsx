'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { EventEditor } from './event-editor'
import { PinPositionEditor } from './pin-position-editor'
import { CalendarDays, Eye, EyeOff, LogOut, MapPin, Pencil, Pin } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'
import type { RoomWithEvent } from '@/server/repositories/room-repository'

interface StaffDashboardProps {
  initialRooms: RoomWithEvent[]
}

const FLOOR_LABELS: Record<number, string> = { 1: '1階', 2: '2階', 3: '3階', 4: '4階' }

export function StaffDashboard({ initialRooms }: StaffDashboardProps) {
  const router = useRouter()
  const [rooms, setRooms] = useState<RoomWithEvent[]>(initialRooms)
  const [editingRoom, setEditingRoom] = useState<RoomWithEvent | null>(null)
  const [pinEditingRoom, setPinEditingRoom] = useState<RoomWithEvent | null>(null)
  const [eventEditorOpen, setEventEditorOpen] = useState(false)
  const [pinEditorOpen, setPinEditorOpen] = useState(false)

  const refreshRooms = useCallback(async () => {
    const res = await fetch('/api/rooms/all')
    if (res.ok) {
      const json = await res.json()
      setRooms(json.rooms)
    }
  }, [])

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/staff/login')
  }

  function openEventEditor(room: RoomWithEvent) {
    setEditingRoom(room)
    setEventEditorOpen(true)
  }

  function openPinEditor(room: RoomWithEvent) {
    setPinEditingRoom(room)
    setPinEditorOpen(true)
  }

  async function handleTogglePinVisible(room: RoomWithEvent) {
    await fetch(`/api/rooms/${room.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pinVisible: !room.pinVisible }),
    })
    await refreshRooms()
  }

  const byFloor = [1, 2, 3, 4].map((floor) => ({
    floor,
    rooms: rooms.filter((r) => r.floor === floor),
  }))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="font-bold text-gray-900">スタッフ管理画面</h1>

          <div className="flex items-center gap-2">
            {/* フロアマップへのクイックリンク */}
            <div className="hidden sm:flex items-center gap-1">
              {[1, 2, 3, 4].map((f) => (
                <Link key={f} href={`/floor/${f}`}>
                  <Button variant="outline" size="sm" className="text-xs px-2">
                    {f}階マップ
                  </Button>
                </Link>
              ))}
            </div>

            <Link href="/">
              <Button variant="outline" size="sm" className="text-xs">
                フロア選択へ
              </Button>
            </Link>

            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-gray-500">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* スマホ向けフロアリンク */}
        <div className="sm:hidden flex gap-1 px-4 pb-2 overflow-x-auto">
          {[1, 2, 3, 4].map((f) => (
            <Link key={f} href={`/floor/${f}`} className="shrink-0">
              <Button variant="outline" size="sm" className="text-xs px-2">
                {f}階マップ
              </Button>
            </Link>
          ))}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-8">
        <p className="text-sm text-gray-500">
          各部屋の「イベント編集」ボタンでイベント情報を登録・更新できます。
          「ピン位置」ボタンでフロアマップ上のピン位置を調整できます。
        </p>

        {byFloor.map(({ floor, rooms: floorRooms }) => (
          <section key={floor}>
            <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span className="bg-brand-500 text-white text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center">
                {floor}
              </span>
              {FLOOR_LABELS[floor]}
              <span className="text-sm font-normal text-gray-400 ml-1">
                ({floorRooms.filter((r) => r.event).length}/{floorRooms.length} 件登録済み)
              </span>
            </h2>

            <div className="grid gap-3 sm:grid-cols-2">
              {floorRooms.map((room) => (
                <Card key={room.id} className={room.event ? 'border-brand-200' : ''}>
                  <CardHeader className="pb-1">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-base">{room.name}</CardTitle>
                      <Badge variant={room.event ? 'default' : 'outline'} className="shrink-0 text-xs">
                        {room.event ? '登録済み' : '未設定'}
                      </Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-2">
                    {room.event ? (
                      <div className="text-sm text-gray-600 space-y-1">
                        <p className="font-medium text-gray-900 truncate">{room.event.title}</p>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <CalendarDays className="h-3 w-3" />
                          <span>{formatDateTime(room.event.startAt)}</span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">イベント情報なし</p>
                    )}

                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <MapPin className="h-3 w-3" />
                      <span>ピン位置: X={room.pinX.toFixed(1)}%, Y={room.pinY.toFixed(1)}%</span>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 text-xs"
                        onClick={() => openEventEditor(room)}
                      >
                        <Pencil className="h-3 w-3 mr-1" />
                        イベント編集
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-xs px-2"
                        onClick={() => openPinEditor(room)}
                        title="ピン位置を設定"
                      >
                        <Pin className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className={`text-xs px-2 ${room.pinVisible ? 'text-green-600 border-green-300' : 'text-gray-400'}`}
                        onClick={() => handleTogglePinVisible(room)}
                        title={room.pinVisible ? 'ピンを非表示にする' : 'ピンを表示する'}
                      >
                        {room.pinVisible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        ))}
      </main>

      <EventEditor
        room={editingRoom}
        open={eventEditorOpen}
        onOpenChange={setEventEditorOpen}
        onSaved={refreshRooms}
      />

      <PinPositionEditor
        room={pinEditingRoom}
        open={pinEditorOpen}
        onOpenChange={setPinEditorOpen}
        onSaved={refreshRooms}
      />
    </div>
  )
}
