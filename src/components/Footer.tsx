import { Phone, MapPin, Clock } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-muted mt-16" role="contentinfo">
      <div className="container py-12" itemScope itemType="https://schema.org/Restaurant">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-3xl" role="img" aria-label="Суші">🍣</span>
              <h3 className="text-xl font-bold text-primary" itemProp="name">СУШИDОМ</h3>
            </div>
            <p className="text-muted-foreground" itemProp="description">
              Найсмачніші суші у Києві
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Контакти</h4>
            <div className="space-y-2 text-muted-foreground">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4" aria-hidden="true" />
                <a href="tel:+380980036263" itemProp="telephone" className="hover:underline">+38 (098) 003-62-63</a>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" aria-hidden="true" />
                <address className="not-italic" itemProp="address" itemScope itemType="https://schema.org/PostalAddress">
                  <span itemProp="addressLocality">м. Київ, вул. Княжий Затон 2/30</span>
                </address>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Режим роботи</h4>
            <div className="flex items-start gap-2 text-muted-foreground">
              <Clock className="h-4 w-4 mt-1" aria-hidden="true" />
              <div itemProp="openingHoursSpecification" itemScope itemType="https://schema.org/OpeningHoursSpecification">
                <meta itemProp="dayOfWeek" content="Monday" />
                <meta itemProp="dayOfWeek" content="Tuesday" />
                <meta itemProp="dayOfWeek" content="Wednesday" />
                <meta itemProp="dayOfWeek" content="Thursday" />
                <meta itemProp="dayOfWeek" content="Friday" />
                <meta itemProp="dayOfWeek" content="Saturday" />
                <meta itemProp="dayOfWeek" content="Sunday" />
                <meta itemProp="opens" content="10:00" />
                <meta itemProp="closes" content="21:00" />
                <p>Без вихідних 10:00 - 21:00</p>
                <p className="text-sm mt-1">При замовленні на суму від 1000 грн - ПОДАРУНОК</p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-muted-foreground text-sm">
          <p>&copy; 2025 СУШИDОМ. Всі права захищені.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
