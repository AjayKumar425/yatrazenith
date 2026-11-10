export interface NavLinkItem {
  title: string;
  href: string;
  isActive?: boolean;
}

export const navLinks: NavLinkItem[] = [
  { title: "Home", href: "/", isActive: true },
  { title: "Destinations", href: "#destinations" },
  { title: "About", href: "#about" },
  { title: "Journal", href: "#journal" },
];
