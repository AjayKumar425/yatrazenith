export interface NavLinkItem {
  title: string;
  href: string;
}

export const navLinks: NavLinkItem[] = [
  { title: "Home", href: "/" },
  { title: "Experiences", href: "/experiences" },
  { title: "The Journal", href: "/journal" },
  { title: "Our Philosophy", href: "/philosophy" },
  { title: "Gallery", href: "/gallery" },
];

export interface ContactItem {
  label: string;
  value: string;
  href: string;
}

export const contactLinks: ContactItem[] = [
  {
    label: "WhatsApp",
    value: "+91 98765 43210",
    href: "https://wa.me/919876543210",
  },
  {
    label: "Email",
    value: "hello@yatrazenith.com",
    href: "mailto:hello@yatrazenith.com",
  },
];

export interface SocialItem {
  label: string;
  href: string;
}

export const socialLinks: SocialItem[] = [
  { label: "Instagram", href: "https://instagram.com/yatrazenith" },
  { label: "Facebook", href: "https://facebook.com/yatrazenith" },
];
