import { IMAGES } from "./images";
import { emptyDraft, type ListingDraft } from "./types";

/** Complete USA-market listing used to seed the Add Car wizard. */
export function usaSampleDraft(
  plan?: Partial<Pick<ListingDraft, "subscriptionId" | "addonId" | "bundleId">>,
): ListingDraft {
  return {
    ...emptyDraft(plan),
    year: "2018",
    make: "Chevrolet",
    model: "Camaro",
    trim: "SS",
    bodyType: "Coupe",
    vin: "1G1FH1R79J0147852",
    vinDecoded: true,
    mileage: "42850",
    transmission: "Automatic",
    fuelType: "Gasoline",
    drivetrain: "RWD",
    engineSize: "6.2L V8",
    exteriorColor: "Red",
    interiorColor: "Black",
    seats: "4",
    doors: "2",
    state: "Texas",
    city: "Dallas",
    zip: "75201",
    features: [
      "Backup Camera",
      "Apple CarPlay",
      "Android Auto",
      "Leather Seats",
      "Heated Seats",
      "Premium Audio",
      "Blind Spot Monitor",
    ],
    price: "28950",
    priceStance: "negotiable",
    thumbnail: IMAGES.mustang,
    gallery: [...IMAGES.mustangGallery.slice(1, 5)],
    description:
      "2018 Chevrolet Camaro SS listed in Dallas, TX. Clean title, two owners, no accidents. Regular dealer service, new Michelin tires at 40k. Garage kept. Private-party FSBO — no dealer fees.",
    titleStatus: "Clean",
    owners: "2",
    accidents: "0",
    mpgCity: "16",
    mpgHwy: "24",
    horsepower: "455",
    highlights: ["Clean Carfax", "New tires", "Garage kept"],
    historyReport: "Carfax — 0 accidents, 2 owners",
    commMode: "chat_phone",
    listedLabel: "Listed today",
  };
}
