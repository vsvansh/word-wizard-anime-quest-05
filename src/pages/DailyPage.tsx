
import NavBar from '@/components/NavBar';
import DailyChallenge from '@/components/DailyChallenge';

const DailyPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      
      <main className="container max-w-6xl pt-24 pb-12 px-4 md:px-6">
        <section className="py-10">
          <h1 className="text-3xl md:text-4xl font-manga font-bold text-center mb-8 bg-gradient-to-r from-wizard-purple to-wizard-blue text-transparent bg-clip-text">
            Daily Word Challenge
          </h1>
          <p className="text-center text-foreground/70 max-w-2xl mx-auto mb-10">
            A new word puzzle every day! Solve it to maintain your streak and become a Word Wizard master.
          </p>
          <DailyChallenge />
        </section>
      </main>
    </div>
  );
};

export default DailyPage;
