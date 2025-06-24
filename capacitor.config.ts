import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.CalBus',
  appName: 'CalBus',
  webDir: 'dist',
  server: {
    androidScheme: 'http'
  }
};

export default config;
