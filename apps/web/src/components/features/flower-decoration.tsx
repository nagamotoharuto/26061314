import type { SVGProps } from 'react'

/** 5枚花びらのシンプルな SVG 花 */
export function FlowerSvg({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
      {...props}
    >
      <g transform="translate(50,50)">
        {[0, 72, 144, 216, 288].map((angle) => (
          <ellipse
            key={angle}
            cx="0"
            cy="-21"
            rx="10"
            ry="19"
            fill="currentColor"
            transform={`rotate(${angle})`}
          />
        ))}
        {/* 花の中心 (黄色) */}
        <circle cx="0" cy="0" r="10" fill="#fde047" />
      </g>
    </svg>
  )
}

/** ホーム画面の背景に散りばめる花飾り */
export function FlowerBgDecoration() {
  return (
    <div aria-hidden className="absolute inset-0 pointer-events-none select-none overflow-hidden">
      <FlowerSvg className="absolute -top-8 -right-8 w-52 h-52 text-pink-300 opacity-[0.09] rotate-12" />
      <FlowerSvg className="absolute top-1/3 -left-12 w-56 h-56 text-pink-200 opacity-[0.07]" />
      <FlowerSvg className="absolute bottom-24 right-6 w-32 h-32 text-pink-300 opacity-[0.10] rotate-[30deg]" />
      <FlowerSvg className="absolute -bottom-6 left-10 w-40 h-40 text-pink-200 opacity-[0.06] -rotate-12" />
      <FlowerSvg className="absolute top-24 left-[30%] w-14 h-14 text-white opacity-[0.08] rotate-[15deg]" />
      <FlowerSvg className="absolute top-8 left-[60%] w-10 h-10 text-pink-100 opacity-[0.12] -rotate-6" />
    </div>
  )
}

/** 見出し横に置く小さな花アイコン */
export function FlowerInline({ className }: { className?: string }) {
  return <FlowerSvg className={className ?? 'inline-block w-4 h-4 text-pink-300'} />
}
