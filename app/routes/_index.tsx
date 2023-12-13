/* eslint-disable @typescript-eslint/no-unused-vars */

import { json, type LoaderFunctionArgs, type MetaFunction } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { createSession } from '~/session.server';

export const meta: MetaFunction = () => {
  return [{ title: 'New Remix App' }, { name: 'description', content: 'Welcome to Remix!' }];
};

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { getSession } = await createSession();
  const session = await getSession(request.headers.get('Cookie'));

  const auth = session.get('auth');

  return json({ auth });
};

export default function Index() {
  const loaderData = useLoaderData<typeof loader>();

  return (
    <>
      <Link to="/auth/login">Login</Link>
      <h1>Session data:</h1>
      <pre style={{ border: 'thin solid black', width: '500px', overflow: 'scroll' }}>{JSON.stringify(loaderData, null, 2)}</pre>
    </>
  );
}
