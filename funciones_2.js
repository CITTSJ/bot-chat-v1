const { MessageMedia } = require('whatsapp-web.js');
const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config();

function Saludo(msg){
    const mensaje = msg.body.toLowerCase();
    if (mensaje === 'hola') {
        const mensaje_respuesta = 'Hola\nBienvenido a mi chatbot lamentabelmente no esta con inteligencia arcificial, pero puedes usar estos comandos y te ayudare en lo que pueda\n 🔹 !contacto\n 🔹 !pagina-web\n 🔹 !proyectos';
        msg.reply(mensaje_respuesta);
    }
}

async function Contacto(msg, client){
    const mensaje = msg.body.toLowerCase();
    const correo = process.env.CORREO;
    const linkedin = process.env.LINKEDIN;
    if (mensaje === '!contacto') {
        const remoteUrl = imagen_contacto;
        const mensaje_respuesta = `Mi forma de contacto es Linkedin o correo\n 🔹 ${linkedin}\n 🔹 ${correo}\nDe igual manera cuando este disponible contactare con ud cuando este disponible`;
        
        msg.reply(mensaje_respuesta);
    }
}

async function Proyectos(msg, client){
    const mensaje = msg.body.toLowerCase();
    if (mensaje === '!proyectos') {
        const username = process.env.GITHUB_USERNAME;
        const apiUrl = `https://api.github.com/users/${username}/repos`;
        try {
            const response = await axios.get(apiUrl);
            const proyectos = response.data.map(repo => ({
                nombre: repo.name,
                descripcion: repo.description,
                url: repo.html_url,
            }));
            client.sendMessage(msg.from, 'Proyectos en GitHub:\n' +
                proyectos.map(proyecto => `🔹${proyecto.nombre}:\n${proyecto.descripcion}\n${proyecto.url}`).join('\n\n')
            );
            client.sendMessage(msg.from, 'Puedes ver más en mi perfil de GitHub:\n' +
                `https://github.com/${username}`)
        } catch (error) {
            console.error('Error al obtener proyectos de GitHub:', error.message);
            client.sendMessage(msg.from, 'Error al obtener proyectos de GitHub. Por favor, inténtalo de nuevo más tarde.');
        }
    }
}

async function buscarSala(nombreSala) {
    try {
        const apiUrl = `http://192.168.0.9:5000/api/v1/buscar-sector?nombre=${nombreSala}`;
        const response = await axios.get(apiUrl);
        const salaInfo = response.data;
        const respuesta = `Nombre: *${salaInfo.nombre}*\nPiso: *${salaInfo.piso}*\nUbicación: *${salaInfo.ubicacion}*\nDescripción: ${salaInfo.descripcion}`;
        const media = await MessageMedia.fromUrl(`${salaInfo.imagen}`);
        return { respuesta, media }; 
    } catch (error) {
        console.error('Error al buscar la sala:', error);
    }
}

async function Sala(msg, client) {
    const mensaje = msg.body.toLowerCase();
    if (mensaje.startsWith('!sala')) {
        const nombreSala = mensaje.split(' ')[1];
        try {
            const { respuesta, media } = await buscarSala(nombreSala); 

            await client.sendMessage(msg.from, respuesta, { media });

        } catch (error) {
            console.error('Error al buscar la sala:', error);
            msg.reply('Hubo un error al buscar la sala.');
        }
    }
}


async function Pagina(msg, client) {
    const mensaje = msg.body.toLowerCase();
    if (mensaje === '!pagina-web') {
        mensaje_respuesta= `Mi Pagina web es:\n- ${process.env.PAGINA_WEB}`; 
        client.sendMessage(msg.from, mensaje_respuesta);
    }
}


module.exports = {
    Saludo,
    Contacto,
    Proyectos,
    Pagina,
    Sala
}
