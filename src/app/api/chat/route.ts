import { NextRequest, NextResponse } from 'next/server';
import { chatService } from '@/lib/chat/chatService';
import { chatRequestSchema } from '@/lib/validation/chatSchema';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    // 1. Feature flag check
    if (process.env.NEXT_PUBLIC_CHAT_ENABLED !== 'true') {
      return NextResponse.json(
        { success: false, error: 'Chat is currently disabled.' },
        { status: 503 }
      );
    }

    // 2. Parse and validate request body
    const body = await request.json();

    let validated;
    try {
      validated = await chatRequestSchema.parseAsync(body);
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid request format.' },
        { status: 400 }
      );
    }

    // 3. Extract client identifier for rate limiting
    const clientId =
      request.headers.get('x-forwarded-for') ||
      request.headers.get('x-real-ip') ||
      'anonymous';

    // 4. Process through ChatService (includes key rotation)
    const response = await chatService.processMessage(
      validated.message,
      validated.conversationHistory,
      clientId
    );

    if (!response.success) {
      return NextResponse.json(response, { status: 429 });
    }

    return NextResponse.json(response);
  } catch (error) {
    logger.error('Chat API route error', { error });
    return NextResponse.json(
      { success: false, error: 'Internal server error.' },
      { status: 500 }
    );
  }
}
