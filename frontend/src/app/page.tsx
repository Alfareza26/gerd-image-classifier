import Footer from './components/Footer';
import Guide from './components/Guide';
import Header from './components/Header';
import Hero from './components/Hero';
import ModuleBar from './components/ModuleBar';
import Workspace from './components/Workspace';

export default function Page() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Guide />
        <ModuleBar />
        <Workspace />
      </main>
      <Footer />
    </>
  );
}
