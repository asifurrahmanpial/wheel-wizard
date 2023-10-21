import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
	appId: 'com.example.app',
	appName: 'client',
	webDir: 'dist/client',
	server: {
		url: 'http://192.168.0.120:4200',
		cleartext: true,
		androidScheme: 'https'
	}
};

export default config;
