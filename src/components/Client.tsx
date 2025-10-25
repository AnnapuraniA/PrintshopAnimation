import { motion } from "framer-motion";

interface ClientProps {
  item: "cup" | "tshirt" | "helmet" | "board";
  position: "entering" | "exiting" | "waiting";
  isHappy?: boolean;
}

export const Client = ({ item, position, isHappy }: ClientProps) => {
  const getAnimationProps = () => {
    if (position === "entering") {
      return { x: [-200, 0], opacity: [0, 1] };
    } else if (position === "exiting") {
      return { x: [0, 200], opacity: [1, 0] };
    }
    return {};
  };

  return (
    <motion.div 
      className="relative flex flex-col items-center"
      initial={{ x: -200, opacity: 0 }}
      animate={getAnimationProps()}
      transition={{ duration: 1, ease: "easeInOut" }}
    >
      {/* Head */}
      <motion.div 
        className="w-14 h-14 rounded-full bg-[hsl(var(--craft-yellow))] relative"
        animate={isHappy ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 0.5, repeat: isHappy ? 2 : 0 }}
        style={{ boxShadow: "var(--shadow-soft)" }}
      >
        {/* Simple happy expression */}
        {isHappy && (
          <>
            <div className="absolute top-5 left-3 w-2 h-2 rounded-full bg-[hsl(var(--foreground))] opacity-70" />
            <div className="absolute top-5 right-3 w-2 h-2 rounded-full bg-[hsl(var(--foreground))] opacity-70" />
            <motion.div 
              className="absolute bottom-3 left-1/2 -translate-x-1/2 w-6 h-2 border-b-2 border-[hsl(var(--foreground))] rounded-b-full opacity-70"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.3 }}
            />
          </>
        )}
      </motion.div>
      
      {/* Body */}
      <div className="w-16 h-20 bg-[hsl(var(--craft-blue))] rounded-lg mt-2 relative">
        {/* Arms holding item */}
        <div className="absolute -left-3 top-3 w-10 h-3 bg-[hsl(var(--craft-blue))] rounded-full" />
        <div className="absolute -right-3 top-3 w-10 h-3 bg-[hsl(var(--craft-blue))] rounded-full" />
      </div>
      
      {/* Item being held */}
      <motion.div 
        className="absolute top-16 left-1/2 -translate-x-1/2"
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <ItemIcon type={item} isPrinted={isHappy} />
      </motion.div>
      
      {/* Legs */}
      <div className="flex gap-2 mt-1">
        <div className="w-3 h-10 bg-[hsl(var(--craft-blue))] rounded-b-lg" />
        <div className="w-3 h-10 bg-[hsl(var(--craft-blue))] rounded-b-lg" />
      </div>
    </motion.div>
  );
};

const ItemIcon = ({ type, isPrinted }: { type: string; isPrinted?: boolean }) => {
  const baseClass = "relative transition-all duration-300";
  
  switch (type) {
    case "cup":
      return (
        <div className={`${baseClass} w-12 h-14 bg-[hsl(var(--card))] rounded-lg border-4 border-[hsl(var(--border))]`}>
          {isPrinted && (
            <motion.div 
              className="absolute inset-2 rounded bg-gradient-to-br from-[hsl(var(--craft-orange))] to-[hsl(var(--craft-yellow))]"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.5 }}
            />
          )}
        </div>
      );
    case "tshirt":
      return (
        <div className={`${baseClass} w-14 h-12 bg-[hsl(var(--card))] rounded-t-xl relative`}>
          <div className="absolute -top-1 left-0 w-4 h-4 bg-[hsl(var(--card))] rounded-tl-lg" />
          <div className="absolute -top-1 right-0 w-4 h-4 bg-[hsl(var(--card))] rounded-tr-lg" />
          {isPrinted && (
            <motion.div 
              className="absolute inset-2 rounded bg-gradient-to-br from-[hsl(var(--craft-blue))] to-[hsl(var(--secondary))]"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
            />
          )}
        </div>
      );
    case "helmet":
      return (
        <div className={`${baseClass} w-16 h-12 bg-[hsl(var(--card))] rounded-t-full border-4 border-[hsl(var(--border))]`}>
          {isPrinted && (
            <motion.div 
              className="absolute top-1 left-1 right-1 h-6 rounded-t-full bg-gradient-to-r from-[hsl(var(--craft-orange))] via-[hsl(var(--craft-yellow))] to-[hsl(var(--craft-orange))]"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            />
          )}
        </div>
      );
    case "board":
      return (
        <div className={`${baseClass} w-16 h-10 bg-[hsl(var(--card))] rounded-lg border-4 border-[hsl(var(--border))]`}>
          {isPrinted && (
            <motion.div 
              className="absolute inset-1 rounded bg-gradient-to-tr from-[hsl(var(--craft-blue))] via-[hsl(var(--craft-yellow))] to-[hsl(var(--craft-orange))]"
              initial={{ scale: 0, rotate: 90 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.5 }}
            />
          )}
        </div>
      );
    default:
      return null;
  }
};
