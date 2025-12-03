# Sistema de Transporte Público Santa Terezinha

Sistema de comunicação e gestão para empresa de transporte público localizada em Fraiburgo-SC. Desenvolvido como protótipo para TCC com foco em resolver problemas de comunicação e gestão identificados em pesquisa de campo.

## 🚌 Sobre o Projeto

Este sistema foi desenvolvido para atender quatro perfis de usuário distintos:
- **Passageiro**: Consulta de horários, avisos em tempo real e chat com a empresa
- **Motorista**: Reportar problemas e visualizar escala de trabalho
- **Mecânico**: Gerenciar chamados técnicos e checklist de manutenção
- **Gestor**: Dashboard operacional, relatórios e gestão geral

## 🛠️ Tecnologias Utilizadas

### Fase Atual (Protótipo)
- **HTML5**: Estrutura semântica da interface
- **CSS3**: Estilização responsiva e acessível
- **JavaScript (ES6+)**: Lógica de controle e simulação de dados
- **Chart.js**: Gráficos para dashboard
- **Google Maps API**: Mapas interativos (opcional)
- **OpenStreetMap + Leaflet**: Mapas gratuitos (recomendado)

### Próxima Fase (Sistema Completo)
- **PHP 8+**: Lógica de servidor
- **MySQL 8+**: Persistência de dados
- **API REST**: Comunicação entre frontend e backend
- **GPS/Geolocalização**: Rastreamento em tempo real

## 📁 Estrutura do Projeto

```
SantaTerezinhaBus/
├── index.html                    # Página principal
├── passageiro.html              # Perfil passageiro (Google Maps)
├── passageiro-gratuito.html     # Perfil passageiro (OpenStreetMap)
├── motorista.html               # Perfil motorista
├── mecanico.html                # Perfil mecânico
├── gestor.html                  # Perfil gestor
├── css/
│   ├── style.css               # Estilos principais unificados
│   ├── responsive.css          # Media queries responsivas
│   └── modern.css              # Estilos modernos
├── js/
│   ├── app.js                  # Lógica principal da aplicação
│   ├── data.js                 # Dados simulados
│   ├── mapa-avancado.js        # Funcionalidades Google Maps
│   └── mapa-gratuito.js        # Funcionalidades OpenStreetMap
├── config/
│   ├── api-keys.js             # Configuração de API keys
│   └── api-keys.example.js     # Exemplo de configuração
├── images/
│   ├── logo.png                # Logo da empresa (PNG)
│   └── logo.svg                # Logo da empresa (SVG)
├── php/
│   ├── config.php              # Configurações do banco
│   └── api.php                 # API REST
├── database/
│   └── schema.sql              # Estrutura do banco de dados
├── DOCUMENTACAO_GOOGLE_MAPS.md # Documentação completa dos mapas
├── DEMO.md                     # Guia de demonstração
└── README.md                   # Este arquivo
```

## 🚀 Instalação e Configuração

### Requisitos
- Servidor web (Apache/Nginx)
- PHP 8.0+ (para próxima fase)
- MySQL 8.0+ (para próxima fase)
- Navegador moderno com suporte a ES6+

### Instalação Rápida (Protótipo Atual)
1. Clone ou baixe o projeto
2. Coloque os arquivos em um diretório do servidor web
3. Acesse `http://localhost/SantaTerezinhaBus/`
4. Use as credenciais de demonstração:
   - **Passageiro**: user1 / senha123
   - **Motorista**: motorista1 / senha123
   - **Mecânico**: mecanico1 / senha123
   - **Gestor**: gestor1 / senha123

### Instalação Completa (Próxima Fase)
1. Configure o banco de dados MySQL
2. Execute o script `database/schema.sql`
3. Configure as credenciais em `php/config.php`
4. Acesse a aplicação

### 🗺️ Configuração de Mapas

#### Opção 1: Google Maps (Recomendado para produção)
1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um projeto e ative a Maps JavaScript API
3. Gere uma chave de API
4. Configure em `config/api-keys.js`
5. Use `passageiro.html` para a versão completa

#### Opção 2: OpenStreetMap (100% Gratuito)
1. Nenhuma configuração necessária
2. Use `passageiro-gratuito.html` para a versão gratuita
3. Funcionalidades básicas de mapa incluídas

📖 **Documentação completa**: `DOCUMENTACAO_GOOGLE_MAPS.md`

## 📱 Funcionalidades por Perfil

### 👤 Passageiro
- **Consulta de Horários**: Visualizar linhas e horários em tempo real
- **Mapas Interativos**: 
  - 🗺️ **Google Maps**: Versão completa com rotas e direções
  - 🆓 **OpenStreetMap**: Versão gratuita com funcionalidades básicas
- **Avisos**: Painel de notícias sobre alterações e atrasos
- **Chat**: Canal direto para comunicação com a empresa

### 🚗 Motorista
- **Reportar Problemas**: Sistema de chamados para falhas técnicas
- **Visualizar Escala**: Consultar e confirmar escala de trabalho

### 🔧 Mecânico
- **Painel de Chamados**: Fila de problemas reportados
- **Checklist**: Registro de ações de manutenção
- **Atualizar Status**: Marcar chamados como resolvidos

### 📊 Gestor
- **Dashboard**: Indicadores operacionais em tempo real
- **Relatórios**: Geração de relatórios detalhados
- **Gestão**: Controle de chamados e mensagens

## 🎨 Design e Acessibilidade

- **Mobile First**: Interface otimizada para dispositivos móveis
- **Responsivo**: Adaptação automática para diferentes telas
- **Acessível**: Suporte a leitores de tela e navegação por teclado
- **Dark Mode**: Suporte automático baseado nas preferências do sistema
- **Alto Contraste**: Modo de alto contraste para melhor visibilidade

## 🔧 Desenvolvimento

### Estrutura de Dados
Os dados são simulados no arquivo `js/data.js` e incluem:
- Usuários e autenticação
- Rotas e horários
- Avisos e notícias
- Chamados técnicos
- Escalas de motoristas
- Checklist de manutenção

### API REST (Próxima Fase)
Endpoints disponíveis em `php/api.php`:
- `GET /api/rotas` - Listar rotas
- `GET /api/avisos` - Listar avisos
- `GET /api/chamados` - Listar chamados
- `POST /api/chamados` - Criar chamado
- `PUT /api/chamados/{id}` - Atualizar chamado
- `GET /api/dashboard` - Dados do dashboard

## 📊 Banco de Dados

### Tabelas Principais
- `usuarios` - Dados dos usuários do sistema
- `rotas` - Informações das linhas de ônibus
- `horarios_rotas` - Horários por rota e dia da semana
- `veiculos` - Frota de veículos
- `chamados` - Chamados técnicos
- `escalas` - Escalas dos motoristas
- `avisos` - Avisos e notícias
- `mensagens_chat` - Mensagens do chat

## 🚀 Próximas Implementações

### Fase TC2 (Sistema Completo)
1. **Integração Backend**: Implementação completa com PHP/MySQL
2. **Geolocalização**: Rastreamento GPS em tempo real
3. **Autenticação Real**: Sistema de login com JWT
4. **Notificações Push**: Alertas em tempo real
5. **Relatórios Avançados**: Exportação em PDF/Excel
6. **App Mobile**: Versão nativa para Android/iOS

### Melhorias Futuras
- Integração com APIs de trânsito
- Sistema de pagamento online
- Integração com redes sociais
- Análise de dados com IA
- Sistema de avaliações

## 🤝 Contribuição

Este projeto foi desenvolvido como parte de um Trabalho de Conclusão de Curso (TCC). Para contribuições ou sugestões, entre em contato através dos canais oficiais.

## 📄 Licença

Este projeto é propriedade da empresa Santa Terezinha Transporte e está sendo desenvolvido para fins acadêmicos e comerciais.

## 📞 Contato

- **Empresa**: Santa Terezinha Transporte
- **Localização**: Fraiburgo/SC
- **Desenvolvimento**: TCC - Sistema de Transporte Público

---

**Desenvolvido com ❤️ para melhorar o transporte público de Fraiburgo/SC**

