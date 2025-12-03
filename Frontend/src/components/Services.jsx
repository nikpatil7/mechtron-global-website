import { Link } from 'react-router-dom';
import { FaBuilding, FaCogs, FaSearch, FaCube, FaArrowRight, FaProjectDiagram, FaExclamationTriangle, FaEye } from 'react-icons/fa';
import FadeIn from './animations/FadeIn';
import StaggerContainer, { StaggerItem } from './animations/StaggerContainer';

const services = [
  {
    icon: <FaCube />,
    title: 'MEPF Services',
    description: 'Comprehensive MEPF BIM solutions for mechanical, electrical, plumbing and fire systems with accurate 3D models.',
    features: ['HVAC Systems', 'Electrical Distribution', 'Plumbing & Fire Protection']
  },
  {
    icon: <FaProjectDiagram />,
    title: 'Coordination & Collaboration',
    description: 'Ensuring seamless collaboration between different MEP disciplines to avoid clashes and rework.',
    features: ['Multi-discipline Coordination', 'Design & Site Team Collaboration', 'Clash Avoidance']
  },
  {
    icon: <FaCube />,
    title: 'MEP Modeling',
    description: 'Specialized Revit MEP BIM modeling services for precision and consistency in building design with latest technology and plugins.',
    features: ['Revit MEP Modeling', 'LOD 300-500', 'BIM Standards Compliance']
  },
  {
    icon: <FaEye />,
    title: 'MEP Shop Drawings',
    description: 'Detailed and accurate MEP shop drawings and As-built drawings for on-site hassle free installation, execution and evaluation.',
    features: ['Fabrication Drawings', 'As-built Documentation', 'Installation Details']
  },
  {
    icon: <FaCube />,
    title: 'Content Creation',
    description: 'Custom Revit family creation for MEP components to enhance project efficiency and accuracy.',
    features: ['Custom Revit Families', 'Parametric Components', 'Library Management']
  },
  {
    icon: <FaExclamationTriangle />,
    title: 'Clash Detection',
    description: 'Early detection and resolution of MEP clashes to save project cost, time, and ensure smooth construction.',
    features: ['Automated Clash Detection', 'Clash Reports', 'Resolution Coordination']
  }
];

export default function Services() {
  return (
    <section id="services" className="section-padding bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Decorative Background Elements - Subtle */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-20 -right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 -left-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <FadeIn className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-accent/10 text-accent rounded-full text-sm font-semibold mb-4">
            What We Offer
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-secondary">
            Our BIM Services
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            Comprehensive BIM solutions tailored to meet the unique needs of your construction projects
          </p>
        </FadeIn>

        {/* Services Grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <StaggerItem key={index}>
              <div className="relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl border border-gray-200 cursor-pointer group overflow-hidden h-full transition-all duration-500 hover:-translate-y-2 hover:ring-2 hover:ring-primary/25">
                
                {/* Subtle hover ring replaces gradient glow to preserve text clarity */}

                <div className="relative z-10">
                  {/* Icon with 3D Effect */}
                  <div className="mb-6 relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center text-white text-3xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-xl group-hover:shadow-2xl group-hover:shadow-accent/30">
                      {service.icon}
                    </div>
                    {/* Pulse Effect */}
                    <div className="absolute inset-0 w-16 h-16 bg-accent/30 rounded-2xl opacity-0 group-hover:opacity-100 group-hover:scale-150 transition-all duration-700 blur-xl"></div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-bold mb-3 text-secondary group-hover:text-primary transition-colors duration-300 relative z-10">
                    {service.title}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-6 leading-relaxed relative z-10">
                    {service.description}
                  </p>

                  {/* Features with Hover Effect */}
                  <ul className="space-y-3 mb-6 relative z-10">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="text-sm text-gray-700 flex items-start gap-3 group/item">
                        <span className="w-5 h-5 bg-gradient-to-br from-accent/20 to-accent/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 group-hover/item:from-accent group-hover/item:to-accent/80 transition-all duration-300">
                          <span className="w-2 h-2 bg-accent rounded-full group-hover/item:bg-white transition-colors"></span>
                        </span>
                        <span className="group-hover/item:text-secondary group-hover/item:translate-x-1 transition-all duration-300">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Learn More Link with Arrow Animation */}
                  <Link
                    to="/services"
                    className="text-primary font-bold text-sm flex items-center gap-2 group-hover:gap-4 transition-all group-hover:text-accent relative z-10"
                  >
                    <span>Learn More</span>
                    <span className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all">
                      <FaArrowRight className="text-xs" />
                    </span>
                  </Link>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* CTA with Magnetic Effect */}
        <FadeIn delay={0.5} className="text-center mt-16">
          <Link
            to="/services"
            className="inline-flex items-center gap-3 bg-gradient-to-r from-accent to-accent/90 text-white px-10 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-accent/40 hover:scale-105 transition-all duration-300 group"
          >
            <span>View All Services</span>
            <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
          </Link>
        </FadeIn>
      </div>
    </section>
  );
}
