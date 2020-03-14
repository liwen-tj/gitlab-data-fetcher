export interface Repo {
  // basic
  id: number;
  owner: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  description: string;
  starCount: number;
  forkCount: number;
  // issue
  issues: Issue[];
  // merge request
  mergeRequests: MergeRequest[];
}

export interface BasicInfo {
  id: number;
  owner: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  description: string;
  starCount: number;
  forkCount: number;
}

export interface Issue {
  id: number;
  author: string;
  number: number;
  createdAt: Date;
  updatedAt: Date;
  closedAt: Date;
  title: string;
  body: string;
  labels: string[];
  comments: Comment[];
}

export interface MergeRequest {
  id: number;
  number: number;
  createdAt: Date;
  updatedAt: Date;
  title: string;
  body: string;
  comments: Comment[];
}

export interface Comment {
  id: number;
  login: string;
  body: string;
  url: string;
  createdAt: Date;
}