// hecho por: Fernando Silva T.
const fs = require('fs');
const path = require('path');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fechaActual = new Date();
const dia = fechaActual.getDate();
const mes = fechaActual.getMonth() + 1;
const diaYMes = `${dia}-${mes}`;

const client = new Client({
  authStrategy: new LocalAuth(),
});

const messageResponses = {
  '!ping': 'pong, bot activo',
  '!contacto': 'Mi nombre es Fernando Silva',
  '!linkedin': 'https://www.linkedin.com/in/fernando-silvo-t/',
  '!github': 'https://github.com/fernandosilvot',
  '!pagina': 'https://fernandosilvot.github.io/',
};

const messageLogs = []; // Declaración de messageLogs fuera del controlador de eventos

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
  console.log('Escanea el código QR con la aplicación de WhatsApp en tu teléfono.');
});

client.on('ready', () => {
  console.log('¡El cliente está listo!');
});

client.on('message', async (message) => {
  const chatId = message.from.split('@')[0];

  if (chatId === message.from.split('@')[0] && chatId.length === 11) {
    console.log(chatId, 'Mensaje recibido:', message.body);

    if (message.body.toLowerCase() === 'hola') {
      const options = [
        'Hola, ¿En qué puedo ayudarte?',
        '0 - Utiliza (!ping) para saber si el bot está activo',
        '1 - Utiliza (!contacto) para saber el nombre del contacto',
        '2 - Utiliza (!linkedin) para saber el enlace de LinkedIn',
        '3 - Utiliza (!github) para saber el enlace de GitHub',
        '4 - Utiliza (!pagina) para saber el enlace de la página web personal',
      ];
      message.reply(options.join('\n'));
    }

    const response = messageResponses[message.body.toLowerCase()];
    if (response) {
      message.reply(response);
    } else {
      message.reply('No entiendo lo que quieres decir');
    }

    const saveFolder = path.join(__dirname, 'archivos_whatsApp', diaYMes, chatId);
    if (!fs.existsSync(saveFolder)) {
      fs.mkdirSync(saveFolder, { recursive: true });
    }
    
    if (message.hasMedia) {
      const media = await message.downloadMedia();
      const filename = `${message.from}_attachment_${Date.now()}.${media.mimetype.split('/')[1]}`;
      const filePath = path.join(saveFolder, filename);

      try {
        fs.writeFileSync(filePath, media.data, 'base64');
        console.log(`Archivo adjunto "${filename}" guardado en "${saveFolder}" con éxito.`);
      } catch (error) {
        console.error('Error al guardar archivo adjunto:', error);
      }
    }

    messageLogs.push({
      chatId,
      timestamp: new Date(),
      body: message.body,
    });

    // Guarda registros en un archivo JSON
    const logsFilePath = `C:\\Users\\Lenovo\\OneDrive\\Documentos\\Proyectos\\bot-chat-v1\\log_whatsapp\\logs_de_${chatId}_${diaYMes}.json`;
    try {
      fs.writeFileSync(logsFilePath, JSON.stringify(messageLogs, null, 2), 'utf-8');
      console.log(`Registros guardados en logs_${diaYMes}.json`);
    } catch (error) {
      console.error('Error al guardar registros:', error);
    }
  }
});

client.initialize();
