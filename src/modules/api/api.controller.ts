import { NextFunction, Request, Response } from 'express';
import { RequestWithUser } from '../../types/auth';
import type { Auto, Manual } from '../../types/api';
import { faker } from '@faker-js/faker';
import HttpStatusCode from '../../utils/HttpStatusCode';
import { db } from '../../utils/db.server';
import { sendBadRequestResponse, sendErrorResponse } from '../../utils/responseHandler';
import { generateJSON } from './api.service';

export async function getAll(request: Request, res: Response, next: NextFunction) {
  try {
    const { user } = request as RequestWithUser;

    const rs = await db.visite.findMany({
      where: {
        userId: user.id
      },
      select: {
        id: true,
        name: true,
      },
    });
    return res.send(rs);
  } catch (error) {
    next(error);
  }
}

export async function getOne(request: Request, res: Response, next: NextFunction) {
  try {
    if (!request.params.id) {
      return sendBadRequestResponse(res, 'Id params required !');
    }

    const { user } = request as RequestWithUser;

    const rs = await db.visite.findUnique({
      where: {
        id: request.params.id,
        userId: user.id
      },
    });

    return res.send(rs);
  } catch (error) {
    next(error);
  }
}

export async function generateManual(request: Request, res: Response) {
  try {
    const {
      user,
      body: { count, prompts, name, isPrivate },
    } = request as RequestWithUser<Manual>;

    let predata: { key: string; values: Array<any> }[] = [];

    prompts.forEach((prompt) => {
      switch (prompt.type) {
        case 'name':
          {
            let values: Array<any> = [];
            for (let index = 0; index < count; index++) {
              values.push(faker.person.firstName());
            }
            predata.push({ key: prompt.key, values });
          }
          break;
        case 'image':
          {
            let values: Array<any> = [];
            for (let index = 0; index < count; index++) {
              values.push(faker.image.url());
            }
            predata.push({ key: prompt.key, values });
          }
          break;
        case 'number': {
          let values: Array<any> = [];
          for (let index = 0; index < count; index++) {
            values.push(faker.number.int());
          }
          predata.push({ key: prompt.key, values });
        }
        case 'phone':
          {
            let values: Array<any> = [];
            for (let index = 0; index < count; index++) {
              values.push(faker.phone.number({ style: 'international' }));
            }
            predata.push({ key: prompt.key, values });
          }
          break;
        case 'date':
          {
            let values: Array<any> = [];
            for (let index = 0; index < count; index++) {
              values.push(faker.date.soon());
            }
            predata.push({ key: prompt.key, values });
          }
          break;
        case 'word':
          {
            let values: Array<any> = [];
            for (let index = 0; index < count; index++) {
              const module = faker.helpers.arrayElement(['noun', 'sample', 'verb']);
              values.push(faker.word[module]());
            }
            predata.push({ key: prompt.key, values });
          }
          break;
        case 'city':
          {
            let values: Array<any> = [];
            for (let index = 0; index < count; index++) {
              values.push(faker.person.firstName());
            }
            predata.push({ key: prompt.key, values });
          }
          break;
        case 'lorem':
          {
            let values: Array<any> = [];
            for (let index = 0; index < count; index++) {
              values.push(faker.lorem.paragraph({ max: 30, min: 10 }));
            }
            predata.push({ key: prompt.key, values });
          }
          break;
        default:
          res.status(HttpStatusCode.NOT_IMPLEMENTED);
          break;
      }
    });

    const numberOfItems = predata[0].values.length;
    const data = [];

    for (let i = 0; i < numberOfItems; i++) {
      const obj: any = {};
      predata.forEach((item) => {
        obj['id'] = Date.now();
        obj[item.key] = item.values[i];
      });
      data.push(obj);
    }

    const resp = await db.api.create({
      data: {
        id: Date.now().toString(),
        name,
        data,
        isPrivate,
        userId: user.id,
      },
    });

    res.send(resp);
  } catch (error) {
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR);
  }
}

export async function generateAuto(request: Request, res: Response) {
  try {
    const {
      user,
      body: { name, prompt, isPrivate },
    } = request as RequestWithUser<Auto>;

    const data = await generateJSON(prompt);

    if (!data) {
      sendErrorResponse(res, 'not generated', HttpStatusCode.INTERNAL_SERVER_ERROR);
      return;
    }

    const resp = await db.api.create({
      data: {
        id: Date.now().toString(),
        data,
        name,
        isPrivate,
        userId: user.id,
      },
    });

    res.send(resp);
  } catch (error) {
    res.status(500).send(error);
  }
}

export async function use(request: Request, res: Response) {
  try {
    const { id } = request.params;

    const data = await db.api.findUnique({
      where: {
        id,
        isPrivate: false,
      },
    });

    if (!data) {
      sendBadRequestResponse(res, 'not found');
      return;
    }

    res.send({
      success: true,
      data: data.data,
    });
  } catch (error) {
    res.send(HttpStatusCode.INTERNAL_SERVER_ERROR);
  }
}
