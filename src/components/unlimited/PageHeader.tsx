
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const PageHeader = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-3xl md:text-4xl font-manga font-bold text-center mb-6 bg-gradient-to-r from-wizard-purple to-wizard-blue text-transparent bg-clip-text">
        <Sparkles className="inline-block w-8 h-8 mr-2 animate-pulse" />
        Unlimited Play Mode
        <Sparkles className="inline-block w-8 h-8 ml-2 animate-pulse" />
      </h1>
      <p className="text-center text-foreground/70 max-w-2xl mx-auto mb-8">
        Play as many word puzzles as you want! Skip, get hints, or generate new puzzles whenever you like.
      </p>
    </motion.div>
  );
};

export default PageHeader;
