// hecho por: Fernando Silva T.

// Obtiene el ID del chat sin el '@'
const chatId = message.from.split('@')[0];
console.log(chatId, 'Mensaje recibido:', message.body);

// Verifica si el mensaje es de un chat grupal
if (message.isGroupMsg) {
    const group = await message.getChat();
    const groupPhoneNumber = group.id._serialized.replace('@g.us', '');
    const groupName = group.name;
    console.log('Nombre del grupo:', groupName);

    console.log(`Número de teléfono del grupo: ${groupPhoneNumber}`);
} else {
    console.log('Mensaje de chat individual.');
}

// Ruta de la carpeta donde se guardarán los archivos adjuntos
const saveFolder = `C:\\Users\\Lenovo\\Desktop\\archivos_whatsApp\\${diaYMes}\\${chatId}`;

// Crea la carpeta de forma recursiva si no existe
if (!fs.existsSync(saveFolder)) {
    fs.mkdirSync(saveFolder, { recursive: true });
}

// Comandos de respuesta a ciertos mensajes
if (message.body === '!ping') {
    message.reply('pong');
}

if (message.body === 'hola') {
    message.reply('Hola, ¿cómo estás?');
}

if (message.body === 'hace frio') {
    message.reply('si, hace frio, te recomiendo abrigarte bien');
}

if (message.body === 'hace calor') {
    message.reply('si, hace calor, te recomiendo tomar mucha agua');
}

// Envia un archivo local
if (message.body === 'foto_citt') {
    const filePath = 'C:\\Users\\Lenovo\\Downloads\\test1.jpg';
    const media = MessageMedia.fromFilePath(filePath);

    try {
        await client.sendMessage(message.from, media);
        console.log('Archivo local enviado con éxito.');
    } catch (error) {
        console.error('Error al enviar archivo local:', error);
    }
}

// Envia un archivo desde una URL remota
if (message.body === 'juntos_citt') {
    const remoteUrl = 'https://media.giphy.com/media/qgQUggAC3Pfv687qPC/giphy.gif';

    try {
        const media = await MessageMedia.fromUrl(remoteUrl);
        await client.sendMessage(message.from, media);
        console.log('Archivo desde URL remota enviado con éxito.');
    } catch (error) {
        console.error('Error al enviar archivo desde URL remota:', error);
    }
}

// Descarga y almacena archivos adjuntos
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

// Agrega el mensaje al registro
messageLogs.push({
    chatId,
    timestamp: new Date(),
    body: message.body,
});

// Guarda registros en un archivo JSON
const logsFilePath = `C:\\Users\\Lenovo\\Desktop\\archivos_whatsApp\\logs${diaYMesYHoraYMinutos}.json`;
try {
    fs.writeFileSync(logsFilePath, JSON.stringify(messageLogs, null, 2), 'utf-8');
    console.log(`Registros guardados en logs_${diaYMes}.json`);  
} catch (error) {
    console.error('Error al guardar registros:', error);
}