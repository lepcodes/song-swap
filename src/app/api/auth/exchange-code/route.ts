import { env } from '@/env'
import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function GET( request: NextRequest) {
  
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get('code')
  const service = searchParams.get('service')

  if (!code){
    return NextResponse.json({ error: 'No code found' }, { status: 400 });
  }

  if (!service){
    return NextResponse.json({ error: 'No service found' }, { status: 400 });
  } 
  
  try {
    const response = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(env.SPOTIFY_CLIENT_ID + ':' + env.SPOTIFY_CLIENT_SECRET).toString('base64'),
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: env.SPOTIFY_REDIRECT_URI,
      })
    })
    console.log(response)
    const data = await response.json()
    const cookieStore = await cookies()
    cookieStore.set('access_token', data.access_token, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365,
    })
    return NextResponse.json({ success: true });
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}