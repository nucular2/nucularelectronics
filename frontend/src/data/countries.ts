export interface Country {
  code: string;
  name: string;
  dial_code: string;
  flag: string;
}

export const countries: Country[] = [
  { code: "US", name: "United States", dial_code: "+1", flag: "🇺🇸" },
  { code: "RU", name: "Russia", dial_code: "+7", flag: "🇷🇺" },
  { code: "KZ", name: "Kazakhstan", dial_code: "+7", flag: "🇰🇿" },
  { code: "GB", name: "United Kingdom", dial_code: "+44", flag: "🇬🇧" },
  { code: "FR", name: "France", dial_code: "+33", flag: "🇫🇷" },
  { code: "DE", name: "Germany", dial_code: "+49", flag: "🇩🇪" },
  { code: "IT", name: "Italy", dial_code: "+39", flag: "🇮🇹" },
  { code: "ES", name: "Spain", dial_code: "+34", flag: "🇪🇸" },
  { code: "UA", name: "Ukraine", dial_code: "+380", flag: "🇺🇦" },
  { code: "BY", name: "Belarus", dial_code: "+375", flag: "🇧🇾" },
  { code: "IN", name: "India", dial_code: "+91", flag: "🇮🇳" },
  { code: "AE", name: "UAE", dial_code: "+971", flag: "🇦🇪" },
  { code: "CN", name: "China", dial_code: "+86", flag: "🇨🇳" },
  { code: "JP", name: "Japan", dial_code: "+81", flag: "🇯🇵" },
  { code: "KR", name: "South Korea", dial_code: "+82", flag: "🇰🇷" },
  { code: "AU", name: "Australia", dial_code: "+61", flag: "🇦🇺" },
  { code: "CA", name: "Canada", dial_code: "+1", flag: "🇨🇦" },
  { code: "BR", name: "Brazil", dial_code: "+55", flag: "🇧🇷" },
  { code: "TR", name: "Turkey", dial_code: "+90", flag: "🇹🇷" },
  { code: "IL", name: "Israel", dial_code: "+972", flag: "🇮🇱" },
  { code: "ID", name: "Indonesia", dial_code: "+62", flag: "🇮🇩" },
  { code: "VN", name: "Vietnam", dial_code: "+84", flag: "🇻🇳" },
  { code: "TH", name: "Thailand", dial_code: "+66", flag: "🇹🇭" },
  { code: "MY", name: "Malaysia", dial_code: "+60", flag: "🇲🇾" },
  { code: "SG", name: "Singapore", dial_code: "+65", flag: "🇸🇬" },
  { code: "PL", name: "Poland", dial_code: "+48", flag: "🇵🇱" },
  { code: "NL", name: "Netherlands", dial_code: "+31", flag: "🇳🇱" },
  { code: "SE", name: "Sweden", dial_code: "+46", flag: "🇸🇪" },
  { code: "NO", name: "Norway", dial_code: "+47", flag: "🇳🇴" },
  { code: "DK", name: "Denmark", dial_code: "+45", flag: "🇩🇰" },
  { code: "FI", name: "Finland", dial_code: "+358", flag: "🇫🇮" },
  { code: "CH", name: "Switzerland", dial_code: "+41", flag: "🇨🇭" },
  { code: "AT", name: "Austria", dial_code: "+43", flag: "🇦🇹" },
  { code: "BE", name: "Belgium", dial_code: "+32", flag: "🇧🇪" },
  { code: "CZ", name: "Czech Republic", dial_code: "+420", flag: "🇨🇿" },
];
