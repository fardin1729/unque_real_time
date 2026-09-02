export interface Lead {
  id: string;
  leadgenId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  company?: string;
  city?: string;
  formName?: string;
  adName?: string;
  pageId?: string;
  createdAt: string;
  receivedAt: string;
  isSimulated?: boolean;
  rawMetaPayload?: any;
}

export type ConnectionStatusType = 'connected' | 'connecting' | 'disconnected' | 'error';
