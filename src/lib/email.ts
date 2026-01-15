import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface ContactEmailData {
  name: string;
  email: string;
  message: string;
}

export interface EmailResult {
  success: boolean;
  error?: string;
}

/**
 * Global email service using Resend
 * This service is shared across all themes - only the UI differs per theme
 */
export async function sendContactEmail(data: ContactEmailData): Promise<EmailResult> {
  const { name, email, message } = data;

  try {
    const { error } = await resend.emails.send({
      from: 'Portfolio Contact <onboarding@resend.dev>', // Update with your verified domain
      to: process.env.CONTACT_EMAIL || 'gauravsaxena.jaipur@gmail.com',
      replyTo: email,
      subject: `Portfolio Contact: ${name}`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #007acc, #00ff9d); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">New Contact Message</h1>
          </div>
          <div style="padding: 30px; background: #f9f9f9;">
            <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <p style="margin: 0 0 10px;"><strong style="color: #007acc;">From:</strong> ${name}</p>
              <p style="margin: 0 0 20px;"><strong style="color: #007acc;">Email:</strong> ${email}</p>
              <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
              <p style="margin: 0 0 10px;"><strong style="color: #007acc;">Message:</strong></p>
              <p style="margin: 0; white-space: pre-wrap; line-height: 1.6;">${message}</p>
            </div>
          </div>
          <div style="padding: 15px; text-align: center; background: #1e1e1e; color: #888;">
            <p style="margin: 0; font-size: 12px;">Sent from Gaurav Saxena Portfolio</p>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Email service error:', err);
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to send email'
    };
  }
}
