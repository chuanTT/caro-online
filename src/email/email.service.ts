import { ConfigService } from '@nestjs/config';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;
  private nameApp: string;
  private userMail: string;

  constructor(private readonly configService: ConfigService) {
    const user = configService.get('mailer.auth.user');
    this.nameApp = configService.get('mailer.auth.user.name');
    this.userMail = user;
    this.transporter = nodemailer.createTransport({
      host: configService.get('mailer.host'), // Thay thế bằng địa chỉ SMTP server
      port: +configService.get('mailer.port', 587), // Cổng SMTP
      secure: configService.get('mailer.secure', true), // true cho cổng 465, false cho cổng khác
      auth: {
        user, // Địa chỉ email
        pass: configService.get('mailer.auth.pass'), // Mật khẩu email
      },
    });
  }

  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    const mailOptions: Mail['options'] = {
      from: `${this.nameApp} <${this.userMail}>`,
      to,
      subject,
      html,
    };

    try {
      await this.transporter.sendMail(mailOptions);
    } catch {
      throw new InternalServerErrorException('Không thể gửi email');
    }
  }

  async senEmailPassword(to: string, password: string) {
    this.sendEmail(
      to,
      'Thay đổi mật khẩu',
      `Mật khẩu mới của bạn là: <b>${password}<b/>`,
    );
  }
}
