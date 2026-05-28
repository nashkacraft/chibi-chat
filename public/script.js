// Chibi Chat — simple vanilla JS game engine (public build)
// Loads conversation from local `data/conversations.json` and uses `assets/` for images.

const EMOTION_MAP = {
  normal: 'assets/normal.png',
  happy: 'assets/happy.png',
  veryhappy: 'assets/very.happy.png',
  sad: 'assets/cry.png',
  angry: 'assets/angry.png',
  smirk: 'assets/smirk.png',
  confused: 'assets/confusion.png',
  uncomfortable: 'assets/uncomfortable.or.hurt.png',
};

const DOM = {
  dialogueText: () => document.getElementById('dialogueText'),
  choices: () => document.getElementById('choices'),
  character: () => document.getElementById('character'),
  replayBtn: () => document.getElementById('replayBtn'),
};

let conversation = null;
let gameState = null;

async function init() {
  try {
    const res = await fetch('data/conversations.json');
    conversation = await res.json();
  } catch (e) {
    console.error('Failed to load conversations.json', e);
    DOM.dialogueText().textContent = 'Failed to load game data.';
    return;
  }

  preloadImages(Object.values(EMOTION_MAP).concat(['assets/background.jpg'])).then(() => {
    startNewGame();
    attachUIHandlers();
  });
}

function preloadImages(urls) {
  const promises = urls.map(
    (u) =>
      new Promise((res) => {
        const img = new Image();
        img.src = u;
        img.onload = img.onerror = res;
      })
  );
  return Promise.all(promises);
}

function startNewGame() {
  gameState = {
    currentNodeId: conversation.start || 'start',
    friendship: 50,
    emotion: 'normal',
    history: [],
  };
  renderCurrentNode();
}

function getNode(id) {
  return conversation.nodes.find((n) => n.id === id);
}

function renderCurrentNode() {
  const node = getNode(gameState.currentNodeId);
  if (!node) {
    DOM.dialogueText().textContent = '...';
    return;
  }

  DOM.dialogueText().textContent = node.text;
  DOM.choices().innerHTML = '';
  if (!node.choices || node.choices.length === 0) {
    showEnding();
    return;
  }

  node.choices.slice(0, 3).forEach((choice, idx) => {
    const btn = document.createElement('button');
    btn.textContent = `${idx + 1}. ${choice.text}`;
    btn.setAttribute('data-choice', choice.id);
    btn.onclick = () => applyChoice(choice);
    DOM.choices().appendChild(btn);
  });
}

function applyChoice(choice) {
  if (typeof choice.friendshipDelta === 'number') {
    gameState.friendship = Math.max(
      0,
      Math.min(100, gameState.friendship + choice.friendshipDelta)
    );
  }
  if (choice.emotion) {
    setEmotion(choice.emotion);
  }
  gameState.history.push({
    node: gameState.currentNodeId,
    choice: choice.id,
    friendship: gameState.friendship,
  });
  if (choice.nextId) {
    gameState.currentNodeId = choice.nextId;
    renderCurrentNode();
  } else {
    showEnding();
  }
}

function setEmotion(em) {
  gameState.emotion = em || 'normal';
  const img = DOM.character();
  const src = EMOTION_MAP[gameState.emotion] || EMOTION_MAP.normal;
  img.className = 'character ' + (gameState.emotion || '');
  img.src = src;
}

function showEnding() {
  const node = getNode(gameState.currentNodeId) || {};
  const base = node.endings || {};
  let tier = 'neutral';
  if (gameState.friendship >= 70) tier = 'good';
  else if (gameState.friendship <= 35) tier = 'bad';
  const endingText = base[tier] || defaultEndings()[tier];
  DOM.dialogueText().textContent = endingText;
  DOM.choices().innerHTML = '';
  const replay = document.createElement('button');
  replay.textContent = 'Play again';
  replay.onclick = startNewGame;
  DOM.choices().appendChild(replay);
}

function defaultEndings() {
  return {
    good: 'You two ended the chat with smiles — you made a new friend!',
    neutral: "The conversation ended on a friendly note. Maybe next time you'll be closer.",
    bad: "The chat was awkward. You didn't quite click this time.",
  };
}

function attachUIHandlers() {
  DOM.replayBtn().addEventListener('click', startNewGame);
  window.addEventListener('keydown', (e) => {
    if (document.activeElement && document.activeElement.tagName === 'INPUT') return;
    const k = e.key;
    if (['1', '2', '3'].includes(k)) {
      const idx = Number(k) - 1;
      const btn = DOM.choices().children[idx];
      if (btn) btn.click();
    }
  });
}

window.addEventListener('DOMContentLoaded', init);
