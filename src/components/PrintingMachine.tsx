import { motion } from "framer-motion";

interface PrintingMachineProps {
  isActive: boolean;
}

export const PrintingMachine = ({ isActive }: PrintingMachineProps) => {
  return (
    <motion.div 
      className="relative"
      animate={isActive ? { scale: [1, 1.02, 1] } : {}}
      transition={{ duration: 0.5, repeat: isActive ? Infinity : 0 }}
    >
      {/* Machine body */}
      <div className="w-48 h-40 bg-[hsl(var(--craft-blue))] rounded-2xl relative overflow-hidden"
        style={{ boxShadow: "var(--shadow-craft)" }}>
        
        {/* Screen/Display area */}
        <div className="absolute top-4 left-4 right-4 h-12 bg-[hsl(var(--secondary-foreground))] rounded-lg overflow-hidden">
          {isActive && (
            <motion.div
              className="h-full bg-gradient-to-r from-transparent via-[hsl(var(--craft-yellow))] to-transparent"
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            />
          )}
        </div>
        
        {/* Control buttons */}
        <div className="absolute top-20 left-6 flex gap-2">
          <motion.div 
            className="w-4 h-4 rounded-full bg-[hsl(var(--craft-orange))]"
            animate={isActive ? { opacity: [1, 0.3, 1] } : {}}
            transition={{ duration: 0.8, repeat: isActive ? Infinity : 0 }}
          />
          <motion.div 
            className="w-4 h-4 rounded-full bg-[hsl(var(--craft-yellow))]"
            animate={isActive ? { opacity: [0.3, 1, 0.3] } : {}}
            transition={{ duration: 0.8, repeat: isActive ? Infinity : 0, delay: 0.2 }}
          />
          <motion.div 
            className="w-4 h-4 rounded-full bg-[hsl(var(--accent))]"
            animate={isActive ? { opacity: [1, 0.3, 1] } : {}}
            transition={{ duration: 0.8, repeat: isActive ? Infinity : 0, delay: 0.4 }}
          />
        </div>
        
        {/* Printing slot */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-32 h-8 bg-[hsl(var(--foreground))] opacity-30 rounded" />
        
        {/* Rollers */}
        <motion.div 
          className="absolute bottom-4 left-8 w-6 h-6 rounded-full bg-[hsl(var(--craft-grey))]"
          animate={isActive ? { rotate: 360 } : {}}
          transition={{ duration: 2, repeat: isActive ? Infinity : 0, ease: "linear" }}
        />
        <motion.div 
          className="absolute bottom-4 right-8 w-6 h-6 rounded-full bg-[hsl(var(--craft-grey))]"
          animate={isActive ? { rotate: -360 } : {}}
          transition={{ duration: 2, repeat: isActive ? Infinity : 0, ease: "linear" }}
        />
        
        {/* Glow effect when active */}
        {isActive && (
          <motion.div
            className="absolute inset-0 bg-[hsl(var(--craft-yellow))] opacity-20 rounded-2xl"
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </div>
      
      {/* Machine stand */}
      <div className="w-40 h-8 bg-[hsl(var(--muted))] mx-auto rounded-b-lg" />
    </motion.div>
  );
};
