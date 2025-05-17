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
  // Add the form type to the data
  formData.append('type', type);
  
  try {
    const response = await fetch('/api/send-email', {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to submit form');
    }
    
    return response;
  } catch (error) {
    console.error(`Error submitting ${type} form:`, error);
    throw error;
  }
}
