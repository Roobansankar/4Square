export const STAFF_CATEGORIES = [
  'Civil Engineer',
  'Contractor',
  'Interior Supervisor',
  'Masonry',
  'Centering',
  'Electrician',
  'Plumber',
  'Painter',
  'Tile Laying',
  'Carpenter',
  'Landscape',
  'Fabricator',
  'Waterproofing',
  'Automation',
  'Glass Work',
  'Earth Work',
] as const;

export type StaffCategory = typeof STAFF_CATEGORIES[number];

export type MemberStatus = 'Active' | 'On Leave' | 'Inactive';

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  phone: string;
  experience: string;
  dailyWage: number;
  joiningDate: string;
  status: MemberStatus;
  assignedSite: string;
  currentTask: string;
}

export interface TeamCategoryGroup {
  category: StaffCategory;
  members: TeamMember[];
}

export type TeamStatus = 'Active' | 'Inactive';

export interface Team {
  id: string;
  name: string;
  project: string;
  leader: string;
  createdDate: string;
  status: TeamStatus;
  categories: TeamCategoryGroup[];
}
