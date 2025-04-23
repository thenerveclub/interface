import { NextResponse } from 'next/server';

export default function middleware(req) {
	// No operations are performed, simply return a NextResponse object
	return NextResponse.next();
}
