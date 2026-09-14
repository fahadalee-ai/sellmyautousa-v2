import { asset } from "./utils";

/** Local branded photos — always available with the Vite base path. */
const local = (file: string) => asset(file);

/** Editorial Unsplash photography for listing galleries. */
const u = (id: string, w = 2000) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80&fm=jpg`;

export const FALLBACK_IMAGE = local("intro-2.jpg");

export const IMAGES = {
  splash: local("intro-splash-alt.jpg"),
  splashAccent: local("auth-car.jpg"),
  onboard1: local("intro-1.jpg"),
  onboard2: local("intro-2.jpg"),
  onboard3: local("intro-3.jpg"),
  auth: local("auth-car.jpg"),
  homeHero: local("home-hero.jpg"),
  emptyInventory: local("intro-3.jpg"),
  showroom: local("showroom.jpg"),
  bmw: u("photo-1555215695-3004980ad54e"),
  tesla: u("photo-1560958089-b8a1929cea18"),
  porsche: u("photo-1503376780353-7e6692767b70"),
  camry: u("photo-1621007947382-bb3c3994e3fb"),
  f150: u("photo-1533473359331-0135ef1b58bf"),
  mercedes: u("photo-1618843479313-40f8afb4b4d8"),
  mustang: u("photo-1494976388531-d1058494cdd8"),
  audi: u("photo-1606664515524-ed2f9980df7c"),
  jeep: u("photo-1519641471654-76ce0107ad1b"),
  honda: u("photo-1610768764270-790fbec18178"),
  ferrari: u("photo-1583121274602-3e2820c69888"),
  white: u("photo-1614162692292-7ac56d7f7f1e"),
  interior: u("photo-1503376780353-7e6692767b70", 1600),
  wheel: u("photo-1544636331-e26879cd4d9b", 1600),
  detail: u("photo-1605559424843-9e4c228bf1c2", 1600),
  engine: u("photo-1486262715619-67b85e0b08d3", 1600),
  bmwGallery: [
    u("photo-1555215695-3004980ad54e", 1800),
    u("photo-1617531653332-bd46c24f2068", 1800),
    u("photo-1617814076367-b759c7d7e738", 1800),
    u("photo-1614162692292-7ac56d7f7f1e", 1800),
    u("photo-1605559424843-9e4c228bf1c2", 1800),
    u("photo-1544636331-e26879cd4d9b", 1800),
    u("photo-1511919884226-fd3cad34687c", 1800),
    u("photo-1492144534655-ae79c964c9d7", 1800),
  ],
  teslaGallery: [
    u("photo-1560958089-b8a1929cea18", 1800),
    u("photo-1563720223185-11003d516935", 1800),
    u("photo-1614162692292-7ac56d7f7f1e", 1800),
    u("photo-1609521263047-f8f205293f24", 1800),
    u("photo-1617814076367-b759c7d7e738", 1800),
    u("photo-1605559424843-9e4c228bf1c2", 1800),
  ],
  porscheGallery: [
    u("photo-1503376780353-7e6692767b70", 1800),
    u("photo-1542362567-b07e54358753", 1800),
    u("photo-1583121274602-3e2820c69888", 1800),
    u("photo-1492144534655-ae79c964c9d7", 1800),
    u("photo-1544636331-e26879cd4d9b", 1800),
    u("photo-1511919884226-fd3cad34687c", 1800),
  ],
  truckGallery: [
    u("photo-1533473359331-0135ef1b58bf", 1800),
    u("photo-1519641471654-76ce0107ad1b", 1800),
    u("photo-1486262715619-67b85e0b08d3", 1800),
    u("photo-1493238792000-8113da705763", 1800),
    u("photo-1605559424843-9e4c228bf1c2", 1800),
  ],
  camryGallery: [
    u("photo-1621007947382-bb3c3994e3fb", 1800),
    u("photo-1610768764270-790fbec18178", 1800),
    u("photo-1614162692292-7ac56d7f7f1e", 1800),
    u("photo-1609521263047-f8f205293f24", 1800),
    u("photo-1605559424843-9e4c228bf1c2", 1800),
  ],
  mustangGallery: [
    u("photo-1494976388531-d1058494cdd8", 1800),
    u("photo-1552519507-da3b142c6e3d", 1800),
    u("photo-1542362567-b07e54358753", 1800),
    u("photo-1492144534655-ae79c964c9d7", 1800),
  ],
  sampleGallery: [
    u("photo-1552519507-da3b142c6e3d", 1600),
    u("photo-1542362567-b07e54358753", 1600),
    u("photo-1583121274602-3e2820c69888", 1600),
    u("photo-1511919884226-fd3cad34687c", 1600),
    u("photo-1502877338535-766e1452684a", 1600),
    u("photo-1544636331-e26879cd4d9b", 1600),
    u("photo-1617531653332-bd46c24f2068", 1600),
    u("photo-1609521263047-f8f205293f24", 1600),
    u("photo-1614162692292-7ac56d7f7f1e", 1600),
    u("photo-1617814076367-b759c7d7e738", 1600),
    u("photo-1605559424843-9e4c228bf1c2", 1600),
    u("photo-1494976388531-d1058494cdd8", 1600),
  ],
} as const;
