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
  "Buick",
  "Cadillac",
  "Chevrolet",
  "Chrysler",
  "Dodge",
  "Ford",
  "GMC",
  "Honda",
  "Hyundai",
  "Jeep",
  "Kia",
  "Lexus",
  "Lincoln",
  "Mazda",
  "Mercedes-Benz",
  "Nissan",
  "Porsche",
  "Ram",
  "Subaru",
  "Tesla",
  "Toyota",
  "Volkswagen",
];

export const MODELS: Record<string, string[]> = {
  Acura: ["ILX", "TLX", "Integra", "MDX", "RDX"],
  Audi: ["A4", "A6", "A5", "Q5", "Q7", "Q3"],
  BMW: ["3 Series", "5 Series", "X3", "X5", "X1", "M4", "M3"],
  Buick: ["Enclave", "Encore GX", "Envision"],
  Cadillac: ["CT5", "XT5", "Escalade", "Lyriq"],
  Chevrolet: ["Malibu", "Equinox", "Silverado 1500", "Camaro", "Traverse", "Tahoe", "Colorado", "Corvette"],
  Chrysler: ["Pacifica", "300"],
  Dodge: ["Charger", "Challenger", "Durango", "Hornet"],
  Ford: ["F-150", "Mustang", "Explorer", "Escape", "Bronco", "Ranger", "Edge", "Maverick", "Expedition"],
  GMC: ["Sierra 1500", "Terrain", "Acadia", "Yukon", "Canyon"],
  Honda: ["Civic", "Accord", "CR-V", "Pilot", "HR-V", "Odyssey", "Ridgeline"],
  Hyundai: ["Elantra", "Sonata", "Tucson", "Santa Fe", "Palisade", "Ioniq 5"],
  Jeep: ["Wrangler", "Grand Cherokee", "Cherokee", "Gladiator", "Compass", "Wagoneer"],
  Kia: ["Forte", "K5", "Sportage", "Telluride", "Sorento", "Carnival"],
  Lexus: ["ES", "RX", "NX", "IS", "GX", "UX"],
  Lincoln: ["Nautilus", "Aviator", "Navigator", "Corsair"],
  Mazda: ["Mazda3", "CX-5", "CX-50", "CX-90", "MX-5 Miata"],
  "Mercedes-Benz": ["C-Class", "E-Class", "GLE", "GLC", "GLA", "S-Class"],
  Nissan: ["Altima", "Rogue", "Sentra", "Frontier", "Pathfinder", "Murano", "Titan"],
  Porsche: ["911", "Cayenne", "Macan", "Taycan", "Panamera", "718 Cayman"],
  Ram: ["1500", "2500", "3500"],
  Subaru: ["Outback", "Forester", "Crosstrek", "Ascent", "WRX"],
  Tesla: ["Model 3", "Model Y", "Model S", "Model X", "Cybertruck"],
  Toyota: ["Camry", "Corolla", "RAV4", "Tacoma", "Highlander", "4Runner", "Tundra", "Prius", "Camry Hybrid"],
  Volkswagen: ["Jetta", "Tiguan", "Atlas", "Golf", "ID.4", "Taos"],
};

export function modelsFor(make: string): string[] {
  if (make && MODELS[make]) return MODELS[make];
  return [...new Set(Object.values(MODELS).flat())].sort((a, b) => a.localeCompare(b));
}

export function makeForModel(model: string): string | undefined {
  return MAKES.find((make) => MODELS[make]?.includes(model));
}

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
  Alabama: ["Birmingham", "Huntsville", "Montgomery", "Mobile"],
  Alaska: ["Anchorage", "Fairbanks", "Juneau"],
  Arizona: ["Phoenix", "Scottsdale", "Tucson", "Mesa", "Chandler"],
  Arkansas: ["Little Rock", "Fayetteville", "Fort Smith"],
  California: ["Los Angeles", "San Diego", "San Jose", "San Francisco", "Sacramento", "Irvine", "Oakland"],
  Colorado: ["Denver", "Boulder", "Colorado Springs", "Aurora"],
  Connecticut: ["Hartford", "New Haven", "Stamford"],
  Delaware: ["Wilmington", "Dover", "Newark"],
  Florida: ["Miami", "Orlando", "Tampa", "Jacksonville", "Fort Lauderdale", "Naples"],
  Georgia: ["Atlanta", "Savannah", "Augusta", "Marietta"],
  Hawaii: ["Honolulu", "Hilo", "Kailua"],
  Idaho: ["Boise", "Meridian", "Idaho Falls"],
  Illinois: ["Chicago", "Aurora", "Naperville", "Joliet", "Evanston"],
  Indiana: ["Indianapolis", "Fort Wayne", "Bloomington"],
  Iowa: ["Des Moines", "Cedar Rapids", "Iowa City"],
  Kansas: ["Wichita", "Overland Park", "Kansas City"],
  Kentucky: ["Louisville", "Lexington", "Bowling Green"],
  Louisiana: ["New Orleans", "Baton Rouge", "Shreveport"],
  Maine: ["Portland", "Augusta", "Bangor"],
  Maryland: ["Baltimore", "Annapolis", "Bethesda"],
  Massachusetts: ["Boston", "Cambridge", "Worcester"],
  Michigan: ["Detroit", "Ann Arbor", "Grand Rapids"],
  Minnesota: ["Minneapolis", "Saint Paul", "Rochester"],
  Mississippi: ["Jackson", "Gulfport", "Biloxi"],
  Missouri: ["Kansas City", "St. Louis", "Springfield"],
  Montana: ["Billings", "Missoula", "Bozeman"],
  Nebraska: ["Omaha", "Lincoln"],
  Nevada: ["Las Vegas", "Reno", "Henderson"],
  "New Hampshire": ["Manchester", "Nashua", "Concord"],
  "New Jersey": ["Newark", "Jersey City", "Princeton"],
  "New Mexico": ["Albuquerque", "Santa Fe", "Las Cruces"],
  "New York": ["New York", "Buffalo", "Rochester", "Albany", "Syracuse"],
  "North Carolina": ["Charlotte", "Raleigh", "Durham", "Asheville"],
  "North Dakota": ["Fargo", "Bismarck"],
  Ohio: ["Columbus", "Cleveland", "Cincinnati", "Toledo"],
  Oklahoma: ["Oklahoma City", "Tulsa"],
  Oregon: ["Portland", "Eugene", "Salem"],
  Pennsylvania: ["Philadelphia", "Pittsburgh", "Harrisburg"],
  "Rhode Island": ["Providence", "Newport"],
  "South Carolina": ["Charleston", "Columbia", "Greenville"],
  "South Dakota": ["Sioux Falls", "Rapid City"],
  Tennessee: ["Nashville", "Memphis", "Knoxville"],
  Texas: ["Houston", "Dallas", "Austin", "San Antonio", "Fort Worth", "Plano"],
  Utah: ["Salt Lake City", "Provo", "Park City"],
  Vermont: ["Burlington", "Montpelier"],
  Virginia: ["Richmond", "Virginia Beach", "Arlington", "Norfolk"],
  Washington: ["Seattle", "Tacoma", "Bellevue", "Spokane"],
  "West Virginia": ["Charleston", "Morgantown"],
  Wisconsin: ["Milwaukee", "Madison", "Green Bay"],
  Wyoming: ["Cheyenne", "Jackson"],
};

export function citiesFor(state: string): string[] {
  if (state && CITIES[state]) return CITIES[state];
  return [...new Set(Object.values(CITIES).flat())].sort((a, b) => a.localeCompare(b));
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
