/* eslint-disable @typescript-eslint/no-unused-vars */

import { createMemorySessionStorage, createSessionStorage, type CookieSerializeOptions, createFileSessionStorage } from '@remix-run/node';
import { createClient } from 'redis';

import * as crypto from 'crypto';

const cookie = { name: '__GjB//session', path: '/', secrets: ['secret'], sameSite: true };
const sessionType = 'FILE' as 'REDIS' | 'FILE';

function generateId() {
  return crypto.randomUUID();
}

async function createRedisSessionStorage({ cookie }: { cookie: CookieSerializeOptions }) {
  const expiresInSeconds = 600;

  const redisClient = createClient({ url: 'redis://localhost' });
  const redisClientType = await redisClient.connect();

  return createSessionStorage({
    cookie,
    async createData(data) {
      const id = generateId();
      await redisClient.set(id, JSON.stringify(data), { EX: expiresInSeconds });
      return id;
    },
    async readData(id) {
      const data = await redisClient.get(id);
      return data ? await JSON.parse(data) : null;
    },
    async updateData(id, data) {
      await redisClient.set(id, JSON.stringify(data), { EX: expiresInSeconds });
    },
    async deleteData(id) {
      await redisClient.del(id);
    },
  });
}

export async function createSession() {
  switch (sessionType) {
    case 'REDIS':
      return createRedisSessionStorage({ cookie });
    case 'FILE':
      return createFileSessionStorage({
        dir: './.cache/sessions',
        cookie,
      });
  }
}
