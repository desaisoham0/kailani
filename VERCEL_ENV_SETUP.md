# Setting up Environment Variables on Vercel

To make the email functionality work correctly on Vercel, you need to configure the following environment variables in your Vercel project settings.

## Required Environment Variables

1. **EMAILUSER**: Your Gmail email address (e.g., example@gmail.com)
2. **EMAILPASS**: Your Gmail App Password. This is not your regular Gmail password.
3. **EMAILRECIPIENT**: Email address to receive form submissions (can be the same as EMAILUSER)

## How to Set Up Environment Variables on Vercel

1. Go to your Vercel Dashboard: https://vercel.com/dashboard
2. Select your project
3. Click on the "Settings" tab
4. Select "Environment Variables" from the left sidebar
5. Add each variable:
   - Click "Add New"
   - Enter the variable name (e.g., EMAILUSER)
   - Enter the value
   - Make sure "Production" is selected (and optionally "Preview" and "Development")
   - Click "Save"
6. Repeat for all three environment variables
7. Redeploy your project to apply the changes

## Creating a Gmail App Password

For security reasons, Gmail requires an App Password for sending emails from third-party applications:

1. Go to your Google Account: https://myaccount.google.com/
2. Select "Security" from the left menu
3. Under "Signing in to Google," select "2-Step Verification" (enable it if not already)
4. Scroll down to "App passwords" and select it
5. Select "Mail" for the app and "Other" for the device type
6. Give it a name like "Kailani Website"
7. Click "Generate"
8. Copy the 16-character password (spaces don't matter)
9. Use this password as your EMAILPASS value in Vercel

## Troubleshooting

If emails still aren't sending:

1. Check Vercel Function Logs for detailed error messages
2. Ensure that "Less secure app access" is enabled in your Google account
3. Verify that the App Password is correct
4. Make sure all three environment variables are properly set in Vercel

For any issues, contact your developer or check the Vercel documentation.
