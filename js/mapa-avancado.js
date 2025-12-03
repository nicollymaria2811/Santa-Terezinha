/**
 * Sistema de Mapa Avançado - Santa Terezinha Transporte
 * Baseado no exemplo do Google Maps Commutes
 */

class MapaAvancado {
    constructor(containerId, configuracao) {
        this.containerId = containerId;
        this.configuracao = configuracao;
        this.mapa = null;
        this.origem = null;
        this.destinos = [];
        this.destinoAtivo = null;
        this.marcadores = [];
        this.polylines = [];
        this.directionsService = null;
        this.directionsRenderer = null;
        this.placesService = null;
        this.autocomplete = null;
        
        this.inicializar();
    }

    /**
     * Inicializa o mapa e os serviços necessários
     */
    inicializar() {
        if (!this.verificarAPIKey()) {
            this.mostrarErro('Google Maps API Key não configurada');
            return;
        }

        this.criarMapa();
        this.configurarServicos();
        this.configurarEventos();
    }

    /**
     * Verifica se a API key está configurada
     */
    verificarAPIKey() {
        return typeof API_KEYS !== 'undefined' && 
               API_KEYS.GOOGLE_MAPS && 
               API_KEYS.GOOGLE_MAPS !== 'SUA_API_KEY_AQUI';
    }

    /**
     * Cria o mapa do Google Maps
     */
    criarMapa() {
        const opcoesMapa = {
            center: this.configuracao.centro || { lat: -27.0233, lng: -50.9185 },
            zoom: this.configuracao.zoom || 14,
            mapTypeId: 'roadmap',
            styles: [
                {
                    featureType: 'poi',
                    elementType: 'labels',
                    stylers: [{ visibility: 'off' }]
                }
            ],
            fullscreenControl: true,
            mapTypeControl: false,
            streetViewControl: false,
            zoomControl: true
        };

        this.mapa = new google.maps.Map(
            document.getElementById(this.containerId), 
            opcoesMapa
        );
    }

    /**
     * Configura os serviços do Google Maps
     */
    configurarServicos() {
        this.directionsService = new google.maps.DirectionsService();
        this.directionsRenderer = new google.maps.DirectionsRenderer({
            suppressMarkers: true,
            polylineOptions: {
                strokeColor: '#8B2323',
                strokeWeight: 4,
                strokeOpacity: 0.8
            }
        });
        this.directionsRenderer.setMap(this.mapa);
        
        this.placesService = new google.maps.places.PlacesService(this.mapa);
    }

    /**
     * Configura eventos do mapa
     */
    configurarEventos() {
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
        const marcador = new google.maps.Marker({
            position: this.origem,
            map: this.mapa,
            title: "Você está aqui!",
            icon: {
                url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                scaledSize: new google.maps.Size(40, 40)
            },
            zIndex: 1000
        });

        this.marcadores.push(marcador);
        this.mapa.setCenter(this.origem);
    }

    /**
     * Carrega as paradas de ônibus
     */
    carregarParadasOnibus() {
        const paradas = this.configuracao.paradas || [
            { 
                lat: -27.0220, 
                lng: -50.9200, 
                linha: "Centro - São José", 
                horario: "08:00", 
                tarifa: "R$ 3,50",
                cor: "#FF6B6B"
            },
            { 
                lat: -27.0245, 
                lng: -50.9150, 
                linha: "Centro - Industrial", 
                horario: "08:15", 
                tarifa: "R$ 3,50",
                cor: "#4ECDC4"
            },
            { 
                lat: -27.0210, 
                lng: -50.9250, 
                linha: "Centro - Bairro Alto", 
                horario: "08:30", 
                tarifa: "R$ 3,50",
                cor: "#45B7D1"
            },
            { 
                lat: -27.0250, 
                lng: -50.9100, 
                linha: "Centro - Estação", 
                horario: "08:45", 
                tarifa: "R$ 3,50",
                cor: "#96CEB4"
            },
            { 
                lat: -27.0200, 
                lng: -50.9300, 
                linha: "Centro - Shopping", 
                horario: "09:00", 
                tarifa: "R$ 3,50",
                cor: "#FFEAA7"
            }
        ];

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
        const marcador = new google.maps.Marker({
            position: { lat: parada.lat, lng: parada.lng },
            map: this.mapa,
            title: `${parada.linha} - Próximo: ${parada.horario}`,
            icon: {
                url: 'https://maps.google.com/mapfiles/ms/icons/bus.png',
                scaledSize: new google.maps.Size(30, 30)
            },
            zIndex: 500
        });

        // Info window com detalhes da parada
        const infoWindow = new google.maps.InfoWindow({
            content: this.criarConteudoInfoWindow(parada)
        });

        marcador.addListener('click', () => {
            this.selecionarParada(parada, marcador, infoWindow);
        });

        this.marcadores.push(marcador);
    }

    /**
     * Cria conteúdo do info window
     */
    criarConteudoInfoWindow(parada) {
        return `
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
                    <button onclick="mapaAvancado.calcularRota('${parada.linha}')" 
                            style="background: #8B2323; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer; font-size: 12px;">
                        <i class="fas fa-route" style="margin-right: 5px;"></i>
                        Calcular Rota
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Seleciona uma parada e calcula rota
     */
    selecionarParada(parada, marcador, infoWindow) {
        // Fechar outros info windows
        this.fecharInfoWindows();
        
        // Abrir info window da parada selecionada
        infoWindow.open(this.mapa, marcador);
        
        // Calcular rota automaticamente
        this.calcularRota(parada.linha);
    }

    /**
     * Calcula rota para uma parada específica
     */
    calcularRota(nomeParada) {
        if (!this.origem) {
            console.error('Origem não definida');
            return;
        }

        const parada = this.configuracao.paradas.find(p => p.linha === nomeParada);
        if (!parada) {
            console.error('Parada não encontrada:', nomeParada);
            return;
        }

        const request = {
            origin: this.origem,
            destination: { lat: parada.lat, lng: parada.lng },
            travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.METRIC
        };

        this.directionsService.route(request, (result, status) => {
            if (status === 'OK') {
                this.directionsRenderer.setDirections(result);
                this.mostrarInformacoesRota(result, parada);
            } else {
                console.error('Erro ao calcular rota:', status);
                this.mostrarErro('Erro ao calcular rota. Tente novamente.');
            }
        });
    }

    /**
     * Mostra informações da rota calculada
     */
    mostrarInformacoesRota(resultado, parada) {
        const rota = resultado.routes[0];
        const percurso = rota.legs[0];
        
        const distancia = percurso.distance.text;
        const duracao = percurso.duration.text;
        
        // Criar painel de informações da rota
        this.criarPainelRota(parada, distancia, duracao);
    }

    /**
     * Cria painel com informações da rota
     */
    criarPainelRota(parada, distancia, duracao) {
        const painel = document.getElementById('painel-rota');
        if (painel) {
            painel.innerHTML = `
                <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); margin: 10px 0;">
                    <h4 style="margin: 0 0 15px 0; color: #8B2323; display: flex; align-items: center;">
                        <i class="fas fa-route" style="margin-right: 8px;"></i>
                        Rota para ${parada.linha}
                    </h4>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                        <div style="text-align: center; padding: 10px; background: #f8f9fa; border-radius: 6px;">
                            <i class="fas fa-road" style="color: #8B2323; font-size: 20px; margin-bottom: 5px;"></i>
                            <div style="font-weight: bold; color: #333;">${distancia}</div>
                            <div style="font-size: 12px; color: #666;">Distância</div>
                        </div>
                        <div style="text-align: center; padding: 10px; background: #f8f9fa; border-radius: 6px;">
                            <i class="fas fa-clock" style="color: #8B2323; font-size: 20px; margin-bottom: 5px;"></i>
                            <div style="font-weight: bold; color: #333;">${duracao}</div>
                            <div style="font-size: 12px; color: #666;">Tempo estimado</div>
                        </div>
                    </div>
                    <div style="display: flex; gap: 10px;">
                        <button onclick="mapaAvancado.abrirNoGoogleMaps('${parada.linha}')" 
                                style="flex: 1; background: #8B2323; color: white; border: none; padding: 10px; border-radius: 4px; cursor: pointer; font-size: 14px;">
                            <i class="fas fa-external-link-alt" style="margin-right: 5px;"></i>
                            Abrir no Google Maps
                        </button>
                        <button onclick="mapaAvancado.limparRota()" 
                                style="flex: 1; background: #6c757d; color: white; border: none; padding: 10px; border-radius: 4px; cursor: pointer; font-size: 14px;">
                            <i class="fas fa-times" style="margin-right: 5px;"></i>
                            Limpar Rota
                        </button>
                    </div>
                </div>
            `;
        }
    }

    /**
     * Abre rota no Google Maps
     */
    abrirNoGoogleMaps(nomeParada) {
        const parada = this.configuracao.paradas.find(p => p.linha === nomeParada);
        if (parada) {
            const url = `https://www.google.com/maps/dir/?api=1&origin=${this.origem.lat},${this.origem.lng}&destination=${parada.lat},${parada.lng}&travelmode=driving`;
            window.open(url, '_blank');
        }
    }

    /**
     * Limpa a rota atual
     */
    limparRota() {
        this.directionsRenderer.setDirections({ routes: [] });
        const painel = document.getElementById('painel-rota');
        if (painel) {
            painel.innerHTML = '';
        }
    }

    /**
     * Cria círculo de proximidade
     */
    criarCirculoProximidade() {
        const circulo = new google.maps.Circle({
            strokeColor: '#8B2323',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#8B2323',
            fillOpacity: 0.1,
            map: this.mapa,
            center: this.origem,
            radius: 1000 // 1km
        });
    }

    /**
     * Fecha todos os info windows
     */
    fecharInfoWindows() {
        // Implementar se necessário
    }

    /**
     * Mostra erro no mapa
     */
    mostrarErro(mensagem) {
        const container = document.getElementById(this.containerId);
        if (container) {
            container.innerHTML = `
                <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100%; padding: 20px; text-align: center; background: #f8f9fa; border-radius: 8px;">
                    <div style="font-size: 48px; margin-bottom: 16px;">🗺️</div>
                    <h3 style="color: #dc3545; margin: 0 0 12px 0;">Erro no Mapa</h3>
                    <div style="color: #6c757d; margin-bottom: 16px;">
                        <div style="font-size: 24px; margin-bottom: 8px;">⚠️</div>
                        <div style="font-weight: 500; margin-bottom: 8px;">Ops! Algo deu errado.</div>
                        <div style="font-size: 14px;">${mensagem}</div>
                    </div>
                </div>
            `;
        }
    }

    /**
     * Configura eventos do mapa
     */
    configurarEventos() {
        // Implementar eventos adicionais se necessário
    }
}

// Instância global do mapa avançado
let mapaAvancado = null;

// Função para inicializar o mapa avançado
function inicializarMapaAvancado() {
    const configuracao = {
        centro: { lat: -27.0233, lng: -50.9185 },
        zoom: 14,
        paradas: [
            { 
                lat: -27.0220, 
                lng: -50.9200, 
                linha: "Centro - São José", 
                horario: "08:00", 
                tarifa: "R$ 3,50",
                cor: "#FF6B6B"
            },
            { 
                lat: -27.0245, 
                lng: -50.9150, 
                linha: "Centro - Industrial", 
                horario: "08:15", 
                tarifa: "R$ 3,50",
                cor: "#4ECDC4"
            },
            { 
                lat: -27.0210, 
                lng: -50.9250, 
                linha: "Centro - Bairro Alto", 
                horario: "08:30", 
                tarifa: "R$ 3,50",
                cor: "#45B7D1"
            },
            { 
                lat: -27.0250, 
                lng: -50.9100, 
                linha: "Centro - Estação", 
                horario: "08:45", 
                tarifa: "R$ 3,50",
                cor: "#96CEB4"
            },
            { 
                lat: -27.0200, 
                lng: -50.9300, 
                linha: "Centro - Shopping", 
                horario: "09:00", 
                tarifa: "R$ 3,50",
                cor: "#FFEAA7"
            }
        ]
    };

    mapaAvancado = new MapaAvancado('mapaContainer', configuracao);
}

