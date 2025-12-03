import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
import Preloader from './components/Preloader';
import Home from './pages/Home';
import About from './pages/About';
import ServicesPage from './pages/ServicesPage';
import Projects from './pages/Projects';
import Contact from './pages/Contact';
import ProjectDetail from './pages/ProjectDetail';
import NotFound from './pages/NotFound';
import Admin from './pages/Admin';
import AdminLogin from './pages/AdminLogin';
import ProjectsList from './pages/admin/ProjectsList';
import ProjectForm from './pages/admin/ProjectForm';
import TestimonialsList from './pages/admin/TestimonialsList';
import TestimonialForm from './pages/admin/TestimonialForm';
import InquiriesList from './pages/admin/InquiriesList';
import InquiryDetail from './pages/admin/InquiryDetail';
import ServicesList from './pages/admin/ServicesList';
import ServiceForm from './pages/admin/ServiceForm';
import SiteSettings from './pages/admin/SiteSettings';
import AdminLayout from './components/admin/AdminLayout';
import ToastProvider from './components/ui/ToastProvider';

function App() {
  return (
    <ErrorBoundary>
    <Preloader />
    <Router>
      <ScrollToTop />
      <ToastProvider>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/projects/slug/:slug" element={<ProjectDetail />} />
            <Route path="/portfolio" element={<Projects />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route element={<AdminLayout />}> 
              <Route path="/admin/projects" element={<ProjectsList />} />
              <Route path="/admin/projects/new" element={<ProjectForm />} />
              <Route path="/admin/projects/edit/:id" element={<ProjectForm />} />
              <Route path="/admin/testimonials" element={<TestimonialsList />} />
              <Route path="/admin/testimonials/new" element={<TestimonialForm />} />
              <Route path="/admin/testimonials/edit/:id" element={<TestimonialForm />} />
              <Route path="/admin/inquiries" element={<InquiriesList />} />
              <Route path="/admin/inquiries/:id" element={<InquiryDetail />} />
              <Route path="/admin/services" element={<ServicesList />} />
              <Route path="/admin/services/new" element={<ServiceForm />} />
              <Route path="/admin/services/edit/:id" element={<ServiceForm />} />
              <Route path="/admin/settings" element={<SiteSettings />} />
              <Route path="/admin" element={<Admin />} />
            </Route>
            {/* 404 Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
      </ToastProvider>
    </Router>
    </ErrorBoundary>
  );
}

export default App;
