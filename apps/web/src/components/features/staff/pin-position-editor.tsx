'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Check, Loader2, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'
import { PersonPin } from '@/components/features/person-pin'
import type { RoomWithEvent } from '@/server/repositories/room-repository'

interface PinPositionEditorProps {
  room: RoomWithEvent | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved: () => void
}

const ZOOM_STEP = 25
const ZOOM_MIN  = 80
const ZOOM_MAX  = 400

export function PinPositionEditor({ room, open, onOpenChange, onSaved }: PinPositionEditorProps) {
  const [pinX, setPinX] = useState<number | null>(null)
  const [pinY, setPinY] = useState<number | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [zoom, setZoom] = useState(100)

  const scrollRef = useRef<HTMLDivElement>(null)

  const currentX = pinX ?? room?.pinX ?? 50
  const currentY = pinY ?? room?.pinY ?? 50

  function changeZoom(delta: number) {
    setZoom((prev) => Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, prev + delta)))
  }

  // マップのクリック座標 → % 変換（スクロール・ズーム後でも正確）
  function handleMapClick(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width)  * 100
    const y = ((e.clientY - rect.top)  / rect.height) * 100
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
      setZoom(100)
    } finally {
      setSaving(false)
    }
  }

  function handleClose() {
    setPinX(null)
    setPinY(null)
    setError(null)
    setZoom(100)
    onOpenChange(false)
  }

  if (!room) return null

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-3xl w-[95vw]">
        <DialogHeader>
          <DialogTitle>ピン位置の設定 — {room.name}</DialogTitle>
          <DialogDescription className="text-xs text-gray-500">
            マップをスクロールして拡大し、ピンを置きたい場所をクリックしてください
          </DialogDescription>
        </DialogHeader>

        {/* ズームコントロール */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline" size="sm"
            onClick={() => changeZoom(-ZOOM_STEP)}
            disabled={zoom <= ZOOM_MIN}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>

          <span className="text-xs font-medium w-12 text-center tabular-nums">{zoom}%</span>

          <Button
            variant="outline" size="sm"
            onClick={() => changeZoom(ZOOM_STEP)}
            disabled={zoom >= ZOOM_MAX}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>

          <Button variant="outline" size="sm" onClick={() => setZoom(100)} title="ズームをリセット">
            <RotateCcw className="h-3.5 w-3.5" />
          </Button>

          <span className="text-xs text-gray-400 ml-1 hidden sm:block">
            拡大後はスクロールで移動できます
          </span>
        </div>

        {/* スクロール可能なマップ領域 */}
        <div
          ref={scrollRef}
          className="border border-gray-200 rounded-lg overflow-auto bg-gray-100"
          style={{ maxHeight: '55vh' }}
        >
          {/* zoom% の幅に広げることでスクロール可能にする */}
          <div
            className="relative cursor-crosshair"
            style={{ width: `${zoom}%`, minWidth: '100%' }}
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
                transform: 'translate(-50%, -100%)',
              }}
            >
              <PersonPin className="h-9 w-6 text-red-600 drop-shadow-md" />
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-0.5 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow whitespace-nowrap">
                {room.name}
              </span>
            </div>
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
                : <Check   className="h-4 w-4 mr-1" />
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
