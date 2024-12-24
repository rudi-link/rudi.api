import { NextFunction, Request, Response } from 'express';
import { db } from '../../utils/db.server';
import { sendBadRequestResponse } from '../../utils/responseHandler';
import { RequestWithUser } from '../../types/auth';

export async function getOne(request: Request, res: Response, next: NextFunction) {
  try {
    if (!request.query.id) {
      return sendBadRequestResponse(res, 'Id query required !');
    }

    const { user } = request as RequestWithUser;

    const rs = await db.visite.findUnique({
      where: {
        id: request.query.id as string,
        userId: user.id,
      },
      include: {
        visiter: true,
      },
    });

    await db.visite.update({
      where: {
        id: rs?.id
      },
      data: {
        checked: true
      }
    })

    return res.send(rs);
  } catch (error) {
    next(error);
  }
}

export async function getAll(request: Request, res: Response, next: NextFunction) {
  try {
    const { user } = request as RequestWithUser;

    const rs = await db.visite.findMany({
      where: {
        userId: user.id,
      },
    });

    return res.send(rs);
  } catch (error) {
    next(error);
  }
}

export async function create(request: Request, res: Response, next: NextFunction) {
  try {
    const {
      user,
      body: { name },
    } = request as RequestWithUser<{ name: string}>;

    const rs = await db.visite.create({
      data: {
        userId: user.id,
        name
      }
    })

    res.send(rs)
  } catch (error) {
    next(error)
  }
}

export async function visite(request: Request, res: Response, next: NextFunction) {
  try {
    const id = request.query.id as string;
    const { user } = request as RequestWithUser;

    if (!id) {
      return sendBadRequestResponse(res, 'Id query required');
    }

    await db.visiter.create({
      data: {
        id: Date.now().toString(),
        visite: {
          connect: {
            id,
            userId: user.id,
          },
        },
      },
    });

    return res.status(400).send('ok');
  } catch (error) {
    next(error);
  }
}

export async function out(id: string) {
  await db.visiter.update({
    where: {
      id,
    },
    data: {
      outedAt: Date.now().toString(),
    },
  });
}
