export interface Lead {
  id?: string;
  name: string;
  businessName?: string;
  email: string;
  phone?: string;
  businessType?: string;
  message?: string;
  createdAt: string;
  status: 'new' | 'contacted' | 'qualified' | 'closed';
}

export interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  author?: string;
  publishedAt: string;
  tags?: string[];
  featuredImage?: string;
}

export interface PricingPackage {
  name: string;
  price: string;
  setup: string;
  features: string[];
  isPopular?: boolean;
}
