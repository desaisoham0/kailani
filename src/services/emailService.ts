// Email service for handling form submissions

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
  // Add the type to the FormData if not already present
  if (!formData.has('type')) {
    formData.append('type', type);
  }
  
  try {
    // Always use relative URL which will work in both development and production
    const apiUrl = '/api/send-email';
      
    console.log(`Submitting ${type} form to: ${apiUrl}`);
    
    // For job application with resume, use FormData directly
    if (type === 'job' && formData.has('resume')) {
      console.log('Submitting form with resume attachment');
      const response = await fetch(apiUrl, {
        method: 'POST',
        // Don't set Content-Type header - browser will set it with correct boundary for FormData
        body: formData,
      });
      return response;
    }
    
    // For regular forms without file uploads, use JSON
    const formDataObj: Record<string, any> = { type };
    formData.forEach((value, key) => {
      if (key !== 'type') { // already added above
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
      } catch (parseErr) {
        console.warn('Could not parse response as JSON:', responseText);
        responseData = { 
          message: responseText || 'Failed to parse server response',
          rawResponse: responseText
        };
      }
    } catch (err) {
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
