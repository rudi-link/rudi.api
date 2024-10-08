import { NextFunction, Request, Response } from 'express';
import { RequestWithUser } from '../../types/auth';
import { db } from '../../utils/db.server';
import { sendBadRequestResponse, sendNotFoundResponse } from '../../utils/responseHandler';
import { checkURL } from './link.service';

export async function create(request: Request, res: Response, next: NextFunction) {
  try {
    const {
      user,
      body: { website },
    } = request as RequestWithUser<{ website: string }>;

    if(!await checkURL(website)){
      return sendBadRequestResponse(res, 'URL invalid')
    }

    const rs = await db.link.create({
      data: {
        id: Date.now().toString(),
        website,
        userId: user.id
      },
    });

    return res.send(rs)
  } catch (error) {
    next(error);
  }
}

export async function use(request: Request, res: Response, next: NextFunction) {
    try {
        const {id} = request.params;

        if(!id) {
            return sendBadRequestResponse(res, 'Id params required !')
        }

        const rs = await db.link.findUnique({
          where: {
            id
          }
        })

        if(!rs){
          return sendNotFoundResponse(res, 'Not found')
        }

        return res.redirect(rs.website)
    } catch (error) {
        next(error)
    }
}
