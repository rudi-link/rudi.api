import { NextFunction, Request, Response } from 'express';
import { RequestWithUser } from '../../types/auth';
import { db } from '../../utils/db.server';
import { sendBadRequestResponse, sendNotFoundResponse } from '../../utils/responseHandler';
import { checkURL } from './link.service';

export async function get(request: Request, res: Response, next: NextFunction) {
  try {
    const {
      user,
      params: { id },
    } = request as RequestWithUser & {params: {id: string | 'all'}};
    
    if (!id) {
      return sendBadRequestResponse(res, 'Id params required !');
    }

    if(id === 'all'){
      const rs = await db.link.findMany({
        where: {
          userId: user.id
        },
        include: {
          tag: true
        }
      })

      return res.send(rs)
    }

    const rs = await db.link.findMany({
      where: {
        id,
        userId: user.id,
      },
      include: {
        tag: {
          include: {
            click: true
          }
        }
      }
    })

    await db.link.update({
      where: {
        id
      },
      data: {
        checked: true
      }
    })

    return res.send(rs)
  } catch (error) {
    next(error);
  }
}

export async function create(request: Request, res: Response, next: NextFunction) {
  try {
    const {
      user,
      body: { website },
    } = request as RequestWithUser<{ website: string }>;

    if (!(await checkURL(website))) {
      return sendBadRequestResponse(res, 'URL invalid');
    }

    const rs = await db.link.create({
      data: {
        id: Date.now().toString(),
        website,
        userId: user.id,
        tag: {
          create: {
            name: "default",
          }
        }
      },
    });

    return res.send(rs);
  } catch (error) {
    next(error);
  }
}

export async function use(request: Request, res: Response, next: NextFunction) {
  try {
    const { id } = request.params;

    if (!id) {
      return sendBadRequestResponse(res, 'Id params required !');
    }

    const rs = await db.link.findUnique({
      where: {
        id: id.split('#')[0],
      },
    });

    if (!rs) {
      return sendNotFoundResponse(res, 'Not found');
    }

    await db.click.create({
      data: {
        tagId: Number(id.split('#')[0] || 0)
      },
    });

    await db.link.update({
      where: {
        id: id.split('#')[0],
      },
      data: {
        checked: false
      }
    })

    return res.redirect(rs.website);
  } catch (error) {
    next(error);
  }
}
