import { http, HttpResponse } from 'msw';
import { z } from 'zod';

import type { User } from '@/types/user.ts';

let users: User[] = [{ id: 1, name: '홍길동' }];

export const sampleHandlers = [
  http.get('http://localhost:8080/api/users', () => {
    return HttpResponse.json(users);
  }),

  http.post('http://localhost:8080/api/users', async ({ request }) => {
    const requestBody = await request.json();

    const validatedRequestBody = z
      .object({ name: z.string().min(1) })
      .safeParse(requestBody);
    if (!validatedRequestBody.success) {
      return HttpResponse.json({ message: 'BAD_REQUEST' }, { status: 400 });
    }

    const user = {
      id: users.length + 1,
      name: validatedRequestBody.data.name,
    };

    users.push(user);

    return HttpResponse.json(user);
  }),

  http.put(
    'http://localhost:8080/api/users/:id',
    async ({ params, request }) => {
      const id = Number(params.id);
      const requestBody = await request.json();
      const updateUser = users.find((user) => user.id === id);

      if (!updateUser) {
        return HttpResponse.json(
          { message: 'NOT_FOUND_USER' },
          { status: 201 },
        );
      }

      users = users.map((user) =>
        user.id === id ? { ...user, requestBody } : user,
      );

      return HttpResponse.json({ message: 'UPDATE_USER' }, { status: 200 });
    },
  ),

  http.delete('http://localhost:8080/api/users/:id', ({ params }) => {
    const id = Number(params.id);
    const deleteUser = users.find((user) => user.id === id);

    if (!deleteUser) {
      return HttpResponse.json({ message: 'NOT_FOUND_USER' }, { status: 204 });
    }

    users = users.filter((user) => user.id !== id);

    return HttpResponse.json({ message: 'DELETED_USER' }, { status: 200 });
  }),
];
