import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore = cookies();
  const accessToken = (await cookieStore).get('gmail_access_token');
  const refreshToken = (await cookieStore).get('gmail_refresh_token');

  return NextResponse.json({
    authenticated: !!accessToken?.value,
    hasRefreshToken: !!refreshToken?.value,
  });
}
