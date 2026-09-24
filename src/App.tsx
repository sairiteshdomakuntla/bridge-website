import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Home';
import Privacy from './Privacy';
import { SIGNUP_SECTION } from './config';

const SECTIONS = ['story', 'moments', 'features', 'tour', 'setup', 'love', 'security', 'permissions', 'compare', 'faq'];

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {SECTIONS.map((s) => (
          <Route key={s} path={`/${s}`} element={<Home section={s} />} />
        ))}
        {/* Signup URL per mode (/waitlist vs /download) + aliases so old links never 404. */}
        <Route path="/download" element={<Home section={SIGNUP_SECTION} />} />
        <Route path="/waitlist" element={<Home section={SIGNUP_SECTION} />} />
        <Route path="/join" element={<Home section={SIGNUP_SECTION} />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/privacy-policy" element={<Privacy />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
