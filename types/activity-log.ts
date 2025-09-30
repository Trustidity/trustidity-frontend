export interface ActivityLog {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  entityType?: string;
  entityId?: string;
  userId?: string;
  metadata?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}
