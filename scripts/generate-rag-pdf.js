const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');

const OUTPUT_DIR = path.join(__dirname, '..', 'output', 'pdf');
const OUTPUT_FILE = path.join(OUTPUT_DIR, 'smart-scale-systems-agency-chatbot-guide.pdf');

const SITE = 'https://www.smartscalesystems.tech';
const CONTACT_EMAIL = 'contact@smartscalesystems.tech';
const COLORS = {
  ink: '#0A0A0A',
  charcoal: '#222222',
  body: '#3E3E3E',
  muted: '#717171',
  line: '#D9D9D9',
  soft: '#F2F2F2',
  accent: '#5757FF',
  accentSoft: '#EEEEFF',
  white: '#FFFFFF',
};

const sections = [
  {
    id: 'answer-contract',
    title: 'ScaleBot Answer Contract',
    summary: 'How the website assistant should use this knowledge base and handle uncertainty.',
    blocks: [
      {
        heading: 'Primary role',
        paragraphs: [
          'ScaleBot is the professional business assistant for Smart Scale Systems. It should answer questions about the company, services, team, project fit, delivery approach, contact routes, careers, privacy, and terms using the facts in this document.',
          'The assistant should be direct and useful. It may recommend a relevant service when the visitor explains a business problem, but it must not invent project facts, private information, client identities, certifications, prices, delivery dates, or performance guarantees.',
        ],
      },
      {
        heading: 'Answer behavior',
        bullets: [
          'Lead with the answer, then add only the detail needed to make the answer useful.',
          'Use short paragraphs and bullets. Keep most website-chat replies under 220 words unless the visitor asks for depth.',
          'For a person-specific question, answer only about that person unless the visitor asks for the whole team.',
          'For pricing, timeline, or a custom scope, explain that these depend on requirements and direct the visitor to the Contact page.',
          'Use named links such as Services, Team, Contact Us, Privacy Policy, or Terms of Service instead of pasting a long raw URL.',
          'If the visitor is rude, remain calm and continue helping. Do not lecture, shame, or display a generic conduct warning.',
          'If a fact is not in this document, say that it is not published or needs confirmation, then offer the correct contact route.',
        ],
      },
      {
        heading: 'Truth and qualification rules',
        paragraphs: [
          'Capabilities describe work Smart Scale Systems offers. They are not automatic guarantees for every project. Published accuracy figures, response windows, testimonial outcomes, and example benefits must be described as website claims or past examples, not universal promises.',
          'A response window means the agency plans to reply or provide an initial action plan. It does not mean the complete project will be delivered in that window.',
        ],
      },
    ],
  },
  {
    id: 'company-overview',
    title: 'Company Overview',
    summary: 'Core identity, positioning, audience, and value proposition.',
    blocks: [
      {
        heading: 'Who Smart Scale Systems is',
        paragraphs: [
          'Smart Scale Systems is an AI services agency established in 2021. It helps ambitious teams design, build, and scale practical AI systems. The agency works across the full AI lifecycle, from data collection and annotation through model development, evaluation, automation, integration, and deployment support.',
          'The company serves businesses worldwide. Its website positions the team as delivery-focused: useful production systems, reliable data, measurable performance, and clear communication rather than experiments that never ship.',
        ],
      },
      {
        heading: 'Primary service portfolio',
        bullets: [
          'AI Model Training',
          'AI Automation',
          'Computer Vision',
          'Natural Language Processing (NLP)',
          'Large Language Model (LLM) Solutions',
          'Data Annotation',
          'AI Training Data Creation',
          'Custom AI Solutions',
        ],
      },
      {
        heading: 'What the agency emphasizes',
        bullets: [
          'End-to-end ownership from raw data to deployment-ready systems.',
          'Dedicated specialists across machine learning, automation, language AI, computer vision, and annotation.',
          'Rapid iteration supported by structured quality assurance.',
          'Scalable delivery for both early prototypes and high-volume data operations.',
          'Transparent communication through clear updates, reporting, and direct collaboration.',
          'Security, confidentiality, responsible AI practices, and long-term client value.',
        ],
      },
    ],
  },
  {
    id: 'service-router',
    title: 'Service Selection Guide',
    summary: 'A problem-to-service map ScaleBot can use when a visitor is unsure where to start.',
    blocks: [
      {
        heading: 'Recommend by business need',
        bullets: [
          'Choose AI Model Training when the visitor has data and needs a custom predictive, classification, regression, or deep learning model.',
          'Choose AI Automation when the visitor wants to reduce repetitive work, connect business tools, build agents, automate CRM activity, or streamline operations.',
          'Choose Computer Vision when the input is images, video, scanned documents, visual inspection, object tracking, OCR, or segmentation.',
          'Choose NLP when the task involves text classification, sentiment, named entities, intent, semantic search, ticket routing, or language understanding.',
          'Choose LLM Solutions for RAG assistants, model fine-tuning, prompt systems, RLHF, knowledge retrieval, evaluation, tool use, or generative workflows.',
          'Choose Data Annotation when the visitor already has raw image, video, text, audio, OCR, lidar, or multimodal data that needs accurate labels.',
          'Choose AI Training Data when the visitor needs the dataset itself designed, collected, generated, cleaned, balanced, annotated, and validated.',
          'Choose Custom AI Solutions when the project combines disciplines, has unusual workflows, or does not fit a standard service.',
        ],
      },
      {
        heading: 'Projects often combine services',
        paragraphs: [
          'A complete engagement may combine training data, annotation, model training, evaluation, automation, and integration. ScaleBot should explain the likely combination without claiming a final architecture before discovery.',
        ],
      },
      {
        heading: 'Best next question',
        paragraphs: [
          'When the request is vague, ask what the visitor wants to improve, what data they have, where the output will be used, and what success should look like. Then recommend the smallest sensible starting service.',
        ],
      },
    ],
  },
  {
    id: 'ai-model-training',
    title: 'AI Model Training',
    summary: 'Custom model development, fine-tuning, evaluation, and production preparation.',
    route: '/service-ai-model-training',
    blocks: [
      {
        heading: 'What is offered',
        bullets: [
          'Custom model development with architecture selection, training pipelines, and hyperparameter optimization.',
          'Fine-tuning and transfer learning to adapt pre-trained models to a specific domain.',
          'Dataset cleaning, augmentation, splitting, and preprocessing.',
          'Evaluation and benchmarking with accuracy, precision, recall, F1, AUC, and custom business metrics.',
          'Deployment-ready packaging, serving recommendations, and integration support.',
          'Monitoring, retraining pipelines, and performance optimization as new data arrives.',
        ],
      },
      {
        heading: 'Representative applications',
        bullets: [
          'Medical image analysis, patient outcome prediction, and clinical decision support.',
          'Fraud detection, anomaly detection, transaction monitoring, and risk scoring.',
          'Predictive maintenance using equipment, sensor, and telemetry data.',
          'Demand forecasting, inventory planning, sales forecasting, and supply chain optimization.',
          'Customer churn prediction and retention signal discovery.',
          'Manufacturing quality control and visual defect classification.',
        ],
      },
      {
        heading: 'Scoping inputs',
        paragraphs: [
          'Useful discovery details include the prediction target, available data volume and format, label quality, baseline performance, required metrics, inference environment, latency needs, compliance constraints, and how model output will be used.',
        ],
      },
    ],
  },
  {
    id: 'ai-automation',
    title: 'AI Automation',
    summary: 'Agents, workflow automation, CRM systems, integrations, and operational efficiency.',
    route: '/service-ai-automation',
    blocks: [
      {
        heading: 'What is offered',
        bullets: [
          'AI agents for research, lead qualification, support, data processing, and multi-step work.',
          'CRM automation for lead scoring, follow-up sequences, pipeline updates, and customer segmentation.',
          'Lead generation automation for identifying, qualifying, and routing prospects.',
          'Business process automation for approvals, documents, reports, and cross-tool data flows.',
          'Automated dashboards, scheduled reports, anomaly alerts, and analytics workflows.',
          'Integrations with tools such as Slack, HubSpot, Salesforce, Notion, Zapier, GoHighLevel, n8n, and custom APIs.',
        ],
      },
      {
        heading: 'Representative applications',
        bullets: [
          'Sales research, personalized outreach, follow-up, and CRM hygiene.',
          'Support triage, FAQ deflection, ticket routing, and human escalation.',
          'PDF, form, invoice, and document extraction into structured systems.',
          'Content planning, brief generation, SEO support, and publishing workflows.',
          'Resume screening, interview scheduling, onboarding, and employee communication.',
          'Invoice processing, expense categorization, reporting, and compliance monitoring.',
        ],
      },
      {
        heading: 'Important qualification',
        paragraphs: [
          'The automation page describes potential efficiency outcomes, including reduced support overhead. Actual ROI and time savings depend on the current process, task volume, exception rate, integrations, and adoption. The agency offers to design a solution and estimate ROI after reviewing the workflow.',
        ],
      },
    ],
  },
  {
    id: 'computer-vision',
    title: 'Computer Vision',
    summary: 'Production visual AI for images, video, OCR, detection, segmentation, and tracking.',
    route: '/service-computer-vision',
    blocks: [
      {
        heading: 'What is offered',
        bullets: [
          'Object detection using real-time, batch, standard, or custom architectures.',
          'Multi-class and multi-label image classification.',
          'Semantic segmentation for pixel-level scene understanding.',
          'Instance segmentation for separating individual objects in crowded scenes.',
          'OCR and document AI for images, PDFs, handwriting, invoices, and complex layouts.',
          'Video analytics with object tracking, activity recognition, anomaly detection, and temporal understanding.',
        ],
      },
      {
        heading: 'Representative applications',
        bullets: [
          'Autonomous mobility: lanes, pedestrians, obstacles, traffic signs, and sensor-assisted perception.',
          'Retail: visual search, shelf monitoring, planogram compliance, and self-checkout.',
          'Medical imaging: radiology support, tumor segmentation, and cell counting.',
          'Manufacturing: defects, surface inspection, measurement, and assembly verification.',
          'Security: re-identification, intrusion detection, crowd analysis, and anomaly detection.',
          'Agriculture: crop disease, yield estimation, drone imagery, and soil analysis.',
        ],
      },
      {
        heading: 'Full pipeline support',
        paragraphs: [
          'Computer vision work can include data collection, annotation, model training, optimization, evaluation, and deployment support. Relevant discovery details include camera or image source, operating environment, object classes, annotation availability, target accuracy, latency, hardware, and privacy requirements.',
        ],
      },
    ],
  },
  {
    id: 'nlp',
    title: 'Natural Language Processing',
    summary: 'Language systems for classification, extraction, intent, search, and text intelligence.',
    route: '/service-nlp',
    blocks: [
      {
        heading: 'What is offered',
        bullets: [
          'Multi-class and hierarchical text classification.',
          'Document-, sentence-, and aspect-level sentiment analysis.',
          'Named entity recognition for standard and custom entities.',
          'Intent detection for assistants, routing, search, and conversational systems.',
          'Semantic search, query understanding, and relevance ranking.',
          'Conversation datasets, intent-utterance pairs, and dialogue data for chatbot training.',
        ],
      },
      {
        heading: 'Representative applications',
        bullets: [
          'Customer support ticket classification, routing, sentiment, and escalation detection.',
          'Content moderation and harmful-content detection.',
          'Market intelligence from news, social channels, reports, and transcripts.',
          'Contract review, clause extraction, document classification, and compliance flags.',
          'Intent-aware e-commerce search and autocomplete.',
          'Clinical note extraction, coding support, and structuring of health records.',
        ],
      },
      {
        heading: 'Scale and evaluation',
        paragraphs: [
          'The agency builds classical and transformer-based NLP systems and states that its systems can scale to large document volumes. Final architecture and performance targets depend on languages, domain vocabulary, data quality, label definitions, latency, and review requirements.',
        ],
      },
    ],
  },
  {
    id: 'llm-solutions',
    title: 'LLM Solutions',
    summary: 'Fine-tuning, RAG, evaluation, alignment, AI assistants, and generative systems.',
    route: '/service-llm',
    blocks: [
      {
        heading: 'What is offered',
        bullets: [
          'Supervised fine-tuning of open-source model families such as Mistral, LLaMA, Qwen, and Phi.',
          'Prompt engineering, few-shot design, prompt testing, and evaluation frameworks.',
          'RLHF workflows including preference data, reward modeling, PPO, and DPO alignment.',
          'Benchmarking, human preference evaluation, safety red-teaming, and custom evaluation harnesses.',
          'RAG pipelines, knowledge bases, tool use, function calling, and multi-turn AI assistants.',
          'Safety filtering, toxicity reduction, constitutional approaches, and responsible deployment support.',
        ],
      },
      {
        heading: 'Representative applications',
        bullets: [
          'Domain-specific customer, employee, or operations assistants.',
          'Code assistants aligned to a codebase and engineering conventions.',
          'Summarization for legal, financial, medical, and operational documents.',
          'Knowledge retrieval over documents, wikis, databases, and internal resources.',
          'Brand-aligned content workflows and structured content generation.',
          'Flexible information extraction from unstructured documents.',
        ],
      },
      {
        heading: 'RAG versus fine-tuning',
        paragraphs: [
          'RAG is usually the starting point when answers must stay connected to changing documents or databases. Fine-tuning is more appropriate when the desired behavior, style, domain task, or output pattern must be learned. Many systems combine retrieval, prompt design, evaluation, and selective fine-tuning.',
        ],
      },
    ],
  },
  {
    id: 'data-annotation',
    title: 'Data Annotation',
    summary: 'Multi-modal labeling with structured guidelines, review, calibration, and reporting.',
    route: '/service-data-annotation',
    blocks: [
      {
        heading: 'Supported modalities and tasks',
        bullets: [
          'Images: bounding boxes, polygons, masks, keypoints, landmarks, and classification.',
          'Video: tracking, temporal segmentation, action labels, and frame interpolation.',
          'Text: NER, sentiment, intent, coreference, relation extraction, and classification.',
          'Audio: transcription, diarization, emotion, sound events, and classification.',
          'OCR: text regions, line- and word-level transcription, and document layout analysis.',
          '3D and lidar: point-cloud labeling and 3D bounding boxes.',
        ],
      },
      {
        heading: 'Quality framework',
        bullets: [
          'Detailed guidelines and edge-case definitions before production.',
          'Calibration sessions to align annotators on ambiguous examples.',
          'Peer review, lead review, expert spot checks, and milestone audits.',
          'Consensus checks and inter-annotator agreement measurement where appropriate.',
          'Quality reports that may include accuracy, rejection rates, and review outcomes.',
        ],
      },
      {
        heading: 'Published accuracy statement',
        paragraphs: [
          'The Data Annotation page states that Smart Scale Systems maintains 95%+ accuracy across annotation projects through its QA process. Treat this as a published agency statement, not an unconditional guarantee for every dataset. Project-specific targets and acceptance criteria belong in the statement of work.',
        ],
      },
    ],
  },
  {
    id: 'ai-training-data',
    title: 'AI Training Data Creation',
    summary: 'Dataset strategy, collection, generation, annotation, curation, and evaluation sets.',
    route: '/service-ai-training-data',
    blocks: [
      {
        heading: 'What is offered',
        bullets: [
          'Dataset design, class taxonomy, target distribution, collection strategy, and acceptance criteria.',
          'Collection of image, video, text, and audio through appropriate sourcing methods.',
          'Synthetic data through rendering, generative methods, and augmentation to address gaps.',
          'Annotation and labeling across modalities with multi-stage review.',
          'Deduplication, outlier removal, balancing, and train-validation-test splitting.',
          'Benchmark and evaluation datasets for testing, red-teaming, and performance tracking.',
        ],
      },
      {
        heading: 'Dataset categories',
        bullets: [
          'Computer vision datasets for detection, segmentation, OCR, pose, and scene understanding.',
          'NLP datasets for classification, NER, sentiment, intent, Q&A, summarization, and translation.',
          'LLM data for instruction tuning, preference learning, RLHF, and domain adaptation.',
          'Speech and audio datasets for ASR, speakers, emotion, and sound events.',
          'Multimodal image-text, video-caption, and audio-visual datasets.',
          'Curated benchmark, adversarial, and test sets.',
        ],
      },
      {
        heading: 'Data annotation versus training data creation',
        paragraphs: [
          'Data Annotation is the best fit when the client already owns raw data that needs labels. AI Training Data Creation is broader: it can start with dataset design and sourcing, then continue through annotation, curation, validation, and benchmark preparation.',
        ],
      },
    ],
  },
  {
    id: 'custom-ai-solutions',
    title: 'Custom AI Solutions',
    summary: 'Tailored systems for unique requirements and multi-discipline projects.',
    route: '/service-custom',
    blocks: [
      {
        heading: 'When to recommend custom work',
        bullets: [
          'The requirement combines computer vision, NLP, LLMs, automation, or data services.',
          'The system must fit a unique operational workflow or technical environment.',
          'The project needs a rapid prototype before a full implementation decision.',
          'An existing product needs AI features or integrations that do not match a standard package.',
          'The client needs ongoing maintenance, optimization, or a longer-term AI partner.',
        ],
      },
      {
        heading: 'What is offered',
        bullets: [
          'Tailored end-to-end AI pipelines.',
          'Hybrid systems that combine multiple AI disciplines.',
          'Prototype development and concept validation.',
          'Integration with existing products, tools, data flows, and business processes.',
          'Ongoing support, maintenance, and iterative improvement.',
        ],
      },
      {
        heading: 'How to start',
        paragraphs: [
          'The Custom AI Solutions page asks visitors to describe their requirements and states that the agency will respond within one business day with a clear plan. A final solution, budget, and schedule require discovery.',
        ],
      },
    ],
  },
  {
    id: 'industries',
    title: 'Industries and Cross-Industry Use Cases',
    summary: 'Published sectors where the agency applies its AI and data capabilities.',
    blocks: [
      {
        heading: 'Industries listed on the website',
        bullets: [
          'Healthcare and medical: imaging AI, clinical NLP, diagnostic support, and structured records.',
          'Finance and fintech: risk models, fraud detection, anomaly detection, and document automation.',
          'Retail and e-commerce: visual search, recommendations, demand forecasting, and semantic search.',
          'Automotive and mobility: perception data, ADAS, tracking, and sensor-oriented workflows.',
          'Manufacturing: defect detection, predictive maintenance, visual inspection, and QA.',
          'Technology and SaaS: AI feature development, LLM products, NLP integration, and automation.',
          'Education technology: tutoring, content classification, and assessment systems.',
          'Security and defense: surveillance, threat detection, video analytics, and anomaly systems.',
          'Agriculture: crop disease, yield estimation, drone imagery, and visual monitoring.',
        ],
      },
      {
        heading: 'How ScaleBot should discuss industry work',
        paragraphs: [
          'Explain relevant capabilities and examples, but do not imply regulatory approval, medical diagnosis, legal advice, financial advice, defense authorization, or a named client relationship. High-stakes deployments require domain review, privacy controls, evaluation, and human oversight.',
        ],
      },
    ],
  },
  {
    id: 'delivery-workflow',
    title: 'Typical Engagement Workflow',
    summary: 'A practical project path from discovery through support.',
    blocks: [
      {
        heading: '1. Discovery and problem framing',
        paragraphs: [
          'The team reviews the business objective, users, workflow, available data, technical environment, constraints, risk, and measurable success criteria.',
        ],
      },
      {
        heading: '2. Scope and proposal',
        paragraphs: [
          'Smart Scale Systems recommends the service mix, deliverables, milestones, assumptions, evaluation plan, communication rhythm, and commercial scope. Exact pricing and delivery dates are established here, not by the chatbot.',
        ],
      },
      {
        heading: '3. Data and solution preparation',
        paragraphs: [
          'Depending on the project, this can include data collection, cleaning, labeling guidelines, annotation, architecture selection, workflow mapping, integrations, or prototype design.',
        ],
      },
      {
        heading: '4. Build and iterative validation',
        paragraphs: [
          'The team develops the model, dataset, automation, or integrated system and validates it against agreed technical and business criteria. Iterations address errors, edge cases, usability, and quality.',
        ],
      },
      {
        heading: '5. Delivery, integration, and support',
        paragraphs: [
          'Outputs may include models, datasets, reports, workflows, documentation, deployment packages, integration support, and a plan for monitoring or continuous improvement. The exact handoff depends on the service agreement.',
        ],
      },
    ],
  },
  {
    id: 'quality-security-communication',
    title: 'Quality, Security, Scalability, and Communication',
    summary: 'Operating principles repeatedly emphasized across the agency website.',
    blocks: [
      {
        heading: 'Quality',
        bullets: [
          'Define success metrics and acceptance criteria before production work.',
          'Use structured QA, calibration, review, evaluation, and reporting appropriate to the task.',
          'Track edge cases and revise guidelines, data, prompts, or models through iteration.',
          'Measure model and system performance against both technical metrics and business goals.',
        ],
      },
      {
        heading: 'Security and confidentiality',
        paragraphs: [
          'The website states that contact information is kept confidential and that Smart Scale Systems uses appropriate technical and organizational safeguards. Specific project controls, data residency, access policies, retention, compliance, and contractual protections must be confirmed during scoping.',
        ],
      },
      {
        heading: 'Scalability and communication',
        paragraphs: [
          'The agency describes infrastructure and teams that can scale from smaller pilots to high-volume data work. It emphasizes clear status visibility through reports, dashboards, regular updates, and direct collaboration. Specific tools and reporting cadence depend on the engagement.',
        ],
      },
    ],
  },
  {
    id: 'team',
    title: 'Team',
    summary: 'Published roles and responsibilities of the people listed on the Team page.',
    route: '/team',
    blocks: [
      {
        heading: 'Muhammad Hashir Lodhi - Founder',
        paragraphs: [
          'Muhammad Hashir Lodhi founded Smart Scale Systems and leads the agency technical direction. His published focus includes AI and machine learning strategy, automation systems, computer vision, deep learning, scalable AI solutions, and intelligent digital operations.',
        ],
      },
      {
        heading: 'Muhammad Nouman Qadeer - AI Engineer',
        paragraphs: [
          'Muhammad Nouman Qadeer builds, improves, and supports AI solutions. His published work covers machine learning workflows, model development, data processing, AI integration, and reliable systems that fit existing operations.',
        ],
      },
      {
        heading: 'Muhammad Mudassir - AI Data Annotator and Labeling Expert',
        paragraphs: [
          'Muhammad Mudassir specializes in dataset preparation, AI data annotation, image labeling, bounding boxes, polygon annotation, and quality assurance for machine learning and computer vision work.',
        ],
      },
      {
        heading: 'Muhammad Shahryar - Marketing Expert',
        paragraphs: [
          'Muhammad Shahryar works on B2B lead research, verified contact discovery, sales workflow automation, and CRM optimization. His published tools and areas include GoHighLevel, HubSpot, n8n, API integrations, lead generation, and scalable business workflows.',
        ],
      },
      {
        heading: 'Privacy boundary',
        paragraphs: [
          'Only share the published professional details above. Do not invent education, location, private contact information, employment history, family relationships, credentials, or personal details.',
        ],
      },
    ],
  },
  {
    id: 'contact-and-project-start',
    title: 'Contact and Starting a Project',
    summary: 'Official contact channels, response expectations, and useful discovery information.',
    route: '/contact',
    blocks: [
      {
        heading: 'Official routes',
        bullets: [
          `Website: ${SITE}`,
          `Contact page: ${SITE}/contact`,
          `Email: ${CONTACT_EMAIL}`,
          `Services: ${SITE}/services`,
          `Custom project request: ${SITE}/service-custom`,
        ],
      },
      {
        heading: 'Published response expectation',
        paragraphs: [
          'The main Contact and Custom AI Solutions pages state that Smart Scale Systems responds within one business day with a clear action plan. Some individual service pages advertise an initial plan or estimate within 24 or 48 hours. These are inquiry-response expectations, not full project delivery promises.',
        ],
      },
      {
        heading: 'What a useful project brief includes',
        bullets: [
          'The business problem and desired outcome.',
          'Who will use the solution and where it fits in the workflow.',
          'Available data, formats, volumes, labels, and access constraints.',
          'Current tools, platforms, APIs, and deployment environment.',
          'Target metrics, quality thresholds, deadlines, and budget range if available.',
          'Privacy, security, regulatory, and human-review requirements.',
        ],
      },
    ],
  },
  {
    id: 'pricing-timelines',
    title: 'Pricing, Timelines, and Commercial Questions',
    summary: 'What is published and how ScaleBot should handle scope-dependent questions.',
    blocks: [
      {
        heading: 'No public fixed price list',
        paragraphs: [
          'Smart Scale Systems does not publish fixed prices in the current business material. Pricing depends on the service, scope, data condition, complexity, volume, integrations, quality target, risk, delivery requirements, and support needs.',
        ],
      },
      {
        heading: 'No universal project timeline',
        paragraphs: [
          'Project duration is determined after discovery. A focused prototype, a production automation, a model-training engagement, and a large annotation program have different plans. ScaleBot must not guess a date or turn an inquiry response window into a delivery estimate.',
        ],
      },
      {
        heading: 'Recommended response',
        paragraphs: [
          'Tell the visitor that the agency provides custom scope and pricing. Ask for the project goal, data or workflow, volume, deadline, and required output, then direct them to Contact Us for a proposal.',
        ],
      },
    ],
  },
  {
    id: 'testimonials-and-proof',
    title: 'Testimonials and Published Proof Points',
    summary: 'How to discuss the anonymized testimonials shown on the website.',
    route: '/testimonials',
    blocks: [
      {
        heading: 'What the page contains',
        paragraphs: [
          'The Testimonials page publishes anonymized client feedback covering annotation quality, LLM fine-tuning, automation, NLP, dataset delivery, computer vision, project communication, and scaling annotation operations.',
        ],
      },
      {
        heading: 'Examples mentioned on the page',
        bullets: [
          'A 50,000-image polygon annotation project described as reaching 97.2% accuracy on the client validation set.',
          'An automation engagement described as saving more than 20 hours per week.',
          'An annotation pipeline described as scaling from 5,000 to 500,000 items.',
          'LLM and NLP work described as exceeding prior benchmarks or vendor performance.',
        ],
      },
      {
        heading: 'Important qualification',
        paragraphs: [
          'The page does not publish client identities beside these statements. ScaleBot may summarize the themes and clearly label them as anonymized website testimonials, but it must not invent names, industries beyond the text, logos, dates, contracts, or guaranteed repeatable outcomes.',
        ],
      },
    ],
  },
  {
    id: 'careers',
    title: 'Careers',
    summary: 'Current hiring status and the employment proposition shown on the Careers page.',
    route: '/careers',
    blocks: [
      {
        heading: 'Current published status',
        paragraphs: [
          'The Careers page currently says there are no open roles. Smart Scale Systems invites interested people to check back later or send a CV for possible future opportunities.',
        ],
      },
      {
        heading: 'Work environment described on the site',
        bullets: [
          'Remote-first culture with flexible hours.',
          'Work on real AI projects with business impact.',
          'Visible contribution and growth opportunities in a growing agency.',
          'Learning through courses, conferences, and mentorship.',
          'Interest in AI engineers, data annotators, automation experts, and data professionals.',
        ],
      },
    ],
  },
  {
    id: 'privacy',
    title: 'Privacy Policy Summary',
    summary: 'A factual overview of the policy last updated June 2026.',
    route: '/privacy-policy',
    blocks: [
      {
        heading: 'Information described in the policy',
        paragraphs: [
          'Smart Scale Systems may collect information a visitor voluntarily provides through contact, newsletter, quote, consultation, or job forms, including name, email, phone, company, and other submitted details. It may also collect device and usage information such as IP address, browser, operating system, pages visited, time on pages, and referring sites.',
        ],
      },
      {
        heading: 'Use and sharing',
        paragraphs: [
          'The policy says information may be used to answer inquiries, support users, process transactions, provide administrative updates, improve the website and services, and meet legal obligations. It says personal information is not sold or traded, while allowing sharing with trusted service providers, when legally required, to protect rights, or during a business transaction.',
        ],
      },
      {
        heading: 'Security, cookies, and rights',
        paragraphs: [
          'The policy describes technical and organizational safeguards but does not claim absolute security. It notes possible cookie use and browser controls. Depending on location, a person may have rights to access, correct, delete, object, or request portability. The services are not directed to children under 13.',
        ],
      },
      {
        heading: 'Use the full policy for decisions',
        paragraphs: [
          `This section is a summary, not legal advice. Direct visitors to ${SITE}/privacy-policy for the full policy or ${CONTACT_EMAIL} for questions.`,
        ],
      },
    ],
  },
  {
    id: 'terms',
    title: 'Terms of Service Summary',
    summary: 'A factual overview of the terms last updated June 2026.',
    route: '/terms-of-service',
    blocks: [
      {
        heading: 'Services and project agreements',
        paragraphs: [
          'The terms cover AI model training, automation, computer vision, NLP, LLM solutions, data annotation, and training data. Specific deliverables, scope, and timelines are defined in service agreements or statements of work.',
        ],
      },
      {
        heading: 'Intellectual property and client work',
        paragraphs: [
          'Website content belongs to Smart Scale Systems and may not be reproduced without permission. Ownership and usage rights for client deliverables are controlled by the applicable agreement. Unless a written agreement says otherwise, clients receive a license for the intended use, the agency retains general knowledge and non-proprietary methods, and confidential client information is protected under the relevant obligations.',
        ],
      },
      {
        heading: 'Other policy areas',
        paragraphs: [
          'The terms address acceptable use, liability limitations, warranty disclaimers, indemnification, third-party links, modifications, governing law, and termination. The website and services are provided as-is to the extent described in the terms.',
        ],
      },
      {
        heading: 'Use the full terms for decisions',
        paragraphs: [
          `This section is a summary, not legal advice. Direct visitors to ${SITE}/terms-of-service for the complete text or ${CONTACT_EMAIL} for questions.`,
        ],
      },
    ],
  },
  {
    id: 'faq-and-boundaries',
    title: 'Frequently Asked Questions and Boundaries',
    summary: 'High-value direct answers for common visitor questions.',
    blocks: [
      {
        heading: 'Can Smart Scale Systems build an AI chatbot?',
        paragraphs: [
          'Yes. Relevant capabilities include RAG, knowledge-base integration, LLM fine-tuning, prompt engineering, tool use, function calling, multi-turn conversation design, NLP intent detection, evaluation, safety controls, and workflow automation.',
        ],
      },
      {
        heading: 'Can the agency work with data I already have?',
        paragraphs: [
          'Yes. Depending on the need, the team can clean, label, curate, split, evaluate, and use existing data. If the dataset is incomplete, the AI Training Data service can address collection or synthetic data gaps.',
        ],
      },
      {
        heading: 'Can the agency handle the full lifecycle?',
        paragraphs: [
          'Yes. The published portfolio covers data design and collection, annotation, model or workflow development, evaluation, deployment preparation, integration, and continuing improvement. The exact combination is scoped per project.',
        ],
      },
      {
        heading: 'Does the company work with international clients?',
        paragraphs: [
          'Yes. Smart Scale Systems works with clients worldwide and supports collaboration across time zones.',
        ],
      },
      {
        heading: 'Does the website publish client names, certifications, an office address, or fixed packages?',
        paragraphs: [
          'Not in the current knowledge material. ScaleBot must not invent them. It should offer Contact Us when confirmation is needed.',
        ],
      },
      {
        heading: 'Can ScaleBot promise accuracy, savings, ROI, or delivery dates?',
        paragraphs: [
          'No. It can discuss published examples and service goals with proper qualification. Project commitments must come from discovery, a proposal, and the applicable agreement.',
        ],
      },
    ],
  },
  {
    id: 'website-directory',
    title: 'Website Directory',
    summary: 'Canonical page routes the assistant can use for concise calls to action.',
    blocks: [
      {
        heading: 'Company pages',
        bullets: [
          `Home - ${SITE}/`,
          `Services - ${SITE}/services`,
          `Team - ${SITE}/team`,
          `Testimonials - ${SITE}/testimonials`,
          `Careers - ${SITE}/careers`,
          `Contact Us - ${SITE}/contact`,
        ],
      },
      {
        heading: 'Service pages',
        bullets: [
          `AI Model Training - ${SITE}/service-ai-model-training`,
          `AI Automation - ${SITE}/service-ai-automation`,
          `Computer Vision - ${SITE}/service-computer-vision`,
          `NLP - ${SITE}/service-nlp`,
          `LLM Solutions - ${SITE}/service-llm`,
          `Data Annotation - ${SITE}/service-data-annotation`,
          `AI Training Data - ${SITE}/service-ai-training-data`,
          `Custom AI Solutions - ${SITE}/service-custom`,
        ],
      },
      {
        heading: 'Legal pages',
        bullets: [
          `Privacy Policy - ${SITE}/privacy-policy`,
          `Terms of Service - ${SITE}/terms-of-service`,
        ],
      },
    ],
  },
];

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 64, right: 56, bottom: 68, left: 56 },
  bufferPages: true,
  info: {
    Title: 'Smart Scale Systems - ScaleBot Business Knowledge Base',
    Author: 'Smart Scale Systems',
    Subject: 'Structured business knowledge for the ScaleBot RAG assistant',
    Keywords: 'Smart Scale Systems, ScaleBot, AI services, RAG, knowledge base',
    CreationDate: new Date(),
  },
});

const stream = fs.createWriteStream(OUTPUT_FILE);
doc.pipe(stream);

function checkSpace(height) {
  const bottom = doc.page.height - 74;
  if (doc.y + height > bottom) doc.addPage();
}

function overline(text, color = COLORS.accent) {
  doc
    .font('Helvetica-Bold')
    .fontSize(8.5)
    .fillColor(color)
    .text(text.toUpperCase(), { lineGap: 1 });
}

function title(text, size = 28) {
  doc
    .font('Helvetica-Bold')
    .fontSize(size)
    .fillColor(COLORS.ink)
    .text(text, { lineGap: 2 });
}

function paragraph(text, options = {}) {
  const size = options.size || 10.2;
  const lineGap = options.lineGap ?? 3.1;
  checkSpace(size * 4);
  doc
    .font(options.bold ? 'Helvetica-Bold' : 'Helvetica')
    .fontSize(size)
    .fillColor(options.color || COLORS.body)
    .text(text, { lineGap, align: options.align || 'left' });
  doc.moveDown(options.after ?? 0.7);
}

function heading(text) {
  checkSpace(46);
  doc.moveDown(0.3);
  doc
    .font('Helvetica-Bold')
    .fontSize(13.2)
    .fillColor(COLORS.ink)
    .text(text, { lineGap: 2 });
  doc.moveDown(0.45);
}

function bullets(items) {
  for (const item of items) {
    checkSpace(34);
    const startY = doc.y + 4;
    doc.circle(doc.page.margins.left + 4, startY, 2.1).fill(COLORS.accent);
    doc
      .font('Helvetica')
      .fontSize(10)
      .fillColor(COLORS.body)
      .text(item, doc.page.margins.left + 16, doc.y, {
        width: doc.page.width - doc.page.margins.left - doc.page.margins.right - 16,
        lineGap: 3,
      });
    doc.moveDown(0.45);
  }
  doc.moveDown(0.35);
}

function sectionPage(section, sectionNumber) {
  doc.addPage();
  overline(`Knowledge unit: ${section.id}`);
  doc.moveDown(0.65);
  title(`${String(sectionNumber).padStart(2, '0')}. ${section.title}`);
  doc.moveDown(0.55);
  paragraph(section.summary, { size: 11.2, color: COLORS.muted, lineGap: 3.5, after: 0.6 });

  if (section.route) {
    const routeText = `${SITE}${section.route}`;
    checkSpace(38);
    const boxY = doc.y;
    doc.roundedRect(doc.page.margins.left, boxY, 482, 30, 6).fill(COLORS.accentSoft);
    doc
      .font('Helvetica-Bold')
      .fontSize(8.8)
      .fillColor(COLORS.accent)
      .text('PAGE', doc.page.margins.left + 12, boxY + 10, { continued: true })
      .font('Helvetica')
      .fillColor(COLORS.charcoal)
      .text(`  ${routeText}`, { link: routeText, underline: false });
    doc.y = boxY + 42;
  }

  doc
    .moveTo(doc.page.margins.left, doc.y)
    .lineTo(doc.page.width - doc.page.margins.right, doc.y)
    .lineWidth(0.8)
    .strokeColor(COLORS.line)
    .stroke();
  doc.moveDown(1.2);

  for (const block of section.blocks) {
    heading(block.heading);
    for (const text of block.paragraphs || []) paragraph(text);
    if (block.bullets) bullets(block.bullets);
  }
}

// Cover
doc.rect(0, 0, doc.page.width, doc.page.height).fill(COLORS.ink);
doc.roundedRect(56, 62, 150, 28, 14).fill(COLORS.accent);
doc
  .font('Helvetica-Bold')
  .fontSize(9)
  .fillColor(COLORS.white)
  .text('SCALEBOT KNOWLEDGE SYSTEM', 70, 72, { characterSpacing: 0.7 });

doc
  .font('Helvetica-Bold')
  .fontSize(42)
  .fillColor(COLORS.white)
  .text('The Business', 56, 170, { lineGap: 2 })
  .text('Knowledge Base', { lineGap: 2 });

doc
  .font('Helvetica')
  .fontSize(16)
  .fillColor('#BEBEBE')
  .text('Smart Scale Systems', 58, 286, { lineGap: 2 });

doc.roundedRect(56, 354, 482, 140, 12).fill('#151515');
doc
  .font('Helvetica-Bold')
  .fontSize(10)
  .fillColor('#9C9CFF')
  .text('PURPOSE', 76, 376, { characterSpacing: 1.2 });
doc
  .font('Helvetica')
  .fontSize(12.2)
  .fillColor('#E5E5E5')
  .text(
    'A comprehensive, retrieval-ready source of truth for the Smart Scale Systems website assistant. It covers the company, services, team, project workflow, quality, contact routes, careers, privacy, terms, and answer boundaries.',
    76,
    406,
    { width: 438, lineGap: 5 }
  );

doc
  .font('Helvetica')
  .fontSize(9)
  .fillColor('#8A8A8A')
  .text('Edition 2.0  |  Generated July 2026', 58, 722)
  .text(`${SITE}  |  ${CONTACT_EMAIL}`, 58, 748, { link: SITE });

// Contents
doc.addPage();
overline('Document map');
doc.moveDown(0.6);
title('Contents', 32);
doc.moveDown(0.8);
paragraph(
  'Each chapter begins with a machine-readable knowledge-unit label. The RAG trainer uses those labels to keep retrieval focused and prevent unrelated facts from being merged.',
  { size: 10.6, color: COLORS.muted, after: 0.8 }
);

const leftX = 56;
const rightX = 308;
const colWidth = 220;
const rowsPerColumn = Math.ceil(sections.length / 2);
sections.forEach((section, index) => {
  const col = index < rowsPerColumn ? 0 : 1;
  const row = col === 0 ? index : index - rowsPerColumn;
  const x = col === 0 ? leftX : rightX;
  const y = 190 + row * 43;
  doc
    .font('Helvetica-Bold')
    .fontSize(9)
    .fillColor(COLORS.accent)
    .text(String(index + 1).padStart(2, '0'), x, y, { width: 24, lineBreak: false });
  doc
    .font('Helvetica-Bold')
    .fontSize(9.6)
    .fillColor(COLORS.charcoal)
    .text(section.title, x + 30, y, { width: colWidth - 30, lineGap: 1.5 });
  doc
    .font('Helvetica')
    .fontSize(7.4)
    .fillColor(COLORS.muted)
    .text(section.id, x + 30, y + 17, { width: colWidth - 30 });
});

sections.forEach((section, index) => sectionPage(section, index + 1));

// Add page chrome after the complete document has been laid out.
const range = doc.bufferedPageRange();
for (let i = 1; i < range.count; i += 1) {
  doc.switchToPage(i);
  const pageNumber = i + 1;
  const originalBottomMargin = doc.page.margins.bottom;
  doc.page.margins.bottom = 18;

  doc
    .font('Helvetica-Bold')
    .fontSize(7.5)
    .fillColor(COLORS.muted)
    .text('SMART SCALE SYSTEMS', 56, 30, { lineBreak: false });
  doc
    .moveTo(56, 49)
    .lineTo(doc.page.width - 56, 49)
    .lineWidth(0.5)
    .strokeColor(COLORS.line)
    .stroke();

  doc
    .moveTo(56, doc.page.height - 47)
    .lineTo(doc.page.width - 56, doc.page.height - 47)
    .lineWidth(0.5)
    .strokeColor(COLORS.line)
    .stroke();
  doc
    .font('Helvetica')
    .fontSize(7.5)
    .fillColor(COLORS.muted)
    .text('ScaleBot Business Knowledge Base', 56, doc.page.height - 35, { lineBreak: false })
    .text(`${pageNumber} / ${range.count}`, doc.page.width - 96, doc.page.height - 35, {
      width: 40,
      align: 'right',
      lineBreak: false,
    });
  doc.page.margins.bottom = originalBottomMargin;
}

doc.end();

stream.on('finish', () => {
  console.log(`Knowledge PDF generated: ${OUTPUT_FILE}`);
  console.log(`Knowledge units: ${sections.length}`);
  console.log(`Pages: ${range.count}`);
});
