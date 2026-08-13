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
    /no open roles/,
    /careers/,
  ]);

  if (process.exitCode) {
    throw new Error('ScaleBot fallback regression checks failed.');
  }
  console.log('ScaleBot conversation behavior passed 5 of 5 checks.');
}

main()
  .catch(error => {
    console.error(error.message);
    process.exit(1);
  })
  .finally(() => {
    if (originalApiKey) process.env.GROQ_API_KEY = originalApiKey;
  });
