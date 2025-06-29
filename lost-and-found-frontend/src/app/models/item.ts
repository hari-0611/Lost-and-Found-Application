export interface Item {
    id: number;
    itemName: string;
    category: string;
    description: string;
    lastSeenLocation: string;
    dateLost: string;
    contactInfo: string;
    imageUrl?: string | null; // <-- allow null as well
    created_at: string | null;
    username: string;
  }
  
  