'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { STAGES, progressPercent, stageStatus } = require('../pipeline.js');
const root = path.resolve(__dirname, '..');

test('le pipeline contient exactement cinq étapes', () => {
  assert.equal(STAGES.length, 5);
  for (const stage of STAGES) {
    assert.ok(stage.title);
    assert.ok(stage.description);
  }
});

test('la progression démarre à 0 %', () => assert.equal(progressPercent(0, 5), 0));
test('la progression atteint 60 % après trois étapes', () => assert.equal(progressPercent(3, 5), 60));
test('la progression se termine à 100 %', () => assert.equal(progressPercent(5, 5), 100));
test('la progression reste limitée à 0–100 %', () => {
  assert.equal(progressPercent(-1, 5), 0);
  assert.equal(progressPercent(9, 5), 100);
});
test('un total nul est refusé', () => assert.throws(() => progressPercent(1, 0), RangeError));
test('le statut distingue terminé, actif et en attente', () => {
  assert.equal(stageStatus(0, 2, 2), 'done');
  assert.equal(stageStatus(2, 2, 2), 'active');
  assert.equal(stageStatus(4, 2, 2), 'pending');
});
test('les trois ressources du site existent', () => {
  for (const name of ['style.css', 'script.js', 'pipeline.js']) {
    assert.ok(fs.statSync(path.join(root, name)).size > 0);
  }
});
test('la page HTML référence les scripts et la feuille de style', () => {
  const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  assert.match(html, /lang="fr"/);
  assert.match(html, /src="pipeline\.js"/);
  assert.match(html, /src="script\.js"/);
  assert.match(html, /href="style\.css"/);
});
