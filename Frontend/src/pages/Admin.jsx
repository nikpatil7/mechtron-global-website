import { useState } from 'react';
import SEO from '../components/SEO';
import { createProject, createTestimonial } from '../utils/api';

const CATEGORIES = ['Commercial', 'Residential', 'High-Rise', 'Kitchen', 'Industrial', 'Educational'];

export default function Admin() {
  const [authed, setAuthed] = useState(!!localStorage.getItem('adminToken'));
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('project'); // 'project' | 'testimonial'
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || '';

  const handleLogin = (e) => {
    e.preventDefault();
    setErr('');
    if (!password) {
      setErr('Enter password');
      return;
    }
    if (password === adminPassword) {
      setAuthed(true);
    } else {
      setErr('Invalid password');
    }
  };

  // Project form state
  const [project, setProject] = useState({
    title: '',
    category: 'Commercial',
    description: '',
    tags: '', // comma separated
    metrics: '', // JSON string
    images: [], // uploaded URLs
    clientName: '',
    clientTestimonial: '',
    clientRating: 5,
    featured: false,
  });

  // Testimonial form state
  const [testimonial, setTestimonial] = useState({
    quote: '',
    author: '',
    role: '',
    company: '',
    rating: 5,
    photo: '', // uploaded URL
    featured: false,
  });

  // Upload helpers
  async function uploadSingle(file) {
    const form = new FormData();
    form.append('file', file);
    const res = await fetch('/api/upload/single', { method: 'POST', body: form });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Upload failed');
    return data.url;
  }
  async function uploadMultiple(files) {
    const form = new FormData();
    for (const f of files) form.append('files', f);
    const res = await fetch('/api/upload/multiple', { method: 'POST', body: form });
    const data = await res.json();
    if (!data.success) throw new Error(data.error || 'Upload failed');
    return data.urls;
  }

  const submitProject = async (e) => {
    e.preventDefault();
    setLoading(true); setMsg(''); setErr('');
    try {
      let metricsObj = undefined;
      if (project.metrics) {
        try { metricsObj = JSON.parse(project.metrics); } catch (err) { void err; throw new Error('Metrics must be valid JSON'); }
      }
      const payload = {
        title: project.title,
        category: project.category,
        description: project.description,
        tags: project.tags ? project.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        metrics: metricsObj,
        images: project.images,
        client: {
          name: project.clientName || undefined,
          testimonial: project.clientTestimonial || undefined,
          rating: Number(project.clientRating) || 5,
        },
        featured: !!project.featured,
      };
      const res = await createProject(payload);
      if (res.success) {
        setMsg('Project created');
        setProject({
          title: '', category: 'Commercial', description: '', tags: '', metrics: '', images: [],
          clientName: '', clientTestimonial: '', clientRating: 5, featured: false,
        });
      } else {
        setErr(res.error || 'Failed to create project');
      }
    } catch (e) {
      setErr(e.message || 'Failed to create project');
    } finally { setLoading(false); }
  };

  const submitTestimonial = async (e) => {
    e.preventDefault();
    setLoading(true); setMsg(''); setErr('');
    try {
      const payload = {
        quote: testimonial.quote,
        author: testimonial.author,
        role: testimonial.role,
        company: testimonial.company,
        rating: Number(testimonial.rating) || 5,
        photo: testimonial.photo || undefined,
        featured: !!testimonial.featured,
      };
      const res = await createTestimonial(payload);
      if (res.success) {
        setMsg('Testimonial created');
        setTestimonial({ quote: '', author: '', role: '', company: '', rating: 5, photo: '', featured: false });
      } else {
        setErr(res.error || 'Failed to create testimonial');
      }
    } catch (e) {
      setErr(e.message || 'Failed to create testimonial');
    } finally { setLoading(false); }
  };

  return (
    <div>
      <SEO title="Admin — KataVerse BIM Services" description="Admin tools to create projects and testimonials" url="https://www.kataversebim.com/admin" />

      <section className="section-padding bg-light">
        <div className="container-custom max-w-3xl">
          {!authed ? (
            <div className="bg-white p-8 rounded-xl shadow">
              <h1 className="text-2xl font-bold text-secondary mb-4">Admin Access</h1>
              <p className="text-gray-700 mb-4">Please <a href="/admin/login" className="text-primary underline">login</a> with your credentials.</p>
              <p className="text-sm text-gray-500">Legacy password access is still available below.</p>
              <form onSubmit={handleLogin} className="mt-4">
                {err && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">{err}</div>}
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full px-4 py-3 border border-gray-300 rounded-lg mb-4" />
                <button type="submit" className="bg-primary text-white px-6 py-3 rounded-lg font-semibold">Login</button>
              </form>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-xl shadow">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-secondary">Admin</h1>
                <div className="flex gap-2">
                  <button onClick={()=>setMode('project')} className={`px-3 py-2 rounded ${mode==='project'?'bg-primary text-white':'bg-light'}`}>Project</button>
                  <button onClick={()=>setMode('testimonial')} className={`px-3 py-2 rounded ${mode==='testimonial'?'bg-primary text-white':'bg-light'}`}>Testimonial</button>
                </div>
              </div>
              {msg && <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded">{msg}</div>}
              {err && <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">{err}</div>}

              {mode === 'project' ? (
                <form onSubmit={submitProject} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Title *</label>
                    <input className="w-full px-4 py-3 border rounded" value={project.title} onChange={(e)=>setProject({...project, title:e.target.value})} required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Category *</label>
                    <select className="w-full px-4 py-3 border rounded" value={project.category} onChange={(e)=>setProject({...project, category:e.target.value})}>
                      {CATEGORIES.map(c=> <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Description *</label>
                    <textarea className="w-full px-4 py-3 border rounded" rows={4} value={project.description} onChange={(e)=>setProject({...project, description:e.target.value})} required />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Tags (comma separated)</label>
                    <input className="w-full px-4 py-3 border rounded" value={project.tags} onChange={(e)=>setProject({...project, tags:e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Metrics (JSON object)</label>
                    <textarea className="w-full px-4 py-3 border rounded font-mono" rows={4} placeholder='{"floors":"45","timeline":"18 months"}' value={project.metrics} onChange={(e)=>setProject({...project, metrics:e.target.value})} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1">Client Name</label>
                      <input className="w-full px-4 py-3 border rounded" value={project.clientName} onChange={(e)=>setProject({...project, clientName:e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Client Rating (1-5)</label>
                      <input type="number" min={1} max={5} className="w-full px-4 py-3 border rounded" value={project.clientRating} onChange={(e)=>setProject({...project, clientRating:e.target.value})} />
                    </div>
                    <div className="flex items-end gap-2">
                      <input id="featured" type="checkbox" checked={project.featured} onChange={(e)=>setProject({...project, featured:e.target.checked})} />
                      <label htmlFor="featured">Featured</label>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Images (upload 1-5)</label>
                    <input type="file" multiple accept="image/*" onChange={async (e)=>{
                      try {
                        setLoading(true); setErr('');
                        const files = Array.from(e.target.files || []);
                        if (!files.length) return;
                        const urls = files.length === 1 ? [await uploadSingle(files[0])] : await uploadMultiple(files);
                        setProject(prev=> ({...prev, images: urls}));
                        setMsg(`Uploaded ${urls.length} image(s)`);
                      } catch (error) {
                        setErr(error.message || 'Upload failed');
                      } finally { setLoading(false); }
                    }} className="w-full px-4 py-3 border rounded" />
                    {project.images?.length ? (
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {project.images.map((url, i)=> (
                          <img key={i} src={url} alt="uploaded" className="w-20 h-20 object-cover rounded border" />
                        ))}
                      </div>
                    ) : null}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Client Testimonial</label>
                    <textarea className="w-full px-4 py-3 border rounded" rows={3} value={project.clientTestimonial} onChange={(e)=>setProject({...project, clientTestimonial:e.target.value})} />
                  </div>
                  <button type="submit" disabled={loading} className="bg-accent text-white px-6 py-3 rounded font-semibold disabled:opacity-50">{loading? 'Saving...' : 'Create Project'}</button>
                </form>
              ) : (
                <form onSubmit={submitTestimonial} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1">Quote *</label>
                    <textarea className="w-full px-4 py-3 border rounded" rows={3} value={testimonial.quote} onChange={(e)=>setTestimonial({...testimonial, quote:e.target.value})} required />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1">Author *</label>
                      <input className="w-full px-4 py-3 border rounded" value={testimonial.author} onChange={(e)=>setTestimonial({...testimonial, author:e.target.value})} required />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Role *</label>
                      <input className="w-full px-4 py-3 border rounded" value={testimonial.role} onChange={(e)=>setTestimonial({...testimonial, role:e.target.value})} required />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1">Company *</label>
                      <input className="w-full px-4 py-3 border rounded" value={testimonial.company} onChange={(e)=>setTestimonial({...testimonial, company:e.target.value})} required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1">Photo</label>
                    <input type="file" accept="image/*" onChange={async (e)=>{
                      try {
                        setLoading(true); setErr('');
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const url = await uploadSingle(file);
                        setTestimonial(prev=> ({...prev, photo: url}));
                        setMsg('Photo uploaded');
                      } catch (error) {
                        setErr(error.message || 'Upload failed');
                      } finally { setLoading(false); }
                    }} className="w-full px-4 py-3 border rounded" />
                    {testimonial.photo ? (
                      <img src={testimonial.photo} alt="uploaded" className="w-20 h-20 object-cover rounded border mt-2" />
                    ) : null}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-1">Rating (1-5)</label>
                      <input type="number" min={1} max={5} className="w-full px-4 py-3 border rounded" value={testimonial.rating} onChange={(e)=>setTestimonial({...testimonial, rating:e.target.value})} />
                    </div>
                    <div className="flex items-end gap-2">
                      <input id="tfeatured" type="checkbox" checked={testimonial.featured} onChange={(e)=>setTestimonial({...testimonial, featured:e.target.checked})} />
                      <label htmlFor="tfeatured">Featured</label>
                    </div>
                  </div>
                  <button type="submit" disabled={loading} className="bg-accent text-white px-6 py-3 rounded font-semibold disabled:opacity-50">{loading? 'Saving...' : 'Create Testimonial'}</button>
                </form>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
