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
            code: ['t', 'b', 'b','t'],
            avatar: "https://api.dicebear.com/9.x/big-smile/svg?seed=4man"
        }
    })
}

seed();
