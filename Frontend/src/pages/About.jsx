import { FaCheckCircle, FaUsers, FaLightbulb, FaHandshake } from 'react-icons/fa';
import SEO from '../components/SEO';

const values = [
  {
    icon: <FaCheckCircle />,
    title: 'Quality Excellence',
    description: 'We deliver precise, accurate BIM models that exceed industry standards and client expectations.'
  },
  {
    icon: <FaUsers />,
    title: 'Expert Team',
    description: 'Our team of 50+ certified BIM professionals brings decades of combined experience.'
  },
  {
    icon: <FaLightbulb />,
    title: 'Innovation',
    description: 'We leverage cutting-edge technology and methodologies to optimize your projects.'
  },
  {
    icon: <FaHandshake />,
    title: 'Client Partnership',
    description: 'We work collaboratively with clients to ensure project success at every stage.'
  }
];

export default function About() {
  return (
    <div>
      <SEO
        title="About Us — KataVerse BIM Services"
        description="Learn about KataVerse BIM Services: 8+ years of BIM excellence delivering BIM modeling, MEP coordination, clash detection, and 3D visualization."
        url="https://www.kataversebim.com/about"
      />
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-primary to-[#0a2f47] text-white">
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About KataVerse BIM Services
          </h1>
          <p className="text-lg md:text-xl text-white text-opacity-90 max-w-3xl mx-auto">
            Leading provider of BIM services with over 8 years of experience in transforming construction projects worldwide
          </p>
        </div>
      </section>

      {/* Company Story */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-secondary text-center">
              Our Story
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                With 8+ years of experience, KataVerse BIM Services has grown to become a trusted provider of comprehensive BIM services for construction projects. Our journey began with a simple mission: to help contractors, subcontractors, and engineers prevent clashes and costly rework through advanced Building Information Modeling.
              </p>
              <p>
                Over the past decade, we've completed more than 500 projects across residential, commercial, and high-rise sectors. Our expertise spans BIM modeling, MEP coordination, clash detection, and 3D visualization, helping clients reduce costs, minimize rework, and accelerate project timelines.
              </p>
              <p>
                Today, with a team of 50+ certified professionals and partnerships with industry-leading firms, we continue to push the boundaries of what's possible in BIM technology. Our commitment to quality, innovation, and client success remains at the heart of everything we do.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-light">
        <div className="container-custom">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-secondary text-center">
            Our Core Values
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="text-5xl text-primary mb-4 flex justify-center">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-secondary">
                  {value.title}
                </h3>
                <p className="text-gray-600">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-secondary">
              Our Expertise
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              A team of certified BIM professionals with expertise across all major platforms
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {['Revit', 'Navisworks', 'AutoCAD', 'BIM 360', 'Tekla', 'ArchiCAD', 'Dynamo', 'Solibri'].map((tool) => (
              <div key={tool} className="bg-light p-6 rounded-lg text-center font-semibold text-secondary hover:bg-primary hover:text-white transition-all cursor-pointer">
                {tool}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gradient-to-r from-primary to-[#0a2f47] text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Let's Work Together
          </h2>
          <p className="text-lg mb-8 text-white text-opacity-90 max-w-2xl mx-auto">
            Partner with us to bring precision, efficiency, and innovation to your next project
          </p>
          <a
            href="/contact"
            className="inline-block bg-accent text-white px-8 py-3 rounded-lg font-semibold hover:bg-[#d4613a] transition-all"
          >
            Get in Touch
          </a>
        </div>
      </section>
    </div>
  );
}
