const { createChatReply } = require('../lib/chat-service');

const originalApiKey = process.env.GROQ_API_KEY;
delete process.env.GROQ_API_KEY;

async function check(label, query, assertions) {
  const result = await createChatReply(query, []);
  const reply = result.reply.toLowerCase();
  const failures = assertions.filter(assertion => (
    typeof assertion === 'function' ? !assertion(reply, result) : !assertion.test(reply)
  ));
  const passed = typeof result.reply === 'string' && failures.length === 0;
  console.log(`${passed ? 'PASS' : 'FAIL'} ${label}`);
  if (!passed) {
    console.log(result.reply);
    process.exitCode = 1;
  }
}

async function main() {
  await check('greeting stays conversational', 'hi', [
    /hi! how can i help/,
    reply => !/hashir|founder|contact and project start/.test(reply),
  ]);
  await check('person-specific founder answer', 'Who is Hashir?', [
    /muhammad hashir lodhi/,
    /founder/,
  ]);
  await check('calm profanity handling', 'Fuck you!', [
    /still here to help/,
  ]);
  await check(
    'combined automation and pricing answer',
    'I run support in HubSpot. What can you automate and how much does it cost?',
    [/ai automation/, /hubspot/, /pricing is custom/, /contact us/]
  );
  await check('careers answer', 'Are you hiring?', [
    /does not currently publish/,
    /hiring or careers page/,
  ]);
  await check('service discovery asks focused scoping questions', 'Which service should I use?', [
    /two details/,
    (_reply, result) => result.intent === 'discovery',
    (_reply, result) => result.actions.some(action => action.href === '/services'),
    (_reply, result) => result.suggestions.length >= 2,
  ]);
  await check('chatbot request recommends LLM service and useful follow-ups', 'I need a chatbot for our company knowledge base', [
    (_reply, result) => result.intent === 'llm',
    (_reply, result) => result.actions.some(action => action.href === '/services/llm'),
    (_reply, result) => result.suggestions.some(item => /accuracy|knowledge/i.test(item)),
  ]);
  await check('grocery ordering receives a practical automation plan', 'I have a grocery store and want to automate ordering. What should I do?', [
    /inventory-based automatic reordering/,
    /pos/,
    /supplier/,
    /50-100 products/,
    /smart scale systems can help/,
    /ai automation service/,
    (_reply, result) => result.intent === 'ordering',
    (_reply, result) => result.actions.some(action => action.href === '/services/ai-automation'),
    reply => !/contact and starting a project official|page https:/.test(reply),
  ]);
  const matureConversation = await createChatReply('What should we do next?', [
    { role: 'user', content: 'We need to automate lead follow-up.' },
    { role: 'assistant', content: 'AI Automation is a strong fit.' },
    { role: 'user', content: 'We use HubSpot and n8n.' },
    { role: 'assistant', content: 'Those tools can be integrated.' },
  ]);
  if (!matureConversation.actions.some(action => action.href === '/contact')) {
    throw new Error('ScaleBot did not offer a project action after a mature conversation.');
  }

  if (process.exitCode) {
    throw new Error('ScaleBot fallback regression checks failed.');
  }
  console.log('ScaleBot conversation behavior passed 9 of 9 checks.');
}

main()
  .catch(error => {
    console.error(error.message);
    process.exit(1);
  })
  .finally(() => {
    if (originalApiKey) process.env.GROQ_API_KEY = originalApiKey;
  });
