import { Request, Response } from 'express';
import { db } from '../../utils/db.server';
import { Login, Register, RequestWithUser } from '../../types/auth';
import HttpStatusCode from '../../utils/HttpStatusCode';
import jwt from 'jsonwebtoken';

export async function register(req: Request<{}, {}, Register>, res: Response) {
  try {
    const data = req.body;
    const resp = await db.user.create({ data });

    res.send(resp);
  } catch (error) {
    res.status(500).json(error);
  }
}

export async function login(req: Request<{}, {}, Login>, res: Response) {
  try {
    const data = req.body;
    const resp = await db.user.findUnique({
      where: {
        name: data.name,
        code: {
          equals: data.code,
        },
      },
    });

    if (!resp) {
      return res.status(HttpStatusCode.NOT_FOUND).send();
    }

    const token = jwt.sign({ id: resp.id }, process.env.JWT_SECRET || '');

    res.send({ token });
  } catch (error) {
    res.status(500).json(error);
  }
}

export async function auth(req: Request, res: Response) {
  const { user } = req as RequestWithUser;
  res.send(user);
}
