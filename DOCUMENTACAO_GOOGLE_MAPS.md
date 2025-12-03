# 🗺️ Documentação Completa - Google Maps - Sistema Santa Terezinha

## 📋 Visão Geral

Este documento contém todas as informações necessárias para configurar e usar o Google Maps no Sistema Santa Terezinha, incluindo opções gratuitas e pagas.

## ❌ Problema Comum

O sistema pode exibir a mensagem de erro: **"Ops! Algo deu errado. Esta página não carregou o Google Maps corretamente."**

## 🔧 Soluções Disponíveis

### **Opção 1: Google Maps (Pago após créditos gratuitos)**

#### Pré-requisitos
- Conta no Google Cloud Platform
- Cartão de crédito para ativar a API (há créditos gratuitos)

#### Passo a Passo

**1. Criar Projeto no Google Cloud Console**
1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Clique em "Selecionar projeto" → "Novo projeto"
3. Nome: "Sistema Santa Terezinha"
4. Clique em "Criar"

**2. Ativar a Google Maps JavaScript API**
1. No menu lateral, vá em "APIs e Serviços" → "Biblioteca"
2. Pesquise por "Maps JavaScript API"
3. Clique em "Maps JavaScript API"
4. Clique em "Ativar"

**3. Criar Chave de API**
1. Vá em "APIs e Serviços" → "Credenciais"
2. Clique em "Criar credenciais" → "Chave de API"
3. **IMPORTANTE**: Copie a chave gerada e guarde em local seguro

**4. Configurar Restrições (Recomendado)**
1. Clique no ícone de editar (✏️) da chave criada
2. Em "Restrições de aplicativo":
   - Selecione "Sites HTTP (websites)"
   - Adicione: `http://localhost/*`
   - Adicione: `https://seudominio.com/*` (se tiver domínio)
3. Em "Restrições de API":
   - Selecione "Restringir chave"
   - Marque apenas "Maps JavaScript API"
4. Clique em "Salvar"

**5. Configurar no Sistema**
1. Abra o arquivo `config/api-keys.js`
2. Substitua `SUA_API_KEY_AQUI` pela sua chave real:

```javascript
const API_KEYS = {
    GOOGLE_MAPS: 'AIzaSyBvOkBwv7wj8DqE8fGhI2jKl3MnOpQrStU' // Sua chave aqui
};
```

**6. Testar o Sistema**
1. Salve o arquivo
2. Recarregue a página `passageiro.html`
3. O mapa deve carregar normalmente

#### Custos do Google Maps
- **$300 em créditos gratuitos** para novos usuários (90 dias)
- **$200 em créditos mensais** para Maps JavaScript API
- **28.000 carregamentos de mapa por mês** - GRATUITO
- **40.000 solicitações de direções por mês** - GRATUITO

### **Opção 2: OpenStreetMap + Leaflet (100% Gratuito)**

#### Vantagens
- ✅ **100% gratuito para sempre**
- ✅ **Sem necessidade de API key**
- ✅ **Sem limites de uso**
- ✅ **Funcionalidades completas**

#### Como Usar
1. Acesse `passageiro-gratuito.html`
2. Faça login com `user1` / `senha123`
3. Vá para a aba "Horários"
4. Use o mapa interativo sem configuração

#### Funcionalidades Disponíveis
- Mapa interativo com OpenStreetMap
- Marcadores coloridos para paradas de ônibus
- Info windows com informações detalhadas
- Cálculo de rotas (simulado)
- Painel de informações da rota
- Compartilhamento de rotas
- Design responsivo e moderno

## 🎯 Funcionalidades do Mapa

### ✅ Recursos Implementados
- **Localização Atual**: Alfinete azul mostra onde você está
- **Centralização Automática**: Mapa centraliza na sua posição
- **Fallback**: Se não conseguir localização, usa Fraiburgo/SC
- **5 Paradas Simuladas** em Fraiburgo/SC
- **Ícones de Ônibus**: Marcadores visuais nas paradas
- **Info Windows**: Clique nos marcadores para ver detalhes
- **Informações Completas**: Linha, horário e tarifa
- **Círculo de Proximidade**: Mostra área de 1km ao redor

### 📍 Coordenadas das Paradas (Fraiburgo/SC)
- **Centro - São José**: -27.0220, -50.9200
- **Centro - Industrial**: -27.0245, -50.9150
- **Centro - Bairro Alto**: -27.0210, -50.9250
- **Centro - Estação**: -27.0250, -50.9100
- **Centro - Shopping**: -27.0200, -50.9300

## 🚀 Funcionalidades Avançadas (Google Maps)

### Interface Melhorada
- **Mapa Maior**: Altura aumentada para 400px para melhor visualização
- **Controles de Modo de Transporte**: Seletor com 4 opções (Carro, Caminhada, Bicicleta, Transporte Público)
- **Botão Limpar Rota**: Para remover rotas calculadas
- **Painel de Informações**: Exibe detalhes da rota calculada

### Cálculo de Rotas Avançado
- **Múltiplos Modos de Transporte**: 
  - 🚗 **Carro** (DRIVING)
  - 🚶 **Caminhada** (WALKING) 
  - 🚴 **Bicicleta** (BICYCLING)
  - 🚌 **Transporte Público** (TRANSIT)
- **Cálculo em Tempo Real**: Rotas recalculadas automaticamente ao mudar o modo
- **Informações Detalhadas**: Distância, tempo estimado e próximo ônibus

### Interatividade Aprimorada
- **Info Windows Melhorados**: Design mais moderno com botões de ação
- **Botões de Ação**: 
  - "Calcular Rota" - Calcula rota para a parada
  - "Google Maps" - Abre no Google Maps externo
- **Fechamento Automático**: Info windows fecham ao abrir outros

### Painel de Informações da Rota
- **Cards Informativos**: 
  - 📏 **Distância** da rota
  - ⏱️ **Tempo estimado** de deslocamento
  - 🚌 **Próximo ônibus** disponível
- **Botões de Ação**:
  - 🔗 **Abrir no Google Maps** - Navegação externa
  - 📤 **Compartilhar Rota** - Compartilhamento nativo
  - ❌ **Limpar Rota** - Remove rota do mapa

### Funcionalidades de Compartilhamento
- **Web Share API**: Compartilhamento nativo em dispositivos móveis
- **Fallback**: Cópia para área de transferência em navegadores sem suporte
- **Informações Contextuais**: Título e descrição personalizados

### Design e UX
- **Cores do Sistema**: #8B2323 (Vermelho Santa Terezinha)
- **Responsividade**: Mobile First com breakpoints automáticos
- **Acessibilidade**: Navegação por teclado e ARIA labels
- **Performance**: Carregamento otimizado e cache inteligente

## 🔒 Segurança

### Boas Práticas
- ✅ **Restrições de Domínio**: Apenas sites autorizados
- ✅ **Restrições de API**: Apenas Maps JavaScript API
- ✅ **Monitoramento**: Acompanhe uso no console
- ❌ **Nunca** compartilhe sua API key publicamente

## 🛠️ Estrutura de Arquivos

```
SantaTerezinhaBus/
├── config/
│   ├── api-keys.js              # ← Configure sua API key aqui
│   └── api-keys.example.js      # ← Exemplo de configuração
├── passageiro.html              # ← Página com Google Maps
├── passageiro-gratuito.html     # ← Página com OpenStreetMap
├── js/
│   ├── mapa-avancado.js         # ← Funcionalidades Google Maps
│   └── mapa-gratuito.js         # ← Funcionalidades OpenStreetMap
└── DOCUMENTACAO_GOOGLE_MAPS.md  # ← Este arquivo
```

## ❓ Problemas Comuns

### "This page can't load Google Maps correctly"
- ✅ **Causa**: API key não configurada ou inválida
- ✅ **Solução**: Verifique se a chave está correta em `config/api-keys.js`

### Mapa não aparece
- ✅ **Causa**: Restrições de domínio muito restritivas
- ✅ **Solução**: Adicione `http://localhost/*` nas restrições

### Localização não funciona
- ✅ **Causa**: Permissões do navegador
- ✅ **Solução**: Permita acesso à localização quando solicitado

### Erro de CORS
- ✅ **Causa**: Domínio não autorizado
- ✅ **Solução**: Adicione seu domínio nas restrições da API key

## 📊 Comparação: Google Maps vs OpenStreetMap

| Recurso | Google Maps | OpenStreetMap |
|---------|-------------|---------------|
| **Custo** | Pago após créditos | 100% Gratuito |
| **API Key** | Necessária | Não necessária |
| **Limites** | Limitado | Ilimitado |
| **Qualidade** | Excelente | Muito boa |
| **Atualizações** | Automáticas | Comunitárias |
| **Suporte** | Google | Comunidade |

## 💡 Recomendação

Para o seu projeto TCC, recomendo usar a **versão gratuita** porque:

1. **Sem custos** - Ideal para projeto acadêmico
2. **Funcionalidades completas** - Atende todas as necessidades
3. **Fácil manutenção** - Sem dependências externas pagas
4. **Demonstração profissional** - Mostra conhecimento técnico
5. **Escalabilidade** - Pode ser usado em produção

## 📞 Suporte

### Documentação Oficial
- [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript)
- [Google Cloud Console](https://console.cloud.google.com/)
- [Leaflet.js](https://leafletjs.com/)
- [OpenStreetMap](https://www.openstreetmap.org/)

### Suporte Técnico
- [Google Cloud Support](https://cloud.google.com/support)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/google-maps)

---

**Sistema desenvolvido para o TCC - Santa Terezinha Transporte**  
**Fraiburgo/SC - 2024**

*Documentação unificada com todas as opções de mapa disponíveis*
