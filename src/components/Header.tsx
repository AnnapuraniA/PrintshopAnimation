import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export const Header = () => {
  return (
    <motion.header 
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b shadow-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 3.2 }}
      style={{ 
        background: "linear-gradient(135deg, hsl(195 65% 25%) 0%, hsl(195 70% 30%) 100%)",
        borderColor: "hsl(195 60% 35%)",
        boxShadow: "0 4px 24px hsl(195 65% 15% / 0.5)"
      }}
    >
      <div className="container mx-auto px-6 py-4 flex items-center gap-4">
        {/* Enhanced Logo Icon */}
        <motion.div 
          className="w-12 h-12 rounded-xl shadow-lg flex items-center justify-center relative overflow-hidden"
          whileHover={{ scale: 1.05, rotate: 5 }}
          transition={{ duration: 0.3 }}
          style={{ 
            background: "linear-gradient(135deg, hsl(180 70% 45%) 0%, hsl(195 65% 55%) 100%)",
            boxShadow: "0 0 30px hsl(180 70% 45% / 0.5)"
          }}
        >
          <Sparkles className="w-6 h-6 text-white relative z-10" />
          <motion.div
            className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/30 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
        
        {/* Business Name with Gradient */}
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[hsl(180,70%,70%)] via-[hsl(195,65%,65%)] to-[hsl(180,70%,70%)] bg-clip-text text-transparent">
          CraftPrint
        </h1>
        
        {/* Decorative Elements */}
        <div className="ml-auto flex gap-2">
          <div className="w-2 h-2 rounded-full bg-[hsl(180,70%,60%)] animate-pulse" />
          <div className="w-2 h-2 rounded-full bg-[hsl(195,65%,65%)] animate-pulse" style={{ animationDelay: "0.2s" }} />
          <div className="w-2 h-2 rounded-full bg-[hsl(180,70%,70%)] animate-pulse" style={{ animationDelay: "0.4s" }} />
        </div>
      </div>
    </motion.header>
  );
};
