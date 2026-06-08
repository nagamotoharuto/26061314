import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'
import { roomService } from '@/server/services/room-service'
import { FloorMapClient } from '@/components/features/floor-map-client'
import { FlowerInline } from '@/components/features/flower-decoration'

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
      {/* ヘッダー (桃色) */}
      <header className="bg-brand-900 text-yellow-300 flex-shrink-0 sticky top-0 z-30 shadow-md overflow-hidden relative">
        {/* ヘッダー背景の薄い花模様 */}
        <FlowerInline className="absolute -right-3 -top-3 w-16 h-16 text-pink-300 opacity-10 rotate-12 pointer-events-none" />
        <FlowerInline className="absolute left-1/2 -top-4 w-12 h-12 text-pink-200 opacity-[0.07] pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-3 relative">
          <Link href="/" className="flex items-center gap-1 text-yellow-200/80 hover:text-yellow-300 transition-colors">
            <ChevronLeft className="h-5 w-5" />
            <span className="text-sm">戻る</span>
          </Link>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <FlowerInline className="w-4 h-4 text-pink-300 shrink-0 opacity-70" />
              <span className="text-2xl font-bold">{floor}階</span>
              <span className="text-white/70 text-sm hidden sm:block truncate">
                {FLOOR_DESCRIPTION[floor]}
              </span>
            </div>
          </div>

          {/* 他の階へのクイックリンク */}
          <div className="hidden sm:flex items-center gap-1">
            {[1, 2, 3, 4].filter((f) => f !== floor).map((f) => (
              <Link key={f} href={`/floor/${f}`}>
                <button className="text-xs text-yellow-300 hover:text-yellow-100 bg-pink-800/50 hover:bg-pink-700/60 border border-pink-600/40 hover:border-pink-400/60 rounded px-2 py-1 transition-colors font-medium">
                  {f}F
                </button>
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* ピン数インジケーター (緑色) */}
      {pinnedCount > 0 && (
        <div className="bg-green-700 text-yellow-300 text-center text-sm py-2 px-4 flex items-center justify-center gap-2">
          <FlowerInline className="w-3.5 h-3.5 text-green-300" />
          ピンをタップするとイベント情報が表示されます ({pinnedCount}件)
          <FlowerInline className="w-3.5 h-3.5 text-green-300" />
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
