import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.teashop.billboard',
  appName: 'Tea Shop Billboard',
  webDir: 'dist',
  server: {
    androidScheme: 'http'
  }
};

export default config;
