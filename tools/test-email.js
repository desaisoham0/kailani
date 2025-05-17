// Test script for email functionality
const nodemailer = require('nodemailer');
require('dotenv').config();

async function testEmailConfig() {
  // Get environment variables
  const emailUser = process.env.EMAIL_USER || process.env.EMAILUSER;
  const emailPass = process.env.EMAIL_PASS || process.env.EMAILPASS;
  const emailRecipient = process.env.EMAIL_RECIPIENT || process.env.EMAILRECIPIENT || emailUser;
  
  console.log('===== Email Configuration Check =====');
  console.log(`Email User: ${emailUser ? '✅ Configured' : '❌ Missing'}`);
  console.log(`Email Password: ${emailPass ? '✅ Configured' : '❌ Missing'}`);
  console.log(`Email Recipient: ${emailRecipient ? '✅ Configured' : '❌ Missing'}`);
  
  if (!emailUser || !emailPass) {
    console.error('❌ Error: Missing required email configuration. Please check your .env file.');
    return;
  }
  
  // Create test transporter
  console.log('\nAttempting to create email transporter...');
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });
    
    // Verify connection
    console.log('Verifying connection to email server...');
    await transporter.verify();
    console.log('✅ Email server connection successful!');
    
    // Send test email
    console.log(`\nSending test email to ${emailRecipient}...`);
    const info = await transporter.sendMail({
      from: emailUser,
      to: emailRecipient,
      subject: 'Kailani Website Email Test',
      text: 'This is a test email to confirm that your email configuration is working correctly.',
      html: '<h1>Kailani Email Test</h1><p>If you received this email, your email configuration is working correctly! 🎉</p>'
    });
    
    console.log('✅ Test email sent successfully!');
    console.log(`Message ID: ${info.messageId}`);
    console.log('\nYour email configuration is set up correctly.');
  } catch (error) {
    console.error('❌ Email configuration test failed:');
    console.error(error);
    console.error('\nPlease check your Gmail account settings:');
    console.error('1. Ensure you\'re using an App Password (not your regular password)');
    console.error('2. Make sure "Less secure app access" is enabled');
    console.error('3. Check if there are any security alerts in your Gmail account');
  }
}

testEmailConfig();
