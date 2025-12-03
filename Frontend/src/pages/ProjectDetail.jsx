import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { FaStar, FaArrowLeft } from 'react-icons/fa';
import { getProjectById, getProjectBySlug } from '../utils/api';
import SEO from '../components/SEO';

export default function ProjectDetail() {
  const { id, slug } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setError('');
        const res = slug ? await getProjectBySlug(slug) : await getProjectById(id);
        setProject(res.data || res);
      } catch (e) {
        setError(e.response?.data?.error || 'Failed to load project');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, slug]);

  // If we loaded via id and project has a slug, redirect to canonical slug URL
  useEffect(() => {
    if (id && project?.slug) {
      navigate(`/projects/slug/${project.slug}`, { replace: true });
    }
  }, [id, project?.slug, navigate]);

  const rating = project?.client?.rating || 5;
  const tags = project?.tags || [];
  const metrics = project?.metrics ? Object.fromEntries(Object.entries(project.metrics)) : {};

  return (
    <div>
      <SEO
        title={project ? `${project.title} — Mechtron Global` : 'Project — Mechtron Global'}
        description={project?.description}
        url={`https://www.mechtronglobal.com/projects/${slug || id}`}
        image={project?.images?.[0] || '/og-image.jpg'}
        jsonLd={project ? {
          '@context': 'https://schema.org',
          '@type': 'Project',
          name: project.title,
          description: project.description,
          category: project.category,
          image: project.images?.[0],
          url: `https://www.mechtronglobal.com/projects/${project.slug || id}`,
          provider: {
            '@type': 'Organization',
            name: 'Mechtron Global',
            url: 'https://www.mechtronglobal.com'
          }
        } : null}
      />

      <section className="relative py-16 bg-gradient-to-r from-primary to-[#0a2f47] text-white">
        <div className="container-custom">
          <Link to="/projects" className="inline-flex items-center gap-2 text-white/90 hover:text-white mb-6">
            <FaArrowLeft /> Back to Projects
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold">{project?.title || 'Loading...'}</h1>
          <p className="text-white/90 mt-3 max-w-3xl">{project?.description}</p>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom">
          {error && (
            <div className="max-w-3xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">{error}</div>
          )}
          {loading && <div className="text-center text-gray-600 mb-6">Loading project...</div>}
          {project && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main */}
              <div className="lg:col-span-2">
                {/* Hero Image */}
                <div className="h-72 rounded-xl mb-6 overflow-hidden">
                  {project.images && project.images.length > 0 ? (
                    <img src={project.images[0]} alt={project.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold">
                      {project.title}
                    </div>
                  )}
                </div>

                {/* Metrics */}
                {metrics && Object.keys(metrics).length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {Object.entries(metrics).map(([key, value]) => (
                      <div key={key} className="bg-light p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-primary mb-1">{value}</div>
                        <div className="text-xs text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Tags */}
                {tags.length > 0 && (
                  <div className="flex gap-2 flex-wrap mb-8">
                    {tags.map((tag, idx) => (
                      <span key={idx} className="px-4 py-2 bg-primary bg-opacity-10 text-primary rounded-lg font-medium">{tag}</span>
                    ))}
                  </div>
                )}

                {/* Client Testimonial */}
                {project.client?.testimonial && (
                  <div className="bg-light p-6 rounded-lg border-l-4 border-accent">
                    <div className="flex gap-1 text-accent mb-2">
                      {Array.from({ length: rating }).map((_, i) => (
                        <FaStar key={i} />
                      ))}
                    </div>
                    <p className="text-gray-700 italic mb-2">"{project.client.testimonial}"</p>
                    {project.client.name && (
                      <p className="text-sm text-gray-600">— {project.client.name}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Sidebar */}
              <aside className="lg:col-span-1">
                <div className="bg-light p-6 rounded-xl">
                  <h3 className="text-lg font-semibold text-secondary mb-4">Project Info</h3>
                  <div className="space-y-2 text-gray-700">
                    <div><span className="font-semibold">Category:</span> {project.category}</div>
                    <div><span className="font-semibold">Featured:</span> {project.featured ? 'Yes' : 'No'}</div>
                    <div className="flex items-center gap-2"><span className="font-semibold">Rating:</span> {Array.from({ length: rating }).map((_, i) => (<FaStar key={i} className="text-accent" />))}</div>
                  </div>
                </div>
              </aside>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
