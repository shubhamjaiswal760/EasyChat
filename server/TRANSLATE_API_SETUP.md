# Google Translate API Setup Guide

## Steps to get Google Translate API Key:

1. **Go to Google Cloud Console**

   - Visit: https://console.cloud.google.com/

2. **Create a new project or select existing one**

   - Click on the project dropdown at the top
   - Click "New Project" or select an existing project

3. **Enable the Translate API**

   - Go to "APIs & Services" > "Library"
   - Search for "Cloud Translation API"
   - Click on it and press "Enable"

4. **Create API Key**

   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the generated API key

5. **Restrict the API Key (Recommended)**

   - Click on the API key you just created
   - Under "API restrictions", select "Restrict key"
   - Choose "Cloud Translation API"
   - Save the changes

6. **Add to your .env file**
   - Replace `YOUR_GOOGLE_TRANSLATE_API_KEY` in your .env file with the actual API key

## Important Notes:

- The Google Translate API is a paid service, but it offers free tier with generous limits
- Keep your API key secure and never commit it to version control
- The API has usage limits and costs, monitor your usage in Google Cloud Console
- For production, consider setting up billing alerts

## Alternative Setup (Service Account - More Secure):

If you prefer using a service account instead of API key:

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in the details and create
4. Download the JSON key file
5. Update the translator.js file to use the service account key instead of API key

## Testing:

After setup, restart your server and test the translation feature in the profile settings.
