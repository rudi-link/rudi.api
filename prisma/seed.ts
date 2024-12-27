import { db } from '../src/utils/db.server';

async function seed() {
    await db.user.create({
        data: {
            name: "fabrich",
            code: ['t', 'b', 'b','t']
        }
    })
}

seed();
