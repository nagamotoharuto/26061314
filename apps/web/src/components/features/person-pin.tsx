import type { SVGProps } from 'react'

/** 人型マップピン */
export function PersonPin({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={className}
      {...props}
    >
      {/* ピン本体（しずく形） */}
      <path
        d="M12 0C5.373 0 0 5.373 0 12C0 19.5 12 36 12 36C12 36 24 19.5 24 12C24 5.373 18.627 0 12 0Z"
        fill="currentColor"
      />
      {/* 人の頭 */}
      <circle cx="12" cy="9.5" r="3.2" fill="white" />
      {/* 人の肩〜胴 */}
      <path d="M5.5 19.5C5.5 14.5 18.5 14.5 18.5 19.5" fill="white" />
    </svg>
  )
}
