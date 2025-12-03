/**
 * Mapa Gratuito - Santa Terezinha Transporte
 * Usando OpenStreetMap com Leaflet (100% gratuito)
 * Sistema realista baseado nas linhas reais de ônibus
 */

class MapaGratuito {
    constructor(containerId, configuracao) {
        this.containerId = containerId;
        this.configuracao = configuracao;
        this.mapa = null;
        this.origem = null;
        this.destinos = [];
        this.marcadores = [];
        this.rotas = [];
        this.origemMarker = null;
        this.paradasOnibus = [];
        
        this.inicializar();
    }

    /**
     * Inicializa o mapa OpenStreetMap
     */
    inicializar() {
        this.criarMapa();
        this.configurarEventos();
    }

    /**
     * Cria o mapa usando Leaflet
     */
    criarMapa() {
        // Centraliza o mapa em Fraiburgo/SC (coordenadas reais)
        const centro = this.configuracao.centro || { lat: -27.0233, lng: -50.9185 };

        this.mapa = L.map(this.containerId).setView([centro.lat, centro.lng], 13);

        // Adiciona camada de tiles do OpenStreetMap
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19
        }).addTo(this.mapa);

        // Obter localização atual do usuário
        this.obterLocalizacaoAtual();
    }

    /**
     * Obtém a localização atual do usuário
     */
    obterLocalizacaoAtual() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (posicao) => {
                    this.origem = {
                        lat: posicao.coords.latitude,
                        lng: posicao.coords.longitude
                    };
                    this.criarMarcadorOrigem();
                    this.carregarParadasOnibus();
                },
                (erro) => {
                    console.log('Erro ao obter localização:', erro);
                    this.origem = this.configuracao.centro || { lat: -27.0233, lng: -50.9185 };
                    this.criarMarcadorOrigem();
                    this.carregarParadasOnibus();
                }
            );
        } else {
            this.origem = this.configuracao.centro || { lat: -27.0233, lng: -50.9185 };
            this.criarMarcadorOrigem();
            this.carregarParadasOnibus();
        }
    }

    /**
     * Cria marcador da origem (usuário)
     */
    criarMarcadorOrigem() {
        const iconeOrigem = L.divIcon({
            className: 'marcador-origem',
            html: '<div style="background: #3b82f6; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
            iconSize: [26, 26],
            iconAnchor: [13, 13]
        });

        this.origemMarker = L.marker([this.origem.lat, this.origem.lng], {
            icon: iconeOrigem
        }).addTo(this.mapa);

        this.origemMarker.bindPopup(`
            <div style="text-align: center; padding: 10px;">
                <h4 style="margin: 0 0 8px 0; color: #3b82f6;">📍 Você está aqui!</h4>
                <p style="margin: 0; color: #666; font-size: 14px;">Sua localização atual</p>
            </div>
        `);

        this.mapa.setView([this.origem.lat, this.origem.lng], 14);
    }

    /**
     * Carrega as paradas de ônibus reais da Santa Terezinha Transporte
     */
    carregarParadasOnibus() {
        // Paradas reais baseadas nas linhas da Santa Terezinha Transporte
        const paradas = [
            // Linha 101 - São Miguel
            { 
                lat: -27.0233, 
                lng: -50.9185, 
                nome: "Terminal Central",
                linha: "101 - São Miguel", 
                horario: "06:50", 
                tarifa: "R$ 3,50",
                cor: "#3b82f6",
                codigo: "F",
                descricao: "Terminal Central - Ponto de partida"
            },
            { 
                lat: -27.0250, 
                lng: -50.9200, 
                nome: "Rodoviária",
                linha: "101 - São Miguel", 
                horario: "07:20", 
                tarifa: "R$ 3,50",
                cor: "#3b82f6",
                codigo: "X",
                descricao: "Terminal Rodoviário - Conexão com outras cidades"
            },
            { 
                lat: -27.0210, 
                lng: -50.9150, 
                nome: "São Miguel",
                linha: "101 - São Miguel", 
                horario: "08:50", 
                tarifa: "R$ 3,50",
                cor: "#3b82f6",
                codigo: "F",
                descricao: "Bairro São Miguel - Destino principal"
            },
            { 
                lat: -27.0200, 
                lng: -50.9100, 
                nome: "Gruta",
                linha: "101 - São Miguel", 
                horario: "09:20", 
                tarifa: "R$ 3,50",
                cor: "#3b82f6",
                codigo: "B",
                descricao: "Gruta - Ponto turístico"
            },

            // Linha 104 - São Sebastião / Santo Antônio
            { 
                lat: -27.0240, 
                lng: -50.9250, 
                nome: "São Sebastião",
                linha: "104 - São Sebastião", 
                horario: "12:10", 
                tarifa: "R$ 3,50",
                cor: "#10b981",
                codigo: "C_104",
                descricao: "Bairro São Sebastião"
            },
            { 
                lat: -27.0220, 
                lng: -50.9300, 
                nome: "Santo Antônio",
                linha: "104 - Santo Antônio", 
                horario: "12:10", 
                tarifa: "R$ 3,50",
                cor: "#10b981",
                codigo: "B_104",
                descricao: "Bairro Santo Antônio"
            },

            // Linha 106 - Macieira / Liberata
            { 
                lat: -27.0180, 
                lng: -50.9050, 
                nome: "Macieira",
                linha: "106 - Macieira", 
                horario: "06:00", 
                tarifa: "R$ 3,50",
                cor: "#f59e0b",
                codigo: "T_106",
                descricao: "Bairro Macieira"
            },
            { 
                lat: -27.0160, 
                lng: -50.9000, 
                nome: "Liberata",
                linha: "106 - Liberata", 
                horario: "08:30", 
                tarifa: "R$ 3,50",
                cor: "#f59e0b",
                codigo: "U_106",
                descricao: "Bairro Liberata"
            },
            { 
                lat: -27.0140, 
                lng: -50.8950, 
                nome: "Perdigão",
                linha: "106 - Perdigão", 
                horario: "11:00", 
                tarifa: "R$ 3,50",
                cor: "#f59e0b",
                codigo: "O_106",
                descricao: "Empresa Perdigão"
            },

            // Linha 107 - Vila Reflor
            { 
                lat: -27.0260, 
                lng: -50.9350, 
                nome: "Vila Reflor",
                linha: "107 - Vila Reflor", 
                horario: "07:00", 
                tarifa: "R$ 3,50",
                cor: "#8b5cf6",
                codigo: "B_107",
                descricao: "Vila Reflor - Assentamento"
            },

            // Linha 109 - São Cristóvão
            { 
                lat: -27.0190, 
                lng: -50.9400, 
                nome: "São Cristóvão",
                linha: "109 - São Cristóvão", 
                horario: "18:10", 
                tarifa: "R$ 3,50",
                cor: "#ef4444",
                codigo: "C_109",
                descricao: "Bairro São Cristóvão"
            },

            // Pontos de referência importantes
            { 
                lat: -27.0230, 
                lng: -50.9180, 
                nome: "Prefeitura",
                linha: "Ponto de Referência", 
                horario: "24h", 
                tarifa: "Gratuito",
                cor: "#6b7280",
                codigo: "REF",
                descricao: "Prefeitura Municipal de Fraiburgo"
            },
            { 
                lat: -27.0245, 
                lng: -50.9160, 
                nome: "Hospital",
                linha: "Ponto de Referência", 
                horario: "24h", 
                tarifa: "Gratuito",
                cor: "#6b7280",
                codigo: "REF",
                descricao: "Hospital Municipal"
            }
        ];

        this.paradasOnibus = paradas;
        paradas.forEach((parada, index) => {
            this.criarMarcadorParada(parada, index);
        });

        // Adicionar círculo de proximidade
        this.criarCirculoProximidade();
    }

    /**
     * Cria marcador para parada de ônibus
     */
    criarMarcadorParada(parada, index) {
        const iconeParada = L.divIcon({
            className: 'marcador-parada',
            html: `
                <div style="
                    background: ${parada.cor}; 
                    width: 30px; 
                    height: 30px; 
                    border-radius: 50% 50% 50% 0; 
                    border: 3px solid white; 
                    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    font-weight: bold;
                    color: white;
                ">🚌</div>
            `,
            iconSize: [36, 36],
            iconAnchor: [18, 36]
        });

        const marcador = L.marker([parada.lat, parada.lng], {
            icon: iconeParada
        }).addTo(this.mapa);

        // Popup com informações da parada
        const popupContent = `
            <div style="padding: 15px; min-width: 250px; font-family: Arial, sans-serif;">
                <h4 style="margin: 0 0 10px 0; color: #8B2323; font-size: 16px;">
                    ${parada.linha}
                </h4>
                <div style="margin: 8px 0;">
                    <i class="fas fa-clock" style="color: #666; margin-right: 8px;"></i>
                    <span style="color: #666;">Próximo: ${parada.horario}</span>
                </div>
                <div style="margin: 8px 0;">
                    <i class="fas fa-dollar-sign" style="color: #666; margin-right: 8px;"></i>
                    <span style="color: #666;">Tarifa: ${parada.tarifa}</span>
                </div>
                <div style="margin: 8px 0;">
                    <i class="fas fa-map-marker-alt" style="color: #666; margin-right: 8px;"></i>
                    <span style="color: #666;">Parada próxima</span>
                </div>
                <div style="margin-top: 12px;">
                    <button onclick="mapaGratuito.calcularRota(${index})" 
                            style="background: #8B2323; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 12px; margin-right: 8px;">
                        <i class="fas fa-route" style="margin-right: 5px;"></i>
                        Calcular Rota
                    </button>
                    <button onclick="mapaGratuito.abrirNoGoogleMaps(${index})" 
                            style="background: #007bff; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                        <i class="fas fa-external-link-alt" style="margin-right: 5px;"></i>
                        Google Maps
                    </button>
                </div>
            </div>
        `;

        marcador.bindPopup(popupContent);
        this.marcadores.push(marcador);
    }

    /**
     * Calcula rota para uma parada específica
     */
    calcularRota(indiceParada) {
        if (!this.origem) {
            alert('Localização atual não disponível. Ative a geolocalização para calcular rotas.');
            return;
        }

        const parada = this.paradasOnibus[indiceParada];
        if (!parada) {
            console.error('Parada não encontrada:', indiceParada);
            return;
        }

        // Mostrar loading
        this.mostrarLoadingRota();

        // Calcular rota realista
        this.calcularRotaRealista(parada);
    }

    /**
     * Calcula rota realista usando OpenRouteService (gratuito)
     */
    async calcularRotaRealista(parada) {
        try {
            // Usar OpenRouteService para roteamento gratuito
            const response = await fetch(`https://api.openrouteservice.org/v2/directions/foot-walking?api_key=5b3ce3597851110001cf6248e8b3c5b4c4e64a0a8b3c5b4c4e64a0a&start=${this.origem.lng},${this.origem.lat}&end=${parada.lng},${parada.lat}`);
            
            if (response.ok) {
                const data = await response.json();
                this.desenharRotaRealista(data.features[0].geometry.coordinates, parada);
            } else {
                // Fallback para rota simulada se a API falhar
                this.desenharRotaSimulada(parada);
            }
        } catch (error) {
            console.log('Erro ao calcular rota, usando simulação:', error);
            this.desenharRotaSimulada(parada);
        }
    }

    /**
     * Desenha rota realista
     */
    desenharRotaRealista(coordenadas, parada) {
        // Limpar rotas anteriores
        this.limparRotas();

        // Converter coordenadas para formato Leaflet [lat, lng]
        const pontos = coordenadas.map(coord => [coord[1], coord[0]]);

        const rota = L.polyline(pontos, {
            color: '#3b82f6',
            weight: 5,
            opacity: 0.8,
            smoothFactor: 1
        }).addTo(this.mapa);

        this.rotas.push(rota);

        // Adicionar marcadores de início e fim
        const inicioMarker = L.marker([this.origem.lat, this.origem.lng], {
            icon: L.divIcon({
                className: 'marcador-inicio',
                html: '<div style="background: #10b981; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
                iconSize: [26, 26],
                iconAnchor: [13, 13]
            })
        }).addTo(this.mapa);

        const fimMarker = L.marker([parada.lat, parada.lng], {
            icon: L.divIcon({
                className: 'marcador-fim',
                html: '<div style="background: #ef4444; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
                iconSize: [26, 26],
                iconAnchor: [13, 13]
            })
        }).addTo(this.mapa);

        this.rotas.push(inicioMarker, fimMarker);

        // Ajustar visualização para mostrar a rota
        this.mapa.fitBounds(rota.getBounds(), { padding: [20, 20] });

        this.mostrarInformacoesRota(parada);
    }

    /**
     * Desenha rota simulada (fallback)
     */
    desenharRotaSimulada(parada) {
        // Limpar rotas anteriores
        this.limparRotas();

        // Criar linha com pontos intermediários para simular rota realista
        const pontos = this.criarPontosIntermediarios(
            [this.origem.lat, this.origem.lng],
            [parada.lat, parada.lng]
        );

        const rota = L.polyline(pontos, {
            color: '#3b82f6',
            weight: 5,
            opacity: 0.8,
            smoothFactor: 1
        }).addTo(this.mapa);

        this.rotas.push(rota);

        // Ajustar visualização para mostrar a rota
        this.mapa.fitBounds(rota.getBounds(), { padding: [20, 20] });

        this.mostrarInformacoesRota(parada);
    }

    /**
     * Cria pontos intermediários para simular rota realista
     */
    criarPontosIntermediarios(inicio, fim) {
        const pontos = [inicio];
        const numPontos = 5;
        
        for (let i = 1; i < numPontos; i++) {
            const fator = i / numPontos;
            const lat = inicio[0] + (fim[0] - inicio[0]) * fator + (Math.random() - 0.5) * 0.001;
            const lng = inicio[1] + (fim[1] - inicio[1]) * fator + (Math.random() - 0.5) * 0.001;
            pontos.push([lat, lng]);
        }
        
        pontos.push(fim);
        return pontos;
    }

    /**
     * Mostra loading durante cálculo de rota
     */
    mostrarLoadingRota() {
        const painel = document.getElementById('painel-rota');
        if (painel) {
            painel.innerHTML = `
                <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin: 10px 0; text-align: center;">
                    <div style="display: flex; align-items: center; justify-content: center; gap: 10px;">
                        <div class="spinner" style="width: 20px; height: 20px; border: 2px solid #e5e7eb; border-top: 2px solid #3b82f6; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                        <span style="color: #6b7280;">Calculando rota...</span>
                    </div>
                </div>
            `;
        }
    }

    /**
     * Mostra informações da rota calculada
     */
    mostrarInformacoesRota(parada) {
        // Calcular distância aproximada
        const distancia = this.calcularDistancia(
            this.origem.lat, this.origem.lng,
            parada.lat, parada.lng
        );

        const indiceParada = this.paradasOnibus.indexOf(parada);
        const tempoEstimado = Math.round(distancia * 1.5);

        const painel = document.getElementById('painel-rota');
        if (painel) {
            painel.innerHTML = `
                <div class="route-info-card">
                    <h4 style="margin: 0 0 1rem 0; color: #1f2937; display: flex; align-items: center; font-size: 1.25rem;">
                        <i class="fas fa-route" style="margin-right: 0.5rem; color: #3b82f6;"></i>
                        Rota para ${parada.nome}
                    </h4>
                    <p style="margin: 0 0 1rem 0; color: #6b7280; font-size: 0.875rem;">
                        ${parada.linha} • ${parada.descricao}
                    </p>
                    
                    <div class="route-stats">
                        <div class="route-stat">
                            <div class="route-stat-icon">
                                <i class="fas fa-road"></i>
                            </div>
                            <div class="route-stat-value">${distancia} km</div>
                            <div class="route-stat-label">Distância</div>
                        </div>
                        <div class="route-stat">
                            <div class="route-stat-icon">
                                <i class="fas fa-clock"></i>
                            </div>
                            <div class="route-stat-value">${tempoEstimado} min</div>
                            <div class="route-stat-label">Tempo a pé</div>
                        </div>
                        <div class="route-stat">
                            <div class="route-stat-icon">
                                <i class="fas fa-bus"></i>
                            </div>
                            <div class="route-stat-value">${parada.horario}</div>
                            <div class="route-stat-label">Próximo ônibus</div>
                        </div>
                        <div class="route-stat">
                            <div class="route-stat-icon">
                                <i class="fas fa-dollar-sign"></i>
                            </div>
                            <div class="route-stat-value">${parada.tarifa}</div>
                            <div class="route-stat-label">Tarifa</div>
                        </div>
                    </div>
                    
                    <div class="route-actions">
                        <button onclick="mapaGratuito.abrirNoGoogleMaps(${indiceParada})" 
                                class="route-btn route-btn-primary">
                            <i class="fas fa-external-link-alt"></i>
                            Google Maps
                        </button>
                        <button onclick="mapaGratuito.compartilharRota('${parada.nome}')" 
                                class="route-btn route-btn-success">
                            <i class="fas fa-share"></i>
                            Compartilhar
                        </button>
                        <button onclick="mapaGratuito.limparRota()" 
                                class="route-btn route-btn-secondary">
                            <i class="fas fa-times"></i>
                            Limpar Rota
                        </button>
                    </div>
                </div>
            `;
        }
    }

    /**
     * Calcula distância entre dois pontos (fórmula de Haversine)
     */
    calcularDistancia(lat1, lng1, lat2, lng2) {
        const R = 6371; // Raio da Terra em km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLng/2) * Math.sin(dLng/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return Math.round(R * c * 10) / 10;
    }

    /**
     * Abre rota no Google Maps
     */
    abrirNoGoogleMaps(indiceParada) {
        const parada = this.configuracao.paradas[indiceParada];
        if (parada && this.origem) {
            const url = `https://www.google.com/maps/dir/?api=1&origin=${this.origem.lat},${this.origem.lng}&destination=${parada.lat},${parada.lng}&travelmode=driving`;
            window.open(url, '_blank');
        }
    }

    /**
     * Compartilha rota
     */
    compartilharRota(nomeParada) {
        if (navigator.share) {
            navigator.share({
                title: `Rota para ${nomeParada} - Santa Terezinha`,
                text: `Confira a rota para a parada ${nomeParada} no sistema Santa Terezinha`,
                url: window.location.href
            });
        } else {
            navigator.clipboard.writeText(window.location.href).then(() => {
                alert('Link copiado para a área de transferência!');
            });
        }
    }

    /**
     * Limpa rota
     */
    limparRota() {
        this.limparRotas();
        const painel = document.getElementById('painel-rota');
        if (painel) {
            painel.innerHTML = '';
        }
    }

    /**
     * Limpa todas as rotas
     */
    limparRotas() {
        this.rotas.forEach(rota => {
            this.mapa.removeLayer(rota);
        });
        this.rotas = [];
    }

    /**
     * Cria círculo de proximidade
     */
    criarCirculoProximidade() {
        const circulo = L.circle([this.origem.lat, this.origem.lng], {
            color: '#8B2323',
            fillColor: '#8B2323',
            fillOpacity: 0.1,
            radius: 1000 // 1km
        }).addTo(this.mapa);
    }

    /**
     * Configura eventos do mapa
     */
    configurarEventos() {
        // Implementar eventos adicionais se necessário
    }
}

// Instância global do mapa gratuito
let mapaGratuito = null;

// Função para inicializar o mapa gratuito
function inicializarMapaGratuito() {
    const configuracao = {
        centro: { lat: -27.0233, lng: -50.9185 },
        zoom: 13
    };

    mapaGratuito = new MapaGratuito('mapaContainer', configuracao);
}


