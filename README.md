☕ Café Central - Sistema de Autenticação
O Café Central é uma plataforma robusta de gerenciamento de usuários, focada em segurança e experiência do usuário. Este repositório contém o backend e o frontend completo, lidando desde o cadastro de clientes até o controle de sessões persistentes.
 
Funcionalidades do projeto:
    Cadastro de Usuários: Validação de campos e verificação de e-mails duplicados.
    Segurança de Ponta: Senhas criptografadas com bcryptjs (hash).
    Gestão de Sessão: Controle de login via express-session com cookies seguros.
    CORS Configurado: Pronto para receber requisições de diferentes origens (Local e GitHub Pages).
    Interface de Contato: Rota dedicada para recebimento de mensagens.
 
Tecnologias Utilizadas:
    Node.js & Express: Base do servidor.
    MySQL: Banco de dados relacional para armazenamento seguro.
    BcryptJS: Para nunca salvar senhas em texto puro.
    Express-Session: Para manter o usuário "logado" enquanto navega
    CORS: Para permitir a comunicação entre o frontend e o backend.
 
 
 