import { NextRequest, NextResponse } from 'next/server';
import { sendContactEmail, ContactEmailData } from '@/lib/email';
import { contactFormSchema } from '@/lib/validation/schemas';

export async function POST(request: NextRequest) {
  try {
    const body: ContactEmailData = await request.json();

    // Validate using Zod
    try {
      await contactFormSchema.parseAsync(body);
    } catch (error) {
      // Return structured validation error
      // We can manually format it or use ErrorHandler if desired, but for API responses we want pure JSON
      // Currently using simple response.
      return NextResponse.json(
        { success: false, error: 'Validation failed', details: error },
        { status: 400 }
      );
    }

    // Send email using the global email service
    const result = await sendContactEmail(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: { message: result.error || 'Failed to send email' } },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
