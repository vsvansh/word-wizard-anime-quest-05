
import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Dictionary, Book, External } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { motion } from 'framer-motion';

interface DefinitionDisplayProps {
  word: string;
}

type WordDefinition = {
  word: string;
  phonetic?: string;
  meanings?: {
    partOfSpeech: string;
    definitions: {
      definition: string;
      example?: string;
    }[];
  }[];
}

const DefinitionDisplay: React.FC<DefinitionDisplayProps> = ({ word }) => {
  const [definitions, setDefinitions] = useState<WordDefinition | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchDefinition = async () => {
      setLoading(true);
      setError(false);
      
      try {
        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch definition');
        }
        
        const data = await response.json();
        if (data && data.length > 0) {
          setDefinitions(data[0]);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error fetching definition:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    
    if (word) {
      fetchDefinition();
    }
  }, [word]);

  if (loading) {
    return (
      <Card className="p-4 mt-4 bg-wizard-purple/10 dark:bg-wizard-purple/20 animate-pulse">
        <div className="flex items-center justify-center space-x-2">
          <Dictionary className="h-5 w-5 text-wizard-purple animate-spin-slow" />
          <span className="font-medium">Loading definition...</span>
        </div>
      </Card>
    );
  }

  if (error || !definitions || !definitions.meanings) {
    return (
      <Card className="p-4 mt-4 bg-wizard-yellow/10 dark:bg-wizard-yellow/20">
        <div className="flex items-center justify-center space-x-2">
          <Book className="h-5 w-5 text-wizard-yellow" />
          <span className="font-medium">No definition found for {word}</span>
        </div>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-4"
    >
      <Card className="p-4 bg-wizard-purple/10 dark:bg-wizard-purple/20 border-wizard-purple/20">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center">
            <Dictionary className="h-5 w-5 text-wizard-purple mr-2" />
            <h3 className="text-lg font-bold font-manga">Definition</h3>
          </div>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0" 
            asChild
          >
            <a 
              href={`https://www.merriam-webster.com/dictionary/${word}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center justify-center"
            >
              <External className="h-4 w-4" />
              <span className="sr-only">More info</span>
            </a>
          </Button>
        </div>

        <div className="space-y-3">
          <div>
            <h4 className="font-bold text-xl text-wizard-blue">{word}</h4>
            {definitions.phonetic && (
              <p className="text-sm text-foreground/70">{definitions.phonetic}</p>
            )}
          </div>

          <div className="space-y-4">
            {definitions.meanings.slice(0, 2).map((meaning, i) => (
              <div key={i}>
                <div className="inline-block bg-wizard-blue/10 dark:bg-wizard-blue/20 px-2 py-0.5 rounded text-sm font-medium text-wizard-blue mb-1">
                  {meaning.partOfSpeech}
                </div>
                <ul className="list-disc list-inside space-y-1">
                  {meaning.definitions.slice(0, 2).map((def, j) => (
                    <li key={j} className="text-sm">
                      {def.definition}
                      {def.example && (
                        <p className="italic text-xs ml-4 mt-0.5 text-foreground/70">
                          "{def.example}"
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default DefinitionDisplay;
