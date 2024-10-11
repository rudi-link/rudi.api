import { NextFunction, Request, Response } from 'express';
import { RequestWithUser } from '../../types/auth';
import { db } from '../../utils/db.server';
import { sendBadRequestResponse, sendNotFoundResponse } from '../../utils/responseHandler';
import { checkURL } from './link.service';
import HttpStatusCode from '../../utils/HttpStatusCode';

export async function get(request: Request, res: Response, next: NextFunction) {
  try {
    const {
      user,
      params: { id },
    } = request as RequestWithUser & { params: { id: string | 'all' } };

    if (!id) {
      return sendBadRequestResponse(res, 'Id params required !');
    }

    if (id === 'all') {
      const rs = await db.link.findMany({
        where: {
          userId: user.id,
        },
        include: {
          tag: true,
        },
      });

      return res.send(rs);
    }

    const rs = await db.link.findMany({
      where: {
        id,
        userId: user.id,
      },
      include: {
        tag: {
          include: {
            click: true,
          },
        },
      },
    });

    await db.link.update({
      where: {
        id,
      },
      data: {
        checked: true,
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
      body: { website, tag },
    } = request as RequestWithUser<{ website: string, tag: {name: string}[] }>;

    if (!(await checkURL(website))) {
      return sendBadRequestResponse(res, 'URL invalid');
    }

    const rs = await db.link.create({
      data: {
        id: website.split('://')[1].split('.')[0],
        website,
        userId: user.id,
        tag: {
          createMany: {
            data: tag
          }
        },
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
      return sendBadRequestResponse(res, `params required !`);
    }

    const rs = await db.link.findUnique({
      where: {
        id: id.split('@')[0],
      },
    });

    if (!rs) {
      return sendNotFoundResponse(res, 'Not found');
    }

    if (id.split('@')[1]) {
      if (!(await db.tag.findUnique({ where: { id: Number(id.split('@')[1]), linkId: rs.id } })))
        return sendBadRequestResponse(res, 'Bad request');
      await db.click.create({
        data: {
          tagId: Number(id.split('@')[1]),
        },
      });
    } else {
      const tag = await db.tag.findMany({
        where: {
          linkId: rs.id,
          name: 'default',
        },
      });

      if (tag.length !== 1) {
        return res.status(HttpStatusCode.CONFLICT).send();
      }

      await db.click.create({
        data: {
          tagId: tag[0].id,
        },
      });
    }

    await db.link.update({
      where: {
        id: id.split('@')[0],
      },
      data: {
        checked: false,
      },
    });

    return res.redirect(rs.website);
  } catch (error) {
    next(error);
  }
}
