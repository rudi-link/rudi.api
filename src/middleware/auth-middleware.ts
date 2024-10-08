import { NextFunction, Request, Response } from 'express';
import { sendBadRequestResponse } from '../utils/responseHandler';
import { verifyToken } from '../utils/jwtHandler';
import { db } from '../utils/db.server';
import { RequestWithUser } from '../types/auth';

export const protectAuth = async (req: Request, response: Response, next: NextFunction) => {
  const request = req as RequestWithUser;

  const token = (() => {
    const headers = request.headers;
    const bearer = headers.authorization! as string;
    return bearer.split(' ')[1];
  })();

  if (token) {
    try {
      const decoded = verifyToken(token);
      const authUser = await db.user.findUnique({
        where: {
          id: decoded.id,
        },
      });

      if (authUser?.name) {
        request.user = authUser;
      }

      next();
    } catch (error) {
      next(error);
    }
  } else {
    return sendBadRequestResponse(response, 'Unauthorized');
  }
};
