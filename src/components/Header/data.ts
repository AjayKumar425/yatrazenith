export interface NavLinkItem {
  title: string;
  href: string;
  isActive?: boolean;
}

export const navLinks: NavLinkItem[] = [
  { title: "Home", href: "/", isActive: true },
  { title: "Destinations", href: "/" },
  { title: "About", href: "/" },
  { title: "Journal", href: "/" },
];


