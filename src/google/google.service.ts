import { Injectable } from '@nestjs/common';
import { google, sheets_v4 } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';
import { addHours, format } from 'date-fns';

@Injectable()
export class GoogleService {
    private sheets: sheets_v4.Sheets;
    private spreadsheetId: string;


  constructor(private readonly configService: ConfigService) {
    const credentials = {
      type: this.configService.get<string>('GOOGLE_TYPE'),
      project_id: this.configService.get<string>('GOOGLE_PROJECT_ID'),
      private_key_id: this.configService.get<string>('GOOGLE_PRIVATE_KEY_ID'),
      private_key: this.configService.get<string>('GOOGLE_PRIVATE_KEY')?.replace(/\\n/g, '\n'),
      client_email: this.configService.get<string>('GOOGLE_CLIENT_EMAIL'),
      client_id: this.configService.get<string>('GOOGLE_CLIENT_ID'),
      auth_uri: this.configService.get<string>('GOOGLE_AUTH_URI'),
      token_uri: this.configService.get<string>('GOOGLE_TOKEN_URI'),
      auth_provider_x509_cert_url: this.configService.get<string>('GOOGLE_AUTH_PROVIDER_CERT_URL'),
      client_x509_cert_url: this.configService.get<string>('GOOGLE_CLIENT_CERT_URL'),
      universe_domain: this.configService.get<string>('GOOGLE_UNIVERSE_DOMAIN'),
    };
    
    this.spreadsheetId = this.configService.get<string>('SPREADSHEET_ID')as string;
  
  
    const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  this.sheets = google.sheets({ version: 'v4', auth });
}


  async clearSheet(sheetName: string) {
    try {
      await this.sheets.spreadsheets.values.clear({
        spreadsheetId: this.spreadsheetId,
        range: `${sheetName}!A:Z`,
      });
    } catch (err) {
      // Sheet yo'q bo‘lsa - jim turamiz
    }
  }

  async ensureSheetExists(sheetTitle: string) {
    try {
      await this.sheets.spreadsheets.batchUpdate({
        spreadsheetId: this.spreadsheetId,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: sheetTitle,
                },
              },
            },
          ],
        },
      });
    } catch (e) {
      // Agar mavjud bo‘lsa xatoni e’tiborsiz qoldiramiz
    }
  }

  async writeUsersToSheet(sheetTitle: string, users: any[], includeReferrer = false) {
  await this.ensureSheetExists(sheetTitle);
  await this.clearSheet(sheetTitle);

  const headers = ['#', 'F.I.Sh.', 'Telefon', 'Qo‘shimcha tel', 'Telegram', 'Link', 'Status', 'Ariza vaqti'];
  if (includeReferrer) headers.push('Referrer Operator');

  const values = [
  headers,
  ...users.map((user, i) => {
   const formattedDate = user.applicationDate
  ? format(new Date(user.applicationDate), 'yyyy-MM-dd HH:mm')
  : '';

    const row = [
      i + 1,
      user.fullName || '',
      user.phone || '',
      user.additionalPhone || '',
      user.username || '',
      user.utmTag || '',
      user.status || '',
      formattedDate,
    ];

    if (includeReferrer) {
      row.push(user.referrerOperator?.name || '');
    }

    return row;
  }),
];

  await this.sheets.spreadsheets.values.update({
    spreadsheetId: this.spreadsheetId,
    range: `${sheetTitle}!A1`,
    valueInputOption: 'RAW',
    requestBody: {
      values,
    },
  });
}

}
