const siteUrl = 'https://www.smartscalesystems.tech';
const lastmod = '2026-08-16';
const team = [
  { name: 'Muhammad Hashir Lodhi', jobTitle: 'Founder' },
  { name: 'Muhammad Nouman Qadeer', jobTitle: 'AI Engineer' },
  { name: 'Muhammad Mudassir', jobTitle: 'AI Data Annotator & Labeling Expert' },
  { name: 'Muhammad Shahryar', jobTitle: 'Marketing Expert' },
];

const routes = [
  {
    path: '/', source: 'index.html', type: 'home', priority: '1.0', changefreq: 'weekly',
    title: 'Smart Scale Systems | AI Development & Automation Company',
    description: 'Smart Scale Systems builds custom AI agents, automation, machine learning, computer vision, and AI data solutions worldwide. Discuss your project.',
  },
  {
    path: '/services', source: 'services.html', type: 'collection', priority: '0.9', changefreq: 'weekly',
    title: 'AI Development & Automation Services | Smart Scale Systems',
    description: 'Explore AI development services for custom agents, automation, model training, computer vision, NLP, LLM solutions, analytics, integrations, and training data.',
  },
  {
    path: '/projects', source: 'projects.html', type: 'projects', priority: '0.85', changefreq: 'monthly',
    title: 'AI Projects & Technical Prototypes | Smart Scale Systems',
    description: 'Explore independent Smart Scale Systems technical prototypes in document RAG, legal AI, tool-assisted planning, automation, computer vision, and analytics.',
  },
  {
    path: '/team', source: 'team.html', type: 'page', priority: '0.6', changefreq: 'monthly',
    title: 'About Smart Scale Systems | AI Development Team',
    description: 'Meet the Smart Scale Systems team working across AI engineering, machine learning, automation, data annotation, computer vision, NLP, and business growth.',
  },
  {
    path: '/contact', source: 'contact.html', type: 'contact', priority: '0.7', changefreq: 'monthly',
    title: 'Contact Smart Scale Systems | Start Your AI Project',
    description: 'Contact Smart Scale Systems about custom AI development, automation, model training, computer vision, NLP, LLM, analytics, integrations, or data needs.',
  },
  {
    path: '/services/ai-model-training', source: 'service-ai-model-training.html', type: 'service', priority: '0.8', changefreq: 'monthly',
    title: 'AI Model Training Services | Smart Scale Systems',
    description: 'Custom AI model training, fine-tuning, dataset preparation, evaluation, optimization, deployment support, and retraining workflows for production systems.',
  },
  {
    path: '/services/ai-automation', source: 'service-ai-automation.html', type: 'service', priority: '0.8', changefreq: 'monthly',
    title: 'AI Automation Services | Smart Scale Systems',
    description: 'Automate workflows, CRM operations, lead handling, support, reporting, document processing, and business processes with practical AI systems. Explore options.',
  },
  {
    path: '/services/custom-ai-agents', source: 'service-custom-ai-agents.html', type: 'service', priority: '0.8', changefreq: 'monthly',
    title: 'Custom AI Agent Development Services | Smart Scale Systems',
    description: 'Build custom AI agents for support, knowledge search, research, tool use, document operations, and multi-step business workflows with clear guardrails.',
  },
  {
    path: '/services/data-analytics', source: 'service-data-analytics.html', type: 'service', priority: '0.8', changefreq: 'monthly',
    title: 'Data Analytics & AI Insights | Smart Scale Systems',
    description: 'Turn business data into trusted dashboards, forecasting, customer analytics, automated reporting, governed metrics, and actionable AI insights. See what fits.',
  },
  {
    path: '/services/ai-integrations', source: 'service-ai-integrations.html', type: 'service', priority: '0.8', changefreq: 'monthly',
    title: 'AI Integration Services | Smart Scale Systems',
    description: 'Integrate AI into websites, SaaS products, internal applications, CRMs, APIs, databases, and existing business systems with reliable production workflows.',
  },
  {
    path: '/services/business-automations', source: 'service-business-automations.html', type: 'service', priority: '0.8', changefreq: 'monthly',
    title: 'Business Process Automation Services | Smart Scale Systems',
    description: 'Automate sales, support, operations, lead routing, reporting, document processing, approvals, and back-office workflows across your existing tools.',
  },
  {
    path: '/services/computer-vision', source: 'service-computer-vision.html', type: 'service', priority: '0.8', changefreq: 'monthly',
    title: 'Computer Vision Services | Smart Scale Systems',
    description: 'Production computer vision for object detection, image classification, segmentation, OCR, video analytics, tracking, and visual quality inspection.',
  },
  {
    path: '/services/nlp', source: 'service-nlp.html', type: 'service', priority: '0.8', changefreq: 'monthly',
    title: 'Natural Language Processing Services | Smart Scale Systems',
    description: 'NLP services for text classification, sentiment analysis, named entity recognition, intent detection, semantic search, extraction, and language intelligence.',
  },
  {
    path: '/services/llm', source: 'service-llm.html', type: 'service', priority: '0.8', changefreq: 'monthly',
    title: 'LLM Development & AI Assistant Services | Smart Scale Systems',
    description: 'Build LLM solutions with prompt engineering, RAG, fine-tuning, RLHF, response evaluation, safety testing, tool use, and custom AI assistants. Start planning.',
  },
  {
    path: '/services/data-annotation', source: 'service-data-annotation.html', type: 'service', priority: '0.8', changefreq: 'monthly',
    title: 'Data Annotation Services for AI | Smart Scale Systems',
    description: 'Image, video, text, audio, OCR, and 3D data annotation with bounding boxes, polygons, segmentation masks, keypoints, transcription, and rigorous QA.',
  },
  {
    path: '/services/ai-training-data', source: 'service-ai-training-data.html', type: 'service', priority: '0.8', changefreq: 'monthly',
    title: 'AI Training Data & Dataset Creation | Smart Scale Systems',
    description: 'Create and curate training datasets for machine learning, computer vision, NLP, LLMs, speech, multimodal systems, benchmarks, and model evaluation.',
  },
  {
    path: '/services/custom', source: 'service-custom.html', type: 'service', priority: '0.75', changefreq: 'monthly',
    title: 'Custom AI Solutions & Development | Smart Scale Systems',
    description: 'Plan and build tailored AI solutions combining automation, machine learning, LLMs, computer vision, NLP, analytics, integrations, and data systems.',
  },
  {
    path: '/privacy-policy', source: 'privacy-policy.html', type: 'page', priority: '0.3', changefreq: 'yearly',
    title: 'Privacy Policy | Smart Scale Systems',
    description: 'Read the Smart Scale Systems privacy policy covering information collection, use, security, cookies, data rights, and contact information. Review your rights.',
  },
  {
    path: '/terms-of-service', source: 'terms-of-service.html', type: 'page', priority: '0.3', changefreq: 'yearly',
    title: 'Terms of Service | Smart Scale Systems',
    description: 'Read the Smart Scale Systems terms governing website use, AI services, client projects, intellectual property, acceptable use, and limitations. Read the terms.',
  },
];

const routeMap = Object.fromEntries(routes.map((route) => [route.path, route]));

const redirects = {
  '/about': '/team',
  '/privacy': '/privacy-policy',
  '/terms': '/terms-of-service',
  '/service-ai-model-training': '/services/ai-model-training',
  '/service-ai-automation': '/services/ai-automation',
  '/service-custom-ai-agents': '/services/custom-ai-agents',
  '/service-data-analytics': '/services/data-analytics',
  '/service-ai-integrations': '/services/ai-integrations',
  '/service-business-automations': '/services/business-automations',
  '/service-computer-vision': '/services/computer-vision',
  '/service-nlp': '/services/nlp',
  '/service-llm': '/services/llm',
  '/service-data-annotation': '/services/data-annotation',
  '/service-ai-training-data': '/services/ai-training-data',
  '/service-custom': '/services/custom',
};

export default {
  siteUrl,
  lastmod,
  team,
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
