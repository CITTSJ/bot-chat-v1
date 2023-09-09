// hecho por: Fernando Silva T.
const fs = require('fs'); // Módulo de sistema de archivos
const path = require('path'); // Módulo para trabajar con rutas de archivos
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js'); // Biblioteca para WhatsApp Web
const qrcode = require('qrcode-terminal'); // Biblioteca para generar códigos QR

// Crear una instancia del cliente de WhatsApp Web con autenticación local
const client = new Client({
    authStrategy: new LocalAuth(),
});

// Respuestas a comandos
const messageResponses = {
    '!ping': 'pong, bot activo',
    '!contacto': 'Mi nombre es Fernando Silva',
    '!linkedin': 'https://www.linkedin.com/in/fernando-silvo-t/',
    '!github': 'https://github.com/fernandosilvot',
    '!pagina': 'https://fernandosilvot.github.io/',
};

// Obtener la fecha y mes actual para el nombre de la carpeta
const diaYMes = obtenerDiaYMes();
// Almacenar registros de mensajes
const messageLogs = [];

// Evento: Generación de código QR para autenticación
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true }); // Genera y muestra el código QR en la consola
    console.log('Escanea el código QR con la aplicación de WhatsApp en tu teléfono.');
});

// Evento: Cliente listo para usar
client.on('ready', () => {
    console.log('¡El cliente está listo!');
});

// Evento: Manejo de mensajes entrantes
client.on('message', async (message) => {
    const chatId = obtenerChatId(message);

    // Verificar si el ID del chat tiene 11 caracteres (es un número de teléfono) y si es mayor es un mensaje de grupo
    if (chatId.length === 11) {
        console.log(chatId, 'Mensaje recibido:', message.body);

        if (message.body.toLowerCase() === 'hola') {
            // Respuestas al comando "Hola"
            const options = [
                'Hola, ¿En qué puedo ayudarte?',
                '0 - Utiliza (!ping) para saber si el bot está activo',
                '1 - Utiliza (!contacto) para saber el nombre del contacto',
                '2 - Utiliza (!linkedin) para saber el enlace de LinkedIn',
                '3 - Utiliza (!github) para saber el enlace de GitHub',
                '4 - Utiliza (!pagina) para saber el enlace de la página web personal',
            ];

            // Ruta del archivo a enviar
            const remoteUrl = 'https://media.licdn.com/dms/image/D4E22AQGisbQSdfx62Q/feedshare-shrink_2048_1536/0/1694054093551?e=1697068800&v=beta&t=pyjJlll9MFuI5X_MST0RXjK5IXl9_c0rQ_rLVi5VYb4';
            try {
                const media = await MessageMedia.fromUrl(remoteUrl);
                await client.sendMessage(message.from, media);
                console.log('Archivo desde URL remota enviado con éxito.');
            } catch (error) {
                console.error('Error al enviar archivo desde URL remota:', error);
            }

            // Escuchar mensajes del usuario y responder según corresponda
            client.on('message', async (message) => {
                const response = messageResponses[message.body.toLowerCase()];
                if (response) {
                    message.reply(response);
                }
            });

        }

        // Guardar registros de mensajes
        guardarRegistroDeMensajes(messageLogs, diaYMes);
    }
});

// Inicializar el cliente de WhatsApp Web
client.initialize();

// Función para obtener el día y mes actual en formato "dd-mm"
function obtenerDiaYMes() {
    const fechaActual = new Date();
    const dia = fechaActual.getDate();
    const mes = fechaActual.getMonth() + 1;
    return `${dia}-${mes}`;
}

// Función para obtener el ID del chat a partir del mensaje
function obtenerChatId(message) {
    return message.from.split('@')[0];
}

// Función para enviar un archivo local al chat
async function enviarArchivoLocal(chatId, filePath, options) {
    const media = MessageMedia.fromFilePath(filePath);
    try {
        await client.sendMessage(chatId, media);
        console.log('Archivo local enviado con éxito.');
    } catch (error) {
        console.error('Error al enviar archivo local:', error);
    }
    client.sendMessage(chatId, options.join('\n'));
}

// Función para crear una carpeta si no existe
function crearCarpeta(folderPath) {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
    }
}

// Función para guardar un archivo adjunto en una carpeta
async function guardarArchivoAdjunto(message, saveFolder) {
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

// Función para guardar registros de mensajes en un archivo JSON
function guardarRegistroDeMensajes(messageLogs, diaYMes) {
    const logsFilePath = `C:\\Users\\Lenovo\\Desktop\\archivos_whatsApp\\logs_${diaYMes}.json`;
    try {
        fs.writeFileSync(logsFilePath, JSON.stringify(messageLogs, null, 2), 'utf-8');
        console.log(`Registros guardados en logs_${diaYMes}.json`);
    } catch (error) {
        console.error('Error al guardar registros:', error);
    }
}
