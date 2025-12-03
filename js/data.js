// Dados simulados para o sistema de transporte público Santa Terezinha
// NOTA: Usuários e senhas agora são gerenciados pelo backend (PHP/API)
// Este arquivo mantém apenas dados auxiliares como códigos de itinerário

// Códigos de itinerário e suas descrições
const codigosItinerario = {
    // Linha 101
    'B': 'Sai Gruta (São Cristóvão / São Miguel / Terminal)',
    'C': 'Sai Miguel (Terminal / Vila Reflor)',
    'D': 'Sai Rodoviária (Terminal / São Miguel / Gruta)',
    'E': 'Sai São Miguel (São Cristóvão / Gruta / Terminal)',
    'F': 'Sai São Miguel (Terminal)',
    'G': 'Sai São Miguel (Terminal)',
    'H': 'Sai São Miguel (Terminal / Até Rodoviária / Terminal)',
    'I': 'Sai São Miguel (Terminal / Prefeitura)',
    'J': 'Sai São Miguel (Terminal / Rodoviária / Maçã / Sanefrai / Terminal)',
    'K': 'Sai São Miguel (Terminal / Rodoviária / Maçã / Terminal)',
    'L': 'Sai Vila Reflor (Terminal / São Miguel)',
    'M': 'Saída Granja (São Miguel / Bem-te-vi / Senai)',
    'N': 'Sanefrai (Terminal / São Miguel)',
    'O': 'São Miguel (Hospital / Terminal / Rodoviária / Terminal)',
    'P': 'Facelpa (Terminal / São Sebastião / São Miguel)',
    'Q': 'Granja Peranzolle',
    'R': 'Prefeitura (Terminal / São Miguel)',
    'S': 'Rodoviária (Terminal / São Cristóvão / São Miguel)',
    'T': 'Sanefrai (Maçã / Terminal / São Miguel)',
    'U': 'Senai',
    'V': 'Senai',
    'W': 'Terminal (São Miguel)',
    'X': 'Terminal (Rodoviária / São Miguel)',
    'Y': 'Terminal (São Cristóvão / São Miguel / Terminal)',
    'Z': 'Terminal (São Miguel / São Cristóvão)',
    
    // Linha 101-1
    'B_101_1': 'Terminal / Barro Preto / Terminal',
    
    // Linha 104
    'B_104': 'São Sebastião / Santo Antônio / São Sebastião',
    'C_104': 'Terminal / São Sebastião',
    
    // Linha 106
    'B_106': 'Macieira / Terminal',
    'C_106': 'Faxinal / Macieira / Liberata / Terminal',
    'D_106': 'Faxinal / Macieira / Liberata / Terminal / Até P.A',
    'E_106': 'Faxinal / Macieira / São Luiz / Liberata / Terminal',
    'F_106': 'Macieira / Liberata / Terminal',
    'G_106': 'Macieira / Liberata / Terminal / São Sebastião',
    'H_106': 'P.A / Terminal / Liberata / São Luiz / Macieira / Terminal',
    'I_106': 'Perdigão / Macieira / Liberata / Terminal',
    'J_106': 'Perdigão / Macieira / Rodoviária',
    'K_106': 'São Sebastião / P.A / Tic Tac / Liberata / Macieira / Perdigão',
    'L_106': 'São Sebastião / Terminal / Liberata / Macieira / São Sebastião',
    'M_106': 'São Sebastião / Tic Tac / Liberata / Macieira / Perdigão',
    'N_106': 'São Sebastião / Terminal / Liberata / São Luiz / Macieira / Centro',
    'O_106': 'Terminal / Liberata / Macieira',
    'P_106': 'Terminal / Liberata / Macieira / Faxinal / Terminal',
    'Q_106': 'Terminal / Liberata / Macieira / Perdigão',
    'R_106': 'Terminal / Liberata / Macieira / Perdigão / Macieira / Faxinal / Até Rodoviária',
    'S_106': 'Terminal / Liberata / São Luiz / Macieira',
    'T_106': 'Terminal / Macieira',
    'U_106': 'Terminal / Macieira / Faxinal',
    'V_106': 'Terminal / Renar Móveis / Liberata / São Luiz / Macieira / Terminal',
    
    // Linha 107
    'B_107': 'Terminal / Vila Reflor / Assentamento / Terminal',
    'C_107': 'Terminal / Vila Reflor / Até Rodoviária',
    
    // Linha 109
    'B_109': 'Terminal / São Cristóvão / Gruta / São Miguel / Terminal',
    'C_109': 'Terminal / São Cristóvão / Gruta / Terminal'
};

// Rotas e horários - Sistema Santa Terezinha Transporte
const rotas = [
    {
        id: 101,
        numero: '101',
        nome: 'São Miguel Santa Terezinha - Fraiburgo',
        origem: 'São Miguel',
        destino: 'Fraiburgo',
        direcoes: {
            ida: {
                diasUteis: [
                    { horario: '05:50', codigo: 'F' },
                    { horario: '06:50', codigo: 'X' },
                    { horario: '07:20', codigo: 'F' },
                    { horario: '07:50', codigo: 'F' },
                    { horario: '08:50', codigo: 'X' },
                    { horario: '09:20', codigo: 'F' },
                    { horario: '11:20', codigo: 'F' },
                    { horario: '11:50', codigo: 'F' },
                    { horario: '12:50', codigo: 'X' },
                    { horario: '12:50', codigo: 'V' },
                    { horario: '13:00', codigo: 'F' },
                    { horario: '13:20', codigo: 'F' },
                    { horario: '13:50', codigo: 'X' },
                    { horario: '13:50', codigo: 'F' },
                    { horario: '14:20', codigo: 'F' },
                    { horario: '14:50', codigo: 'F' },
                    { horario: '16:20', codigo: 'X' },
                    { horario: '16:20', codigo: 'F' },
                    { horario: '16:50', codigo: 'F' },
                    { horario: '17:50', codigo: 'F' },
                    { horario: '18:00', codigo: 'X' },
                    { horario: '18:20', codigo: 'F' },
                    { horario: '18:50', codigo: 'F' },
                    { horario: '19:20', codigo: 'F' },
                    { horario: '23:10', codigo: 'P' }
                ],
                sabado: [
                    { horario: '05:30', codigo: 'W' },
                    { horario: '05:50', codigo: 'F' },
                    { horario: '06:10', codigo: 'W' },
                    { horario: '06:30', codigo: 'W' },
                    { horario: '06:55', codigo: 'X' },
                    { horario: '07:20', codigo: 'F' },
                    { horario: '08:00', codigo: 'W' },
                    { horario: '08:30', codigo: 'W' },
                    { horario: '08:50', codigo: 'X' },
                    { horario: '08:50', codigo: 'F' },
                    { horario: '09:20', codigo: 'F' },
                    { horario: '09:30', codigo: 'Y' },
                    { horario: '10:00', codigo: 'W' },
                    { horario: '10:20', codigo: 'F' },
                    { horario: '11:00', codigo: 'W' },
                    { horario: '11:20', codigo: 'F' },
                    { horario: '12:00', codigo: 'W' },
                    { horario: '12:55', codigo: 'X' },
                    { horario: '13:50', codigo: 'S' },
                    { horario: '14:00', codigo: 'Y' },
                    { horario: '14:20', codigo: 'F' },
                    { horario: '15:00', codigo: 'W' },
                    { horario: '15:20', codigo: 'F' },
                    { horario: '17:00', codigo: 'W' },
                    { horario: '18:00', codigo: 'X' },
                    { horario: '18:20', codigo: 'F' },
                    { horario: '19:00', codigo: 'W' },
                    { horario: '19:20', codigo: 'F' },
                    { horario: '20:00', codigo: 'W' },
                    { horario: '21:00', codigo: 'W' },
                    { horario: '22:00', codigo: 'W' },
                    { horario: '23:10', codigo: 'P' }
                ],
                domingo: [
                    { horario: '05:00', codigo: 'W' },
                    { horario: '05:20', codigo: 'F' },
                    { horario: '06:00', codigo: 'W' },
                    { horario: '06:30', codigo: 'W' },
                    { horario: '06:50', codigo: 'X' },
                    { horario: '06:50', codigo: 'F' },
                    { horario: '07:00', codigo: 'D' },
                    { horario: '07:20', codigo: 'F' },
                    { horario: '08:00', codigo: 'W' },
                    { horario: '08:50', codigo: 'X' },
                    { horario: '08:55', codigo: 'S' },
                    { horario: '10:00', codigo: 'W' },
                    { horario: '11:00', codigo: 'W' },
                    { horario: '11:20', codigo: 'F' },
                    { horario: '12:50', codigo: 'X' },
                    { horario: '13:50', codigo: 'X' },
                    { horario: '15:50', codigo: 'X' },
                    { horario: '16:50', codigo: 'X' },
                    { horario: '16:55', codigo: 'D' },
                    { horario: '22:00', codigo: 'W' },
                    { horario: '23:10', codigo: 'P' }
                ]
            },
            volta: {
                diasUteis: [
                    { horario: '05:55', codigo: 'Q' },
                    { horario: '06:20', codigo: 'H' },
                    { horario: '06:30', codigo: 'C' },
                    { horario: '06:50', codigo: 'I' },
                    { horario: '08:20', codigo: 'H' },
                    { horario: '10:20', codigo: 'Z' },
                    { horario: '11:20', codigo: 'I' },
                    { horario: '11:30', codigo: 'R' },
                    { horario: '12:20', codigo: 'L' },
                    { horario: '12:20', codigo: 'H' },
                    { horario: '12:50', codigo: 'I' },
                    { horario: '13:20', codigo: 'H' },
                    { horario: '15:20', codigo: 'Z' },
                    { horario: '15:50', codigo: 'H' },
                    { horario: '16:10', codigo: 'M' },
                    { horario: '17:20', codigo: 'H' },
                    { horario: '17:30', codigo: 'R' },
                    { horario: '17:30', codigo: 'U' },
                    { horario: '20:20', codigo: 'J' },
                    { horario: '20:30', codigo: 'G' },
                    { horario: '21:00', codigo: 'K' },
                    { horario: '21:20', codigo: 'G' },
                    { horario: '21:50', codigo: 'T' },
                    { horario: '22:20', codigo: 'G' },
                    { horario: '23:30', codigo: 'G' }
                ],
                sabado: [
                    { horario: '05:55', codigo: 'Q' },
                    { horario: '06:20', codigo: 'H' },
                    { horario: '06:20', codigo: 'O' },
                    { horario: '06:50', codigo: 'K' },
                    { horario: '08:20', codigo: 'H' },
                    { horario: '12:20', codigo: 'H' },
                    { horario: '13:20', codigo: 'H' },
                    { horario: '16:00', codigo: 'Z' },
                    { horario: '16:10', codigo: 'M' },
                    { horario: '16:20', codigo: 'H' },
                    { horario: '17:20', codigo: 'H' },
                    { horario: '17:20', codigo: 'E' },
                    { horario: '20:20', codigo: 'K' },
                    { horario: '20:20', codigo: 'G' },
                    { horario: '21:20', codigo: 'K' },
                    { horario: '21:20', codigo: 'G' },
                    { horario: '21:50', codigo: 'N' },
                    { horario: '22:20', codigo: 'G' },
                    { horario: '23:30', codigo: 'G' }
                ],
                domingo: [
                    { horario: '05:55', codigo: 'Q' },
                    { horario: '06:15', codigo: 'H' },
                    { horario: '07:20', codigo: 'B' },
                    { horario: '08:20', codigo: 'H' },
                    { horario: '10:20', codigo: 'H' },
                    { horario: '11:20', codigo: 'H' },
                    { horario: '12:20', codigo: 'H' },
                    { horario: '13:20', codigo: 'H' },
                    { horario: '16:10', codigo: 'M' },
                    { horario: '16:20', codigo: 'H' },
                    { horario: '17:20', codigo: 'H' },
                    { horario: '22:20', codigo: 'G' }
                ]
            }
        },
        duracao: '30 min',
        tarifa: 'R$ 3,50',
        status: 'operando'
    },
    {
        id: 1011,
        numero: '101-1',
        nome: 'Barro Preto Santa Terezinha - Fraiburgo',
        origem: 'Barro Preto',
        destino: 'Fraiburgo',
        direcoes: {
            ida: {
                terca: [
                    { horario: '07:40', codigo: 'B_101_1' },
                    { horario: '15:00', codigo: 'B_101_1' }
                ]
            }
        },
        duracao: '25 min',
        tarifa: 'R$ 3,50',
        status: 'operando'
    },
    {
        id: 104,
        numero: '104',
        nome: 'São Sebastião / Santo Antônio Santa Terezinha - Fraiburgo',
        origem: 'São Sebastião / Santo Antônio',
        destino: 'Fraiburgo',
        direcoes: {
            ida: {
                diasUteis: [
                    { horario: '12:10', codigo: 'C_104' }
                ],
                sabado: [
                    { horario: '06:20', codigo: 'B_104' },
                    { horario: '07:00', codigo: 'B_104' },
                    { horario: '08:00', codigo: 'B_104' },
                    { horario: '09:00', codigo: 'B_104' },
                    { horario: '10:00', codigo: 'B_104' },
                    { horario: '11:00', codigo: 'B_104' },
                    { horario: '12:00', codigo: 'B_104' },
                    { horario: '13:00', codigo: 'B_104' },
                    { horario: '14:00', codigo: 'B_104' },
                    { horario: '15:00', codigo: 'B_104' },
                    { horario: '16:00', codigo: 'B_104' },
                    { horario: '17:00', codigo: 'B_104' },
                    { horario: '18:00', codigo: 'B_104' },
                    { horario: '19:00', codigo: 'B_104' },
                    { horario: '20:00', codigo: 'B_104' },
                    { horario: '21:00', codigo: 'B_104' }
                ],
                domingo: [
                    { horario: '07:00', codigo: 'B_104' },
                    { horario: '09:00', codigo: 'B_104' },
                    { horario: '11:00', codigo: 'B_104' },
                    { horario: '14:00', codigo: 'B_104' },
                    { horario: '15:00', codigo: 'B_104' },
                    { horario: '17:00', codigo: 'B_104' },
                    { horario: '19:00', codigo: 'B_104' }
                ]
            }
        },
        duracao: '35 min',
        tarifa: 'R$ 3,50',
        status: 'operando'
    },
    {
        id: 106,
        numero: '106',
        nome: 'Macieira / Liberata Santa Terezinha - Fraiburgo',
        origem: 'Macieira / Liberata',
        destino: 'Fraiburgo',
        direcoes: {
            ida: {
                diasUteis: [
                    { horario: '06:00', codigo: 'T_106' },
                    { horario: '08:30', codigo: 'U_106' },
                    { horario: '11:00', codigo: 'O_106' },
                    { horario: '11:00', codigo: 'S_106' },
                    { horario: '12:50', codigo: 'N_106' },
                    { horario: '15:30', codigo: 'Q_106' },
                    { horario: '15:50', codigo: 'H_106' },
                    { horario: '17:00', codigo: 'V_106' },
                    { horario: '17:50', codigo: 'H_106' }
                ],
                sabado: [
                    { horario: '06:00', codigo: 'O_106' },
                    { horario: '06:30', codigo: 'U_106' },
                    { horario: '06:45', codigo: 'M_106' },
                    { horario: '08:30', codigo: 'U_106' },
                    { horario: '11:15', codigo: 'O_106' },
                    { horario: '12:00', codigo: 'P_106' },
                    { horario: '12:50', codigo: 'N_106' },
                    { horario: '15:30', codigo: 'Q_106' },
                    { horario: '16:00', codigo: 'P_106' },
                    { horario: '18:00', codigo: 'S_106' }
                ],
                domingo: [
                    { horario: '07:15', codigo: 'R_106' },
                    { horario: '13:00', codigo: 'L_106' },
                    { horario: '15:30', codigo: 'M_106' },
                    { horario: '18:15', codigo: 'P_106' }
                ]
            },
            volta: {
                diasUteis: [
                    { horario: '06:15', codigo: 'G_106' },
                    { horario: '06:45', codigo: 'K_106' },
                    { horario: '08:00', codigo: 'B_106' },
                    { horario: '08:50', codigo: 'E_106' },
                    { horario: '08:55', codigo: 'C_106' },
                    { horario: '08:55', codigo: 'D_106' },
                    { horario: '11:45', codigo: 'F_106' },
                    { horario: '12:45', codigo: 'E_106' },
                    { horario: '13:00', codigo: 'B_106' },
                    { horario: '16:30', codigo: 'I_106' }
                ],
                sabado: [
                    { horario: '06:15', codigo: 'G_106' },
                    { horario: '07:00', codigo: 'E_106' },
                    { horario: '08:00', codigo: 'B_106' },
                    { horario: '08:50', codigo: 'E_106' },
                    { horario: '16:30', codigo: 'I_106' },
                    { horario: '18:30', codigo: 'B_106' }
                ],
                domingo: [
                    { horario: '16:00', codigo: 'J_106' }
                ]
            }
        },
        duracao: '40 min',
        tarifa: 'R$ 3,50',
        status: 'operando'
    },
    {
        id: 107,
        numero: '107',
        nome: 'Vila Reflor Santa Terezinha - Fraiburgo',
        origem: 'Vila Reflor',
        destino: 'Fraiburgo',
        direcoes: {
            ida: {
                diasUteis: [
                    { horario: '07:00', codigo: 'B_107' },
                    { horario: '11:45', codigo: 'B_107' },
                    { horario: '15:30', codigo: 'C_107' },
                    { horario: '18:00', codigo: 'B_107' }
                ],
                sabado: [
                    { horario: '07:00', codigo: 'B_107' },
                    { horario: '11:00', codigo: 'B_107' },
                    { horario: '15:00', codigo: 'B_107' }
                ]
            }
        },
        duracao: '20 min',
        tarifa: 'R$ 3,50',
        status: 'operando'
    },
    {
        id: 109,
        numero: '109',
        nome: 'São Cristóvão Santa Terezinha - Fraiburgo',
        origem: 'São Cristóvão',
        destino: 'Fraiburgo',
        direcoes: {
            ida: {
                diasUteis: [
                    { horario: '18:10', codigo: 'C_109' }
                ],
                sabado: [
                    { horario: '07:40', codigo: 'B_109' },
                    { horario: '12:10', codigo: 'C_109' },
                    { horario: '18:00', codigo: 'C_109' }
                ],
                domingo: [
                    { horario: '07:00', codigo: 'B_109' },
                    { horario: '07:05', codigo: 'C_109' }
                ]
            }
        },
        duracao: '25 min',
        tarifa: 'R$ 3,50',
        status: 'operando'
    }
];

// Avisos e notícias
const avisos = [
    {
        id: 1,
        titulo: 'Atraso na Linha Centro - Bairro São José',
        conteudo: 'A linha Centro - Bairro São José está com atraso de aproximadamente 15 minutos devido a problemas no trânsito.',
        data: '2024-12-09 14:30',
        tipo: 'atraso',
        prioridade: 'alta'
    },
    {
        id: 2,
        titulo: 'Feriado Municipal - Alteração de Horários',
        conteudo: 'No dia 15/12, feriado municipal, os horários das linhas serão alterados. Consulte os novos horários nos pontos de parada.',
        data: '2024-12-09 10:00',
        tipo: 'feriado',
        prioridade: 'media'
    },
    {
        id: 3,
        titulo: 'Nova Linha - Centro - Shopping',
        conteudo: 'A partir de 20/12, nova linha será inaugurada: Centro - Shopping. Horários disponíveis em breve.',
        data: '2024-12-09 09:00',
        tipo: 'novidade',
        prioridade: 'baixa'
    },
    {
        id: 4,
        titulo: 'Manutenção Programada - Linha Industrial',
        conteudo: 'A linha Centro - Bairro Industrial passará por manutenção programada no dia 12/12, das 22h às 4h.',
        data: '2024-12-09 08:00',
        tipo: 'manutencao',
        prioridade: 'media'
    }
];

// Chamados técnicos
const chamados = [
    {
        id: 1,
        motorista: 'Carlos Santos',
        veiculo: 'Ônibus 001',
        tipo: 'mecanico',
        descricao: 'Barulho estranho no motor, possível problema na correia dentada.',
        urgencia: 'alta',
        status: 'aberto',
        data: '2024-12-09 15:30',
        mecanico: null
    },
    {
        id: 2,
        motorista: 'Ana Silva',
        veiculo: 'Ônibus 003',
        tipo: 'eletrico',
        descricao: 'Luzes internas não estão funcionando corretamente.',
        urgencia: 'media',
        status: 'em_andamento',
        data: '2024-12-09 14:15',
        mecanico: 'Pedro Oliveira'
    },
    {
        id: 3,
        motorista: 'Roberto Lima',
        veiculo: 'Ônibus 005',
        tipo: 'pneu',
        descricao: 'Pneu traseiro direito com desgaste irregular.',
        urgencia: 'baixa',
        status: 'resolvido',
        data: '2024-12-09 13:00',
        mecanico: 'Pedro Oliveira',
        solucao: {
            descricao: 'Pneu foi trocado por um novo da mesma medida e especificação.',
            pecas: '1x Pneu 275/70R22.5 - Bridgestone',
            custo: 450.00,
            observacoes: 'Pneu estava com desgaste irregular devido ao alinhamento incorreto. Foi feito alinhamento completo.',
            data: '2024-12-09 14:30'
        }
    }
];

// Escalas dos motoristas
const escalas = {
    'motorista1': [
        {
            id: 1,
            data: '2024-12-09',
            turno: 'Manhã',
            horario: '06:00 - 14:00',
            linha: 'Centro - Bairro São José',
            veiculo: 'Ônibus 001',
            status: 'confirmado',
            tipo: 'fixa'
        },
        {
            id: 2,
            data: '2024-12-10',
            turno: 'Tarde',
            horario: '14:00 - 22:00',
            linha: 'Centro - Bairro Industrial',
            veiculo: 'Ônibus 002',
            status: 'pendente',
            tipo: 'fixa'
        },
        {
            id: 3,
            data: '2024-12-11',
            turno: 'Manhã',
            horario: '06:00 - 14:00',
            linha: 'Centro - Bairro Universitário',
            veiculo: 'Ônibus 003',
            status: 'confirmado',
            tipo: 'temporaria',
            dataFim: '2024-12-20'
        }
    ]
};

// Checklist de manutenção
const checklistManutencao = [
    { id: 1, item: 'Verificar nível de óleo do motor', concluido: false },
    { id: 2, item: 'Verificar nível de água do radiador', concluido: false },
    { id: 3, item: 'Verificar pressão dos pneus', concluido: false },
    { id: 4, item: 'Testar sistema de freios', concluido: false },
    { id: 5, item: 'Verificar funcionamento das luzes', concluido: false },
    { id: 6, item: 'Verificar sistema de ar condicionado', concluido: false },
    { id: 7, item: 'Verificar funcionamento das portas', concluido: false },
    { id: 8, item: 'Verificar limpeza interna e externa', concluido: false }
];

// Status da frota
const statusFrota = {
    total: 15,
    disponiveis: 12,
    emManutencao: 2,
    foraDeServico: 1
};

// Status dos motoristas
const statusMotoristas = {
    total: 20,
    dirigindo: 12,
    foraDeEscala: 8
};

// Mensagens do chat
const mensagensChat = [
    {
        id: 1,
        usuario: 'João Silva',
        mensagem: 'Boa tarde! O ônibus da linha Centro - São José está atrasado?',
        data: '2024-12-09 15:45',
        tipo: 'user'
    },
    {
        id: 2,
        usuario: 'Sistema',
        mensagem: 'Olá João! Sim, a linha Centro - São José está com atraso de aproximadamente 15 minutos devido ao trânsito. Obrigado pela paciência!',
        data: '2024-12-09 15:46',
        tipo: 'system'
    },
    {
        id: 3,
        usuario: 'Maria Santos',
        mensagem: 'Qual o horário do último ônibus para o Bairro Industrial?',
        data: '2024-12-09 16:20',
        tipo: 'user'
    },
    {
        id: 4,
        usuario: 'Sistema',
        mensagem: 'Olá Maria! O último ônibus da linha Centro - Bairro Industrial sai às 20:15. Qualquer dúvida, estamos aqui!',
        data: '2024-12-09 16:21',
        tipo: 'system'
    }
];

// Funções para manipular dados
function buscarRotas(termo) {
    if (!termo) return rotas;
    return rotas.filter(rota => 
        rota.nome.toLowerCase().includes(termo.toLowerCase()) ||
        rota.origem.toLowerCase().includes(termo.toLowerCase()) ||
        rota.destino.toLowerCase().includes(termo.toLowerCase()) ||
        rota.numero.includes(termo)
    );
}

function obterHorariosPorDia(rota, dia) {
    if (!rota.direcoes) return [];
    
    const horarios = [];
    
    // Buscar horários de ida
    if (rota.direcoes.ida && rota.direcoes.ida[dia]) {
        rota.direcoes.ida[dia].forEach(item => {
            horarios.push({
                horario: item.horario,
                codigo: item.codigo,
                direcao: 'ida',
                descricao: codigosItinerario[item.codigo] || 'Código não encontrado'
            });
        });
    }
    
    // Buscar horários de volta
    if (rota.direcoes.volta && rota.direcoes.volta[dia]) {
        rota.direcoes.volta[dia].forEach(item => {
            horarios.push({
                horario: item.horario,
                codigo: item.codigo,
                direcao: 'volta',
                descricao: codigosItinerario[item.codigo] || 'Código não encontrado'
            });
        });
    }
    
    // Ordenar por horário
    return horarios.sort((a, b) => a.horario.localeCompare(b.horario));
}

function obterHorariosHoje(rota) {
    const hoje = new Date();
    const diaSemana = hoje.getDay(); // 0 = domingo, 1 = segunda, ..., 6 = sábado
    
    let dia;
    if (diaSemana === 0) dia = 'domingo';
    else if (diaSemana === 6) dia = 'sabado';
    else dia = 'diasUteis';
    
    return obterHorariosPorDia(rota, dia);
}

function obterProximosHorarios(rota, limite = 5) {
    const horarios = obterHorariosHoje(rota);
    const agora = new Date();
    const horaAtual = agora.getHours().toString().padStart(2, '0') + ':' + agora.getMinutes().toString().padStart(2, '0');
    
    return horarios
        .filter(h => h.horario > horaAtual)
        .slice(0, limite);
}

function buscarAvisos() {
    return avisos.sort((a, b) => new Date(b.data) - new Date(a.data));
}

function buscarChamados() {
    return chamados.sort((a, b) => new Date(b.data) - new Date(a.data));
}

function buscarChamadosPorStatus(status) {
    return chamados.filter(chamado => chamado.status === status);
}

function buscarEscala(motoristaId) {
    return escalas[motoristaId] || [];
}

function adicionarChamado(chamado) {
    const novoChamado = {
        id: chamados.length + 1,
        ...chamado,
        data: new Date().toISOString().slice(0, 16).replace('T', ' '),
        status: 'aberto',
        mecanico: null
    };
    chamados.unshift(novoChamado);
    return novoChamado;
}

function atualizarStatusChamado(id, status, mecanico = null) {
    const chamado = chamados.find(c => c.id === id);
    if (chamado) {
        chamado.status = status;
        if (mecanico) chamado.mecanico = mecanico;
    }
    return chamado;
}

function adicionarMensagemChat(usuario, mensagem) {
    const novaMensagem = {
        id: mensagensChat.length + 1,
        usuario: usuario,
        mensagem: mensagem,
        data: new Date().toISOString().slice(0, 16).replace('T', ' '),
        tipo: 'user'
    };
    mensagensChat.push(novaMensagem);
    return novaMensagem;
}

function atualizarChecklist(itemId, concluido) {
    const item = checklistManutencao.find(i => i.id === itemId);
    if (item) {
        item.concluido = concluido;
    }
    return item;
}

function obterEstatisticas() {
    return {
        frota: statusFrota,
        motoristas: statusMotoristas,
        chamadosAbertos: chamados.filter(c => c.status === 'aberto').length,
        mensagensPendentes: mensagensChat.filter(m => m.tipo === 'user' && !m.respondida).length
    };
}

function adicionarAviso(aviso) {
    const novoAviso = {
        id: avisos.length + 1,
        ...aviso,
        data: new Date().toISOString().slice(0, 16).replace('T', ' ')
    };
    avisos.unshift(novoAviso);
    return novoAviso;
}

function editarAviso(id, avisoAtualizado) {
    const aviso = avisos.find(a => a.id === id);
    if (aviso) {
        Object.assign(aviso, avisoAtualizado);
    }
    return aviso;
}

function excluirAviso(id) {
    const index = avisos.findIndex(a => a.id === id);
    if (index > -1) {
        avisos.splice(index, 1);
        return true;
    }
    return false;
}

function adicionarEscala(escala) {
    const novaEscala = {
        id: Date.now(),
        ...escala,
        status: 'pendente'
    };
    
    if (!escalas[escala.motoristaId]) {
        escalas[escala.motoristaId] = [];
    }
    
    escalas[escala.motoristaId].push(novaEscala);
    return novaEscala;
}

function editarEscala(id, escalaAtualizada) {
    for (const motoristaId in escalas) {
        const escala = escalas[motoristaId].find(e => e.id === id);
        if (escala) {
            Object.assign(escala, escalaAtualizada);
            return escala;
        }
    }
    return null;
}

function excluirEscala(id) {
    for (const motoristaId in escalas) {
        const index = escalas[motoristaId].findIndex(e => e.id === id);
        if (index > -1) {
            escalas[motoristaId].splice(index, 1);
            return true;
        }
    }
    return false;
}

function buscarTodasEscalas() {
    const todasEscalas = [];
    for (const motoristaId in escalas) {
        escalas[motoristaId].forEach(escala => {
            todasEscalas.push({
                ...escala,
                motoristaId: motoristaId
            });
        });
    }
    return todasEscalas.sort((a, b) => new Date(a.data) - new Date(b.data));
}

// Exportar apenas códigos de itinerário e funções auxiliares
// Dados dinâmicos agora vêm da API PHP
window.dadosSistema = {
    codigosItinerario,
    // Funções auxiliares para processamento de horários (se necessário)
    obterHorariosPorDia,
    obterHorariosHoje,
    obterProximosHorarios
};
