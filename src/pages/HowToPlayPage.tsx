
import NavBar from '@/components/NavBar';
import HowToPlay from '@/components/HowToPlay';

const HowToPlayPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      
      <main className="container max-w-6xl pt-24 pb-12 px-4 md:px-6">
        <section className="py-10">
          <h1 className="text-3xl md:text-4xl font-manga font-bold text-center mb-8 bg-gradient-to-r from-wizard-purple to-wizard-blue text-transparent bg-clip-text">
            How To Play
          </h1>
          <p className="text-center text-foreground/70 max-w-2xl mx-auto mb-10">
            Learn the rules, strategies, and tips to become the ultimate Word Wizard!
          </p>
          <HowToPlay />
        </section>
      </main>
    </div>
  );
};

export default HowToPlayPage;
