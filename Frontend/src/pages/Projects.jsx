import { useEffect, useState } from 'react';
import { FaStar, FaTimes, FaDownload } from 'react-icons/fa';
import { getProjects } from '../utils/api';
import SEO from '../components/SEO';
import { useNavigate } from 'react-router-dom';
import { ProjectCardSkeleton } from '../components/ui/Skeleton';


const categories = ['All', 'Residential', 'Commercial', 'Industrial', 'High-Rise', 'Others'];

export default function Projects() {
  const navigate = useNavigate();
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
        const res = await getProjects(
          selectedCategory === 'All' ? null : selectedCategory,
          currentPage,
          20 // Fetch 20 per page
        );
        
        if (currentPage === 1) {
          setProjects(res.data || []);
        } else {
          // Append for pagination
          setProjects(prev => [...prev, ...(res.data || [])]);
        }
        
        setPagination(res.pagination || { hasMore: false });
        setDisplayCount(6); // Reset display count on category change
      } catch (e) {
        setError(e.response?.data?.error || 'Failed to load projects');
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [selectedCategory, currentPage]);

  const filteredProjects = projects.slice(0, displayCount);
  const hasMore = displayCount < projects.length;

  return (
    <div>
      <SEO
        title="Projects — Mechtron Global"
        description="Explore Mechtron Global's BIM portfolio across commercial, residential, industrial, and educational sectors."
        url="https://www.mechtronglobal.com/projects"
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

      {/* Filters */}
      <section className="section-padding bg-light">
        <div className="container-custom">
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
                    <img
                      src={project.images[0]}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
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
                      <div className="flex items-center gap-2">
                        <div className="flex gap-0.5 text-accent">
                          {Array.from({ length: (project.client?.rating || 5) }).map((_, i) => (
                            <FaStar key={i} size={14} />
                          ))}
                        </div>
                        {project.client?.name && (
                          <span className="text-xs text-gray-500">by {project.client.name}</span>
                        )}
                      </div>
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
        </div>
      </section>

      {/* Project Modal */}
      {/* Modal removed in favor of dedicated detail route */}
    </div>
  );
}
