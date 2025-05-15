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
      <strong>Assistente Master</strong>
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

	toggleBtn.addEventListener('click', () => {
		minimized = !minimized;
		messagesDiv.style.display = minimized ? 'none' : 'block';
		input.style.display = minimized ? 'none' : 'block';
		toggleBtn.textContent = minimized ? '+' : '_';
	})


	// Gerador de ID para usuários não logados
	function generateAnonymousUserID() {
		// Gera um ID único baseado em timestamp + random (persistente no localStorage)
		const storageKey = 'chatbotAnonymousID';
		let userID = localStorage.getItem(storageKey);

		if (!userID) {
			userID = 'anon_' + Date.now() + '-' + Math.random().toString(36).substring(2, 9);
			localStorage.setItem(storageKey, userID);
		}
		return userID;
	}

	// Detecção de usuário logado (integração com site do cliente)
	function getClientUserID() {

		// Caso 1: site do cliente define uma variável global
		if (window.chatbotConfig?.userID) {
			return window.chatbotConfig.userID;
		}

		// Caso 2: site injeta um atributo no html
		const widgetContainer = document.getElementById('chatbot-widget');
		if (widgetContainer?.dataset.userID) {
			return widgetContainer.dataset.userID;
		}

		// Caso 3: site usa JWT ou cookie acessível (requer mesma origem ou config do CORS)
		try {
			const jwt = localStorage.getItem('cliente_jwt');
			if (jwt) {
				const payload = JSON.parse(atob(jwt.split('.')[1]));
				return payload.userID;
			}
		} catch (e) {
			console.warn("Não foi possível ler o JWT", e);
		}

		return null; // Usuário não logado
	}

	// Dtermina o userID (prioriza o usuário logado)
	const userID = getClientUserID() || generateAnonymousUserID();
	console.log("UserID: ", userID);

	async function sendMessage(message) {
		try {
			const response = await fetch('http://localhost:8080/api/chat', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					message: message,
					user_id: userID,
					is_anonymous: !getClientUserID() // Flag de anonimato
				})
			});

			if (!response.ok) throw new Error('Erro na resposta do servidor');
			return await response.json();
		} catch (error) {
			console.error("Erro ao enviar mensagem:", error);
			return { response: "Desculpe, ocorreu um erro. Tente novamente." };
		}
	}

	input.addEventListener('keydown', async function (e) {
		if (e.key === 'Enter') {
			const userMessage = input.value.trim();
			if (!userMessage) return;

			messagesDiv.innerHTML += `<div><strong>Você:</strong> ${userMessage}</div>`;
			input.value = '';

			const data = await sendMessage(userMessage);
			messagesDiv.innerHTML += `<div style="color:blue">
                <strong>Bot:</strong> ${data.message}
                <div class="meta-info" style="font-size: 0.8em; color: #666;">
                    UserID: ${data.user_id} | ${data.is_anonymous ? 'Anônimo' : 'Logado'}
                </div>
            </div>`;
			messagesDiv.scrollTop = messagesDiv.scrollHeight;
		}
	});

	function observerLoginChanges() {
		let lastUserID = userID;

		setInterval(() => {
			const currentUserID = getClientUserID() || generateAnonymousUserID();
			if (currentUserID !== lastUserID) {
				console.log("Status de login alterado. Novo UserID:", currentUserID);

				lastUserID = currentUserID;
				// Adicionar lógica para reiniciar o chat?
			}
		}, 1000);
	}

	observerLoginChanges();
})();
