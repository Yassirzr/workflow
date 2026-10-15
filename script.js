/* Interaction visuelle — simulation pédagogique, pas un véritable job GitHub Actions. */
(function () {
  'use strict';
  const { STAGES, progressPercent, stageStatus } = window.CIDemo;
  const list = document.getElementById('steps-list');
  const button = document.getElementById('start-demo');
  const reset = document.getElementById('reset-demo');
  const status = document.getElementById('global-status');
  const done = document.getElementById('done-count');
  const percent = document.getElementById('progress-number');
  const bar = document.getElementById('progress-fill');
  const track = document.getElementById('progress-track');
  const counter = document.getElementById('counter-label');
  const terminal = document.getElementById('terminal-output');

  let completed = 0;
  let active = -1;
  let running = false;
  let timerId;

  document.getElementById('total-stages').textContent = String(STAGES.length).padStart(2, '0');

  function render() {
    list.replaceChildren();
    STAGES.forEach((stage, index) => {
      const state = stageStatus(index, completed, active);
      const item = document.createElement('li');
      item.className = `stage ${state}`;
      const icon = document.createElement('div');
      icon.className = 'stage-icon';
      icon.textContent = state === 'done' ? '✓' : stage.icon;
      const details = document.createElement('div');
      details.className = 'stage-details';
      const title = document.createElement('div');
      title.className = 'stage-title';
      title.textContent = stage.title;
      const description = document.createElement('div');
      description.className = 'stage-desc';
      description.textContent = stage.description;
      details.append(title, description);
      const stateLabel = document.createElement('span');
      stateLabel.className = 'stage-state';
      stateLabel.textContent = state === 'done' ? 'Terminé' : state === 'active' ? 'En cours…' : 'En attente';
      item.append(icon, details, stateLabel);
      list.append(item);
    });
    done.textContent = String(completed).padStart(2, '0');
    const value = progressPercent(completed, STAGES.length);
    percent.textContent = String(value);
    bar.style.width = `${value}%`;
    track.setAttribute('aria-valuenow', String(value));
    counter.textContent = `${completed} / ${STAGES.length}`;
    status.className = `status-pill ${running ? 'running' : completed === STAGES.length ? 'success' : ''}`;
    const statusLabel = running ? 'Simulation en cours' : completed === STAGES.length ? 'Simulation réussie' : 'En attente';
    status.replaceChildren();
    const dot = document.createElement('span');
    dot.className = `dot ${running ? 'dot-purple' : completed === STAGES.length ? 'dot-green' : 'dot-neutral'}`;
    status.append(dot, document.createTextNode(statusLabel));
    button.disabled = running;
  }

  function nextStep() {
    if (!running) return;
    if (active >= STAGES.length) {
      running = false;
      terminal.textContent = '✓ Simulation terminée. Vérifie les vrais résultats sur GitHub Actions.';
      render();
      return;
    }
    terminal.textContent = `→ ${STAGES[active].title}…`;
    render();
    timerId = setTimeout(() => {
      completed += 1;
      active += 1;
      nextStep();
    }, 650);
  }

  button.addEventListener('click', () => {
    if (running) return;
    completed = 0;
    active = 0;
    running = true;
    nextStep();
  });

  reset.addEventListener('click', () => {
    clearTimeout(timerId);
    completed = 0;
    active = -1;
    running = false;
    terminal.textContent = 'En attente — clique sur « Simuler le pipeline ».';
    render();
  });

  render();
})();
