import { google } from 'googleapis';
import { redirect } from 'next/navigation';
import { NextResponse } from 'next/server';

export async function GET() {
  console.log('apirequest');
  try {
    const oauthClient = new google.auth.OAuth2(
      process.env.Client_ID,
      process.env.Client_Secret,
      process.env.REDIRECT_URI
    );
    const SCOPES = ['https://www.googleapis.com/auth/gmail.send'];
    const authUrl = oauthClient.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
      prompt: 'consent',
    });

    // This returns a proper redirect response
    return NextResponse.json({ authUrl: authUrl }, { status: 200 });
  } catch (error: any) {
    //TODO: cleanup of type any for error
    // Use NextResponse.redirect() with a string URL

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to initiate OAuth',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
