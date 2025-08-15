import nodemailer from 'nodemailer';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configure email transporter
const emailUser = process.env.EMAIL_USER || process.env.EMAILUSER;
const emailPass = process.env.EMAIL_PASS || process.env.EMAILPASS;
const emailRecipient = process.env.EMAIL_RECIPIENT || process.env.EMAILRECIPIENT;

// Log detailed email configuration status (but not the actual credentials)
console.log('Email configuration check:');
console.log('Email user configured:', emailUser ? 'Yes' : 'No');
console.log('Email password configured:', emailPass ? 'Yes' : 'No');
console.log('Email recipient configured:', emailRecipient ? 'Yes' : 'No');
console.log('Email user variable name present as EMAIL_USER:', process.env.EMAIL_USER ? 'Yes' : 'No');
console.log('Email user variable name present as EMAILUSER:', process.env.EMAILUSER ? 'Yes' : 'No');

if (!emailUser || !emailPass) {
  console.error('Missing email credentials. Please check environment variables.');
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: emailUser,
    pass: emailPass,
  },
});

// Helper function to validate email
const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Parse the request body
    const { type, resume, resumeFilename, ...formData } = req.body;

    // Basic validation
    if (!type) {
      return res.status(400).json({ message: 'Form type is required' });
    }

    let emailSubject = '';
    let emailText = '';
    let emailHtml = '';
    
    // Process based on form type
    if (type === 'contact') {
      // Process contact form
      const { name, email, subject, message } = formData;
      
      if (!name || !email || !message) {
        return res.status(400).json({ message: 'Name, email and message are required' });
      }
      
      if (!isValidEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
      }
      
      emailSubject = `Kailani Contact Form: ${subject || 'New Message'}`;
      emailText = `
        Name: ${name}
        Email: ${email}
        
        Message:
        ${message}
      `;
      emailHtml = `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      `;
    } 
    else if (type === 'job') {
      // Process job application form
      const { fullName, email, phone, experience, coverLetter } = formData;
      
      if (!fullName || !email || !phone) {
        return res.status(400).json({ message: 'Name, email, and phone are required' });
      }
      
      if (!isValidEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
      }
      
      emailSubject = `Kailani Job Application`;
      emailText = `
        Name: ${fullName}
        Email: ${email}
        Phone: ${phone}
        Experience: ${experience || 'N/A'}
        
        Cover Letter:
        ${coverLetter || 'N/A'}
      `;
      emailHtml = `
        <h2>New Job Application</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Experience:</strong> ${experience || 'N/A'}</p>
        <p><strong>Cover Letter:</strong></p>
        <p>${(coverLetter || 'N/A').replace(/\n/g, '<br>')}</p>
      `;
      
      // Handle resume attachment if present
      if (resume) {
        // For now, we just note that a resume was included
        // In a real implementation with Vercel, you would:
        // 1. Store the file in a storage service like AWS S3
        // 2. Include a link to the file in the email

        const filename = resumeFilename || 'Resume';
        emailText += `\nResume: ${filename} (attached)`;
        emailHtml += `<p><strong>Resume:</strong> ${filename} (attached)</p>`;

        // Note: To fully implement file upload handling, you would need:
        // 1. A storage service (AWS S3, Google Cloud Storage, etc.)
        // 2. Proper multipart form handling library
        // 3. Processing of the file buffer before storage
      }
    } 
    else {
      return res.status(400).json({ message: 'Invalid form type' });
    }

    // Send email
    const mailOptions = {
      from: emailUser,
      to: emailRecipient || emailUser, // Fall back to sender if recipient is not set
      subject: emailSubject,
      text: emailText,
      html: emailHtml,
      // If we had attachments, we would handle them here
    };
    
    console.log('Attempting to send email to:', mailOptions.to);
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully. Message ID:', info.messageId);

    return res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    // Enhanced error logging
    console.error('Error sending email:', error);
    console.error('Environment check during error:');
    console.error('- EMAIL_USER present:', !!process.env.EMAIL_USER);
    console.error('- EMAILUSER present:', !!process.env.EMAILUSER);
    console.error('- EMAIL_PASS present:', !!process.env.EMAIL_PASS);
    console.error('- EMAILPASS present:', !!process.env.EMAILPASS);
    console.error('- Final emailUser value present:', !!emailUser);
    console.error('- Final emailPass value present:', !!emailPass);
    
    // Extract more meaningful error message
    let errorMessage = 'Failed to send email';
    if (error instanceof Error) {
      errorMessage = `${errorMessage}: ${error.message}`;
      console.error('Error details:', error.stack);
    }
    
    if (!emailUser || !emailPass) {
      errorMessage = 'Email configuration is missing. Please check server environment variables.';
    }
    
    // Ensure we always send a valid JSON response
    try {
      return res.status(500).json({ 
        message: errorMessage,
        error: error instanceof Error ? error.message : 'Unknown error',
        time: new Date().toISOString()
      });
    } catch (responseError) {
      console.error('Error sending error response:', responseError);
      return res.status(500).send(`Error: ${errorMessage}`);
    }
  }
}
