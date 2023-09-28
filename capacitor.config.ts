import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.gerencial',
  appName: 'app-gerencial',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
