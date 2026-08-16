const siteUrl = 'https://www.smartscalesystems.tech';
const lastmod = '2026-08-16';

const routes = [
  {
    path: '/', source: 'index.html', type: 'home', priority: '1.0', changefreq: 'weekly',
    title: 'Smart Scale Systems | AI Development & Automation Company',
    description: 'Smart Scale Systems builds custom AI agents, automation systems, machine learning models, computer vision solutions, and production-ready AI data workflows for teams worldwide.',
  },
  {
    path: '/services', source: 'services.html', type: 'collection', priority: '0.9', changefreq: 'weekly',
    title: 'AI Development & Automation Services | Smart Scale Systems',
    description: 'Explore AI development services for custom agents, automation, model training, computer vision, NLP, LLM solutions, analytics, integrations, and training data.',
  },
  {
    path: '/projects', source: 'projects.html', type: 'projects', priority: '0.85', changefreq: 'monthly',
    title: 'AI Projects & Case Studies | Smart Scale Systems',
    description: 'Explore Smart Scale Systems projects across Agentic RAG, custom AI agents, chatbots, automation, model training, computer vision, analytics, and anomaly detection.',
  },
  {
    path: '/team', source: 'team.html', type: 'page', priority: '0.6', changefreq: 'monthly',
    title: 'About Smart Scale Systems | AI Development Team',
    description: 'Meet the Smart Scale Systems team working across AI engineering, machine learning, automation, data annotation, computer vision, NLP, and business growth.',
  },
  {
    path: '/contact', source: 'contact.html', type: 'contact', priority: '0.7', changefreq: 'monthly',
    title: 'Contact Smart Scale Systems | Start Your AI Project',
    description: 'Contact Smart Scale Systems to discuss custom AI development, automation, model training, computer vision, NLP, LLM, analytics, integration, or data requirements.',
  },
  {
    path: '/service-ai-model-training', source: 'service-ai-model-training.html', type: 'service', priority: '0.8', changefreq: 'monthly',
    title: 'AI Model Training Services | Smart Scale Systems',
    description: 'Custom AI model training, fine-tuning, dataset preparation, evaluation, optimization, deployment support, and retraining workflows for production systems.',
  },
  {
    path: '/service-ai-automation', source: 'service-ai-automation.html', type: 'service', priority: '0.8', changefreq: 'monthly',
    title: 'AI Automation Services | Smart Scale Systems',
    description: 'Automate workflows, CRM operations, lead handling, support, reporting, document processing, and business processes with practical AI systems.',
  },
  {
    path: '/service-custom-ai-agents', source: 'service-custom-ai-agents.html', type: 'service', priority: '0.8', changefreq: 'monthly',
    title: 'Custom AI Agent Development Services | Smart Scale Systems',
    description: 'Build custom AI agents for support, knowledge search, research, tool use, document operations, and multi-step business workflows with clear guardrails.',
  },
  {
    path: '/service-data-analytics', source: 'service-data-analytics.html', type: 'service', priority: '0.8', changefreq: 'monthly',
    title: 'Data Analytics & AI Insights | Smart Scale Systems',
    description: 'Turn business data into trusted dashboards, forecasting, customer analytics, automated reporting, governed metrics, and actionable AI insights.',
  },
  {
    path: '/service-ai-integrations', source: 'service-ai-integrations.html', type: 'service', priority: '0.8', changefreq: 'monthly',
    title: 'AI Integration Services | Smart Scale Systems',
    description: 'Integrate AI into websites, SaaS products, internal applications, CRMs, APIs, databases, and existing business systems with reliable production workflows.',
  },
  {
    path: '/service-business-automations', source: 'service-business-automations.html', type: 'service', priority: '0.8', changefreq: 'monthly',
    title: 'Business Process Automation Services | Smart Scale Systems',
    description: 'Automate sales, support, operations, lead routing, reporting, document processing, approvals, and back-office workflows across your existing tools.',
  },
  {
    path: '/service-computer-vision', source: 'service-computer-vision.html', type: 'service', priority: '0.8', changefreq: 'monthly',
    title: 'Computer Vision Services | Smart Scale Systems',
    description: 'Production computer vision for object detection, image classification, segmentation, OCR, video analytics, tracking, and visual quality inspection.',
  },
  {
    path: '/service-nlp', source: 'service-nlp.html', type: 'service', priority: '0.8', changefreq: 'monthly',
    title: 'Natural Language Processing Services | Smart Scale Systems',
    description: 'NLP services for text classification, sentiment analysis, named entity recognition, intent detection, semantic search, extraction, and language intelligence.',
  },
  {
    path: '/service-llm', source: 'service-llm.html', type: 'service', priority: '0.8', changefreq: 'monthly',
    title: 'LLM Development & AI Assistant Services | Smart Scale Systems',
    description: 'Build LLM solutions with prompt engineering, RAG, fine-tuning, RLHF, response evaluation, safety testing, tool use, and custom AI assistants.',
  },
  {
    path: '/service-data-annotation', source: 'service-data-annotation.html', type: 'service', priority: '0.8', changefreq: 'monthly',
    title: 'Data Annotation Services for AI | Smart Scale Systems',
    description: 'Image, video, text, audio, OCR, and 3D data annotation with bounding boxes, polygons, segmentation masks, keypoints, transcription, and rigorous QA.',
  },
  {
    path: '/service-ai-training-data', source: 'service-ai-training-data.html', type: 'service', priority: '0.8', changefreq: 'monthly',
    title: 'AI Training Data & Dataset Creation | Smart Scale Systems',
    description: 'Create and curate training datasets for machine learning, computer vision, NLP, LLMs, speech, multimodal systems, benchmarks, and model evaluation.',
  },
  {
    path: '/service-custom', source: 'service-custom.html', type: 'service', priority: '0.75', changefreq: 'monthly',
    title: 'Custom AI Solutions & Development | Smart Scale Systems',
    description: 'Plan and build tailored AI solutions combining automation, machine learning, LLMs, computer vision, NLP, analytics, integrations, and data systems.',
  },
  {
    path: '/privacy-policy', source: 'privacy-policy.html', type: 'page', priority: '0.3', changefreq: 'yearly',
    title: 'Privacy Policy | Smart Scale Systems',
    description: 'Read the Smart Scale Systems privacy policy covering information collection, use, security, cookies, data rights, and contact information.',
  },
  {
    path: '/terms-of-service', source: 'terms-of-service.html', type: 'page', priority: '0.3', changefreq: 'yearly',
    title: 'Terms of Service | Smart Scale Systems',
    description: 'Read the Smart Scale Systems terms governing website use, AI services, client projects, intellectual property, acceptable use, and limitations.',
  },
];

const routeMap = Object.fromEntries(routes.map((route) => [route.path, route]));

// Legacy or shorthand URLs with a clear, current equivalent. Keep aliases out
// of navigation and the sitemap so only canonical destinations are indexable.
const redirects = {
  '/about': '/team',
  '/privacy': '/privacy-policy',
  '/terms': '/terms-of-service',
};

module.exports = {
  siteUrl,
  lastmod,
  brandName: 'Smart Scale Systems',
  logoUrl: `${siteUrl}/logo-main.png`,
  socialImageUrl: `${siteUrl}/og.png`,
  sameAs: [
    'https://github.com/SmartScaleSystems',
    'https://www.instagram.com/smart.scale.systems/',
    'https://x.com/SmartScaleSyst',
  ],
  routes,
  routeMap,
  redirects,
  gone: ['/testimonials'],
};
