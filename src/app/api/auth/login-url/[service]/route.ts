import { NextRequest, NextResponse } from 'next/server'
import { ServiceKeys, ServiceNames } from '@/types/services';
import { env } from '@/env'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ service: ServiceNames}> },
) {
  const service = (await params).service;
  if (!ServiceKeys.includes(service)){
    return NextResponse.json({ error: 'not found' }, { status: 404 });
  }
  let authUrl = ''
  if (service === 'spotify'){
    const params = new URLSearchParams();
    params.append('response_type', 'code');
    params.append('client_id', env.SPOTIFY_CLIENT_ID);
    params.append('scope', 'playlist-read-private');
    params.append('redirect_uri', env.SPOTIFY_REDIRECT_URI);
    params.append('show_dialog', 'true');
    authUrl = `https://accounts.spotify.com/authorize?${params.toString()}`;
  }
  return NextResponse.json({ url: authUrl });
}