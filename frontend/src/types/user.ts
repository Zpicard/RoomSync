export interface User {
  id: string;
  username: string;
  email: string;
  householdId?: string;
  avatarUrl?: string;
  bio?: string | null;
  household?: {
    id: string;
    name: string;
    code: string;
    isPrivate: boolean;
    createdAt: string;
    updatedAt: string;
    ownerId: string;
  };
} 