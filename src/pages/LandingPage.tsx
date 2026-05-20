import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Mail, Phone, MapPin, Search, ChevronRight } from 'lucide-react';

const LandingPage = () => {
  const [cartCount] = useState(0);

  return (
    <div className="min-h-screen font-sans bg-white text-slate-800 selection:bg-slate-200 selection:text-slate-900">
      
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-900 text-white flex items-center justify-center font-bold rounded-sm text-xs tracking-wider">AP</div>
            <span className="text-lg font-bold tracking-tight text-slate-900">AutoParts</span>
          </div>
          
          <div className="hidden md:flex gap-10 text-sm font-medium text-slate-500 tracking-wide">
            <a href="#hero" className="hover:text-slate-900 transition-colors">Home</a>
            <a href="#about" className="hover:text-slate-900 transition-colors">About</a>
            <a href="#contact" className="hover:text-slate-900 transition-colors">Contact</a>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative">
              <Link to="/cart" className="block text-slate-400 hover:text-slate-900 transition-colors">
                <ShoppingCart size={20} strokeWidth={1.5} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-slate-900 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
            </div>
            {localStorage.getItem('user') ? (
              <div className="flex items-center gap-4">
                <span className="text-sm text-slate-500">
                  <span className="font-semibold text-slate-900">{JSON.parse(localStorage.getItem('user')!).fullName ?? JSON.parse(localStorage.getItem('user')!).FullName}</span>
                </span>
                <button
                  onClick={() => {
                    localStorage.removeItem('user');
                    window.location.reload();
                  }}
                  className="text-xs px-4 py-2 text-slate-500 hover:text-slate-900 transition-colors tracking-wide uppercase font-semibold"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link to="/login" className="text-sm text-slate-500 hover:text-slate-900 transition-colors font-medium">Log in</Link>
                <Link to="/register" className="text-sm px-5 py-2.5 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-colors font-medium">Register</Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="pt-32 pb-24 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-xs font-medium text-slate-500 mb-8">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Systems online 24/7
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.1]">
              Refine your ride.
            </h1>
            <p className="text-lg text-slate-500 mb-10 leading-relaxed font-light">
              Essential parts for discerning drivers. Quality components, minimal friction, and a seamless procurement experience.
            </p>
            <div className="flex items-center gap-4">
              <Link to="/register" className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-md hover:bg-slate-800 transition-all font-medium">
                Get started <ChevronRight size={18} />
              </Link>
            </div>
          </div>
          <div className="relative hidden md:block">
            <div className="aspect-square bg-slate-50 rounded-2xl border border-slate-100 flex flex-col items-center justify-center p-10 relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-slate-50 to-slate-100/50"></div>
               <div className="relative z-10 w-full max-w-sm">
                  <div className="mb-8 text-center">
                    <div className="w-16 h-16 bg-white shadow-sm border border-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Search className="text-slate-400" size={24} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900">Locate part</h3>
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Enter part number..." 
                      className="flex-1 bg-white border border-slate-200 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-slate-400 focus:ring-1 focus:ring-slate-400 transition-shadow placeholder:text-slate-400" 
                    />
                    <button className="bg-slate-900 px-6 rounded-md text-white hover:bg-slate-800 transition-colors">
                      <Search size={18} strokeWidth={1.5} />
                    </button>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-6 bg-slate-50/50 border-y border-slate-100">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-4">Precision matters.</h2>
            <p className="text-slate-500 font-light leading-relaxed text-lg">
              We eliminate the noise from auto parts sourcing. No flashy gimmicks—just a verified catalog of authentic OEM and aftermarket components designed to keep you moving.
            </p>
          </div>
          
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              { label: 'Inventory', value: '10k+', desc: 'Curated components' },
              { label: 'Fulfillment', value: '24h', desc: 'Average dispatch time' },
              { label: 'Quality', value: '100%', desc: 'Verified authentic parts' }
            ].map((stat, i) => (
              <div key={i} className="p-8 bg-white border border-slate-100 rounded-xl shadow-sm">
                <div className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-4">{stat.label}</div>
                <div className="text-4xl font-bold text-slate-900 mb-2">{stat.value}</div>
                <div className="text-slate-500 text-sm font-light">{stat.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-20 items-start">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-6">Support & inquiries</h2>
            <p className="text-slate-500 font-light mb-12">
              Require assistance with part compatibility or order tracking? Our technical team is available.
            </p>
            
            <div className="space-y-8">
              {[
                { icon: Phone, label: 'Phone', value: '+1 (555) 123-4567' },
                { icon: Mail, label: 'Email', value: 'support@autoparts.com' },
                { icon: MapPin, label: 'Location', value: '123 Tech Ave, Detroit MI' },
              ].map((contact, i) => (
                <div key={i} className="flex items-center gap-6 group">
                  <div className="w-12 h-12 bg-slate-50 group-hover:bg-slate-100 transition-colors rounded-full flex items-center justify-center border border-slate-100 text-slate-400">
                    <contact.icon size={20} strokeWidth={1.5} />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-slate-400 mb-1">{contact.label}</div>
                    <div className="text-slate-900 font-medium">{contact.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <form className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-100 shadow-sm" onSubmit={e => e.preventDefault()}>
            <div className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Name</label>
                  <input type="text" className="w-full bg-slate-50 border border-slate-200 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-slate-400 focus:bg-white transition-colors" placeholder="Jane Doe" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Email</label>
                  <input type="email" className="w-full bg-slate-50 border border-slate-200 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-slate-400 focus:bg-white transition-colors" placeholder="jane@example.com" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Message</label>
                <textarea rows={4} className="w-full bg-slate-50 border border-slate-200 rounded-md px-4 py-3 text-sm focus:outline-none focus:border-slate-400 focus:bg-white transition-colors resize-none" placeholder="How can we assist you?"></textarea>
              </div>
              <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3.5 rounded-md transition-colors mt-2">
                Send Message
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between max-w-6xl mx-auto text-sm text-slate-400">
        <div className="flex items-center gap-2 mb-4 md:mb-0">
          <div className="w-5 h-5 bg-slate-200 text-slate-600 flex items-center justify-center font-bold rounded-[2px] text-[8px]">AP</div>
          <span className="font-semibold text-slate-900">AutoParts</span>
        </div>
        <p>© {new Date().getFullYear()} AutoParts. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
