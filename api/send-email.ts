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
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
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
        // Note: In a real implementation, you would need to handle file uploads
        // This is a simplified version and would require additional code to handle file attachments
        emailText += '\nResume was attached to the application.';
        emailHtml += '<p><strong>Resume:</strong> Attached</p>';
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
