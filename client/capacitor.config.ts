import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
	appId: 'com.example.app',
	appName: 'Wheel Wizard',
	webDir: 'www',
	server: {
		url: 'http://192.168.0.120:4200',
		cleartext: true,
		androidScheme: 'https'
	}
	// appId: 'com.example.app',
	// appName: 'Wheel Wizard',
	// webDir: 'www',
	// bundledWebRuntime: false
};

export default config;
