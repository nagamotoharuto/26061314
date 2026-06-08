'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, Info, MapPin } from 'lucide-react'
import { formatDateTime } from '@/lib/utils'
import type { RoomWithEvent } from '@/server/repositories/room-repository'

interface EventModalProps {
  room: RoomWithEvent | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EventModal({ room, open, onOpenChange }: EventModalProps) {
  if (!room) return null

  const event = room.event

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-[90vw]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="h-4 w-4 text-brand-600 shrink-0" />
            <span className="text-sm text-gray-500">{room.floor}階</span>
          </div>
          <DialogTitle className="text-2xl">{room.name}</DialogTitle>
          <DialogDescription className="sr-only">
            {room.name} のイベント情報
          </DialogDescription>
        </DialogHeader>

        {event ? (
          <div className="space-y-4 pt-2">
            <div className="bg-brand-50 rounded-lg p-4">
              <div className="flex items-start gap-2 mb-3">
                <Info className="h-4 w-4 text-brand-600 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-brand-600 font-medium mb-0.5">イベント名</p>
                  <p className="font-bold text-lg text-gray-900">{event.title}</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-gray-500 font-medium">イベント内容</p>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {event.description}
              </p>
            </div>

            <div className="border-t border-gray-100 pt-3 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Calendar className="h-4 w-4 text-brand-600 shrink-0" />
                <span className="font-medium">開催日時:</span>
                <span>{formatDateTime(event.startAt)}</span>
              </div>
              {event.endAt && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4 text-brand-600 shrink-0" />
                  <span className="font-medium">終了日時:</span>
                  <span>{formatDateTime(event.endAt)}</span>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="text-gray-400 text-sm">現在イベント情報はありません</p>
          </div>
        )}

        {event && (
          <div className="flex justify-end pt-2">
            <Badge variant="secondary">開催中</Badge>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
