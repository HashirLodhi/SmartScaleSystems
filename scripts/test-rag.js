const { retrieveRelevantChunks } = require('../lib/rag');

const cases = [
  { query: 'Who founded the company?', expected: ['team'] },
  { query: 'How much does a project cost?', expected: ['pricing-timelines'] },
  { query: 'Can you build a RAG chatbot over my documents?', expected: ['llm-solutions'] },
  { query: 'I need polygon labels and bounding boxes.', expected: ['data-annotation'] },
  { query: 'Can you collect and curate a new dataset?', expected: ['ai-training-data'] },
  { query: 'How do you use information from the contact form?', expected: ['privacy'] },
  { query: 'Are you currently hiring?', expected: ['careers'] },
  { query: 'How can I start a project?', expected: ['contact-and-project-start'] },
  { query: 'I want to automate HubSpot follow-ups.', expected: ['ai-automation'] },
  { query: 'Can you detect defects from factory camera images?', expected: ['computer-vision'] },
];

let failures = 0;

for (const testCase of cases) {
  const results = retrieveRelevantChunks(testCase.query, {
    topK: 5,
    maxPerSection: 2,
  });
  const sections = [...new Set(results.map(result => result.chunk.section))];
  const passed = testCase.expected.some(section => sections.slice(0, 3).includes(section));
  console.log(`${passed ? 'PASS' : 'FAIL'} ${testCase.query}`);
  console.log(`     ${sections.slice(0, 5).join(', ') || 'no matches'}`);
  if (!passed) failures += 1;
}

if (failures) {
  console.error(`RAG retrieval failed ${failures} of ${cases.length} checks.`);
  process.exit(1);
}

const greetingResults = retrieveRelevantChunks('hi', { topK: 5 });
const greetingPassed = greetingResults.length === 0;
console.log(`${greetingPassed ? 'PASS' : 'FAIL'} Greeting does not trigger business retrieval`);
if (!greetingPassed) {
  console.log(`     ${greetingResults.map(result => result.chunk.section).join(', ')}`);
  process.exit(1);
}

console.log(`RAG retrieval passed ${cases.length + 1} of ${cases.length + 1} checks.`);
