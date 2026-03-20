// Doctor Service - API implementation for backend
// Uses HTTP requests to backend API

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface Doctor {
    id: number;
    full_name: string;
    specialization?: string;
    qualifications?: string;
    experience_years?: number;
    email: string;
    mobile: string;
    rating?: number;
    totalConsultations?: number;
    availableDays?: string[];
    availableTime?: string;
    status: string;
    date_of_birth?: string;
    medical_council_reg_no: string;
    medical_council_name?: string;
    registration_year?: number;
    university_name?: string;
    graduation_year?: number;
    bio?: string;
    bank_account_name?: string;
    bank_account_number?: string;
    ifsc_code?: string;
    pan_number?: string;
    gstin?: string;
    verification_status: string;
    created_at?: string;
    updated_at?: string;
}

class DoctorService {
    private async getAuthHeaders() {
        const token = localStorage.getItem('auth_token');
        return {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
        };
    }

    async getDoctors(): Promise<Doctor[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/doctors`, {
                headers: await this.getAuthHeaders(),
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result.data?.doctors || [];
        } catch (error) {
            console.error('Error fetching doctors:', error);
            throw error;
        }
    }

    async getDoctorById(id: number | string): Promise<Doctor | null> {
        try {
            const response = await fetch(`${API_BASE_URL}/doctors/${id}`, {
                headers: await this.getAuthHeaders(),
                credentials: 'include',
            });

            if (!response.ok) {
                if (response.status === 404) return null;
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result.data || null;
        } catch (error) {
            console.error('Error fetching doctor:', error);
            return null;
        }
    }

    async createDoctor(doctor: any): Promise<Doctor> {
        try {
            const response = await fetch(`${API_BASE_URL}/doctors`, {
                method: 'POST',
                headers: await this.getAuthHeaders(),
                body: JSON.stringify(doctor),
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result.data;
        } catch (error) {
            console.error('Error creating doctor:', error);
            throw error;
        }
    }

    async updateDoctor(id: number | string, updates: Partial<Doctor>): Promise<Doctor | null> {
        try {
            const response = await fetch(`${API_BASE_URL}/doctors/${id}`, {
                method: 'PUT',
                headers: await this.getAuthHeaders(),
                body: JSON.stringify(updates),
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result.data || null;
        } catch (error) {
            console.error('Error updating doctor:', error);
            throw error;
        }
    }

    async getDoctorPatients(filter?: string, startDate?: string, endDate?: string): Promise<any[]> {
        try {
            const query = new URLSearchParams();
            if (filter) query.append('filter', filter);
            if (startDate) query.append('startDate', startDate);
            if (endDate) query.append('endDate', endDate);

            const response = await fetch(`${API_BASE_URL}/doctors/patients?${query.toString()}`, {
                headers: await this.getAuthHeaders(),
                credentials: 'include',
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const result = await response.json();
            return result.data || [];
        } catch (error) {
            console.error('Error fetching doctor patients:', error);
            throw error;
        }
    }

    async deleteDoctorPatient(id: string): Promise<boolean> {
        try {
            const response = await fetch(`${API_BASE_URL}/doctors/patients/${id}`, {
                method: 'DELETE',
                headers: await this.getAuthHeaders(),
                credentials: 'include',
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return true;
        } catch (error) {
            console.error('Error deleting doctor patient:', error);
            return false;
        }
    }

    async getDoctorAppointments(filters: { doctor_id?: string; type?: string; dateFilter?: string; from?: string; to?: string } = {}): Promise<any[]> {
        try {
            const query = new URLSearchParams();
            if (filters.doctor_id) query.append('doctor_id', filters.doctor_id);
            if (filters.type) query.append('type', filters.type);
            if (filters.dateFilter) query.append('dateFilter', filters.dateFilter);
            if (filters.from) query.append('from', filters.from);
            if (filters.to) query.append('to', filters.to);

            const response = await fetch(`${API_BASE_URL}/appointments?${query.toString()}`, {
                headers: await this.getAuthHeaders(),
                credentials: 'include',
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const result = await response.json();
            return result.data || [];
        } catch (error) {
            console.error('Error fetching doctor appointments:', error);
            throw error;
        }
    }

    async startAppointment(appointment_id: string): Promise<any> {
        try {
            const response = await fetch(`${API_BASE_URL}/appointments/start`, {
                method: 'POST',
                headers: await this.getAuthHeaders(),
                body: JSON.stringify({ appointment_id }),
                credentials: 'include',
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const result = await response.json();
            return result.data;
        } catch (error) {
            console.error('Error starting appointment:', error);
            throw error;
        }
    }

    async updateAppointmentStatus(appointment_id: string, status: string): Promise<any> {
        try {
            const response = await fetch(`${API_BASE_URL}/appointments/status`, {
                method: 'PUT',
                headers: await this.getAuthHeaders(),
                body: JSON.stringify({ appointment_id, status }),
                credentials: 'include',
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const result = await response.json();
            return result.data;
        } catch (error) {
            console.error('Error updating appointment status:', error);
            throw error;
        }
    }

    async rescheduleAppointment(data: { appointment_id: string; appointment_date: string; appointment_time: string }): Promise<any> {
        try {
            const response = await fetch(`${API_BASE_URL}/appointments/reschedule`, {
                method: 'PUT',
                headers: await this.getAuthHeaders(),
                body: JSON.stringify(data),
                credentials: 'include',
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const result = await response.json();
            return result.data;
        } catch (error) {
            console.error('Error rescheduling appointment:', error);
            throw error;
        }
    }

    async deleteAppointment(id: string): Promise<any> {
        try {
            const response = await fetch(`${API_BASE_URL}/appointments/${id}`, {
                method: 'DELETE',
                headers: await this.getAuthHeaders(),
                credentials: 'include',
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const result = await response.json();
            return result.data;
        } catch (error) {
            console.error('Error deleting appointment:', error);
            throw error;
        }
    }

    async getDoctorPrescriptions(filter?: string, date?: string): Promise<any[]> {
        try {
            const query = new URLSearchParams();
            if (filter) query.append('filter', filter);
            if (date) query.append('date', date);

            const response = await fetch(`${API_BASE_URL}/doctors/prescriptions?${query.toString()}`, {
                headers: await this.getAuthHeaders(),
                credentials: 'include',
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const result = await response.json();
            return result.data || [];
        } catch (error) {
            console.error('Error fetching doctor prescriptions:', error);
            throw error;
        }
    }

    async createDoctorPrescription(data: any): Promise<any> {
        try {
            const response = await fetch(`${API_BASE_URL}/doctors/prescriptions`, {
                method: 'POST',
                headers: await this.getAuthHeaders(),
                body: JSON.stringify(data),
                credentials: 'include',
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const result = await response.json();
            return result.data;
        } catch (error) {
            console.error('Error creating doctor prescription:', error);
            throw error;
        }
    }

    async getDoctorStats(): Promise<any> {
        try {
            const response = await fetch(`${API_BASE_URL}/doctors/stats`, {
                headers: await this.getAuthHeaders(),
                credentials: 'include',
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const result = await response.json();
            return result.data;
        } catch (error) {
            console.error('Error fetching doctor stats:', error);
            return { totalPatients: 0, pendingAppointments: 0, completedAppointments: 0 };
        }
    }

    async getCurrentDoctorProfile(): Promise<Doctor | null> {
        try {
            const response = await fetch(`${API_BASE_URL}/doctors/profile`, {
                headers: await this.getAuthHeaders(),
                credentials: 'include',
            });
            if (!response.ok) {
                if (response.status === 404) return null;
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const result = await response.json();
            return result.data || null;
        } catch (error) {
            console.error('Error fetching doctor profile:', error);
            throw error;
        }
    }

    async updateCurrentDoctorProfile(updates: Partial<Doctor>): Promise<Doctor | null> {
        try {
            const response = await fetch(`${API_BASE_URL}/doctors/profile`, {
                method: 'PUT',
                headers: await this.getAuthHeaders(),
                body: JSON.stringify(updates),
                credentials: 'include',
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const result = await response.json();
            return result.data || null;
        } catch (error) {
            console.error('Error updating doctor profile:', error);
            throw error;
        }
    }

    // --- Patient Documents (For Doctors) ---
    async getPatientDocuments(patientId: string): Promise<any[]> {
        try {
            const response = await fetch(`${API_BASE_URL}/documents/patient/${patientId}`, {
                headers: await this.getAuthHeaders(),
                credentials: 'include',
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const result = await response.json();
            return result.data || [];
        } catch (error) {
            console.error('Error fetching patient documents:', error);
            throw error;
        }
    }

    async uploadPatientDocument(patientId: string, file: File, type: string): Promise<any> {
        try {
            const formData = new FormData();
            formData.append('document', file);
            formData.append('patient_id', patientId);
            formData.append('document_type', type);

            const token = localStorage.getItem('auth_token');
            const response = await fetch(`${API_BASE_URL}/documents/patient/upload`, {
                method: 'POST',
                headers: {
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
                },
                body: formData,
                credentials: 'include',
            });

            if (!response.ok) {
                const errorResult = await response.json();
                throw new Error(errorResult.message || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('Error uploading patient document:', error);
            throw error;
        }
    }

    async deletePatientDocument(documentId: number): Promise<boolean> {
        try {
            const response = await fetch(`${API_BASE_URL}/documents/doctor/${documentId}`, {
                method: 'DELETE',
                headers: await this.getAuthHeaders(),
                credentials: 'include',
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return true;
        } catch (error) {
            console.error('Error deleting patient document:', error);
            return false;
        }
    }
}

export const doctorService = new DoctorService();
