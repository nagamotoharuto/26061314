import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { roomService } from '@/server/services/room-service'
import { FloorMapClient } from '@/components/features/floor-map-client'

interface PageProps {
  params: { floorId: string }
}

const FLOOR_DESCRIPTION: Record<number, string> = {
  1: 'カフェテリア・ものづくりシアター・アイデア工房',
  2: 'S棟 202〜216・N253・ラーニングコモンズ',
  3: 'S棟 309〜319・メカトロ実験室・ラーニングコモンズ',
  4: '共和松井ホール',
}

export default async function FloorPage({ params }: PageProps) {
  const floor = parseInt(params.floorId, 10)
  if (isNaN(floor) || floor < 1 || floor > 4) notFound()

  const rooms = await roomService.getRoomsForFloor(floor)

  const pinnedCount = rooms.filter((r) => r.event !== null).length

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* ヘッダー */}
      <header className="bg-brand-900 text-white flex-shrink-0 sticky top-0 z-30 shadow-md">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link href="/" className="flex items-center gap-1 text-brand-200 hover:text-white transition-colors">
            <ChevronLeft className="h-5 w-5" />
            <span className="text-sm">戻る</span>
          </Link>

          <div className="flex-1 min-w-0">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{floor}階</span>
              <span className="text-brand-200 text-sm hidden sm:block truncate">
                {FLOOR_DESCRIPTION[floor]}
              </span>
            </div>
          </div>

          {/* 他の階へのクイックリンク */}
          <div className="hidden sm:flex items-center gap-1">
            {[1, 2, 3, 4].filter((f) => f !== floor).map((f) => (
              <Link key={f} href={`/floor/${f}`}>
                <button className="text-xs text-brand-200 hover:text-white border border-brand-700 hover:border-brand-400 rounded px-2 py-1 transition-colors">
                  {f}F
                </button>
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* ピン数インジケーター */}
      {pinnedCount > 0 && (
        <div className="bg-brand-600 text-white text-center text-sm py-2 px-4">
          ピンをタップするとイベント情報が表示されます ({pinnedCount}件)
        </div>
      )}
      {pinnedCount === 0 && (
        <div className="bg-amber-50 text-amber-700 text-center text-sm py-2 px-4 border-b border-amber-200">
          このフロアにはまだイベント情報が登録されていません
        </div>
      )}

      {/* フロアマップ */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-3xl mx-auto px-0 sm:px-4 py-0 sm:py-4">
          <div className="bg-white sm:rounded-xl sm:shadow-sm overflow-hidden">
            <FloorMapClient floor={floor} rooms={rooms} />
          </div>
        </div>
      </main>

      {/* フッター: 他の階 (スマホ向け) */}
      <footer className="sm:hidden bg-white border-t border-gray-200 flex flex-shrink-0">
        {[1, 2, 3, 4].map((f) => (
          <Link key={f} href={`/floor/${f}`} className="flex-1">
            <button
              className={`w-full py-3 text-sm font-medium transition-colors ${
                f === floor
                  ? 'text-brand-600 bg-brand-50'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {f}階
            </button>
          </Link>
        ))}
      </footer>
    </div>
  )
}
