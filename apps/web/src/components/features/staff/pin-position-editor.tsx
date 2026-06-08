'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Check, Loader2, MapPin } from 'lucide-react'
import type { RoomWithEvent } from '@/server/repositories/room-repository'

interface PinPositionEditorProps {
  room: RoomWithEvent | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved: () => void
}

export function PinPositionEditor({ room, open, onOpenChange, onSaved }: PinPositionEditorProps) {
  const [pinX, setPinX] = useState<number | null>(null)
  const [pinY, setPinY] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const currentX = pinX ?? room?.pinX ?? 50
  const currentY = pinY ?? room?.pinY ?? 50

  function handleMapClick(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setPinX(Math.round(x * 10) / 10)
    setPinY(Math.round(y * 10) / 10)
  }

  async function handleSave() {
    if (!room) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/rooms/${room.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pinX: currentX, pinY: currentY }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error?.message ?? '保存に失敗しました')
        return
      }
      onSaved()
      onOpenChange(false)
      setPinX(null)
      setPinY(null)
    } finally {
      setSaving(false)
    }
  }

  function handleClose() {
    setPinX(null)
    setPinY(null)
    setError(null)
    onOpenChange(false)
  }

  if (!room) return null

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl w-[95vw]">
        <DialogHeader>
          <DialogTitle>ピン位置の設定 — {room.name}</DialogTitle>
          <DialogDescription className="text-xs text-gray-500">
            フロアマップ上をクリックしてピンの位置を指定してください
          </DialogDescription>
        </DialogHeader>

        <div
          className="relative cursor-crosshair border border-gray-200 rounded-lg overflow-hidden"
          onClick={handleMapClick}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`/images/floors/floor-${room.floor}.png`}
            alt={`${room.floor}階 フロアマップ`}
            className="w-full h-auto block select-none"
            draggable={false}
          />

          {/* 現在のピン位置 */}
          <div
            className="absolute pointer-events-none"
            style={{
              left:      `${currentX}%`,
              top:       `${currentY}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            <span className="relative flex items-center gap-1 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg whitespace-nowrap">
              <MapPin className="h-3 w-3 shrink-0" />
              {room.name}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <p className="text-xs text-gray-500">
            現在位置: X={currentX.toFixed(1)}%, Y={currentY.toFixed(1)}%
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={handleClose}>
              キャンセル
            </Button>
            <Button size="sm" onClick={handleSave} disabled={saving}>
              {saving
                ? <Loader2 className="h-4 w-4 animate-spin mr-1" />
                : <Check className="h-4 w-4 mr-1" />
              }
              保存
            </Button>
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 rounded px-3 py-2">{error}</p>
        )}
      </DialogContent>
    </Dialog>
  )
}
