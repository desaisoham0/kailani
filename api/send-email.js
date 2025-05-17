// ES Module version of the email sender
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Configure email transporter
const emailUser = process.env.EMAIL_USER || process.env.EMAILUSER;
const emailPass = process.env.EMAIL_PASS || process.env.EMAILPASS;
const emailRecipient = process.env.EMAIL_RECIPIENT || process.env.EMAILRECIPIENT;

// Log detailed email configuration status (but not the actual credentials)
console.log('Email configuration check:');
console.log('Email user configured:', !!emailUser ? 'Yes' : 'No');
console.log('Email password configured:', !!emailPass ? 'Yes' : 'No');
console.log('Email recipient configured:', !!emailRecipient ? 'Yes' : 'No');
console.log('Email user variable name present as EMAIL_USER:', !!process.env.EMAIL_USER ? 'Yes' : 'No');
console.log('Email user variable name present as EMAILUSER:', !!process.env.EMAILUSER ? 'Yes' : 'No');

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
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Export configuration for Vercel
export const config = {
  // Use the default runtime and body parsing
};

// Export the handler function directly
export default async function handler(req, res) {
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
    console.log('Request received, content-type:', req.headers['content-type']);
    
    // Parse the request body - Vercel automatically handles JSON parsing
    const body = req.body;
    
    console.log('Body received:', Object.keys(body).join(', '));
    
    // For Vercel serverless environment, we can't handle file uploads directly
    // but we can process the rest of the form data
    const type = body.type;
    const formData = { ...body };
    delete formData.type;
    
    // We'll handle resume as a base64 string if it's included
    let resumeData = null;
    // Define resumeAttachment at the function scope so it's available throughout
    let resumeAttachment = null;
    if (body.resumeData) {
      try {
        resumeData = {
          filename: body.resumeFilename || 'resume.pdf',
          content: Buffer.from(body.resumeData, 'base64')
        };
        console.log(`Resume processed: ${body.resumeFilename}, ${Math.round(body.resumeData.length/1.37/1024)}KB`);
        // Remove these from formData to keep it clean
        delete formData.resumeData;
        delete formData.resumeFilename;
      } catch (error) {
        console.error('Error processing resume data:', error);
        return res.status(400).json({ message: 'Invalid resume data format' });
      }
    }

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
      if (resumeData) {
        // We have resume data sent as base64
        emailText += `\nResume: ${resumeData.filename} (attached)`;
        emailHtml += `<p><strong>Resume:</strong> ${resumeData.filename} (attached)</p>`;
        
        resumeAttachment = {
          filename: resumeData.filename,
          content: resumeData.content
        };
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
    };
    
    // Add resume attachment if available
    if (resumeAttachment) {
      mailOptions.attachments = [resumeAttachment];
    }
    
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
