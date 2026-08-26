const siteUrl = 'https://www.smartscalesystems.tech';
const lastmod = '2026-08-26';
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
    description: 'Smart Scale Systems builds custom AI agents, automation, machine learning, computer vision, and AI data solutions worldwide. End-to-end delivery from data to deployment.',
  },
  {
    path: '/services', source: 'services.html', type: 'collection', priority: '0.9', changefreq: 'weekly',
    title: 'AI Development & Automation Services | Smart Scale Systems',
    description: 'Explore AI development services: custom agents, automation, model training, computer vision, NLP, LLM solutions, analytics, integrations, and training data.',
  },
  {
    path: '/projects', source: 'projects.html', type: 'projects', priority: '0.85', changefreq: 'monthly',
    title: 'AI Projects & Technical Prototypes | Smart Scale Systems',
    description: 'Explore Smart Scale Systems technical prototypes in document RAG, legal AI, tool-assisted planning, automation, computer vision, and analytics.',
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
    path: '/services/ai-model-training', source: 'service-ai-model-training.html', type: 'service', priority: '0.8', changefreq: 'weekly',
    title: 'AI Model Training Services | Production ML Pipelines | Smart Scale Systems',
    description: 'Production-ready AI model training with data-first approach, rapid experimentation, and deployment-ready packaging. From data audit to deployed model with evaluation suites and monitoring.',
  },
  {
    path: '/services/ai-automation', source: 'service-ai-automation.html', type: 'service', priority: '0.8', changefreq: 'weekly',
    title: 'AI Automation Services | Intelligent Workflow Automation | Smart Scale Systems',
    description: 'Process-first AI automation with exception handling, human-in-the-loop checkpoints, and measurable ROI. Automate CRM, lead generation, support, and business operations.',
  },
  {
    path: '/services/custom-ai-agents', source: 'service-custom-ai-agents.html', type: 'service', priority: '0.8', changefreq: 'weekly',
    title: 'Custom AI Agent Development | Production-Grade Agents | Smart Scale Systems',
    description: 'Production-grade AI agents with tool-use validation, human oversight, error handling, and cost controls. Build support, knowledge, and task automation agents.',
  },
  {
    path: '/services/data-analytics', source: 'service-data-analytics.html', type: 'service', priority: '0.8', changefreq: 'weekly',
    title: 'Data Analytics Services | Decision-Focused Analytics | Smart Scale Systems',
    description: 'Decision-focused data analytics with dashboards, forecasting, customer intelligence, and metric governance. Built around the decisions your team actually makes.',
  },
  {
    path: '/services/ai-integrations', source: 'service-ai-integrations.html', type: 'service', priority: '0.8', changefreq: 'weekly',
    title: 'AI Integration Services | Add AI to Your Products | Smart Scale Systems',
    description: 'Production-ready AI integrations with access controls, usage monitoring, cost tracking, and fallback behavior. Add AI to websites, SaaS, CRMs, and internal tools.',
  },
  {
    path: '/services/business-automations', source: 'service-business-automations.html', type: 'service', priority: '0.8', changefreq: 'weekly',
    title: 'Business Process Automation | Workflow Automation | Smart Scale Systems',
    description: 'Business automation with exception handling, audit trails, and clear ownership. Automate sales, support, operations, and back-office workflows with measurable impact.',
  },
  {
    path: '/services/computer-vision', source: 'service-computer-vision.html', type: 'service', priority: '0.8', changefreq: 'weekly',
    title: 'Computer Vision Services | Production Vision Systems | Smart Scale Systems',
    description: 'Production computer vision trained on real-world conditions. Object detection, segmentation, OCR, video analytics with edge case analysis and latency optimization.',
  },
  {
    path: '/services/nlp', source: 'service-nlp.html', type: 'service', priority: '0.8', changefreq: 'weekly',
    title: 'NLP Services | Natural Language Processing | Smart Scale Systems',
    description: 'Domain-specific NLP with expert evaluation and scalable architecture. Text classification, sentiment analysis, NER, intent detection, and semantic search.',
  },
  {
    path: '/services/llm', source: 'service-llm.html', type: 'service', priority: '0.8', changefreq: 'weekly',
    title: 'LLM Solutions | Fine-Tuning, RLHF, AI Assistants | Smart Scale Systems',
    description: 'Production LLM pipelines with use-case evaluation, safety red-teaming, and cost optimization. Fine-tuning, prompt engineering, RAG, and custom AI assistants.',
  },
  {
    path: '/services/data-annotation', source: 'service-data-annotation.html', type: 'service', priority: '0.8', changefreq: 'weekly',
    title: 'Data Annotation Services | Precision Labeling with QA | Smart Scale Systems',
    description: 'Precision data annotation with domain expertise and multi-stage QA. Image, video, text, audio, OCR annotation with IAA scores and quality reports.',
  },
  {
    path: '/services/ai-training-data', source: 'service-ai-training-data.html', type: 'service', priority: '0.8', changefreq: 'weekly',
    title: 'AI Training Data Creation | Dataset Design | Smart Scale Systems',
    description: 'Model-first dataset design with curated quality and documented provenance. Create training data for computer vision, NLP, LLMs, and multimodal systems.',
  },
  {
    path: '/services/custom', source: 'service-custom.html', type: 'service', priority: '0.75', changefreq: 'weekly',
    title: 'Custom AI Solutions | Tailored AI Development | Smart Scale Systems',
    description: 'Cross-disciplinary custom AI solutions combining ML, CV, NLP, LLMs, and automation. Flexible engagement from prototype to production with deployment support.',
  },
  {
    path: '/privacy-policy', source: 'privacy-policy.html', type: 'page', priority: '0.3', changefreq: 'yearly',
    title: 'Privacy Policy | Smart Scale Systems',
    description: 'Smart Scale Systems privacy policy covering information collection, use, security, cookies, data rights, and contact information.',
  },
  {
    path: '/terms-of-service', source: 'terms-of-service.html', type: 'page', priority: '0.3', changefreq: 'yearly',
    title: 'Terms of Service | Smart Scale Systems',
    description: 'Smart Scale Systems terms governing website use, AI services, client projects, intellectual property, acceptable use, and limitations.',
  },
];

const routeMap = Object.fromEntries(routes.map((route) => [route.path, route]));

// Legacy or shorthand URLs with a clear, current equivalent. Keep aliases out
// of navigation and the sitemap so only canonical destinations are indexable.
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

module.exports = {
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
