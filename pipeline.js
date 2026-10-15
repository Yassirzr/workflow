/* Logique métier indépendante du navigateur : elle peut être testée avec Node.js. */
(function (scope) {
  'use strict';

  const STAGES = Object.freeze([
    Object.freeze({ icon: '⌁', title: 'Récupération du code', description: 'actions/checkout récupère le dépôt.' }),
    Object.freeze({ icon: '✧', title: 'Vérification du code', description: 'npm run lint et npm test.' }),
    Object.freeze({ icon: '▤', title: 'Construction du site', description: 'npm run build génère le dossier dist/.' }),
    Object.freeze({ icon: '▣', title: 'Construction Docker', description: 'Une image Nginx contient le site final.' }),
    Object.freeze({ icon: '↥', title: 'Publication de l’image', description: 'Push sur GitHub Container Registry (GHCR).' })
  ]);

  function progressPercent(completed, total) {
    if (!Number.isInteger(total) || total <= 0) throw new RangeError('total doit être un entier positif');
    if (!Number.isFinite(completed)) throw new TypeError('completed doit être un nombre');
    return Math.round(Math.min(1, Math.max(0, completed / total)) * 100);
  }

  function stageStatus(index, completed, active) {
    if (index < completed) return 'done';
    if (index === active) return 'active';
    return 'pending';
  }

  const api = Object.freeze({ STAGES, progressPercent, stageStatus });
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  if (typeof window !== 'undefined') scope.CIDemo = api;
})(typeof globalThis !== 'undefined' ? globalThis : this);
