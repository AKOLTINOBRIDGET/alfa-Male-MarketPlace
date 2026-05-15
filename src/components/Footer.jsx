import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/5 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-4 gap-12">
        
        {/* Brand */}
        <div className="space-y-4">
          <Link to="/" className="text-2xl font-serif font-bold text-white flex items-center gap-2">
            <span className="text-gold-500 text-3xl">A</span>lfa Male
          </Link>
          <p className="text-gray-400 text-sm leading-relaxed">
            Style redefined for the modern man. Premium collection of suits, luxury watches, and classic shoes.
          </p>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-gold-500 font-serif text-lg mb-6 tracking-wider">Contact Us</h3>
          <ul className="space-y-3 text-sm text-gray-400">
            <li><a href="mailto:2300900107@gmail.com" className="hover:text-white transition">2300900107@gmail.com</a></li>
            <li><a href="tel:+256707777709" className="hover:text-white transition">+256707777709</a></li>
            <li className="pt-2">
              <input 
                type="text" 
                placeholder="Message us..." 
                className="w-full bg-dark border border-white/10 rounded px-3 py-2 text-white focus:outline-none focus:border-gold-500"
              />
            </li>
          </ul>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-gold-500 font-serif text-lg mb-6 tracking-wider">Quick Links</h3>
          <ul className="space-y-3 text-sm text-gray-400">
            <li><Link to="/" className="hover:text-gold-500 transition">Home</Link></li>
            <li><Link to="/products" className="hover:text-gold-500 transition">Products</Link></li>
            <li><Link to="/custom-tailoring" className="hover:text-gold-500 transition">Bespoke Tailoring</Link></li>
            <li><Link to="/dashboard" className="hover:text-gold-500 transition">My Account</Link></li>
            <li><Link to="/faq" className="hover:text-gold-500 transition">FAQ</Link></li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-gold-500 font-serif text-lg mb-6 tracking-wider">Follow Us</h3>
          <div className="flex gap-4">
            <a href="#" className="bg-dark-100 p-3 rounded-full hover:bg-gold-500 hover:text-dark transition-all duration-300">
              <FaFacebook size={18} />
            </a>
            <a href="#" className="bg-dark-100 p-3 rounded-full hover:bg-gold-500 hover:text-dark transition-all duration-300">
              <FaTwitter size={18} />
            </a>
            <a href="#" className="bg-dark-100 p-3 rounded-full hover:bg-gold-500 hover:text-dark transition-all duration-300">
              <FaInstagram size={18} />
            </a>
            <a href="#" className="bg-dark-100 p-3 rounded-full hover:bg-gold-500 hover:text-dark transition-all duration-300">
              <FaWhatsapp size={18} />
            </a>
          </div>
        </div>

      </div>

      <div className="container mx-auto px-4 mt-16 pt-8 border-t border-white/5 text-center text-sm text-gray-600">
        <p>&copy; {new Date().getFullYear()} The Alfa Male. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
