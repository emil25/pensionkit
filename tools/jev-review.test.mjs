import test from 'node:test';
import assert from 'node:assert/strict';
import { ENDPOINT, QUESTIONS, reviewRequest, interpretReview, runReview } from './jev-review.mjs';

const input = { userRequest: 'Small guesthouse fees', changeSummary: 'Arrival-month overview', checks: 'Unit tests passed', privateBookings: 'must not be sent' };
const response = () => ({ model: 'jev-test', answers: Object.fromEntries(Object.entries(QUESTIONS).map(([id, question]) => {
  const options = Object.keys(question.criteria);
  return [id, { type: 'choice', choice: options[0], confidence: 1, probabilities: Object.fromEntries(options.map((option, i) => [option, i === 0 ? 1 : 0])) }];
})) });

test('Preview whitelists deliberate descriptions and rejects missing or excessive input', () => {
  assert.deepEqual(Object.keys(reviewRequest(input).state), ['userRequest', 'changeSummary', 'checks']);
  assert.ok(!JSON.stringify(reviewRequest(input)).includes('must not be sent'));
  assert.throws(() => reviewRequest({ ...input, checks: '' }));
  assert.throws(() => reviewRequest({ ...input, checks: 'a'.repeat(12001) }));
});
test('Missing credentials prevent a network call', async () => {
  let called = false;
  await assert.rejects(runReview(input, { fetchImpl: async () => { called = true; } }), /TYPESAFE_API_KEY/);
  assert.equal(called, false);
});
test('Live adapter uses the official endpoint and returns advice without execution authority', async () => {
  const result = await runReview(input, { apiKey: 'test-only-key', fetchImpl: async (url, options) => {
    assert.equal(url, ENDPOINT);
    assert.equal(options.headers.Authorization, 'Bearer test-only-key');
    assert.equal(JSON.parse(options.body).model, 'jev-latest');
    assert.ok(!options.body.includes('must not be sent'));
    return { ok: true, json: async () => response() };
  } });
  assert.equal(result.advisoryOnly, true);
  assert.equal(result.status, 'developer-review-required');
});
test('Invalid answers and provider failures are surfaced without leaking remote error bodies', async () => {
  const malformed = response();
  malformed.answers.scope_fit.choice = 'deploy-now';
  assert.throws(() => interpretReview(malformed), /érvénytelen/);
  const invalidProbability = response();
  invalidProbability.answers.review_focus.probabilities.money = 0.2;
  assert.throws(() => interpretReview(invalidProbability));
  await assert.rejects(runReview(input, { apiKey: 'test', fetchImpl: async () => ({ ok: false, status: 401, text: () => 'secret' }) }), { message: 'A Jev kérés nem sikerült (HTTP 401).' });
  const uncertain = response();
  uncertain.answers.scope_fit.confidence = 0.1;
  assert.equal(interpretReview(uncertain).status, 'developer-review-required');
});
