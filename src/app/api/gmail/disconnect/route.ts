import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const response = NextResponse.json({ success: true });

  // Clear all auth cookies
  response.cookies.delete('gmail_access_token');
  response.cookies.delete('gmail_refresh_token');

  return response;
}
