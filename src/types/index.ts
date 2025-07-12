export interface PersonalInfo {
  name: string
  title: string
  description: string
  email: string
  phone: string
  location: string
  profileImage: string
}

export interface Skill {
  id: string
  name: string
  icon: string
  category: "frontend" | "backend" | "tools" | "design"
}

export interface NavigationItem {
  id: string
  label: string
  href: string
  external?: boolean
}

export interface ScrollState {
  scrollY: number
  isScrolled: boolean
  showMainContent: boolean
}
