import { useEffect, useState } from 'react';
import { FaStar, FaTimes, FaDownload, FaImages } from 'react-icons/fa';
import { getProjects } from '../utils/api';
import SEO from '../components/SEO';
import RegionSelector from '../components/RegionSelector';
import UKComingSoonCard from '../components/UKComingSoonCard';
import { useNavigate } from 'react-router-dom';
import { ProjectCardSkeleton } from '../components/ui/Skeleton';

// Available regions - easily extensible for future expansion
const AVAILABLE_REGIONS = [
  { value: 'USA', label: '🇺🇸 USA', flag: '🇺🇸' },
  { value: 'UK', label: '🇬🇧 UK', flag: '🇬🇧' },
  // Future regions can be added here:
  // { value: 'Canada', label: '🇨🇦 Canada', flag: '🇨🇦' },
  // { value: 'Australia', label: '🇦🇺 Australia', flag: '🇦🇺' },
];

const categories = ['All', 'Residential', 'Commercial', 'Industrial', 'High-Rise', 'Others'];

// Coming soon card data - customize per region
const COMING_SOON_REGIONS = {
  UK: {
    flag: '🇬🇧',
    title: 'UK Market Expansion',
    tagline: 'Building Virtually and Visually across UK',
    description: 'We\'re actively developing our MEP coordination and BIM modeling capabilities for the United Kingdom market. Our team is preparing to deliver the same industry-leading standards that define KataVerse\'s work across the USA.',
    launchDate: 'Coming 2025',
  },
  // Future coming soon regions:
  // Canada: { ... },
  // Australia: { ... },
};

export default function Projects() {
  const navigate = useNavigate();
  const [selectedRegion, setSelectedRegion] = useState('USA');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [displayCount, setDisplayCount] = useState(6);
  const [pagination, setPagination] = useState({ hasMore: false, totalPages: 0 });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError('');
        console.log('Fetching projects with:', { selectedCategory, currentPage, selectedRegion });
        
        // Only fetch projects if the region has active projects (not a coming soon region)
        if (!COMING_SOON_REGIONS[selectedRegion]) {
          const res = await getProjects(
            selectedCategory === 'All' ? null : selectedCategory,
            currentPage,
            20 // Fetch 20 per page
          );
          console.log('Projects response:', res);
          
          if (currentPage === 1) {
            setProjects(res.data || []);
          } else {
            // Append for pagination
            setProjects(prev => [...prev, ...(res.data || [])]);
          }
          
          setPagination(res.pagination || { hasMore: false });
        } else {
          // Coming soon region - no projects to fetch
          setProjects([]);
          setPagination({ hasMore: false, totalPages: 0 });
        }
        setDisplayCount(6); // Reset display count on region/category change
      } catch (e) {
        console.error('Error fetching projects:', e);
        setError(e.response?.data?.error || e.message || 'Failed to load projects');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [selectedCategory, currentPage, selectedRegion]);

  const filteredProjects = projects.slice(0, displayCount);
  const hasMore = displayCount < projects.length;
  const hasProjectsInRegion = projects.length > 0;
  const isComingSoonRegion = COMING_SOON_REGIONS[selectedRegion];

  const handleRegionChange = (region) => {
    setSelectedRegion(region);
    setSelectedCategory('All');
    setCurrentPage(1);
    setProjects([]);
  };

  return (
    <div>
      <SEO
        title="Projects — KataVerse BIM Services"
        description="Explore KataVerse BIM Services portfolio across commercial, residential, industrial, and educational sectors in the USA and UK."
        url="https://www.kataversebim.com/projects"
      />
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-primary to-[#0a2f47] text-white" data-aos="fade-up">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Our Projects
          </h1>
          <p className="text-lg md:text-xl text-white text-opacity-90 max-w-3xl mx-auto">
            Explore our portfolio of successful BIM implementations across diverse sectors
          </p>
        </div>
      </section>

      {/* Region Selector */}
      <section className="section-padding bg-light pt-8 pb-4">
        <div className="container-custom">
          <RegionSelector selectedRegion={selectedRegion} onRegionChange={handleRegionChange} />
        </div>
      </section>

      {/* Filters & Projects */}
      <section className="section-padding bg-light">
        <div className="container-custom">
          {/* Show Coming Soon Card if region has no projects and is marked as coming soon */}
          {!hasProjectsInRegion && isComingSoonRegion ? (
            <div className="min-h-[500px] flex items-center justify-center px-4 py-12">
              <div className="max-w-2xl w-full bg-gradient-to-br from-[#0a2f47] to-[#1a4d6d] rounded-lg shadow-xl p-8 md:p-12 text-white text-center">
                {/* Flag Emoji */}
                <div className="text-6xl md:text-7xl mb-6">{isComingSoonRegion.flag}</div>

                {/* Main Heading */}
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  {isComingSoonRegion.title}
                </h2>

                {/* Tagline */}
                <p className="text-lg md:text-xl text-blue-100 mb-6">
                  {isComingSoonRegion.tagline}
                </p>

                {/* Description */}
                <p className="text-base md:text-lg text-blue-50 mb-8 leading-relaxed">
                  {isComingSoonRegion.description}
                </p>

                {/* Timeline Info */}
                <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-lg p-6 border border-blue-200 border-opacity-20">
                  <p className="text-sm md:text-base text-blue-100">
                    <span className="font-semibold">Expected Launch:</span> {isComingSoonRegion.launchDate}
                  </p>
                  <p className="text-sm md:text-base text-blue-100 mt-3">
                    Featuring comprehensive BIM modeling, MEP coordination, and clash detection services for commercial, residential, and industrial projects.
                  </p>
                </div>

                {/* Support Info */}
                <p className="text-xs md:text-sm text-blue-200 mt-8 pt-8 border-t border-blue-200 border-opacity-20">
                  In the meantime, if you have questions about our services or want to discuss your project needs, please contact us at <a href="mailto:Admin@KataVerseBIMServices.onmicrosoft.com" className="underline hover:text-white">Admin@KataVerseBIMServices.onmicrosoft.com</a>
                </p>
              </div>
            </div>
          ) : (
            /* Show Projects Grid for regions with projects */
            <>
              {/* Category Filters */}
              <div className="flex flex-wrap justify-center gap-4 mb-12" data-aos="fade-up">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => {
                      setSelectedCategory(category);
                      setCurrentPage(1);
                      setProjects([]);
                    }}
                    className={`px-6 py-2 rounded-lg font-medium transition-all ${
                      selectedCategory === category
                        ? 'bg-primary text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              {/* Projects Grid */}
              {error && (
                <div className="max-w-3xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">
                  {error}
                </div>
              )}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {[...Array(6)].map((_, i) => (
                    <ProjectCardSkeleton key={i} />
                  ))}
                </div>
              ) : filteredProjects.length === 0 ? (
                // Empty State
                <div className="flex items-center justify-center py-20">
                  <div className="text-center max-w-md">
                    <div className="mb-6 inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full">
                      <svg className="w-10 h-10 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-secondary mb-3">
                      Explore Our Complete Portfolio
                    </h3>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      The <strong>{selectedCategory}</strong> category is currently being updated. View our complete portfolio to discover projects across all sectors.
                    </p>
                    <button
                      onClick={() => {
                        setSelectedCategory('All');
                        setCurrentPage(1);
                        setProjects([]);
                      }}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      View All Projects
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredProjects.map((project) => (
                    <div
                      key={project._id}
                      className="bg-white rounded-xl overflow-hidden shadow-md card-hover cursor-pointer flex flex-col"
                      onClick={() => navigate(project.slug ? `/projects/slug/${project.slug}` : `/projects/${project._id}`)}
                      data-aos="fade-up"
                    >
                      {/* Image */}
                      <div className="relative h-48 overflow-hidden group">
                        {project.images && project.images.length > 0 ? (
                          <>
                            <img
                              src={project.images[0]}
                              alt={project.title}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              loading="lazy"
                              onError={(e) => {
                                // Fallback to gradient if image fails to load
                                e.target.style.display = 'none';
                                const fallback = e.target.nextElementSibling;
                                if (fallback) {
                                  fallback.classList.remove('hidden');
                                  fallback.classList.add('flex');
                                }
                              }}
                            />
                            {/* Fallback gradient (hidden by default, shown on image error) */}
                            <div className="h-full w-full bg-gradient-to-br from-primary via-[#0a2f47] to-secondary hidden items-center justify-center text-white">
                              <span className="text-lg font-semibold">{project.title}</span>
                            </div>
                            {/* Image count indicator */}
                            {project.images.length > 1 && (
                              <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm px-2.5 py-1.5 rounded-lg shadow-lg z-20 flex items-center gap-1.5">
                                <FaImages className="text-white text-xs" />
                                <span className="text-white text-xs font-semibold">
                                  {project.images.length}
                                </span>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="h-full w-full bg-gradient-to-br from-primary via-[#0a2f47] to-secondary flex items-center justify-center text-white">
                            <span className="text-lg font-semibold">{project.title}</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
                        {/* Metrics Badge */}
                        {project.metrics && Object.keys(project.metrics).length > 0 && (
                          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-lg z-20 text-right">
                            <p className="text-xs text-accent font-bold leading-none">
                              {Object.entries(project.metrics)[0][1]}
                            </p>
                            <p className="text-[10px] text-gray-600 uppercase tracking-wide">
                              {Object.entries(project.metrics)[0][0]}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="p-6 flex flex-col h-full">
                        <div className="flex items-start justify-between mb-2 gap-3">
                          <h3 className="text-xl font-semibold text-secondary flex-1">
                            {project.title}
                          </h3>
                          <span className="px-2.5 py-0.5 bg-primary/10 text-primary text-xs rounded-full font-semibold">
                            {project.category}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>

                        {/* Metrics Pills */}
                        {project.metrics && Object.keys(project.metrics).length > 1 && (
                          <div className="grid grid-cols-2 gap-3 mb-4">
                            {Object.entries(project.metrics)
                              .slice(0, 4)
                              .map(([key, value]) => (
                                <div
                                  key={key}
                                  className="flex flex-col bg-gray-50 rounded-lg border border-gray-100 p-3"
                                >
                                  <span className="text-[11px] uppercase tracking-wide text-gray-500">{key}</span>
                                  <span className="text-sm font-semibold text-secondary">{value}</span>
                                </div>
                              ))}
                          </div>
                        )}

                        {/* Tags */}
                        <div className="flex gap-2 flex-wrap mb-4">
                          {(project.tags || []).slice(0, 3).map((tag, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1 bg-gray-50 text-gray-700 text-xs rounded-full font-medium border border-gray-200"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Rating & CTA */}
                        <div className="mt-auto pt-4 border-t border-gray-100 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-primary text-sm font-bold group-hover:text-accent transition-colors">
                              View Details →
                            </span>
                          </div>
                          {project.caseStudyUrl && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(project.caseStudyUrl, '_blank', 'noopener,noreferrer');
                              }}
                              className="w-full inline-flex items-center justify-center gap-2 text-xs font-semibold text-secondary border border-secondary/20 rounded-lg px-3 py-2 hover:bg-secondary hover:text-white transition"
                            >
                              <FaDownload className="text-sm" />
                              Download Case Study (PDF)
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Load More Button */}
              {!loading && hasMore && (
                <div className="flex justify-center mt-12" data-aos="fade-up">
                  <button
                    onClick={() => setDisplayCount(prev => prev + 6)}
                    className="px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl"
                  >
                    Load More Projects ({projects.length - displayCount} more)
                  </button>
                </div>
              )}

              {/* Fetch More from API Button */}
              {!loading && displayCount >= projects.length && pagination.hasMore && (
                <div className="flex justify-center mt-12" data-aos="fade-up">
                  <button
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="px-8 py-3 bg-accent text-white font-semibold rounded-lg hover:bg-accent/90 transition-all shadow-lg hover:shadow-xl"
                  >
                    Load More from Server (Page {currentPage + 1}/{pagination.totalPages})
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Project Modal */}
      {/* Modal removed in favor of dedicated detail route */}
    </div>
  );
}


