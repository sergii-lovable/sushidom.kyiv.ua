import { useState } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Menu from "@/components/Menu";
import Cart, { CartItem } from "@/components/Cart";
import OrderForm from "@/components/OrderForm";
import Footer from "@/components/Footer";
import { MenuItemType } from "@/components/MenuItem";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { toast } = useToast();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrderFormOpen, setIsOrderFormOpen] = useState(false);

  const addToCart = (item: MenuItemType) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item.id);
      
      if (existingItem) {
        return prevItems.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      
      return [...prevItems, { ...item, quantity: 1 }];
    });

    toast({
      title: "Додано до кошика",
      description: `${item.name} додано до вашого замовлення`,
    });
  };

  const updateQuantity = (id: number, change: number) => {
    setCartItems(prevItems => {
      return prevItems
        .map(item => {
          if (item.id === id) {
            const newQuantity = item.quantity + change;
            return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
          }
          return item;
        })
        .filter(item => item.quantity > 0);
    });
  };

  const removeFromCart = (id: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsOrderFormOpen(true);
  };

  const handleOrderComplete = () => {
    setCartItems([]);
  };

  const scrollToMenu = () => {
    const menuSection = document.querySelector('section.container');
    menuSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Header cartCount={cartCount} onCartClick={() => setIsCartOpen(true)} />
        
        <main className="flex-grow" role="main">
          <Hero onOrderClick={scrollToMenu} />
          <Menu onAddToCart={addToCart} />
        </main>

        <Footer />

        <Cart
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          items={cartItems}
          onUpdateQuantity={updateQuantity}
          onRemove={removeFromCart}
          onCheckout={handleCheckout}
        />

        <OrderForm
          isOpen={isOrderFormOpen}
          onClose={() => setIsOrderFormOpen(false)}
          items={cartItems}
          total={total}
          onOrderComplete={handleOrderComplete}
        />
      </div>
      
      {/* Hidden content for SEO - helps search engines understand the page */}
      <div className="sr-only" aria-hidden="true">
        <h1>СУШИDОМ Київ - Доставка суші та ролів</h1>
        <p>
          Замовляйте найсмачніші суші у Києві з доставкою до дому. 
          У нашому меню: роли Філадельфія, Каліфорнія, Дракон, сети та нігірі. 
          Свіжі інгредієнти. 
          Працюємо щодня з 10:00 до 21:00.
        </p>
      </div>
    </>
  );
};

export default Index;
