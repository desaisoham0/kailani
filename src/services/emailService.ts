// Email service for handling form submissions

// Helper function to convert File to base64 string
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const base64String = reader.result as string;
      // Remove the data URL prefix (e.g., "data:application/pdf;base64,")
      const base64Content = base64String.split(',')[1];
      resolve(base64Content);
    };
    reader.onerror = error => {
      reject(error);
    };
  });
};

export interface ContactFormData {
  type: 'contact';
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export interface JobFormData {
  type: 'job';
  fullName: string;
  email: string;
  phone: string;
  position: string;
  experience?: string;
  coverLetter?: string;
  resume?: File | null;
}

export type EmailFormData = ContactFormData | JobFormData;

export async function submitForm(formData: FormData, type: 'contact' | 'job'): Promise<Response> {
  try {
    // Always use relative URL which will work in both development and production
    const apiUrl = '/api/send-email';
      
    console.log(`Submitting ${type} form to: ${apiUrl}`);
    
    // Create a JSON object from the FormData
    const formDataObj: Record<string, string | File> = { type };
    
    // Handle file data conversion to base64 for the resume
    if (type === 'job' && formData.has('resume')) {
      console.log('Processing resume for submission');
      const resumeFile = formData.get('resume') as File;
      
      if (resumeFile && resumeFile.size > 0) {
        // Check file size - 5MB is absolute limit, but we warn at 2MB
        const fileSizeMB = resumeFile.size / (1024 * 1024);
        
        if (fileSizeMB > 5) {
          throw new Error(`Resume file is too large (${fileSizeMB.toFixed(1)}MB). Please use a file smaller than 5MB.`);
        }
        
        try {
          // Convert file to base64
          const base64data = await fileToBase64(resumeFile);
          formDataObj.resumeData = base64data;
          formDataObj.resumeFilename = resumeFile.name;
          console.log(`Resume ${resumeFile.name} (${Math.round(resumeFile.size/1024)}KB) converted to base64 successfully`);
        } catch (err) {
          console.error('Error converting resume to base64:', err);
          throw new Error('Failed to process resume file. Please try with a different file or format.');
        }
      }
    }
    
    // Process all other form fields
    formData.forEach((value, key) => {
      if (key !== 'resume' && key !== 'type') { // Skip resume and type (we handle them separately)
        formDataObj[key] = value;
      }
    });
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formDataObj),
    });
    
    // Parse response data
    let responseData;
    let responseText = '';
    
    try {
      responseText = await response.text(); // First get as text
      try {
        responseData = JSON.parse(responseText); // Then try to parse as JSON
      } catch {
        console.warn('Could not parse response as JSON:', responseText);
        responseData = { 
          message: responseText || 'Failed to parse server response',
          rawResponse: responseText
        };
      }
    } catch {
      responseData = { message: 'Failed to get response content' };
    }
    
    if (!response.ok) {
      console.error(`Server responded with status ${response.status}:`, responseData);
      throw new Error(responseData.message || `Server error: ${response.status}`);
    }
    
    console.log(`${type} form submitted successfully:`, responseData);
    return response;
  } catch (error) {
    console.error(`Error submitting ${type} form:`, error);
    throw error;
  }
}
