import { Injectable } from '@nestjs/common';

@Injectable()
export class BetterAuthConfig {
  getStrategies() {
    return {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID || 'mock_google_id',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'mock_google_secret',
      },
      discord: {
        clientId: process.env.DISCORD_CLIENT_ID || 'mock_discord_id',
        clientSecret: process.env.DISCORD_CLIENT_SECRET || 'mock_discord_secret',
      },
      twitter: {
        clientId: process.env.X_CLIENT_ID || 'mock_x_id',
        clientSecret: process.env.X_CLIENT_SECRET || 'mock_x_secret',
      },
    };
  }
}
