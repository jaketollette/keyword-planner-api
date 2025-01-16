import dotenv from 'dotenv';
import path from 'path';

// Load environment variables before anything else
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Add debug logging
console.log('Environment variables loaded:');
console.log('GOOGLE_ADS_CLIENT_ID:', process.env.GOOGLE_ADS_CLIENT_ID?.substring(0, 10) + '...');
console.log('GOOGLE_ADS_CLIENT_SECRET:', process.env.GOOGLE_ADS_CLIENT_SECRET ? 'Present' : 'Missing');
console.log('GOOGLE_ADS_DEVELOPER_TOKEN:', process.env.GOOGLE_ADS_DEVELOPER_TOKEN ? 'Present' : 'Missing');
console.log('GOOGLE_ADS_API_REFRESH_TOKEN:', process.env.GOOGLE_ADS_API_REFRESH_TOKEN ? 'Present' : 'Missing');