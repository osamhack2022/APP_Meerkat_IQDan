import {PrismaClient} from "@prisma/client"

// export default class Prisma {
//     public prisma: PrismaClient

//     constructor () {
//         this.prisma = new PrismaClient()
//     }

//     public getPrisma() {
//         return this.prisma
//     }
// }

export default new PrismaClient()