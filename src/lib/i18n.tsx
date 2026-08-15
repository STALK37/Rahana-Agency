import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { L10n, Lang } from "./data";

const dict = {
  "nav.buy": { hy: "Վաճառք", en: "Sale", ru: "Продажа" },
  "nav.rent": { hy: "Վարձակալություն", en: "Rental", ru: "Аренда" },
  "nav.listings": { hy: "Բնակարաններ", en: "Properties", ru: "Объекты" },
  "nav.about": { hy: "Մեր մասին", en: "About us", ru: "О нас" },
  "nav.news": { hy: "Նորություններ", en: "News", ru: "Новости" },
  "nav.contact": { hy: "Կապ մեզ հետ", en: "Contact us", ru: "Связаться" },
  "nav.calculator": { hy: "Հաշվիչ", en: "Calculator", ru: "Калькулятор" },
  "nav.favourites": { hy: "Ընտրանի", en: "Favourites", ru: "Избранное" },
  "nav.compare": { hy: "Համեմատել", en: "Compare", ru: "Сравнение" },
  "nav.book": { hy: "Ամրագրել դիտում", en: "Book a viewing", ru: "Записаться на показ" },
  "nav.menu": { hy: "Մենյու", en: "Menu", ru: "Меню" },

  tagline: {
    hy: "Ռահանա՝ որտեղ սկսվում է ձեր պատմությունը",
    en: "Where your story starts",
    ru: "Там, где начинается ваша история",
  },
  "tagline.short": {
    hy: "ՈՐՏԵՂ ՍԿՍՎՈՒՄ Է ՁԵՐ ՊԱՏՄՈՒԹՅՈՒՆԸ",
    en: "WHERE YOUR STORY STARTS",
    ru: "ГДЕ НАЧИНАЕТСЯ ВАША ИСТОРИЯ",
  },

  "hero.cta": { hy: "Տեսնել ավելին", en: "See more", ru: "Смотреть" },
  "search.deal": { hy: "Գործարք", en: "Deal", ru: "Сделка" },
  "search.district": { hy: "Վարչական շրջան", en: "District", ru: "Район" },
  "search.rooms": { hy: "Սենյակ", en: "Rooms", ru: "Комнаты" },
  "search.price": { hy: "Գին", en: "Price", ru: "Цена" },
  "search.any": { hy: "Բոլորը", en: "Any", ru: "Любой" },
  "search.results": { hy: "Առաջարկ", en: "Properties", ru: "Объектов" },
  "search.show": { hy: "Դիտել", en: "View", ru: "Смотреть" },
  "search.more": { hy: "Ավելի շատ ֆիլտրեր", en: "More filters", ru: "Больше фильтров" },
  "search.change": { hy: "Փոխել", en: "Change", ru: "Изменить" },
  "filters.clear": { hy: "Մաքրել", en: "Clear", ru: "Очистить" },
  "listings.noMatch": { hy: "Համընկնումներ չկան", en: "No matches", ru: "Нет совпадений" },
  "listings.status": { hy: "Կարգավիճակ", en: "Status", ru: "Статус" },

  "home.featured": { hy: "Ընտրված առաջարկներ", en: "Featured properties", ru: "Избранные объекты" },
  "home.featured.sub": {
    hy: "Խնամքով ընտրված բնակարաններ Երևանի լավագույն թաղամասերում",
    en: "Carefully selected homes in the best districts of Yerevan",
    ru: "Тщательно отобранные квартиры в лучших районах Еревана",
  },
  "home.about": { hy: "Ռահանայի մասին", en: "About Rahana", ru: "О Rahana" },
  "home.news": { hy: "Նորություններ", en: "News", ru: "Новости" },
  "home.map": { hy: "Մենք Երևանում", en: "We are in Yerevan", ru: "Мы в Ереване" },
  "home.viewAll": { hy: "Դիտել բոլորը", en: "View all", ru: "Смотреть все" },

  "listings.title": { hy: "Բնակարաններ", en: "Properties", ru: "Объекты" },
  "listings.filters": { hy: "Ֆիլտրեր", en: "Filters", ru: "Фильтры" },
  "listings.type": { hy: "Տեսակ", en: "Property type", ru: "Тип" },
  "type.apartment": { hy: "Բնակարան", en: "Apartment", ru: "Квартира" },
  "type.house": { hy: "Առանձնատուն", en: "House", ru: "Дом" },
  "type.commercial": { hy: "Առևտրային", en: "Commercial", ru: "Коммерческая" },
  "listings.floor": { hy: "Հարկ", en: "Floor", ru: "Этаж" },
  "listings.area": { hy: "Մակերես, քմ", en: "Area, m²", ru: "Площадь, м²" },
  "listings.reset": { hy: "Մաքրել բոլորը", en: "Reset all", ru: "Сбросить всё" },
  "listings.sort": { hy: "Դասավորել", en: "Sort", ru: "Сортировка" },
  "sort.newest": { hy: "Ըստ նորության", en: "Newest", ru: "Сначала новые" },
  "sort.priceAsc": { hy: "Գինը՝ աճող", en: "Price: low to high", ru: "Цена: по возрастанию" },
  "sort.priceDesc": { hy: "Գինը՝ նվազող", en: "Price: high to low", ru: "Цена: по убыванию" },
  "sort.areaDesc": { hy: "Մակերեսը՝ նվազող", en: "Area: largest", ru: "Площадь: больше" },
  "status.available": { hy: "Ազատ", en: "Available", ru: "Свободно" },
  "status.reserved": { hy: "Ամրագրված", en: "Reserved", ru: "Забронировано" },
  "status.all": { hy: "Բոլորը", en: "All", ru: "Все" },
  "listings.empty": {
    hy: "Այս պարամետրերով առաջարկ չկա",
    en: "No properties match these filters",
    ru: "По этим параметрам ничего не найдено",
  },
  "listings.emptyHint": {
    hy: "Փորձեք մաքրել մի քանի ֆիլտր",
    en: "Try clearing a few filters",
    ru: "Попробуйте убрать несколько фильтров",
  },

  "unit.sqm": { hy: "քմ", en: "m²", ru: "м²" },
  "unit.room": { hy: "սեն.", en: "rooms", ru: "комн." },
  "unit.month": { hy: "/ ամիս", en: "/ month", ru: "/ мес" },
  "unit.floorOf": { hy: "հարկ", en: "floor", ru: "этаж" },

  "prop.specs": { hy: "Բնութագրեր", en: "Specification", ru: "Характеристики" },
  "prop.layout": { hy: "Սենյակների բաշխում", en: "Room breakdown", ru: "Разбивка по комнатам" },
  "prop.building": { hy: "Շենքի տեսակ", en: "Building type", ru: "Тип здания" },
  "prop.condition": { hy: "Վիճակ", en: "Condition", ru: "Состояние" },
  "prop.similar": { hy: "Նմանատիպ առաջարկներ", en: "Similar properties", ru: "Похожие объекты" },
  "prop.location": { hy: "Տեղակայում", en: "Location", ru: "Расположение" },
  "prop.nearby": { hy: "Մոտակայքում", en: "Nearby", ru: "Рядом" },
  "prop.calc": { hy: "Վճարման հաշվարկ", en: "Payment planner", ru: "Расчёт оплаты" },
  "prop.back": { hy: "Դեպի բնակարաններ", en: "Back to properties", ru: "К объектам" },

  "calc.title": { hy: "Վճարումների հաշվիչ", en: "Payment calculator", ru: "Калькулятор платежей" },
  "calc.sub": {
    hy: "Ռահանան գործակալություն է, ոչ թե բանկ։ Այս հաշվիչը օգնում է պլանավորել վճարումները։",
    en: "Rahana is an agency, not a lender. This planner helps you map out payments.",
    ru: "Rahana — агентство, а не банк. Этот калькулятор помогает спланировать платежи.",
  },
  "calc.full": { hy: "Ամբողջական վճարում", en: "Full payment", ru: "Полная оплата" },
  "calc.installment": { hy: "Ապառիկ", en: "Installment", ru: "Рассрочка" },
  "calc.rental": {
    hy: "Վարձակալության հնարավորություն",
    en: "Rental affordability",
    ru: "Доступность аренды",
  },
  "calc.price": { hy: "Գույքի արժեք", en: "Property price", ru: "Стоимость объекта" },
  "calc.fee": { hy: "Գործակալական վճար, %", en: "Agency fee, %", ru: "Комиссия агентства, %" },
  "calc.total": { hy: "Ընդամենը", en: "Total", ru: "Итого" },
  "calc.down": { hy: "Կանխավճար", en: "Down payment", ru: "Первый взнос" },
  "calc.months": { hy: "Ամիսների քանակ", en: "Months", ru: "Количество месяцев" },
  "calc.monthly": { hy: "Ամսական վճար", en: "Monthly payment", ru: "Ежемесячный платёж" },
  "calc.period": { hy: "Ամիս", en: "Period", ru: "Период" },
  "calc.payment": { hy: "Վճար", en: "Payment", ru: "Платёж" },
  "calc.balance": { hy: "Մնացորդ", en: "Balance", ru: "Остаток" },
  "calc.income": { hy: "Ամսական եկամուտ", en: "Monthly income", ru: "Ежемесячный доход" },
  "calc.rent": { hy: "Ամսական վարձավճար", en: "Monthly rent", ru: "Ежемесячная аренда" },
  "calc.utilities": { hy: "Կոմունալ ծախսեր", en: "Utilities", ru: "Коммунальные" },
  "calc.ratio": { hy: "Բեռի գործակից", en: "Affordability ratio", ru: "Коэффициент нагрузки" },
  "calc.verdict.good": { hy: "Հարմարավետ բեռ", en: "Comfortable", ru: "Комфортно" },
  "calc.verdict.ok": { hy: "Ընդունելի բեռ", en: "Manageable", ru: "Приемлемо" },
  "calc.verdict.bad": { hy: "Բարձր բեռ", en: "Too high", ru: "Высокая нагрузка" },

  "fav.title": {
    hy: "Ընտրանի և համեմատություն",
    en: "Favourites & compare",
    ru: "Избранное и сравнение",
  },
  "fav.wishlist": { hy: "Ընտրանի", en: "Wishlist", ru: "Избранное" },
  "fav.compare": { hy: "Համեմատել", en: "Compare", ru: "Сравнение" },
  "fav.empty": {
    hy: "Ընտրանին դատարկ է։ Սեղմեք սրտիկը ցանկացած առաջարկի վրա՝ այն այստեղ պահելու համար։",
    en: "Your wishlist is empty. Tap the heart on any property to keep it here.",
    ru: "Избранное пусто. Нажмите на сердечко у любого объекта, чтобы сохранить его.",
  },
  "compare.empty": {
    hy: "Համեմատության ցանկը դատարկ է։ Ավելացրեք մինչև 4 առաջարկ՝ դրանք կողք կողքի տեսնելու համար։",
    en: "Nothing to compare yet. Add up to four properties to see them side by side.",
    ru: "Пока нечего сравнивать. Добавьте до четырёх объектов, чтобы увидеть их рядом.",
  },
  "fav.browse": { hy: "Դիտել բնակարանները", en: "Browse properties", ru: "Смотреть объекты" },

  "contact.title": { hy: "Կապ մեզ հետ", en: "Contact us", ru: "Связаться с нами" },
  "contact.address": { hy: "Հասցե", en: "Address", ru: "Адрес" },
  "contact.phone": { hy: "Հեռախոս", en: "Phone", ru: "Телефон" },
  "contact.email": { hy: "Էլ. փոստ", en: "Email", ru: "Эл. почта" },
  "contact.hours": { hy: "Աշխատանքային ժամեր", en: "Opening hours", ru: "Часы работы" },
  "contact.hoursValue": {
    hy: "Երկ–Շաբ, 10:00–19:00",
    en: "Mon–Sat, 10:00–19:00",
    ru: "Пн–Сб, 10:00–19:00",
  },

  "form.first": { hy: "Անուն", en: "First name", ru: "Имя" },
  "form.last": { hy: "Ազգանուն", en: "Last name", ru: "Фамилия" },
  "form.email": { hy: "Էլ. փոստ", en: "Email", ru: "Эл. почта" },
  "form.phone": { hy: "Հեռախոսահամար", en: "Phone number", ru: "Телефон" },
  "form.message": { hy: "Հաղորդագրություն", en: "Message", ru: "Сообщение" },
  "form.send": { hy: "Ուղարկել", en: "Send", ru: "Отправить" },
  "form.consent": {
    hy: "Ուղարկելով՝ դուք համաձայնում եք, որ Ռահանան կապ հաստատի ձեզ հետ ձեր հարցման վերաբերյալ։",
    en: "By sending this you agree that Rahana may contact you about your request.",
    ru: "Отправляя форму, вы соглашаетесь, что Rahana свяжется с вами по вашему запросу.",
  },
  "form.sent": {
    hy: "Շնորհակալություն։ Մենք կկապվենք ձեզ հետ։",
    en: "Thank you. We will get back to you shortly.",
    ru: "Спасибо. Мы свяжемся с вами в ближайшее время.",
  },

  "about.title": { hy: "Մեր մասին", en: "About us", ru: "О нас" },
  "about.lead": {
    hy: "Ռահանան Երևանում գործող անշարժ գույքի գործակալություն է, որը զբաղվում է ժամանակակից և հարմարավետ բնակարանների վաճառքով և վարձակալությամբ։",
    en: "Rahana is a Yerevan estate agency dedicated to the sale and rental of modern, comfortable apartments.",
    ru: "Rahana — ереванское агентство недвижимости, занимающееся продажей и арендой современных, комфортных квартир.",
  },

  "404.title": { hy: "Էջը չի գտնվել", en: "Page not found", ru: "Страница не найдена" },
  "404.text": {
    hy: "Հասցեն սխալ է կամ էջը տեղափոխվել է։ Ահա մի քանի առաջարկ։",
    en: "The address is wrong or the page has moved. Here are a few properties instead.",
    ru: "Адрес неверен или страница перемещена. Вот несколько объектов.",
  },

  "footer.rights": {
    hy: "Բոլոր իրավունքները պաշտպանված են",
    en: "All rights reserved",
    ru: "Все права защищены",
  },
  "footer.pages": { hy: "Էջեր", en: "Pages", ru: "Страницы" },
} satisfies Record<string, L10n>;

export type TKey = keyof typeof dict;

interface Ctx {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (k: TKey) => string;
  tl: (v: L10n) => string;
}

const I18nContext = createContext<Ctx | null>(null);

export const LANGS: { code: Lang; label: string }[] = [
  { code: "hy", label: "ՀԱՅ" },
  { code: "en", label: "ENG" },
  { code: "ru", label: "РУС" },
];

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("hy");

  useEffect(() => {
    const stored = localStorage.getItem("rahana-lang") as Lang | null;
    if (stored && ["hy", "en", "ru"].includes(stored)) setLangState(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    localStorage.setItem("rahana-lang", l);
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      lang,
      setLang,
      t: (k) => dict[k][lang],
      tl: (v) => v[lang],
    }),
    [lang, setLang],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider");
  return ctx;
}
