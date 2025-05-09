(function () {
    const style = `
      #chatbot-box {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 300px;
        max-height: 350px;
        background: white;
        border: 1px solid #ccc;
        border-radius: 10px;
        padding: 10px;
        overflow-y: auto;
        font-family: sans-serif;
        box-shadow: 0 0 10px rgba(0,0,0,0.2);
        z-index: 9999;
        display: flex;
        flex-direction: column;
      }

      #chatbot-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 5px;
      }

      #chatbot-messages {
        flex: 1;
        overflow-y: auto;
        margin-bottom: 5px;
      }

      #chatbot-input {
        width: 90%;
        margin-top: 5px;
      }
    
       #chatbot-toggle {
        background: none;
        border: none;
        font-size: 16px;
        cursor: pointer;
      }
    `;

    const styleTag = document.createElement('style');
    styleTag.innerHTML = style;
    document.head.appendChild(styleTag);

    const chatBox = document.createElement('div');
    chatBox.id = 'chatbot-box';
    chatBox.innerHTML = `
    <div id="chatbot-header">
      <strong>Assistente Virtual</strong>
      <button id="chatbot-toggle">_</button>
    </div>  
    <div id="chatbot-messages"></div>
      <input type="text" id="chatbot-input" placeholder="Digite sua mensagem..." />
    `;
    document.body.appendChild(chatBox);

    const messagesDiv = document.getElementById('chatbot-messages');
    const input = document.getElementById('chatbot-input');
    const toggleBtn = document.getElementById('chatbot-toggle');

    let minimized = false;

    toggleBtn.addEventListener('click', () =>{
        minimized = !minimized;
        messagesDiv.style.display = minimized ? 'none' : 'block';
        input.style.display = minimized ? 'none' : 'block';
        toggleBtn.textContent = minimized ? '+' : '_';
    })

    input.addEventListener('keydown', async function (e) {
        if (e.key === 'Enter') {
            const userMessage = input.value.trim();
            if (!userMessage) return;

            messagesDiv.innerHTML += `<div><strong>Você:</strong> ${userMessage}</div>`;
            input.value = '';
            
            const response = await fetch('http://localhost:8080/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage })
            });

            const data = await response.json();
            messagesDiv.innerHTML += `<div><strong>Bot:</strong> ${data.message}</div>`;
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }
    });
})();
