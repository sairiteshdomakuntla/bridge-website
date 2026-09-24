import { IS_WAITLIST } from './config';
import { useReveal, useSectionScroll } from './hooks';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Moments from './components/Moments';
import Story from './components/Story';
import Features from './components/Features';
import Tour from './components/Tour';
import Setup from './components/Setup';
import Reviews from './components/Reviews';
import Security from './components/Security';
import Permissions from './components/Permissions';
import Compare from './components/Compare';
import Signup from './components/Signup';
import Faq from './components/Faq';
import FinalCTA from './components/FinalCTA';
import Footer from './components/Footer';

export default function Home({ section }: { section?: string }) {
  useReveal();
  useSectionScroll(section);

  return (
    <>
      <Nav />
      <Hero />
      <Moments />
      <Story />
      <Features />
      <Tour />
      <Setup />
      {!IS_WAITLIST && <Reviews />}
      <Security />
      <Permissions />
      {!IS_WAITLIST && <Compare />}
      <Signup />
      <Faq />
      <FinalCTA />
      <Footer />
    </>
  );
}
