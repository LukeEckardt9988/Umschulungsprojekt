document.addEventListener('DOMContentLoaded', function() {
            const messageInput = document.getElementById('messageInput');
            const blinkingImage = document.getElementById('blinkingImage');

            messageInput.addEventListener('input', function() {
                const content = messageInput.value.toLowerCase();
                if (content.includes('penis')) {
                    showBlinkingImage();
                }
            });

            function showBlinkingImage() {
                blinkingImage.style.display = 'block'; // Bild anzeigen

                setTimeout(function() {
                    blinkingImage.style.display = 'none'; // Bild ausblenden
                }, 3000); // Zeit in Millisekunden (3000 ms = 3 Sekunden)
            }

            const chatbox = document.getElementById('chatbox');
            const usernameInput = document.getElementById('usernameInput');
            const sendButton = document.getElementById('sendButton');
            const fileInput = document.getElementById('fileInput');
            let lastMessageId = 0;

            const messageState = new Map();

            function stringToBinary(string) {
                return string.split('')
                    .map(char => char.charCodeAt(0).toString(2).padStart(8, '0'))
                    .join(' ');
            }

            function checkMessageForAlert(username, content) {
                if (content.toLowerCase().includes('klettergerüst')) {
                    alert(`${username} hat eine Nackte Frau geküsst!`);
                }
            }

            function loadNewMessages() {
                fetch(`get_new_messages.php?last_id=${lastMessageId}`)
                    .then(response => response.json())
                    .then(messages => {
                        if (messages.length > 0) {
                            messages.forEach(message => {
                                if (message.id > lastMessageId) {
                                    const messageDiv = document.createElement('div');
                                    messageDiv.className = 'message';
                                    messageDiv.innerHTML = `<span class="username">${message.username}</span>\u0009: ${message.content || ''}`;
                                    if (message.image) {
                                        const img = document.createElement('img');
                                        img.src = message.image;
                                        messageDiv.appendChild(img);
                                    }
                                    chatbox.appendChild(messageDiv);
                                    lastMessageId = message.id;

                                    messageState.set(messageDiv, message.content);

                                    messageDiv.addEventListener('click', () => {
                                        const currentContent = messageDiv.innerText.split(': ')[1];
                                        if (currentContent === messageState.get(messageDiv)) {
                                            const binary = stringToBinary(currentContent);
                                            messageDiv.innerHTML = `<span class="username">${message.username}</span>\u0009: <span class="binary">${binary}</span>`;
                                        } else {
                                            messageDiv.innerHTML = `<span class="username">${message.username}</span>\u0009: ${messageState.get(messageDiv)}`;
                                        }
                                    });
                                }
                            });

                            chatbox.scrollTop = chatbox.scrollHeight;
                        }
                    })
                    .catch(error => console.error('Fetch error:', error));
            }

            function sendMessage() {
                const username = usernameInput.value.trim();
                const content = messageInput.value.trim();
                const file = fileInput.files[0];

                if (content === '' && !file) return;

                checkMessageForAlert(username, content);

                const formData = new FormData();
                formData.append('username', username);
                formData.append('content', content);
                if (file) {
                    formData.append('file', file);
                }

                fetch('post_message.php', {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.text())
                .then(() => {
                    messageInput.value = '';
                    fileInput.value = '';
                    loadNewMessages();
                })
                .catch(error => console.error('Fetch error:', error));
            }

            sendButton.onclick = function(event) {
                event.preventDefault();
                sendMessage();
            };

            messageInput.addEventListener('keypress', function(event) {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    sendMessage();
                }
            });

            setInterval(loadNewMessages, 500);

            // Initialisieren der canvas für Matrix-Effekt und Neigungseffekt
            var canvas = document.querySelector('canvas'),
                ctx = canvas.getContext('2d');

            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            var letters = '01';
            letters = letters.split('');

            var fontSize = 15, // Schriftgröße bleibt unverändert
                columns = canvas.width / fontSize;

            var drops = [];
            for (var i = 0; i < columns; i++) {
                drops[i] = 1;
            }

            var cursor = { x: canvas.width / 2, y: canvas.height / 2 }; // Initiale Cursorposition

            function draw() {
                ctx.fillStyle = 'rgba(0, 0, 0, .05)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                for (var i = 0; i < drops.length; i++) {
                    var text = letters[Math.floor(Math.random() * letters.length)];
                    var x = i * fontSize;
                    var y = drops[i] * fontSize;

                    // Berechne den Abstand zwischen dem Cursor und dem aktuellen Buchstaben
                    var distX = Math.abs(cursor.x - x);
                    var distY = Math.abs(cursor.y - y);
                    var distance = Math.sqrt(distX * distX + distY * distY);

                    // Bestimme die Farbe basierend auf der Distanz
                    var intensity = Math.max(0.2, 1 - (distance / 150)); // Werte anpassen für die gewünschte Helligkeit
                    var color = `rgba(0, 255, 0, ${intensity * 2})`; // Verdoppele die Helligkeit für nahe Buchstaben

                    ctx.fillStyle = color;
                    ctx.font = `${fontSize}px monospace`; // Schriftgröße einstellen
                    ctx.fillText(text, x, y);
                    
                    drops[i]++;
                    if (drops[i] * fontSize > canvas.height && Math.random() > .95) {
                        drops[i] = 0;
                    }
                }
            }

            function updateCursor(e) {
                cursor.x = e.clientX;
                cursor.y = e.clientY;
            }

            document.addEventListener('mousemove', updateCursor);

            setInterval(draw, 33);

            // Mausverfolgung und Neigungseffekt
            document.addEventListener('mousemove', function(e) {
                const x = (e.clientX / window.innerWidth) - 0.5;
                const y = (e.clientY / window.innerHeight) - 0.5;

                const rotateX = -y * 20; // Entgegengesetzte Neigung für X-Achse
                const rotateY = -x * 20; // Entgegengesetzte Neigung für Y-Achse

                const scale = 1 + (Math.abs(x) + Math.abs(y)) * 0.1;

                canvas.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${scale})`;
            });
        });


//Ich habe mitlerweile zwei schöne und Neue Hintergrundeffekte inzugefügt. 
