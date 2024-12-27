import { db } from '../src/utils/db.server';

async function seed() {
    const user = await db.user.findUniqueOrThrow({
        where: {
            name: "fabrich"
        }
    })
    if(user){
        await db.user.delete({
            where: {
                id: user.id
            }
        })
    }
    await db.user.create({
        data: {
            name: "fabrich",
            code: ['t', 'b', 'b','t']
        }
    })
}

seed();
