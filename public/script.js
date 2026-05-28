// Chibi Chat - simple vanilla JS game engine (public build)
// Loads conversation from local `data/conversations.json` and uses `assets/` for images.

// Map all available emotion/pose images from task/assets into named keys.
const EMOTION_MAP = {
  normal: 'assets/normal.png',
  happy: 'assets/happy.png',
  veryhappy: 'assets/very.happy.png',
  cry: 'assets/cry.png',
  angry: 'assets/angry.png',
  smirk: 'assets/smirk.png',
  confusion: 'assets/confusion.png',
  uncomfortable: 'assets/uncomfortable.or.hurt.png',
  creepy: 'assets/creepy.talking.png',
  fake: 'assets/fake.smile.png',
  talk1: 'assets/talking.one.png',
  talk2: 'assets/talking.two.png',
};

const DOM = {
  dialogueText: () => document.getElementById('dialogueText'),
  choices: () => document.getElementById('choices'),
  character: () => document.getElementById('character'),
  replayBtn: () => document.getElementById('replayBtn'),
  friendshipFill: () => document.getElementById('friendshipFill'),
  friendshipValue: () => document.getElementById('friendshipValue'),
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

  // Preload all emotion images plus background for smooth swaps
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
    // track selected choice ids for secret-sequence checking
    choicesTaken: [],
  };
  renderCurrentNode();
  updateFriendshipUI();
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
  // reflect friendship change immediately in the UI
  updateFriendshipUI();
  if (choice.emotion) {
    setEmotion(choice.emotion);
  }
  gameState.history.push({
    node: gameState.currentNodeId,
    choice: choice.id,
    friendship: gameState.friendship,
  });
  if (choice.id) gameState.choicesTaken.push(choice.id);
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

  // Secret ending check: requires both high friendship and matching secret sequence (option C)
  const secretSeq = conversation.secretSequence || [];
  const hasSequence = checkSequence(secretSeq, gameState.choicesTaken);
  const highFriend = gameState.friendship >= 90;
  if (highFriend && hasSequence && base.secret) {
    DOM.dialogueText().textContent = base.secret;
    renderFinalChoices();
    return;
  }

  // Four main tiers: bad, neutral, good, best
  let tier = 'neutral';
  if (gameState.friendship >= 75) tier = 'best';
  else if (gameState.friendship >= 50) tier = 'good';
  else if (gameState.friendship <= 25) tier = 'bad';

  const endingText = base[tier] || defaultEndings()[tier];
  DOM.dialogueText().textContent = endingText;
  renderFinalChoices();
}

function renderFinalChoices() {
  DOM.choices().innerHTML = '';
  const replay = document.createElement('button');
  replay.textContent = 'Play again';
  replay.onclick = startNewGame;
  DOM.choices().appendChild(replay);
}

// Check whether `seq` appears as a subsequence inside `taken` (order matters)
function checkSequence(seq, taken) {
  if (!seq || seq.length === 0) return false;
  let i = 0;
  for (const id of taken) {
    if (id === seq[i]) i++;
    if (i === seq.length) return true;
  }
  return false;
}

function defaultEndings() {
  return {
    bad: "The chat was awkward. You didn't quite click this time.",
    neutral: "The conversation ended on a friendly note. Maybe next time you'll be closer.",
    good: 'Kiko waves happily - you made a friend!',
    best: "Kiko hugs you warmly - you're best friends now!",
    secret: 'A secret moment unfolds... you discovered a hidden ending!',
  };
}

function attachUIHandlers() {
  DOM.replayBtn().addEventListener('click', startNewGame);
  window.addEventListener('keydown', (e) => {
    if (document.activeElement && document.activeElement.tagName === 'INPUT') return;
    const k = e.key;
    // allow number keys for choices and R for replay
    if (['1', '2', '3', '4', '5'].includes(k)) {
      const idx = Number(k) - 1;
      const btn = DOM.choices().children[idx];
      if (btn) btn.click();
    }
    if (k.toLowerCase() === 'r') startNewGame();
  });
}

window.addEventListener('DOMContentLoaded', init);

// Update friendship UI: fill bar and numeric value
function updateFriendshipUI() {
  const val = Math.max(0, Math.min(100, Math.round(gameState.friendship || 0)));
  const fill = DOM.friendshipFill();
  const num = DOM.friendshipValue();
  if (fill) fill.style.width = val + '%';
  if (num) num.textContent = String(val);
}
