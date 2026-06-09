import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { FlowerBgDecoration, FlowerInline } from '@/components/features/flower-decoration'

const FLOORS = [
  { id: 1, label: '1 階', description: 'カフェテリア・ものづくりシアター・体育館' },
  { id: 2, label: '2 階', description: 'S202〜S216・N253・ラーニングコモンズ' },
  { id: 3, label: '3 階', description: 'S309〜S319・メカトロ実験室・ラーニングコモンズ' },
  { id: 4, label: '4 階', description: '共和松井ホール' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-sky-100 flex flex-col relative overflow-hidden">
      {/* 背景花飾り */}
      <FlowerBgDecoration />

      {/* ヘッダー */}
      <header className="flex-shrink-0 px-6 pt-10 pb-4 text-center relative z-10">
        <div className="flex items-center justify-center gap-2 mb-1">
          <FlowerInline className="w-4 h-4 text-sky-400 opacity-80" />
          <p className="text-brand-700 text-sm font-medium tracking-widest uppercase">
            Sanjo City University
          </p>
          <FlowerInline className="w-4 h-4 text-sky-400 opacity-80" />
        </div>

        <h1 className="text-brand-900 text-3xl md:text-4xl font-bold tracking-tight mt-1">
          学園祭マップ
        </h1>

        <p className="text-brand-700/80 text-sm mt-2">
          フロアを選択してイベント情報を確認
        </p>
      </header>

      {/* フロア選択ボタン */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-4 relative z-10">
        <div className="w-full max-w-lg space-y-3">
          {FLOORS.map((floor) => (
            <Link key={floor.id} href={`/floor/${floor.id}`}>
              <div className="group bg-white/80 hover:bg-white border border-sky-200 hover:border-brand-400 hover:shadow-md rounded-2xl p-5 flex items-center gap-5 transition-all cursor-pointer shadow-sm">
                {/* 階数バッジ */}
                <div className="w-16 h-16 rounded-xl bg-brand-900 group-hover:bg-brand-800 flex items-center justify-center shrink-0 transition-colors relative overflow-hidden">
                  <FlowerInline className="absolute inset-0 w-full h-full text-sky-300 opacity-15" />
                  <span className="relative text-white text-2xl font-bold leading-none z-10">
                    {floor.id}
                  </span>
                  <span className="relative text-sky-300 text-sm font-medium ml-0.5 z-10">F</span>
                </div>

                {/* テキスト */}
                <div className="flex-1 min-w-0">
                  <p className="text-brand-900 text-xl font-bold">{floor.label}</p>
                  <p className="text-brand-700/70 text-sm mt-0.5 truncate">{floor.description}</p>
                </div>

                <ChevronRight className="text-brand-300 group-hover:text-brand-600 h-6 w-6 shrink-0 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* フッター */}
      <footer className="flex-shrink-0 pb-6 flex flex-col items-center gap-3 relative z-10">
        <div className="flex items-center gap-2 opacity-30">
          <span className="block w-12 h-px bg-brand-400" />
          <FlowerInline className="w-3 h-3 text-sky-400" />
          <FlowerInline className="w-3 h-3 text-brand-500" />
          <FlowerInline className="w-3 h-3 text-sky-400" />
          <span className="block w-12 h-px bg-brand-400" />
        </div>
        <Link
          href="/staff/login"
          className="text-brand-700/40 text-xs hover:text-brand-700/70 transition-colors"
        >
          スタッフ専用
        </Link>
      </footer>
    </div>
  )
}
