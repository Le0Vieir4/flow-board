import { Injectable, Logger } from "@nestjs/common";
import { Resend } from "resend";

export interface EmailInput {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly resend: Resend | null;
  private readonly fromEmail: string;

  constructor() {
    const apiKey = process.env.RESEND_API_KEY;
    this.fromEmail = process.env.RESEND_FROM_EMAIL ?? "noreply@flowboard.local";
    this.resend = apiKey ? new Resend(apiKey) : null;
    if (!this.resend) {
      this.logger.warn("RESEND_API_KEY not set — emails will be logged to console only");
    }
  }

  async send(input: EmailInput): Promise<void> {
    if (this.resend) {
      try {
        await this.resend.emails.send({
          from: this.fromEmail,
          to: input.to,
          subject: input.subject,
          html: input.html,
          text: input.text,
        });
        return;
      } catch (err) {
        this.logger.error(`Failed to send email to ${input.to}:`, err);
      }
    }

    // Dev fallback: log the email content to console
    this.logger.log(`\n--- EMAIL (dev fallback) ---\nTo: ${input.to}\nSubject: ${input.subject}\nText: ${input.text ?? input.html}\n---`);
  }
}
