export interface Task {
  id: string;
  title: string;
  rewardAmount: number;
  disabled: boolean;
  createdAt: number;
}

export interface UserProfile {
  uid: string;
  email: string;
  walletBalance: number;
  totalEarned: number;
  role: 'user' | 'admin';
  createdAt: number;
}

export interface UserTask {
  id: string; // userId_taskId
  userId: string;
  taskId: string;
  taskTitle: string;
  rewardAmount: number;
  completedAt: number;
}

export interface WithdrawRequest {
  id: string;
  userId: string;
  userEmail: string;
  amount: number;
  upiId: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  createdAt: number;
}

export interface Article {
  id: string;
  category: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  authorImage: string;
  readTime: string;
  publishedTime: string;
  imageUrl: string;
}

export interface AppRecommendation {
  id: string;
  name: string;
  description: string;
  type: 'App' | 'Website';
  icon: string; // lucide icon name
  url: string;
}
