import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Settings, CheckCircle, Mail, Phone, MapPin, Search } from 'lucide-react';

const LandingPage = () => {
  const [cartCount, setCartCount] = useState(0);
  const [addedItems, setAddedItems] = useState<number[]>([]);

  const products = [
    { id: 1, name: "Premium Brake Pads", price: 45.99, category: "Brakes", image: "🛑" },
    { id: 2, name: "Synthetic Motor Oil 5W-30", price: 29.50, category: "Fluids", image: "🛢️" },
    { id: 3, name: "Iridium Spark Plugs (Set of 4)", price: 32.00, category: "Engine", image: "⚡" },
    { id: 4, name: "Heavy Duty Alternator", price: 145.00, category: "Electrical", image: "🔋" },
    { id: 5, name: "Performance Air Filter", price: 18.99, category: "Filters", image: "🌪️" },
    { id: 6, name: "All-Season Wiper Blades", price: 22.50, category: "Exterior", image: "🌧️" },
  ];

  const handleAddToCart = (id: number) => {
    setCartCount(prev => prev + 1);
    setAddedItems([...addedItems, id]);
    setTimeout(() => {
      setAddedItems(prev => prev.filter(item => item !== id));
    }, 2000);
  };

  return (
    <div className="min-h-screen font-sans bg-slate-900 text-slate-200">
      
      {/* Basic Navigation */}
      <nav className="sticky top-0 z-50 bg-slate-800 border-b border-slate-700 shadow-md">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 text-white font-bold p-2 rounded">AP</div>
            <span className="text-xl font-bold text-white tracking-wide">AutoParts Store</span>
          </div>
          
          <div className="hidden md:flex gap-8 font-medium text-slate-300">
            <a href="#hero" className="hover:text-white">Home</a>
            <a href="#products" className="hover:text-blue-400">Shop Parts</a>
            <a href="#about" className="hover:text-white">About Us</a>
            <a href="#contact" className="hover:text-white">Contact</a>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Link to="/cart" className="block">
                <ShoppingCart className="text-slate-300 cursor-pointer hover:text-white" size={24} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
            <Link text-sm to="/login" className="px-4 py-2 text-slate-300 hover:text-white">Login</Link>
            <Link to="/register" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 shadow">Register</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section (Simplified) */}
      <section id="hero" className="py-20 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-blue-400 font-bold tracking-wider uppercase text-sm mb-2 block">Available 24/7</span>
            <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
              Quality Auto Parts for Every Vehicle
            </h1>
            <p className="text-lg text-slate-400 mb-8">
              Find the exact parts you need to get back on the road. We stock thousands of high-quality components from trusted brands.
            </p>
            <div className="flex gap-4">
              <a href="#products" className="px-6 py-3 bg-blue-600 text-white font-bold rounded shadow hover:bg-blue-700">
                Browse Catalog
              </a>
              <Link to="/register" className="px-6 py-3 bg-slate-800 text-white font-bold rounded shadow border border-slate-700 hover:bg-slate-700">
                Join Now
              </Link>
            </div>
          </div>
          <div className="bg-slate-800 p-8 rounded-xl border border-slate-700 shadow-xl flex flex-col items-center justify-center h-80">
            <Settings size={80} className="text-blue-500 mb-6 animate-spin-slow" />
            <h3 className="text-2xl font-bold text-white">Find Your Part</h3>
            <div className="w-full mt-6 flex gap-2">
              <input type="text" placeholder="Search by part number or name..." className="flex-1 bg-slate-700 border border-slate-600 rounded px-4 py-2 text-white" />
              <button className="bg-blue-600 px-4 py-2 rounded text-white"><Search size={20}/></button>
            </div>
          </div>
        </div>
      </section>

      {/* Products Catalog Section */}
      <section id="products" className="py-20 bg-slate-800 border-y border-slate-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-white mb-4">Featured Parts Catalog</h2>
            <p className="text-slate-400">Add genuine OEM and aftermarket parts directly to your cart.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <div key={product.id} className="bg-slate-900 border border-slate-700 rounded-lg p-6 flex flex-col shadow-lg hover:border-blue-500 transition-colors">
                <div className="text-6xl text-center mb-4">{product.image}</div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">{product.category}</span>
                  <span className="text-lg font-bold text-white">${product.price.toFixed(2)}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-200 mb-6 flex-1">{product.name}</h3>
                
                <button 
                  onClick={() => handleAddToCart(product.id)}
                  className={`w-full py-3 rounded font-bold flex justify-center items-center gap-2 transition-colors ${
                    addedItems.includes(product.id) 
                      ? 'bg-green-600 hover:bg-green-700 text-white' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {addedItems.includes(product.id) ? (
                    <><CheckCircle size={18} /> Added to Cart</>
                  ) : (
                    <><ShoppingCart size={18} /> Add to Cart</>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="bg-slate-800 rounded-xl p-10 border border-slate-700 shadow-xl">
            <div className="grid grid-cols-2 gap-6">
               <div className="bg-slate-900 p-6 rounded text-center border border-slate-700">
                  <div className="text-3xl font-bold text-blue-500 mb-2">10k+</div>
                  <div className="text-sm text-slate-400">Parts in Stock</div>
               </div>
               <div className="bg-slate-900 p-6 rounded text-center border border-slate-700">
                  <div className="text-3xl font-bold text-blue-500 mb-2">24h</div>
                  <div className="text-sm text-slate-400">Fast Shipping</div>
               </div>
               <div className="bg-slate-900 p-6 rounded text-center border border-slate-700">
                  <div className="text-3xl font-bold text-blue-500 mb-2">15</div>
                  <div className="text-sm text-slate-400">Years Experience</div>
               </div>
               <div className="bg-slate-900 p-6 rounded text-center border border-slate-700">
                  <div className="text-3xl font-bold text-blue-500 mb-2">5★</div>
                  <div className="text-sm text-slate-400">Customer Rating</div>
               </div>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">About AutoParts Store</h2>
            <p className="text-slate-400 mb-6 leading-relaxed">
              We started with a simple goal: provide everyday people and mechanics with reliable auto parts without the hassle. Getting the right part shouldn't require compromising on quality or paying dealership markups.
            </p>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-slate-300">
                <CheckCircle className="text-blue-500" size={20} /> Only authentic and verified aftermarket parts.
              </li>
              <li className="flex items-center gap-3 text-slate-300">
                <CheckCircle className="text-blue-500" size={20} /> Knowledgeable staff ready to help you match vehicle specs.
              </li>
              <li className="flex items-center gap-3 text-slate-300">
                <CheckCircle className="text-blue-500" size={20} /> Secure online checkout and swift delivery to your garage.
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-slate-800 border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-16">
          <div>
            <h2 className="text-3xl font-bold text-white mb-6">Contact Us</h2>
            <p className="text-slate-400 mb-8">Need a specific part that isn't listed? Have questions about your order? Reach out to our team.</p>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-slate-300">
                <div className="w-12 h-12 bg-slate-900 rounded flex items-center justify-center border border-slate-700">
                  <Phone className="text-blue-400" />
                </div>
                <div>
                  <div className="font-bold">Phone Support</div>
                  <div className="text-slate-400">+1 (555) 123-4567</div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-slate-300">
                <div className="w-12 h-12 bg-slate-900 rounded flex items-center justify-center border border-slate-700">
                  <Mail className="text-blue-400" />
                </div>
                <div>
                  <div className="font-bold">Email Us</div>
                  <div className="text-slate-400">support@autoparts.com</div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-slate-300">
                <div className="w-12 h-12 bg-slate-900 rounded flex items-center justify-center border border-slate-700">
                  <MapPin className="text-blue-400" />
                </div>
                <div>
                  <div className="font-bold">Store Location</div>
                  <div className="text-slate-400">123 Mechanic Ave, Detroit MI</div>
                </div>
              </div>
            </div>
          </div>

          <form className="bg-slate-900 p-8 rounded-xl border border-slate-700 shadow-lg" onSubmit={e => e.preventDefault()}>
            <div className="mb-4">
              <label className="block text-slate-400 mb-2 font-bold text-sm">Full Name</label>
              <input type="text" className="w-full bg-slate-800 border-slate-600 rounded px-4 py-3 text-white" placeholder="John Doe" />
            </div>
            <div className="mb-4">
              <label className="block text-slate-400 mb-2 font-bold text-sm">Email Address</label>
              <input type="email" className="w-full bg-slate-800 border-slate-600 rounded px-4 py-3 text-white" placeholder="john@example.com" />
            </div>
            <div className="mb-6">
              <label className="block text-slate-400 mb-2 font-bold text-sm">How can we help?</label>
              <textarea rows={4} className="w-full bg-slate-800 border-slate-600 rounded px-4 py-3 text-white resize-none" placeholder="I am looking for a water pump for a 2015 Honda Civic..."></textarea>
            </div>
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded transition-colors shadow">
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-10 text-center border-t border-slate-800">
        <div className="text-slate-400 mb-4 font-bold text-xl">AutoParts Store</div>
        <p className="text-slate-600 text-sm">© {new Date().getFullYear()} AutoParts Store. Real parts for real people.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
