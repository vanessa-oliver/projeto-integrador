const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const Questao = require('./models/Questao');
const Usuario = require('./models/Usuario');
const port = process.env.PORT || 3000;
const { GoogleGenerativeAI } = require('@google/generative-ai');
const apiKey = process.env.KEY_GEMINI;
require('dotenv').config();

const genAI = new GoogleGenerativeAI(apiKey);

// Template Engine
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');

// Definindo o diretório de views
app.set('views', path.join(__dirname, 'views'));

// Middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Rota para a página inicial
app.get('/listuser', function(req, res) {
    Usuario.findAll().then(function(usuarios) {
        res.render('user', { usuarios: usuarios });
    }).catch(function(error) {
        console.error(error);
        res.status(500).send("Ocorreu um erro ao buscar os usuários.");
    });
});

// Rota para deletar um usuário
app.get('/del/:cod_usuario', function(req, res) {
    Usuario.destroy({ where: {'cod_usuario': req.params.cod_usuario} })
    .then(function() {
        res.redirect('/');
    }).catch(function(erro) {
        res.send("Erro ao deletar usuário: " + erro);
    });
});

// Rota para a página de cadastro
app.get('/cadastro', function(req, res) {
    res.render('register');
});

// Rota para a página de login
app.get('/login', function(req, res) {
    res.render('login');
});

// Rota para adicionar um novo usuário
app.post('/adduser', function(req, res) {
    Usuario.create({
        nome: req.body.nome,
        email: req.body.email,
        password: req.body.password
    }).then(function() {
        res.redirect('/');
    }).catch(function(erro) {
        res.send("Erro ao cadastrar usuario: " + erro);
    });
});























// Rota para exibir questão
app.get('/readquest/:cod_questao', async (req, res) =>{
    try {
        const cod_questao = req.params.cod_questao;
        console.log(`Buscando questão com código: ${cod_questao}`);
        const questao = await Questao.findByPk(cod_questao);
        console.log(`Questão encontrada: ${questao}`);
        if (!questao) {
            res.status(404).send("Questão não encontrada!");
            return;
        }
        
        res.render('quest', { questao: questao.dataValues });
    } catch (error) {
        console.error("Erro ao buscar questão:", error);
        res.status(500).send("Erro ao buscar a questão.");
    }
});

// Rota para listar as questões
app.get('/listquest', function(req, res) {
    Questao.findAll().then(function(questoes) {
        res.render('listquest', { questoes: questoes});
    }).catch(function(error) {
        console.error(error);
        res.status(500).send("Ocorreu um erro ao buscar as questões.");
    });
});

//Rota para deletar questão
app.get('del/:cod_questao', function(req, res) {
    Questao.destroy({ where: {'cod_questao': req.params.cod_questao} })
    .then(function() {
        res.redirect('/listquest');
    }).catch(function(erro) {
        res.send("Erro ao deletar questão: " + erro);
    });
});

// Rota para criar questão
app.get('/createquest', function(req, res) {
    res.render('addquest');
});

// Rota para adicionar questão 
app.post('/addquest', function(req, res) {
    Questao.create({
        enunciado: req.body.enunciado,
        resposta: req.body.resposta,
        cod_usuario: req.body.cod_usuario,
        cod_assunto: req.body.cod_assunto
    }).then(function() {
        res.redirect('/listquest');
    }).catch(function(erro) {
        res.send("Erro ao cadastrar questão: " + erro);
    });
});
















app.get('/chat', (req, res) => {
    res.render('chat', { messages: [] }); // Renderiza a página inicialmente com um array vazio de mensagens
});

app.post('/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;
        console.log(`Mensagem do usuário: ${userMessage}`);

        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
        const chat = model.startChat();

        const result = await chat.sendMessage(userMessage);
        const response = await result.response;
        const text = response.text();
        console.log(`Resposta do chatbot: ${text}`);

        res.json({ enunciado: userMessage, resposta: text });
    } catch (error) {
        console.error("Erro ao se comunicar com o serviço de IA:", error);
        res.status(500).send("Erro ao processar a mensagem do chatbot.");
    }
});


app.post('/save-conversation', async (req, res) => {
    try {
        const { enunciado, resposta } = req.body;
        const cod_usuario = 1; 
        const cod_assunto = 1; 
        console.log(`Salvar no BD - Enunciado: ${enunciado}, Resposta: ${resposta}, Cod_usuario: ${cod_usuario}, Cod_assunto: ${cod_assunto}`);

        await Questao.create({ enunciado, resposta, cod_usuario, cod_assunto });
        res.status(200).send('Conversa salva com sucesso.');
    } catch (error) {
        console.error("Erro ao salvar a conversa:", error);
        res.status(500).send("Erro ao salvar a conversa.");
    }
});













// Servidor
app.listen(port, function() {
    console.log(`Servidor rodando na porta ${port}`);
});
