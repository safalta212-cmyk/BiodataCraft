import { db, isConfigured } from '../config/firebase';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';
import {
  ContactMessage,
  ContactMessageInput,
  ContactStatus,
  ContactValidationResult
} from '../types/contact';

const CONTACT_MESSAGES_COLLECTION = 'contact_messages';
const LOCAL_STORAGE_MESSAGES_KEY = 'biodatacraft_contact_messages_v1';

// Seed default message for demo / admin initial view if empty
const DEFAULT_INITIAL_MESSAGES: ContactMessage[] = [
  {
    id: 'msg-seed-1',
    name: 'Pooja Sharma',
    email: 'pooja.sharma@example.com',
    subject: 'New Template Suggestion',
    message: 'Could you please add more pastel pink floral templates for Punjabi Sikh Anand Karaj biodatas? Love the existing royal heritage design!',
    status: 'unread',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: 'msg-seed-2',
    name: 'Amit Deshmukh',
    email: 'amit.deshmukh@example.com',
    subject: 'Regional Community Request',
    message: 'The Marathi Lagna Biodata page and Devak guidelines are wonderful. Thank you for keeping this completely free without requiring any login.',
    status: 'read',
    createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 20).toISOString()
  },
  {
    id: 'msg-seed-3',
    name: 'Vikram Yadav',
    email: 'vikram.yadav@example.com',
    subject: 'General Feedback',
    message: 'The PDF generation is crisp and sharp on WhatsApp! High resolution A4 formatting works seamlessly on mobile devices.',
    status: 'resolved',
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    adminNotes: 'Thanked the user via email.'
  }
];

class ContactService {
  private localMessages: ContactMessage[] = [];

  constructor() {
    this.loadLocalMessages();
  }

  private loadLocalMessages(): void {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_MESSAGES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          this.localMessages = parsed;
          return;
        }
      }
    } catch {
      // Fallback
    }
    // Do not seed mock messages into public visitor's localStorage!
    this.localMessages = [];
  }

  private saveLocalMessages(): void {
    try {
      localStorage.setItem(LOCAL_STORAGE_MESSAGES_KEY, JSON.stringify(this.localMessages));
    } catch {
      // Ignore quota errors
    }
  }

  /**
   * Comprehensive validation rules:
   * - Name: 2-100 characters
   * - Email: valid RFC regex
   * - Subject: 3-200 characters
   * - Message: 10-3000 characters
   * - Strictly forbids pasting full matrimonial biodatas into the contact form
   */
  public validate(input: ContactMessageInput): ContactValidationResult {
    const errors: Partial<Record<keyof ContactMessageInput | 'biodataDetected', string>> = {};

    // 1. Name validation
    const trimmedName = (input.name || '').trim();
    if (!trimmedName) {
      errors.name = 'Please provide your full name.';
    } else if (trimmedName.length < 2) {
      errors.name = 'Name must be at least 2 characters.';
    } else if (trimmedName.length > 100) {
      errors.name = 'Name cannot exceed 100 characters.';
    }

    // 2. Email validation
    const trimmedEmail = (input.email || '').trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!trimmedEmail) {
      errors.email = 'Please provide your email address.';
    } else if (!emailRegex.test(trimmedEmail)) {
      errors.email = 'Please enter a valid email address (e.g. name@domain.com).';
    } else if (trimmedEmail.length > 150) {
      errors.email = 'Email address is too long.';
    }

    // 3. Subject validation
    const trimmedSubject = (input.subject || '').trim();
    if (!trimmedSubject) {
      errors.subject = 'Please select or specify a subject.';
    } else if (trimmedSubject.length < 3) {
      errors.subject = 'Subject must be at least 3 characters.';
    } else if (trimmedSubject.length > 200) {
      errors.subject = 'Subject cannot exceed 200 characters.';
    }

    // 4. Message validation
    const trimmedMessage = (input.message || '').trim();
    if (!trimmedMessage) {
      errors.message = 'Please write your message or inquiry.';
    } else if (trimmedMessage.length < 10) {
      errors.message = 'Message must be at least 10 characters so we can understand your request.';
    } else if (trimmedMessage.length > 3000) {
      errors.message = 'Message cannot exceed 3000 characters.';
    }

    // 5. Anti-Biodata Guard:
    // Strictly prevents users from submitting biodatas into the contact form
    const lowerMessage = (trimmedMessage + ' ' + trimmedSubject).toLowerCase();
    const biodataKeywords = [
      'dob:',
      'date of birth',
      'height: 5',
      'height: 6',
      'gotra:',
      'mosal:',
      'kundali',
      'manglik status',
      'rashi:',
      'nakshatra:',
      'complexion: fair',
      'horoscope details',
      'father: shri',
      'mama ji:'
    ];

    let matchCount = 0;
    for (const kw of biodataKeywords) {
      if (lowerMessage.includes(kw)) {
        matchCount++;
      }
    }

    if (matchCount >= 3) {
      errors.biodataDetected =
        'It looks like you are pasting a matrimonial biodata. BiodataCraft does not store biodatas on servers. Please use the free Biodata Maker (/create) to design and download your biodata securely in your browser.';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  }

  /**
   * Submits a contact inquiry to Firestore and local persistent backup
   */
  public async submitMessage(input: ContactMessageInput): Promise<{
    success: boolean;
    id?: string;
    error?: string;
    validationErrors?: Partial<Record<keyof ContactMessageInput | 'biodataDetected', string>>;
  }> {
    const validation = this.validate(input);
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.errors.biodataDetected || 'Please correct the highlighted form errors.',
        validationErrors: validation.errors
      };
    }

    const now = new Date().toISOString();
    const cleanData: Omit<ContactMessage, 'id'> = {
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      subject: input.subject.trim(),
      message: input.message.trim(),
      status: 'unread',
      createdAt: now,
      updatedAt: now
    };

    let generatedId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    let storedInFirestore = false;

    // 1. Try Firestore if configured (primary secure destination)
    if (isConfigured && db) {
      try {
        const docRef = await addDoc(collection(db, CONTACT_MESSAGES_COLLECTION), {
          ...cleanData,
          firestoreTimestamp: serverTimestamp()
        });
        generatedId = docRef.id;
        storedInFirestore = true;
      } catch (err) {
        console.warn('Firestore contact submit notice (falling back to client backup):', err);
      }
    }

    // 2. Only persist to local backup if Firestore is unavailable (dev mode fallback)
    // Never persist messages to public visitor's browser localStorage when cloud storage succeeded!
    if (!storedInFirestore) {
      const newMessage: ContactMessage = {
        id: generatedId,
        ...cleanData
      };
      this.localMessages = [newMessage, ...this.localMessages];
      this.saveLocalMessages();
    }

    return {
      success: true,
      id: generatedId
    };
  }

  /**
   * Retrieves messages with optional filtering by status and search
   */
  public async getMessages(options?: {
    status?: ContactStatus | 'all';
    search?: string;
  }): Promise<ContactMessage[]> {
    let firestoreMessages: ContactMessage[] = [];

    // Attempt to load from Firestore
    if (isConfigured && db) {
      try {
        const q = query(
          collection(db, CONTACT_MESSAGES_COLLECTION),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        firestoreMessages = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            name: data.name || 'Anonymous',
            email: data.email || '',
            subject: data.subject || 'General Inquiry',
            message: data.message || '',
            status: (data.status || 'unread') as ContactStatus,
            createdAt: data.createdAt || new Date().toISOString(),
            updatedAt: data.updatedAt || new Date().toISOString(),
            adminNotes: data.adminNotes
          };
        });
      } catch (err) {
        console.warn('Firestore fetch messages notice:', err);
      }
    }

    // Combine Firestore messages with local messages, deduplicating by ID
    const messageMap = new Map<string, ContactMessage>();

    // Add local messages
    this.localMessages.forEach((m) => messageMap.set(m.id, m));

    // Add firestore messages (higher precedence)
    firestoreMessages.forEach((m) => messageMap.set(m.id, m));

    let results = Array.from(messageMap.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // If completely empty (initial dev launch without Firestore messages), supply in-memory demo records
    if (results.length === 0 && !isConfigured) {
      results = [...DEFAULT_INITIAL_MESSAGES];
    }

    // Apply status filter
    if (options?.status && options.status !== 'all') {
      results = results.filter((m) => m.status === options.status);
    }

    // Apply search filter
    if (options?.search && options.search.trim()) {
      const q = options.search.toLowerCase().trim();
      results = results.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.email.toLowerCase().includes(q) ||
          m.subject.toLowerCase().includes(q) ||
          m.message.toLowerCase().includes(q)
      );
    }

    return results;
  }

  /**
   * Updates message status: 'unread' | 'read' | 'resolved'
   */
  public async updateStatus(
    id: string,
    status: ContactStatus,
    adminNotes?: string
  ): Promise<boolean> {
    const now = new Date().toISOString();

    // Update in local cache
    const idx = this.localMessages.findIndex((m) => m.id === id);
    if (idx !== -1) {
      this.localMessages[idx] = {
        ...this.localMessages[idx],
        status,
        updatedAt: now,
        ...(adminNotes !== undefined ? { adminNotes } : {})
      };
      this.saveLocalMessages();
    }

    // Update in Firestore
    if (isConfigured && db) {
      try {
        const docRef = doc(db, CONTACT_MESSAGES_COLLECTION, id);
        await updateDoc(docRef, {
          status,
          updatedAt: now,
          ...(adminNotes !== undefined ? { adminNotes } : {})
        });
      } catch (err) {
        console.warn('Firestore update status notice:', err);
      }
    }

    return true;
  }

  /**
   * Permanently deletes a message
   */
  public async deleteMessage(id: string): Promise<boolean> {
    this.localMessages = this.localMessages.filter((m) => m.id !== id);
    this.saveLocalMessages();

    if (isConfigured && db) {
      try {
        const docRef = doc(db, CONTACT_MESSAGES_COLLECTION, id);
        await deleteDoc(docRef);
      } catch (err) {
        console.warn('Firestore delete notice:', err);
      }
    }

    return true;
  }

  /**
   * Retrieves summary statistics for admin overview
   */
  public async getStats(): Promise<{
    total: number;
    unread: number;
    read: number;
    resolved: number;
  }> {
    const all = await this.getMessages();
    return {
      total: all.length,
      unread: all.filter((m) => m.status === 'unread').length,
      read: all.filter((m) => m.status === 'read').length,
      resolved: all.filter((m) => m.status === 'resolved').length
    };
  }
}

export const contactService = new ContactService();
