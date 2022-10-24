import {PrismaClient} from "@prisma/client"

// prisma의 model을 매번 가져오면 prisma client가 그만큼 생성되기 때문에,
// prisma의 model을 사용할 때는 해당 파일을 import해서 사용해야 합니다.
export default new PrismaClient()