import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

const FLOORS = [
  { id: 1, label: '1 階', description: 'カフェテリア・ものづくりシアター・アイデア工房' },
  { id: 2, label: '2 階', description: 'S202〜S216・N253・ラーニングコモンズ' },
  { id: 3, label: '3 階', description: 'S309〜S319・メカトロ実験室・ラーニングコモンズ' },
  { id: 4, label: '4 階', description: '共和松井ホール' },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-brand-900 flex flex-col">
      {/* ヘッダー */}
      <header className="flex-shrink-0 px-6 pt-8 pb-4 text-center">
        <p className="text-brand-100 text-sm font-medium tracking-widest uppercase mb-1">
          Sanjo City University
        </p>
        <h1 className="text-white text-3xl md:text-4xl font-bold tracking-tight">
          学園祭マップ
        </h1>
        <p className="text-brand-200 text-sm mt-2">
          フロアを選択してイベント情報を確認
        </p>
      </header>

      {/* フロア選択ボタン */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-6">
        <div className="w-full max-w-lg space-y-3">
          {FLOORS.map((floor) => (
            <Link key={floor.id} href={`/floor/${floor.id}`}>
              <div className="group bg-white/15 hover:bg-white/25 active:bg-white/30 border border-white/25 rounded-2xl p-5 flex items-center gap-5 transition-all cursor-pointer">
                {/* 階数バッジ */}
                <div className="w-16 h-16 rounded-xl bg-white/30 group-hover:bg-white/40 flex items-center justify-center shrink-0 transition-colors">
                  <span className="text-white text-2xl font-bold leading-none">
                    {floor.id}
                  </span>
                  <span className="text-white text-sm font-medium ml-0.5">F</span>
                </div>

                {/* テキスト */}
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xl font-bold">{floor.label}</p>
                  <p className="text-brand-200 text-sm mt-0.5 truncate">{floor.description}</p>
                </div>

                <ChevronRight className="text-white/40 group-hover:text-white/80 h-6 w-6 shrink-0 transition-colors" />
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* フッター */}
      <footer className="flex-shrink-0 pb-6 flex flex-col items-center gap-2">
        <Link
          href="/staff/login"
          className="text-brand-400 text-xs hover:text-brand-200 transition-colors"
        >
          スタッフ専用
        </Link>
      </footer>
    </div>
  )
}
