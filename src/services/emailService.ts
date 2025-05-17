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
  // Convert FormData to a plain object
  const formDataObj: Record<string, any> = { type };
  
  // Extract all form data
  formData.forEach((value, key) => {
    formDataObj[key] = value;
  });
  
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formDataObj),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new Error(errorData.message || 'Failed to submit form');
    }
    
    return response;
  } catch (error) {
    console.error(`Error submitting ${type} form:`, error);
    throw error;
  }
}
