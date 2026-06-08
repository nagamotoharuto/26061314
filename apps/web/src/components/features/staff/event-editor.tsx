'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Loader2, Trash2 } from 'lucide-react'
import type { RoomWithEvent } from '@/server/repositories/room-repository'

const FormSchema = z.object({
  title:       z.string().min(1, 'イベント名を入力してください').max(100),
  description: z.string().min(1, 'イベント内容を入力してください').max(1000),
  startAt:     z.string().min(1, '開催日時を入力してください'),
  endAt:       z.string().optional(),
})

type FormValues = z.infer<typeof FormSchema>

interface EventEditorProps {
  room: RoomWithEvent | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaved: () => void
}

function toLocalDatetimeString(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function EventEditor({ room, open, onOpenChange, onSaved }: EventEditorProps) {
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    values: room?.event
      ? {
          title:       room.event.title,
          description: room.event.description,
          startAt:     toLocalDatetimeString(room.event.startAt),
          endAt:       room.event.endAt ? toLocalDatetimeString(room.event.endAt) : '',
        }
      : { title: '', description: '', startAt: '', endAt: '' },
  })

  async function onSubmit(values: FormValues) {
    if (!room) return
    setSaving(true)
    setError(null)
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId:      room.id,
          title:       values.title,
          description: values.description,
          startAt:     new Date(values.startAt).toISOString(),
          endAt:       values.endAt ? new Date(values.endAt).toISOString() : null,
        }),
      })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error?.message ?? '保存に失敗しました')
        return
      }
      onSaved()
      onOpenChange(false)
      reset()
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!room) return
    if (!confirm(`${room.name} のイベント情報を削除しますか？`)) return
    setDeleting(true)
    setError(null)
    try {
      const res = await fetch(`/api/events/${room.id}`, { method: 'DELETE' })
      if (!res.ok) {
        const json = await res.json()
        setError(json.error?.message ?? '削除に失敗しました')
        return
      }
      onSaved()
      onOpenChange(false)
      reset()
    } finally {
      setDeleting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg w-[95vw]">
        <DialogHeader>
          <DialogTitle>イベント編集 — {room?.name}</DialogTitle>
          <DialogDescription className="text-xs text-gray-500">
            {room?.floor}階
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="title">イベント名 *</Label>
            <Input id="title" placeholder="例: ロボット展示" {...register('title')} />
            {errors.title && <p className="text-xs text-red-600">{errors.title.message}</p>}
          </div>

          <div className="space-y-1">
            <Label htmlFor="description">イベント内容 *</Label>
            <Textarea
              id="description"
              rows={4}
              placeholder="例: 学生が制作したロボットを展示します。デモ体験もできます。"
              {...register('description')}
            />
            {errors.description && <p className="text-xs text-red-600">{errors.description.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="startAt">開催日時 *</Label>
              <Input id="startAt" type="datetime-local" {...register('startAt')} />
              {errors.startAt && <p className="text-xs text-red-600">{errors.startAt.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="endAt">終了日時 (任意)</Label>
              <Input id="endAt" type="datetime-local" {...register('endAt')} />
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded px-3 py-2">{error}</p>
          )}

          <DialogFooter className="gap-2 pt-2">
            {room?.event && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleDelete}
                disabled={deleting || saving}
              >
                {deleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                <span className="ml-1">削除</span>
              </Button>
            )}
            <Button type="button" variant="outline" size="sm" onClick={() => onOpenChange(false)}>
              キャンセル
            </Button>
            <Button type="submit" size="sm" disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
              保存
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
