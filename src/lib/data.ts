export type Lang = "hy" | "en" | "ru";

export type Deal = "sale" | "rent";
export type PropertyType = "apartment" | "house" | "commercial";
export type Status = "available" | "reserved";
export type DistrictKey = "center" | "arabkir" | "kanaker" | "avan" | "davtashen";

export type L10n = Record<Lang, string>;

export interface RoomSpec {
  name: L10n;
  area: number;
}

export interface Poi {
  name: L10n;
  kind: "school" | "metro" | "park" | "supermarket";
  distance: string;
}

export interface Property {
  id: string;
  title: L10n;
  description: L10n;
  deal: Deal;
  type: PropertyType;
  district: DistrictKey;
  address: L10n;
  rooms: number;
  area: number;
  floor: number;
  floors: number;
  price: number; // AMD, total for sale / monthly for rent
  status: Status;
  buildingType: L10n;
  condition: L10n;
  images: string[];
  layout: RoomSpec[];
  pois: Poi[];
}

export const DISTRICTS: { key: DistrictKey; label: L10n }[] = [
  { key: "center", label: { hy: "Կենտրոն", en: "Center", ru: "Центр" } },
  { key: "arabkir", label: { hy: "Արաբկիր", en: "Arabkir", ru: "Арабкир" } },
  { key: "kanaker", label: { hy: "Քանաքեռ", en: "Kanaker", ru: "Канакер" } },
  { key: "avan", label: { hy: "Ավան", en: "Avan", ru: "Аван" } },
  { key: "davtashen", label: { hy: "Դավթաշեն", en: "Davtashen", ru: "Давташен" } },
];

export const districtLabel = (key: DistrictKey, lang: Lang) =>
  DISTRICTS.find((d) => d.key === key)?.label[lang] ?? key;

const img = (id: string) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1600&q=80`;

const IMG = {
  a: img("photo-1512917774080-9991f1c4c750"),
  b: img("photo-1560448204-e02f11c3d0e2"),
  c: img("photo-1502672260266-1c1ef2d93688"),
  d: img("photo-1493809842364-78817add7ffb"),
  e: img("photo-1522708323590-d24dbb6b0267"),
  f: img("photo-1600585154340-be6161a56a0c"),
  g: img("photo-1600607687939-ce8a6c25118c"),
  h: img("photo-1600566753086-00f18fb6b3ea"),
  i: img("photo-1600210492486-724fe5c67fb0"),
  j: img("photo-1580587771525-78b9dba3b914"),
  k: img("photo-1567496898669-ee935f5f647a"),
  l: img("photo-1545324418-cc1a3fa10c00"),
  m: img("photo-1486406146926-c627a92ad1ab"),
  n: img("photo-1449844908441-8829872d2607"),
  o: img("photo-1502005229762-cf1b2da7c5d6"),
  p: img("photo-1616486338812-3dadae4b4ace"),
  q: img("photo-1600047509807-ba8f99d2cdde"),
  r: img("photo-1600607687920-4e2a09cf159d"),
};

export const HERO_IMAGES = [IMG.m, IMG.f, IMG.p, IMG.l];

const room = (hy: string, en: string, ru: string, area: number): RoomSpec => ({
  name: { hy, en, ru },
  area,
});

const layoutFor = (rooms: number, area: number): RoomSpec[] => {
  const living = +(area * 0.32).toFixed(1);
  const bed = +(area * 0.19).toFixed(1);
  const bath = +(area * 0.08).toFixed(1);
  const balcony = +(area * 0.06).toFixed(1);
  const hall = +(area * 0.11).toFixed(1);
  const base = [
    room("Հյուրասենյակ", "Living room", "Гостиная", living),
    room("Ննջասենյակ", "Bedroom", "Спальня", bed),
    room("Սանհանգույց", "Bathroom", "Санузел", bath),
    room("Պատշգամբ", "Balcony", "Балкон", balcony),
    room("Նախասենյակ", "Hall", "Прихожая", hall),
  ];
  if (rooms >= 3)
    base.splice(2, 0, room("Ննջասենյակ 2", "Bedroom 2", "Спальня 2", +(bed * 0.8).toFixed(1)));
  if (rooms >= 4)
    base.splice(3, 0, room("Աշխատասենյակ", "Study", "Кабинет", +(bed * 0.6).toFixed(1)));
  return base;
};

const poisFor = (): Poi[] => [
  {
    name: { hy: "Դպրոց N12", en: "School N12", ru: "Школа N12" },
    kind: "school",
    distance: "350 m",
  },
  { name: { hy: "Մետրո", en: "Metro station", ru: "Метро" }, kind: "metro", distance: "600 m" },
  { name: { hy: "Զբոսայգի", en: "City park", ru: "Парк" }, kind: "park", distance: "200 m" },
  {
    name: { hy: "Սուպերմարկետ", en: "Supermarket", ru: "Супермаркет" },
    kind: "supermarket",
    distance: "120 m",
  },
];

interface Seed {
  id: string;
  hy: string;
  en: string;
  ru: string;
  deal: Deal;
  type: PropertyType;
  district: DistrictKey;
  rooms: number;
  area: number;
  floor: number;
  floors: number;
  price: number;
  status: Status;
  images: string[];
  street: [string, string, string];
  building: [string, string, string];
  condition: [string, string, string];
}

const NEW_BUILD: [string, string, string] = ["Նորակառույց", "New build", "Новостройка"];
const STONE: [string, string, string] = ["Քարե", "Stone", "Каменный"];
const PANEL: [string, string, string] = ["Պանելային", "Panel", "Панельный"];
const MONOLITH: [string, string, string] = ["Մոնոլիտ", "Monolith", "Монолит"];

const RENOVATED: [string, string, string] = ["Վերանորոգված", "Renovated", "С ремонтом"];
const DESIGNER: [string, string, string] = ["Դիզայներական", "Designer", "Дизайнерский"];
const GOOD: [string, string, string] = ["Լավ վիճակում", "Good condition", "Хорошее состояние"];

const seeds: Seed[] = [
  {
    id: "northern-avenue-penthouse",
    hy: "Լուսավոր բնակարան Հյուսիսային պողոտայում",
    en: "Light-filled apartment on Northern Avenue",
    ru: "Светлая квартира на Северном проспекте",
    deal: "sale",
    type: "apartment",
    district: "center",
    rooms: 4,
    area: 138,
    floor: 8,
    floors: 14,
    price: 118000000,
    status: "available",
    images: [IMG.f, IMG.b, IMG.c, IMG.g, IMG.h],
    street: ["Հյուսիսային պող. 12", "12 Northern Ave", "Северный пр. 12"],
    building: NEW_BUILD,
    condition: DESIGNER,
  },
  {
    id: "cascade-view",
    hy: "Բնակարան Կասկադի տեսարանով",
    en: "Apartment with Cascade view",
    ru: "Квартира с видом на Каскад",
    deal: "sale",
    type: "apartment",
    district: "center",
    rooms: 3,
    area: 96,
    floor: 5,
    floors: 9,
    price: 76000000,
    status: "reserved",
    images: [IMG.d, IMG.o, IMG.e, IMG.i],
    street: ["Մոսկովյան 34", "34 Moskovyan St", "Московян 34"],
    building: STONE,
    condition: RENOVATED,
  },
  {
    id: "arabkir-quiet-two",
    hy: "Հանգիստ երկսենյականոց Արաբկիրում",
    en: "Quiet two-room in Arabkir",
    ru: "Тихая двухкомнатная в Арабкире",
    deal: "sale",
    type: "apartment",
    district: "arabkir",
    rooms: 2,
    area: 64,
    floor: 3,
    floors: 5,
    price: 38500000,
    status: "available",
    images: [IMG.c, IMG.q, IMG.h, IMG.b],
    street: ["Կոմիտաս 44", "44 Komitas Ave", "Комитас 44"],
    building: STONE,
    condition: GOOD,
  },
  {
    id: "arabkir-family",
    hy: "Ընտանեկան բնակարան Կոմիտասի մոտ",
    en: "Family apartment near Komitas",
    ru: "Семейная квартира у Комитаса",
    deal: "sale",
    type: "apartment",
    district: "arabkir",
    rooms: 4,
    area: 118,
    floor: 11,
    floors: 16,
    price: 92000000,
    status: "available",
    images: [IMG.g, IMG.i, IMG.o, IMG.d],
    street: ["Ազատության 18", "18 Azatutyan Ave", "Азатутян 18"],
    building: MONOLITH,
    condition: RENOVATED,
  },
  {
    id: "kanaker-terrace",
    hy: "Բնակարան լայն պատշգամբով Քանաքեռում",
    en: "Apartment with wide terrace in Kanaker",
    ru: "Квартира с широкой террасой в Канакере",
    deal: "sale",
    type: "apartment",
    district: "kanaker",
    rooms: 3,
    area: 88,
    floor: 6,
    floors: 12,
    price: 54000000,
    status: "available",
    images: [IMG.e, IMG.r, IMG.b, IMG.c],
    street: ["Դավիթ Անհաղթի 7", "7 Davit Anhaght St", "Давида Анахта 7"],
    building: NEW_BUILD,
    condition: RENOVATED,
  },
  {
    id: "davtashen-new-build",
    hy: "Նորակառույց բնակարան Դավթաշենում",
    en: "New-build apartment in Davtashen",
    ru: "Квартира в новостройке в Давташене",
    deal: "sale",
    type: "apartment",
    district: "davtashen",
    rooms: 2,
    area: 71,
    floor: 4,
    floors: 15,
    price: 44500000,
    status: "available",
    images: [IMG.b, IMG.f, IMG.q, IMG.g],
    street: ["4-րդ թաղամաս 21", "4th district 21", "4-й квартал 21"],
    building: NEW_BUILD,
    condition: GOOD,
  },
  {
    id: "avan-townhouse",
    hy: "Առանձնատուն Ավանում",
    en: "Townhouse in Avan",
    ru: "Дом в Аване",
    deal: "sale",
    type: "house",
    district: "avan",
    rooms: 5,
    area: 210,
    floor: 2,
    floors: 2,
    price: 105000000,
    status: "available",
    images: [IMG.j, IMG.n, IMG.a, IMG.p],
    street: ["Աճառյան 63", "63 Acharyan St", "Ачаряна 63"],
    building: STONE,
    condition: DESIGNER,
  },
  {
    id: "center-studio-rent",
    hy: "Ստուդիո բնակարան Կենտրոնում",
    en: "Studio apartment in the Center",
    ru: "Студия в Центре",
    deal: "rent",
    type: "apartment",
    district: "center",
    rooms: 1,
    area: 42,
    floor: 2,
    floors: 6,
    price: 195000,
    status: "available",
    images: [IMG.o, IMG.c, IMG.h, IMG.e],
    street: ["Աբովյան 9", "9 Abovyan St", "Абовян 9"],
    building: STONE,
    condition: RENOVATED,
  },
  {
    id: "center-opera-rent",
    hy: "Բնակարան Օպերայի հարևանությամբ",
    en: "Apartment next to the Opera",
    ru: "Квартира рядом с Оперой",
    deal: "rent",
    type: "apartment",
    district: "center",
    rooms: 3,
    area: 92,
    floor: 7,
    floors: 10,
    price: 580000,
    status: "available",
    images: [IMG.i, IMG.g, IMG.d, IMG.b],
    street: ["Թումանյան 27", "27 Tumanyan St", "Туманян 27"],
    building: MONOLITH,
    condition: DESIGNER,
  },
  {
    id: "arabkir-rent-two",
    hy: "Երկսենյականոց վարձով Արաբկիրում",
    en: "Two-room rental in Arabkir",
    ru: "Двухкомнатная в аренду в Арабкире",
    deal: "rent",
    type: "apartment",
    district: "arabkir",
    rooms: 2,
    area: 58,
    floor: 9,
    floors: 9,
    price: 265000,
    status: "reserved",
    images: [IMG.q, IMG.e, IMG.r, IMG.c],
    street: ["Բաղրամյան 52", "52 Baghramyan Ave", "Баграмян 52"],
    building: PANEL,
    condition: GOOD,
  },
  {
    id: "davtashen-rent-three",
    hy: "Ընդարձակ բնակարան վարձով Դավթաշենում",
    en: "Spacious rental in Davtashen",
    ru: "Просторная квартира в аренду в Давташене",
    deal: "rent",
    type: "apartment",
    district: "davtashen",
    rooms: 3,
    area: 84,
    floor: 5,
    floors: 12,
    price: 320000,
    status: "available",
    images: [IMG.r, IMG.b, IMG.i, IMG.o],
    street: ["Տիգրան Մեծի 5", "5 Tigran Mets St", "Тиграна Меца 5"],
    building: PANEL,
    condition: RENOVATED,
  },
  {
    id: "kanaker-office",
    hy: "Առևտրային տարածք Քանաքեռում",
    en: "Commercial space in Kanaker",
    ru: "Коммерческое помещение в Канакере",
    deal: "rent",
    type: "commercial",
    district: "kanaker",
    rooms: 4,
    area: 155,
    floor: 1,
    floors: 7,
    price: 480000,
    status: "available",
    images: [IMG.l, IMG.k, IMG.m, IMG.a],
    street: ["Ազատամարտիկների 3", "3 Azatamartikneri St", "Азатамартикнери 3"],
    building: MONOLITH,
    condition: GOOD,
  },
];

const describe = (s: Seed): L10n => ({
  hy: `${s.rooms} սենյականոց, ${s.area} քմ, ${s.floor}/${s.floors} հարկ։ Լուսավոր, հարմարավետ և խնամված տարածք Երևանի ${DISTRICTS.find((d) => d.key === s.district)!.label.hy} վարչական շրջանում։`,
  en: `${s.rooms} rooms, ${s.area} m², floor ${s.floor}/${s.floors}. Bright, comfortable and well-kept space in the ${DISTRICTS.find((d) => d.key === s.district)!.label.en} district of Yerevan.`,
  ru: `${s.rooms} комнаты, ${s.area} м², этаж ${s.floor}/${s.floors}. Светлое, комфортное и ухоженное пространство в районе ${DISTRICTS.find((d) => d.key === s.district)!.label.ru} Еревана.`,
});

export const PROPERTIES: Property[] = seeds.map((s) => ({
  id: s.id,
  title: { hy: s.hy, en: s.en, ru: s.ru },
  description: describe(s),
  deal: s.deal,
  type: s.type,
  district: s.district,
  address: { hy: s.street[0], en: s.street[1], ru: s.street[2] },
  rooms: s.rooms,
  area: s.area,
  floor: s.floor,
  floors: s.floors,
  price: s.price,
  status: s.status,
  buildingType: { hy: s.building[0], en: s.building[1], ru: s.building[2] },
  condition: { hy: s.condition[0], en: s.condition[1], ru: s.condition[2] },
  images: s.images,
  layout: layoutFor(s.rooms, s.area),
  pois: poisFor(),
}));

export const getProperty = (id: string) => PROPERTIES.find((p) => p.id === id);

export const formatAmd = (n: number) =>
  new Intl.NumberFormat("fr-FR").format(Math.round(n)).replace(/\u202f|\u00a0/g, " ") + " ֏";

export interface NewsItem {
  slug: string;
  date: string;
  cover: string;
  title: L10n;
  excerpt: L10n;
  body: L10n;
}

export const NEWS: NewsItem[] = [
  {
    slug: "yerevan-market-2026",
    date: "2026-06-18",
    cover: IMG.m,
    title: {
      hy: "Երևանի բնակարանային շուկան 2026-ին",
      en: "The Yerevan housing market in 2026",
      ru: "Рынок жилья Еревана в 2026 году",
    },
    excerpt: {
      hy: "Կենտրոնում գները կայունացել են, մինչդեռ Դավթաշենն ու Ավանը շարունակում են աճել։",
      en: "Prices in the Center have stabilised while Davtashen and Avan keep growing.",
      ru: "Цены в Центре стабилизировались, а Давташен и Аван продолжают расти.",
    },
    body: {
      hy: "Վերջին տասներկու ամիսների ընթացքում Երևանի կենտրոնում մեկ քառակուսի մետրի միջին գինը մնացել է կայուն, մինչդեռ նոր թաղամասերում պահանջարկը շարունակում է աճել։ Ռահանայի վերլուծաբանները խորհուրդ են տալիս գնորդներին ուշադրություն դարձնել նորակառույցների առաքման ժամկետներին։",
      en: "Over the last twelve months the average price per square metre in central Yerevan has stayed flat, while demand in the newer districts keeps climbing. Rahana's analysts advise buyers to look closely at delivery timelines for new builds.",
      ru: "За последние двенадцать месяцев средняя цена квадратного метра в центре Еревана осталась стабильной, а спрос в новых районах продолжает расти. Аналитики Rahana советуют покупателям внимательно изучать сроки сдачи новостроек.",
    },
  },
  {
    slug: "renting-checklist",
    date: "2026-05-02",
    cover: IMG.b,
    title: {
      hy: "Վարձակալության 7 կանոն",
      en: "Seven rules for renting well",
      ru: "Семь правил аренды",
    },
    excerpt: {
      hy: "Ինչի՞ վրա նայել պայմանագիրը ստորագրելուց առաջ։",
      en: "What to check before you sign the contract.",
      ru: "Что проверить перед подписанием договора.",
    },
    body: {
      hy: "Պայմանագիրը ստորագրելուց առաջ ստուգեք սեփականության վկայականը, կոմունալ վճարների պատմությունը, ջեռուցման տեսակը և գույքագրման ցանկը։ Ռահանան ուղեկցում է վարձակալին ամբողջ գործընթացում։",
      en: "Before signing, check the ownership certificate, the utility payment history, the heating system and the inventory list. Rahana accompanies tenants through the entire process.",
      ru: "Перед подписанием проверьте свидетельство о собственности, историю коммунальных платежей, систему отопления и опись имущества. Rahana сопровождает арендатора на всех этапах.",
    },
  },
  {
    slug: "rahana-opens-arabkir",
    date: "2026-03-21",
    cover: IMG.l,
    title: {
      hy: "Ռահանան բացում է գրասենյակ Արաբկիրում",
      en: "Rahana opens an office in Arabkir",
      ru: "Rahana открывает офис в Арабкире",
    },
    excerpt: {
      hy: "Մեր երկրորդ գրասենյակը՝ Կոմիտասի պողոտայում։",
      en: "Our second office, on Komitas Avenue.",
      ru: "Наш второй офис — на проспекте Комитаса.",
    },
    body: {
      hy: "Մարտից Ռահանայի թիմն ընդունում է հաճախորդներին նաև Կոմիտասի պողոտայի նոր գրասենյակում՝ ամեն օր 10:00–19:00։",
      en: "From March, the Rahana team also welcomes clients at the new Komitas Avenue office, every day from 10:00 to 19:00.",
      ru: "С марта команда Rahana принимает клиентов и в новом офисе на проспекте Комитаса, ежедневно с 10:00 до 19:00.",
    },
  },
];

export const getNews = (slug: string) => NEWS.find((n) => n.slug === slug);
