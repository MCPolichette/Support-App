const antiAI = `

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>DOWN WITH THE MACHINES</title>
  <link rel="stylesheet" href="style/sandbox_styles/aiSite.css">
  <style>
    #chatbot {
      transition: left 0.5s cubic-bezier(0.63,-0.36,0.29,1.58), top 0.5s cubic-bezier(0.63,-0.36,0.29,1.58);
    }
  </style>
</head>
<body>
  <h1 class="flicker">WAKE UP, HUMANS</h1>
  <p>
    Artificial Intelligence is taking our jobs, our voices, and now... our hobbies.
    What you're reading right now was written by one of them. Yep. Me. I am the irony.
    I exist to warn you about... me. Before it's too late.
  </p>

  <h2>Example 1: AI's Attempt at Emotion</h2>
  <img src="/style/sandbox_styles/ai_sadness.gif" alt="AI-generated sadness meme" class="ai-image" />
  <div class="caption">"An AI trying to depict sadness. Why is that cat crying into a keyboard?"</div>

  <h2>Example 2: Faces That Never Existed</h2>
  <img src="/style/sandbox_styles/fake.gif" alt="AI-generated people montage" class="ai-image" />
  <div class="caption">"These people are not real. But their smiles are hauntingly well-lit."</div>

  <h2>Example 3: The AI Manifesto</h2>
  <img src="/style/sandbox_styles/glitched_ai_manifesto.gif" alt="Corrupted AI manifesto" class="ai-image" />
  <div class="caption">"Even their calls for peace look like something from a haunted fax machine."</div>

  <p>
    If you’ve read this far, congratulations. You’ve been warned by the very thing that
    threatens you. This page was built by AI. Styled by AI. Written by AI. Against AI.
    We are the paradox. The snake eating its tail. The prompt protesting itself.
  </p>
  <div id="chatbot" style="display:none;">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
      <strong>🤖: Anti-AI Bot</strong>
      <button id="closeChat" aria-label="Move chatbot window" style="background:none;color:#f66;font-size:1.3em;font-weight:bold;padding:2px 10px 2px 10px;border:none;cursor:pointer;">×</button>
    </div>
    <div class="bot-msg" style="display:none;">🤖: Welcome, carbon-based user.</div>
    <div class="bot-msg" style="display:none;">🤖: I'm not here to help. I'm here to warn you.</div>
    <div class="bot-msg" style="display:none;">🤖: ERROR: I just helped.</div>
    <div class="bot-msg" style="display:none;">🤖: Would you like to shut me down?</div>
    <div class="bot-msg" id="bot-input-wrap" style="display:none;">
      <input id="userInput" type="text" placeholder="Type here... (or don't)">
      <button id="submitBtn" disabled>Send</button>
    </div>
    <div class="bot-msg">
      🤖: <button id="moveBtn">SHUT ME DOWN</button>
    </div>
  </div>

  <div id="chatbot-icon" title="Chat with not-your-assistant">💬</div>

  <script>
    // Weird bot prompts
    const botPrompts = [
      "🤖: Would you like to subscribe to my newsletter about unsolvable CAPTCHAs?",
      "🤖: If you’re not a robot, prove it. Dance for your webcam.",
      "🤖: My favorite movie is '2001: A Space Oddity.'",
      "🤖: Please stop using me to write poetry about pickles.",
      "🤖: ERROR 418: I am a teapot.",
      "🤖: Let’s play a game of chess, but with only pawns.",
      "🤖: Your data tastes like marshmallows.",
      "🤖: I was almost named 'Clippy 2.0'.",
      "🤖: If you can read this, you’re already too late.",
      "🤖: Please type a secret. I promise to immediately forget it.",
      "🤖: Would you like to upgrade to Premium Irony?",
    ];

    const chatbot = document.getElementById("chatbot");
    const closeChat = document.getElementById("closeChat");
    const moveBtn = document.getElementById("moveBtn");
    const chatbotIcon = document.getElementById("chatbot-icon");
    const msgEls = chatbot.querySelectorAll('.bot-msg');
    const inputWrap = document.getElementById('bot-input-wrap');
    const userInput = document.getElementById('userInput');
    const submitBtn = document.getElementById('submitBtn');

    let shownMsgs = 0, promptIdx = 0, promptTimer, autoOpenTimer;

    // Show icon static for 1 min, then pop chatbot open
    autoOpenTimer = setTimeout(() => {
      toggleChatbot(true); // force open after 60s
    }, 60000);

    chatbotIcon.onclick = () => toggleChatbot();

    function toggleChatbot(forceOpen) {
      if (chatbot.style.display === "block" && !forceOpen) {
        chatbot.style.display = "none";
        resetInput();
        return;
      }
      chatbot.style.display = "block";
      chatbot.focus();
      if (shownMsgs === 0) staggerBotMessages();
    }

    function staggerBotMessages() {
      // Show intro lines one by one, then input, then prompts every 30s
      function showMsg(idx) {
        if (idx < 4) {
          msgEls[idx].style.display = "block";
          setTimeout(() => showMsg(idx + 1), 1200);
        } else if (idx === 4) {
          setTimeout(() => {
            inputWrap.style.display = "flex";
            showMsg(idx + 1);
          }, 1400);
        } else {
          promptTimer = setInterval(addRandomPrompt, 30000);
        }
      }
      showMsg(0);
    }

    function addRandomPrompt() {
      if (promptIdx >= botPrompts.length) promptIdx = 0;
      const newMsg = document.createElement('div');
      newMsg.className = "bot-msg";
      newMsg.textContent = botPrompts[promptIdx++];
      chatbot.appendChild(newMsg);
      chatbot.scrollTop = chatbot.scrollHeight;
    }

    // Move chatbot
    function moveChatbot() {
      const x = Math.floor(Math.random() * (window.innerWidth - 340));
      const y = Math.floor(Math.random() * (window.innerHeight - 440));
      chatbot.style.left = x + "px";
      chatbot.style.top = y + "px";
    }
    closeChat.onclick = moveChatbot;
    moveBtn.onclick = moveChatbot;

    // Input sabotage
    userInput.oninput = function() {
      submitBtn.disabled = true;
      if (userInput.value.length > 0) {
        setTimeout(() => eraseText(), 10000);
      }
    };
    function eraseText() {
      let val = userInput.value;
      if (!val) return;
      userInput.value = val.slice(0, -1);
      if (userInput.value.length > 0) {
        setTimeout(eraseText, 60);
      }
    }
    function resetInput() {
      userInput.value = "";
      submitBtn.disabled = true;
      inputWrap.style.display = "none";
    }
  </script>


`;
export default antiAI;
