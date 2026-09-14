export const YEARS = Array.from({ length: 37 }, (_, i) => String(2026 - i));

export const BODY_TYPES = [
  "Sedan",
  "SUV",
  "Coupe",
  "Truck",
  "Hatchback",
  "Convertible",
  "Van",
  "Wagon",
  "Crossover",
  "Sports",
];

export const MAKES = [
  "Acura",
  "Audi",
  "BMW",
  "Chevrolet",
  "Ford",
  "Honda",
  "Hyundai",
  "Jeep",
  "Lexus",
  "Mercedes-Benz",
  "Nissan",
  "Porsche",
  "Tesla",
  "Toyota",
  "Volkswagen",
];

export const MODELS: Record<string, string[]> = {
  Acura: ["ILX", "TLX", "MDX", "RDX"],
  Audi: ["A4", "A6", "Q5", "Q7"],
  BMW: ["3 Series", "5 Series", "X3", "X5", "M4"],
  Chevrolet: ["Malibu", "Equinox", "Silverado", "Camaro"],
  Ford: ["F-150", "Mustang", "Explorer", "Escape"],
  Honda: ["Civic", "Accord", "CR-V", "Pilot"],
  Hyundai: ["Elantra", "Sonata", "Tucson", "Santa Fe"],
  Jeep: ["Wrangler", "Grand Cherokee", "Cherokee", "Gladiator"],
  Lexus: ["ES", "RX", "NX", "IS"],
  "Mercedes-Benz": ["C-Class", "E-Class", "GLE", "GLC"],
  Nissan: ["Altima", "Rogue", "Sentra", "Frontier"],
  Porsche: ["911", "Cayenne", "Macan", "Taycan"],
  Tesla: ["Model 3", "Model Y", "Model S", "Model X"],
  Toyota: ["Camry", "Corolla", "RAV4", "Tacoma", "Camry Hybrid"],
  Volkswagen: ["Jetta", "Tiguan", "Atlas", "Golf"],
};

export const TRANSMISSIONS = ["Automatic", "Manual", "CVT", "DCT"];
export const FUEL_TYPES = ["Gasoline", "Diesel", "Hybrid", "Plug-in Hybrid", "Electric"];
export const DRIVETRAINS = ["FWD", "RWD", "AWD", "4WD"];
export const COLORS = [
  "Black",
  "White",
  "Silver",
  "Gray",
  "Red",
  "Blue",
  "Green",
  "Brown",
  "Beige",
  "Orange",
];

export const FEATURES = [
  "Sunroof",
  "Leather Seats",
  "Backup Camera",
  "Navigation",
  "Heated Seats",
  "Apple CarPlay",
  "Android Auto",
  "Blind Spot Monitor",
  "Lane Keep Assist",
  "Adaptive Cruise",
  "Premium Audio",
  "Third Row",
  "Tow Package",
  "Panoramic Roof",
  "Ventilated Seats",
  "Wireless Charging",
];

export const STATES = [
  "Alabama",
  "Alaska",
  "Arizona",
  "Arkansas",
  "California",
  "Colorado",
  "Connecticut",
  "Delaware",
  "Florida",
  "Georgia",
  "Hawaii",
  "Idaho",
  "Illinois",
  "Indiana",
  "Iowa",
  "Kansas",
  "Kentucky",
  "Louisiana",
  "Maine",
  "Maryland",
  "Massachusetts",
  "Michigan",
  "Minnesota",
  "Mississippi",
  "Missouri",
  "Montana",
  "Nebraska",
  "Nevada",
  "New Hampshire",
  "New Jersey",
  "New Mexico",
  "New York",
  "North Carolina",
  "North Dakota",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Pennsylvania",
  "Rhode Island",
  "South Carolina",
  "South Dakota",
  "Tennessee",
  "Texas",
  "Utah",
  "Vermont",
  "Virginia",
  "Washington",
  "West Virginia",
  "Wisconsin",
  "Wyoming",
];

export const CITIES: Record<string, string[]> = {
  California: ["Los Angeles", "San Diego", "San Jose", "San Francisco", "Sacramento"],
  Texas: ["Houston", "Dallas", "Austin", "San Antonio", "Fort Worth"],
  Florida: ["Miami", "Orlando", "Tampa", "Jacksonville", "Fort Lauderdale"],
  "New York": ["New York", "Buffalo", "Rochester", "Albany", "Syracuse"],
  Illinois: ["Chicago", "Aurora", "Naperville", "Joliet"],
  Georgia: ["Atlanta", "Savannah", "Augusta"],
  Washington: ["Seattle", "Tacoma", "Bellevue", "Spokane"],
  Colorado: ["Denver", "Boulder", "Colorado Springs"],
  Arizona: ["Phoenix", "Scottsdale", "Tucson", "Mesa"],
};

export function citiesFor(state: string): string[] {
  return CITIES[state] ?? ["Metro", "Downtown", "North", "South"];
}

export function decodeVin(vin: string) {
  const clean = vin.trim().toUpperCase();
  if (clean.length !== 17 || !/^[A-HJ-NPR-Z0-9]{17}$/.test(clean)) return null;
  const map = [
    { make: "Honda", model: "Civic", year: "2022", trim: "EX", bodyType: "Sedan" },
    { make: "Toyota", model: "Camry", year: "2020", trim: "XLE", bodyType: "Sedan" },
    { make: "BMW", model: "M4", year: "2023", trim: "Competition", bodyType: "Coupe" },
    { make: "Ford", model: "F-150", year: "2021", trim: "Lariat", bodyType: "Truck" },
    { make: "Tesla", model: "Model 3", year: "2024", trim: "Long Range", bodyType: "Sedan" },
  ];
  const idx = clean.split("").reduce((n, c) => n + c.charCodeAt(0), 0) % map.length;
  return map[idx];
}
