import { motion } from "framer-motion";
import { Mail, Phone, Instagram, Facebook } from "lucide-react";

export const Footer = () => {
  return (
    <footer 
      className="py-6 px-6 backdrop-blur-md"
      style={{ 
        background: "linear-gradient(135deg, hsl(195 65% 25%) 0%, hsl(195 70% 30%) 100%)"
      }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Info */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-[hsl(180,70%,70%)] mb-2">Get in Touch</h3>
            
            <a 
              href="mailto:hello@craftprint.studio" 
              className="flex items-center gap-3 text-sm text-[hsl(195,40%,75%)] hover:text-[hsl(180,70%,80%)] transition-all duration-300 group"
            >
              <div 
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, hsl(195 50% 30%) 0%, hsl(195 55% 35%) 100%)",
                  boxShadow: "0 2px 8px hsl(195 65% 15% / 0.3)"
                }}
              >
                <Mail className="w-4 h-4 text-[hsl(180,70%,70%)] group-hover:text-white transition-colors duration-300" />
              </div>
              <span className="group-hover:translate-x-1 transition-transform duration-300">hello@craftprint.studio</span>
            </a>
            
            <a 
              href="tel:+1234567890" 
              className="flex items-center gap-3 text-sm text-[hsl(195,40%,75%)] hover:text-[hsl(180,70%,80%)] transition-all duration-300 group"
            >
              <div 
                className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, hsl(195 50% 30%) 0%, hsl(195 55% 35%) 100%)",
                  boxShadow: "0 2px 8px hsl(195 65% 15% / 0.3)"
                }}
              >
                <Phone className="w-4 h-4 text-[hsl(180,70%,70%)] group-hover:text-white transition-colors duration-300" />
              </div>
              <span className="group-hover:translate-x-1 transition-transform duration-300">+1 (234) 567-890</span>
            </a>
          </div>
          
          {/* Social Links */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-[hsl(180,70%,70%)] mb-2">Follow Us</h3>
            
            <div className="flex gap-3">
              <a 
                href="#" 
                className="w-11 h-11 rounded-lg flex items-center justify-center transition-all duration-300 group relative overflow-hidden"
                style={{ 
                  background: "linear-gradient(135deg, hsl(195 50% 30%) 0%, hsl(195 55% 35%) 100%)",
                  boxShadow: "0 4px 12px hsl(195 65% 15% / 0.4)" 
                }}
              >
                <Instagram className="w-5 h-5 text-[hsl(180,70%,70%)] group-hover:text-white relative z-10 transition-colors duration-300" />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </a>
              
              <a 
                href="#" 
                className="w-11 h-11 rounded-lg flex items-center justify-center transition-all duration-300 group relative overflow-hidden"
                style={{ 
                  background: "linear-gradient(135deg, hsl(195 50% 30%) 0%, hsl(195 55% 35%) 100%)",
                  boxShadow: "0 4px 12px hsl(195 65% 15% / 0.4)" 
                }}
              >
                <Facebook className="w-5 h-5 text-[hsl(180,70%,70%)] group-hover:text-white relative z-10 transition-colors duration-300" />
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </a>
            </div>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="mt-6 pt-6 text-center" style={{ borderTop: "1px solid hsl(195 60% 35%)" }}>
          <p className="text-sm text-[hsl(195,40%,70%)]">
            © 2025 Craftprint Studio. Bringing designs to life.
          </p>
        </div>
      </div>
    </footer>
  );
};
