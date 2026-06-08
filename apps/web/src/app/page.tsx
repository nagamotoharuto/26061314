import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { FlowerBgDecoration, FlowerInline } from '@/components/features/flower-decoration'

const FLOORS = [
  { id: 1, label: '1 階', description: 'カフェテリア・ものづくりシアター・アイデア工房' },
  { id: 2, label: '2 階', description: 'S202〜S216・N253・ラーニングコモンズ' },
  { id: 3, label: '3 階', description: 'S309〜S319・メカトロ実験室・ラーニングコモンズ' },
  { id: 4, label: '4 階', description: '共和松井ホール' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-brand-900 flex flex-col relative overflow-hidden">
      {/* 背景花飾り */}
      <FlowerBgDecoration />

      {/* ヘッダー */}
      <header className="flex-shrink-0 px-6 pt-10 pb-4 text-center relative z-10">
        <div className="flex items-center justify-center gap-2 mb-1">
          <FlowerInline className="w-4 h-4 text-pink-300 opacity-80" />
          <p className="text-white text-sm font-medium tracking-widest uppercase">
            Sanjo City University
          </p>
          <FlowerInline className="w-4 h-4 text-pink-300 opacity-80" />
        </div>

        <h1 className="text-green-300 text-3xl md:text-4xl font-bold tracking-tight mt-1">
          学園祭マップ
        </h1>

        <p className="text-white/80 text-sm mt-2">
          フロアを選択してイベント情報を確認
        </p>
      </header>

      {/* フロア選択ボタン */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-4 relative z-10">
        <div className="w-full max-w-lg space-y-3">
          {FLOORS.map((floor) => (
            <Link key={floor.id} href={`/floor/${floor.id}`}>
              <div className="group bg-white/15 hover:bg-white/22 active:bg-white/28 border border-white/20 hover:border-white/35 rounded-2xl p-5 flex items-center gap-5 transition-all cursor-pointer">
                {/* 階数バッジ */}
                <div className="w-16 h-16 rounded-xl bg-white/20 group-hover:bg-white/30 flex items-center justify-center shrink-0 transition-colors relative overflow-hidden">
                  {/* バッジ内の薄い花模様 */}
                  <FlowerInline className="absolute inset-0 w-full h-full text-pink-300 opacity-15" />
                  <span className="relative text-green-300 text-2xl font-bold leading-none z-10">
                    {floor.id}
                  </span>
                  <span className="relative text-green-300 text-sm font-medium ml-0.5 z-10">F</span>
                </div>

                {/* テキスト */}
                <div className="flex-1 min-w-0">
                  <p className="text-green-300 text-xl font-bold">{floor.label}</p>
                  <p className="text-white/80 text-sm mt-0.5 truncate">{floor.description}</p>
                </div>

                <ChevronRight className="text-green-300/50 group-hover:text-green-300 h-6 w-6 shrink-0 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* フッター */}
      <footer className="flex-shrink-0 pb-6 flex flex-col items-center gap-3 relative z-10">
        {/* 花区切り線 */}
        <div className="flex items-center gap-2 opacity-30">
          <span className="block w-12 h-px bg-pink-300" />
          <FlowerInline className="w-3 h-3 text-pink-300" />
          <FlowerInline className="w-3 h-3 text-green-300" />
          <FlowerInline className="w-3 h-3 text-pink-300" />
          <span className="block w-12 h-px bg-pink-300" />
        </div>
        <Link
          href="/staff/login"
          className="text-white/40 text-xs hover:text-white/70 transition-colors"
        >
          スタッフ専用
        </Link>
      </footer>
    </div>
  )
}
