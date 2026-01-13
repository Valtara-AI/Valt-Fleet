/**
 * Next.js Middleware for Security, Rate Limiting, and DDoS Protection
 * This runs on all routes before they are processed
 */

import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

// Security configuration
const ALLOWED_ORIGINS = [
  'https://fleet.valtara.ai',
  'https://omni.valtara.ai',
  'https://lms.valtara.ai',
  'https://realtor.valtara.ai',
  'https://valtara.ai',
];

// Rate limiting storage (in production, use Redis or similar)
const requestCounts = new Map<string, { count: number; resetTime: number }>();
const blockedIPs = new Set<string>();

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 100;
const BURST_LIMIT = 20; // Max requests in 1 second
const BAN_DURATION = 15 * 60 * 1000; // 15 minutes

// DDoS detection
const burstTracking = new Map<string, number[]>();

function getClientIP(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    'unknown'
  );
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = requestCounts.get(ip);

  if (!record || now > record.resetTime) {
    requestCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return false;
  }

  record.count++;
  
  if (record.count > MAX_REQUESTS_PER_WINDOW) {
    blockedIPs.add(ip);
    setTimeout(() => blockedIPs.delete(ip), BAN_DURATION);
    return true;
  }

  return false;
}

function detectBurstAttack(ip: string): boolean {
  const now = Date.now();
  const timestamps = burstTracking.get(ip) || [];
  
  // Keep only timestamps from the last second
  const recentTimestamps = timestamps.filter(t => now - t < 1000);
  recentTimestamps.push(now);
  
  burstTracking.set(ip, recentTimestamps);
  
  // If more than BURST_LIMIT requests in 1 second, it's a burst attack
  if (recentTimestamps.length > BURST_LIMIT) {
    blockedIPs.add(ip);
    setTimeout(() => blockedIPs.delete(ip), BAN_DURATION);
    return true;
  }
  
  return false;
}

export function middleware(request: NextRequest) {
  const ip = getClientIP(request);
  const origin = request.headers.get('origin');
  
  // Check if IP is blocked
  if (blockedIPs.has(ip)) {
    return new NextResponse('Too Many Requests - Your IP has been temporarily blocked', {
      status: 429,
      headers: {
        'Retry-After': '900', // 15 minutes
      },
    });
  }

  // Detect burst attacks
  if (detectBurstAttack(ip)) {
    console.warn(`Burst attack detected from IP: ${ip}`);
    return new NextResponse('Too Many Requests', { status: 429 });
  }

  // Check rate limiting
  if (isRateLimited(ip)) {
    console.warn(`Rate limit exceeded for IP: ${ip}`);
    return new NextResponse('Too Many Requests', { status: 429 });
  }

  // Create response
  const response = NextResponse.next();

  // Security Headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  // HSTS (only in production with HTTPS)
  if (request.nextUrl.protocol === 'https:') {
    response.headers.set(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains; preload'
    );
  }

  // Content Security Policy
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';"
  );

  // CORS handling
  if (origin) {
    const isDevelopment = process.env.NODE_ENV === 'development';
    const isAllowedOrigin = ALLOWED_ORIGINS.includes(origin) || 
                           (isDevelopment && origin.includes('localhost'));
    
    if (isAllowedOrigin) {
      response.headers.set('Access-Control-Allow-Origin', origin);
      response.headers.set('Access-Control-Allow-Credentials', 'true');
    }
  }

  // Handle preflight requests
  if (request.method === 'OPTIONS') {
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    response.headers.set(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization, X-API-Key'
    );
    response.headers.set('Access-Control-Max-Age', '86400');
    return new NextResponse(null, { status: 204, headers: response.headers });
  }

  return response;
}

// Specify which routes this middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public directory)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
