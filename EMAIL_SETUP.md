# Email Configuration Guide for Kailani

This guide explains how to set up the email functionality for both the job application form and the contact form on the Kailani website.

## Prerequisites

1. A Gmail account that will be used to send emails
2. An app password for the Gmail account (for increased security)

## Setting Up Gmail App Password

Since May 30, 2022, Google no longer supports less secure apps. Instead, you'll need to use an App Password:

1. Go to your [Google Account](https://myaccount.google.com/)
2. Select "Security"
3. Under "Signing in to Google," select "2-Step Verification" (make sure it's turned on)
4. At the bottom of the page, select "App passwords"
5. Select "Mail" as the app and "Other" as the device type
6. Enter "Kailani Website" (or any name you prefer)
7. Click "Generate"
8. Copy the 16-character password that appears

## Environment Variables Configuration

1. Create a `.env` file in the root of your project (it's already been created for you)
2. Update the following environment variables:

```
# Email configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password
EMAIL_RECIPIENT=where-emails-should-go@example.com
```

**Note:** The `EMAIL_RECIPIENT` is optional. If not specified, emails will be sent to the `EMAIL_USER` address.

## Testing the Setup

1. Deploy your application to Vercel
2. Test both the job application form and the contact form
3. Check the email inbox of the recipient to verify that emails are being received

## Troubleshooting

If emails are not being sent:

1. Verify that your app password is correct
2. Check that your Gmail account doesn't have additional security settings that might block the connection
3. Look at the Vercel Function Logs for any error messages

## Security Considerations

- Never commit your `.env` file to version control
- Use Vercel's environment variables interface to securely store your email credentials
- Regularly rotate your app password for enhanced security
