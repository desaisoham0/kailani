import nodemailer from 'nodemailer';
import type { VercelRequest, VercelResponse } from '@vercel/node';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
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
    const { type, ...formData } = req.body;

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
      const { fullName, email, phone, position, experience, coverLetter } = formData;
      
      if (!fullName || !email || !phone || !position) {
        return res.status(400).json({ message: 'Name, email, phone and position are required' });
      }
      
      if (!isValidEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
      }
      
      emailSubject = `Kailani Job Application: ${position}`;
      emailText = `
        Name: ${fullName}
        Email: ${email}
        Phone: ${phone}
        Position: ${position}
        Experience: ${experience || 'N/A'}
        
        Cover Letter:
        ${coverLetter || 'N/A'}
      `;
      emailHtml = `
        <h2>New Job Application</h2>
        <p><strong>Name:</strong> ${fullName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Position:</strong> ${position}</p>
        <p><strong>Experience:</strong> ${experience || 'N/A'}</p>
        <p><strong>Cover Letter:</strong></p>
        <p>${(coverLetter || 'N/A').replace(/\n/g, '<br>')}</p>
      `;
      
      // Handle resume attachment if present
      if (req.body.resume) {
        // For now, we just note that a resume was included
        // In a real implementation with Vercel, you would:
        // 1. Store the file in a storage service like AWS S3
        // 2. Include a link to the file in the email
        
        emailText += '\nResume was attached to the application.';
        emailHtml += '<p><strong>Resume:</strong> Included in submission</p>';
        
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
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_RECIPIENT || process.env.EMAIL_USER,
      subject: emailSubject,
      text: emailText,
      html: emailHtml,
      // If we had attachments, we would handle them here
    });

    return res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ message: 'Failed to send email' });
  }
}
