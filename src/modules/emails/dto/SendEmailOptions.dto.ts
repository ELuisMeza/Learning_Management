export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  attachments?: Array<{
    filename?: string;
    path?: string;
    content?: string | Buffer;
    cid?: string;
    contentType?: string;
    contentDisposition?: 'attachment' | 'inline';
  }>;
}
