const inputBox = document.getElementById('inputBox');
const sendBtn = document.getElementById('sendBtn');
const messages = document.getElementById('messages');

sendBtn.addEventListener('click', handleSend);
inputBox.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); handleSend(); } });

let typingEl = null;

async function handleSend() {
    const txt = inputBox.value.trim();
    if (!txt) return;

    appendMessage(txt, 'user');
    inputBox.value = '';

    showTypingIndicator();

    try {
        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: txt })
        });
        const data = await res.json();
        hideTypingIndicator();
        appendMessage(data.reply || 'No response', 'bot');
    } catch (err) {
        console.error(err);
        hideTypingIndicator();
        appendMessage('Error: Could not reach server', 'bot');
    }
}

function appendMessage(text, who) {
    const el = document.createElement('div');
    el.className = 'msg ' + (who === 'user' ? 'user' : 'bot');
    text.split('\n').forEach(line => {
        const p = document.createElement('div');
        p.textContent = line;
        el.appendChild(p);
    });

    const meta = document.createElement('div');
    meta.className = 'msg-meta';
    meta.textContent = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    el.appendChild(meta);

    messages.appendChild(el);
    messages.parentElement.scrollTop = messages.parentElement.scrollHeight;
}

function showTypingIndicator() {
    if (typingEl) return;
    typingEl = document.createElement('div');
    typingEl.className = 'msg bot';
    const t = document.createElement('div');
    t.className = 'typing';
    t.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
    typingEl.appendChild(t);
    messages.appendChild(typingEl);
    messages.parentElement.scrollTop = messages.parentElement.scrollHeight;
}

function hideTypingIndicator() {
    if (!typingEl) return;
    messages.removeChild(typingEl);
    typingEl = null;
}
