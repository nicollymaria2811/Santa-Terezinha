// EXEMPLO de configuração das API Keys
// Copie este arquivo para api-keys.js e substitua as chaves

const API_KEYS = {
    // Google Maps API Key
    // Obtenha sua chave em: https://console.cloud.google.com/
    GOOGLE_MAPS: 'AIzaSyBvOkBwv7wj8DqE8fGhI2jKl3MnOpQrStU' // ← Substitua pela sua chave real
};

// Verifica se a API key foi configurada
function verificarAPIKey() {
    if (API_KEYS.GOOGLE_MAPS === 'AIzaSyBvOkBwv7wj8DqE8fGhI2jKl3MnOpQrStU' || !API_KEYS.GOOGLE_MAPS) {
        console.error('❌ Google Maps API Key não configurada!');
        console.log('📋 Para configurar:');
        console.log('1. Acesse: https://console.cloud.google.com/');
        console.log('2. Crie um projeto e ative a Maps JavaScript API');
        console.log('3. Gere uma chave de API');
        console.log('4. Substitua a chave acima pela sua chave real');
        return false;
    }
    return true;
}

// Exporta as configurações
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { API_KEYS, verificarAPIKey };
}
