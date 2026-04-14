import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
console.log('Testing key:', API_KEY);

const response = await fetch(
  `https://generativelanguage.googleapis.com/v1/models?key=${API_KEY}`
);

const data = await response.json();

if (response.ok) {
  console.log('✅ KEY IS VALID!');
  console.log('Available models:');
  data.models.forEach(m => console.log(' -', m.name));
} else {
  console.log('❌ KEY IS INVALID');
  console.log('Status:', response.status);
  console.log('Error:', data.error?.message);
}