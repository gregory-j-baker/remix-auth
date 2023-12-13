import { redirect, type LoaderFunctionArgs } from '@remix-run/node';
import { oidcClient } from '~/auth.server';
import { createSession } from '~/session.server';

async function doLogin(request: Request) {
  const { getSession } = await createSession();
  const session = await getSession(request.headers.get('Cookie'));

  if (!session.has('auth')) {
    const signinRequest = await oidcClient.createSigninRequest({});
    return redirect(signinRequest.url);
  }

  // TODO -- look up next hop from request
  return redirect('/');
}

async function doCallback(request: Request) {
  const { getSession, commitSession } = await createSession();
  const session = await getSession(request.headers.get('Cookie'));

  const auth = await oidcClient.processSigninResponse(request.url);
  console.debug(auth)
  session.set('auth', auth);

  // TODO -- look up next hop from request
  return redirect('/', {
    headers: { 'Set-Cookie': await commitSession(session) },
  });
}

export async function loader({ params, request }: LoaderFunctionArgs) {
  switch (params.action) {
    case 'login':
      return await doLogin(request);

    case 'callback':
      return await doCallback(request);

    default:
      throw Error('unknown auth action');
  }
}
