import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// ピン位置はフロアマップ画像を目視確認して設定 (% 単位)
// スタッフ管理画面の「ピン位置を設定」から後から調整可能
const rooms = [
  // ---- 1階 ----
  { name: 'ものづくりシアター',      floor: 1, imageName: 'making-theater.png',       pinX: 22, pinY: 20 },
  { name: 'アイデア工房 1階',         floor: 1, imageName: 'idea-workshop-1f.png',      pinX: 38, pinY: 33 },
  { name: 'カフェテリア',            floor: 1, imageName: 'cafeteria.png',             pinX: 42, pinY: 52 },
  { name: '授乳室',                  floor: 1, imageName: 'nursing-room.png',          pinX: 24, pinY: 47 },

  // ---- 2階 ----
  { name: 'S202・S203',              floor: 2, imageName: 's202-s203.png',             pinX:  8, pinY: 90 },
  { name: 'S204・S205',              floor: 2, imageName: 's204-s205.png',             pinX:  8, pinY: 83 },
  { name: 'S206',                    floor: 2, imageName: 's206.png',                  pinX:  8, pinY: 77 },
  { name: 'S207',                    floor: 2, imageName: 's207.png',                  pinX:  8, pinY: 73 },
  { name: 'S208',                    floor: 2, imageName: 's208.png',                  pinX:  8, pinY: 69 },
  { name: 'S209',                    floor: 2, imageName: 's209.png',                  pinX:  8, pinY: 65 },
  { name: 'S210',                    floor: 2, imageName: 's210.png',                  pinX:  8, pinY: 61 },
  { name: 'S211',                    floor: 2, imageName: 's211.png',                  pinX:  8, pinY: 57 },
  { name: 'S214',                    floor: 2, imageName: 's214.png',                  pinX:  8, pinY: 35 },
  { name: 'S216',                    floor: 2, imageName: 's216.png',                  pinX:  8, pinY: 23 },
  { name: 'N253',                    floor: 2, imageName: 'n253.png',                  pinX: 85, pinY: 57 },
  { name: 'プログラミング室',         floor: 2, imageName: 'programming-room.png',      pinX: 65, pinY: 50 },
  { name: 'アイデア工房 2階',         floor: 2, imageName: 'idea-workshop-2f.png',      pinX: 42, pinY: 22 },
  { name: 'アクティブラーニングルーム', floor: 2, imageName: 'active-learning-room.png', pinX: 82, pinY: 37 },
  { name: 'ラーニングコモンズ 2階',    floor: 2, imageName: 'learning-commons-2f.png',  pinX: 78, pinY: 72 },

  // ---- 3階 ----
  { name: 'S309',                    floor: 3, imageName: 's309.png',                  pinX:  8, pinY: 50 },
  { name: 'S310',                    floor: 3, imageName: 's310.png',                  pinX:  8, pinY: 47 },
  { name: 'S311',                    floor: 3, imageName: 's311.png',                  pinX:  8, pinY: 43 },
  { name: 'S317',                    floor: 3, imageName: 's317.png',                  pinX:  8, pinY: 15 },
  { name: 'S319',                    floor: 3, imageName: 's319.png',                  pinX:  8, pinY:  5 },
  { name: 'エレベーター前 3階',       floor: 3, imageName: 'elevator-front-3f.png',     pinX: 52, pinY: 27 },
  { name: 'メカトロ実験室',           floor: 3, imageName: 'mechatronics-lab.png',      pinX: 42, pinY:  7 },
  { name: 'ラーニングコモンズ 3階',    floor: 3, imageName: 'learning-commons-3f.png',  pinX: 38, pinY: 82 },

  // ---- 4階 ----
  { name: '共和松井ホール',           floor: 4, imageName: 'kyowa-matsui-hall.png',     pinX: 35, pinY: 22 },
]

async function main() {
  console.log('シードデータを登録中...')

  for (const room of rooms) {
    await prisma.room.upsert({
      where: {
        // name+floor の組み合わせで upsert するため、一意制約が必要
        // ここでは id を仮指定して create のみ実行 (初回セットアップ用)
        id: `seed-${room.floor}-${room.name}`,
      },
      update: {},
      create: {
        id: `seed-${room.floor}-${room.name}`,
        name: room.name,
        floor: room.floor,
        imageName: room.imageName,
        pinX: room.pinX,
        pinY: room.pinY,
      },
    })
  }

  console.log(`${rooms.length} 件の部屋を登録しました。`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
