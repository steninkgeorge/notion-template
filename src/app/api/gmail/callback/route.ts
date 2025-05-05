import { google } from 'googleapis';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  console.log('Received code:', code); // Debug log

  if (!code) {
    console.error('No authorization code provided');
    return NextResponse.redirect(new URL('/?error=no_code', request.url));
  }

  try {
    const oauthClient = new google.auth.OAuth2(
      process.env.Client_ID,
      process.env.Client_Secret,
      process.env.REDIRECT_URI
    );

    console.log('Exchanging code for tokens...'); // Debug log
    const { tokens } = await oauthClient.getToken(code);
    console.log('Received tokens:', tokens); // Debug log

    // Create response object for redirect
    const response = NextResponse.redirect(new URL('/', request.url));

    // Set cookies directly on the response
    response.cookies.set({
      name: 'gmail_access_token',
      value: tokens.access_token || '',
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: tokens.expiry_date
        ? Math.floor((tokens.expiry_date - Date.now()) / 1000)
        : 3600, // 1 hour
    });

    if (tokens.refresh_token) {
      console.log('Setting refresh token cookie'); // Debug log
      response.cookies.set({
        name: 'gmail_refresh_token',
        value: tokens.refresh_token,
        httpOnly: true,
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 2592000, // 30 days
      });
    }

    console.log('Cookies set on response:', response.cookies.getAll()); // Debug log
    return response;
  } catch (error: any) {
    console.error('Token exchange error:', error);
    return NextResponse.redirect(
      new URL(`/?error=${encodeURIComponent(error.message)}`, request.url)
    );
  }
}
