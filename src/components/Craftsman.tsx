import { motion } from "framer-motion";

interface CraftsmanProps {
  isWorking: boolean;
}

export const Craftsman = ({ isWorking }: CraftsmanProps) => {
  return (
    <motion.div 
      className="relative flex flex-col items-center"
      animate={isWorking ? { y: [0, -5, 0] } : {}}
      transition={{ duration: 1, repeat: isWorking ? Infinity : 0 }}
    >
      {/* Head */}
      <motion.div 
        className="w-16 h-16 rounded-full bg-[hsl(var(--craft-orange))] relative overflow-hidden"
        style={{ boxShadow: "var(--shadow-soft)" }}
      >
        {/* Simple face suggestion - minimal eyes */}
        <div className="absolute top-6 left-4 w-2 h-2 rounded-full bg-[hsl(var(--foreground))] opacity-60" />
        <div className="absolute top-6 right-4 w-2 h-2 rounded-full bg-[hsl(var(--foreground))] opacity-60" />
      </motion.div>
      
      {/* Body */}
      <motion.div 
        className="w-20 h-24 bg-[hsl(var(--craft-grey))] rounded-lg mt-2 relative"
        animate={isWorking ? { scaleY: [1, 0.98, 1] } : {}}
        transition={{ duration: 1, repeat: isWorking ? Infinity : 0 }}
      >
        {/* Apron detail */}
        <div className="absolute inset-x-2 top-0 bottom-0 bg-[hsl(var(--craft-cream))] rounded-lg opacity-40" />
        
        {/* Arms */}
        <motion.div 
          className="absolute -left-4 top-4 w-12 h-3 bg-[hsl(var(--craft-grey))] rounded-full origin-right"
          animate={isWorking ? { rotate: [-10, 20, -10] } : { rotate: -10 }}
          transition={{ duration: 1.2, repeat: isWorking ? Infinity : 0 }}
        />
        <motion.div 
          className="absolute -right-4 top-4 w-12 h-3 bg-[hsl(var(--craft-grey))] rounded-full origin-left"
          animate={isWorking ? { rotate: [10, -20, 10] } : { rotate: 10 }}
          transition={{ duration: 1.2, repeat: isWorking ? Infinity : 0 }}
        />
      </motion.div>
      
      {/* Legs */}
      <div className="flex gap-2 mt-1">
        <div className="w-4 h-12 bg-[hsl(var(--craft-grey))] rounded-b-lg" />
        <div className="w-4 h-12 bg-[hsl(var(--craft-grey))] rounded-b-lg" />
      </div>
    </motion.div>
  );
};
