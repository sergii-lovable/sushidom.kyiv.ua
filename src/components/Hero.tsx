import { Button } from "@/components/ui/button";
import heroImage from "@/assets/sushi-hero.jpg";

interface HeroProps {
  onOrderClick: () => void;
}

const Hero = ({ onOrderClick }: HeroProps) => {
  return (
    <section 
      className="relative h-[600px] flex items-center justify-center overflow-hidden"
      aria-label="Головний банер"
    >
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${heroImage})` }}
        role="img"
        aria-label="Фото суші"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
      </div>
      
      <div className="relative z-10 container text-center text-white">
        <h2 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
          Найсмачніші суші у Києві
        </h2>
        <p className="text-xl md:text-2xl mb-8 text-white/90">
          Свіжі інгредієнти •  • Унікальні смаки
        </p>
        <Button 
          variant="hero" 
          size="lg" 
          className="text-lg px-8 py-6"
          onClick={onOrderClick}
          aria-label="Перейти до меню та замовити"
        >
          Замовити зараз
        </Button>
      </div>
    </section>
  );
};

export default Hero;
