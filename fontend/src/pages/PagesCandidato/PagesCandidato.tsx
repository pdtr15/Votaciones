import { useEffect, useState } from "react";
import { EncabezadoSistema } from "../../core/components"
import { Campania, Candidato, VotosCandidato } from "../../@types/types";
import backendVotosApi from "../../api/backendVotosApi";
import { Link, useParams } from "react-router-dom";
import { CandidatoCard } from "./components/CandidatoCard";
import style from "../../assets/css/pagesCandidato.module.scss"

export const PagesCandidato = () => {
    const { idCampania } = useParams();
    const [candidatos, setCandidatos] = useState<Candidato[]>([]);
    const [votosCandidato, setVotosCandidato] = useState<VotosCandidato[]>([]);
    const [campania, setCampania] = useState<Campania>();
    const [activeTab, setActiveTab] = useState<'chart' | 'stats'>('chart');

    const fetchCandidatos = async () => {
        try {
            const response = await backendVotosApi.get(`/api/candidatos/${idCampania}`);
            setCandidatos(response.data);
        } catch (error) {
            console.log(error)
        }
    };

    const fetchVotosCandidatos = async () => {
        try {
            const response = await backendVotosApi.get(`/api/votos/verVotos/${idCampania}`);
            setVotosCandidato(response.data);
        } catch (error) {
            console.error('Error fetching candidates:', error);
        }
    };

    const fetchCampanias = async () => {
        try {
            const respuesta = await backendVotosApi.get(`/api/campanias/${idCampania}`);
            console.log(respuesta)
            setCampania(respuesta.data);
        } catch (err) {
            console.error('Error fetching campania:', err);
        }
    };

    useEffect(() => {
        fetchCandidatos();
        fetchVotosCandidatos();
        fetchCampanias();
    }, [idCampania]);

    // Calcular total de votos
    const totalVotos = votosCandidato.reduce((sum, candidato) => sum + candidato.numtotalvotos, 0);

    // Colores para la gráfica circular
    const getColorPalette = (index: number) => {
        const palettes = [
            ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'],
            ['#6C5CE7', '#A29BFE', '#FD79A8', '#FDCB6E', '#00B894'],
            ['#0984E3', '#00CEC9', '#FFEAA7', '#FDCB6E', '#E17055'],
            ['#00B894', '#00CEC9', '#FD79A8', '#A29BFE', '#DFE6E9']
        ];
        return palettes[index % palettes.length];
    };

    // Generar el conic-gradient para la gráfica circular
    const generatePieChartGradient = () => {
        if (totalVotos === 0) return '#e0e0e0';
        
        const candidatosConVotos = votosCandidato.filter(c => c.numtotalvotos > 0);
        let acumulado = 0;
        
        const segmentos = candidatosConVotos.map((candidato) => {
            const originalIndex = votosCandidato.findIndex(c => c.idcandidato === candidato.idcandidato);
            const colors = getColorPalette(originalIndex);
            const inicio = acumulado;
            acumulado += candidato.porcentajevotos;
            const fin = acumulado;
            return `${colors[0]} ${inicio}% ${fin}%`;
        });
        
        return `conic-gradient(${segmentos.join(', ')})`;
    };

    return (
        <div className="container-fluid">
            <EncabezadoSistema titulo="Administración de Candidatos" />

            <Link className="btn btn-secondary mt-2" to='/Campanias'>
                <img src="https://img.icons8.com/material-outlined/24/000000/left.png" alt="Regresar" className="me-2" />
                Regresar
            </Link>

            <main>
                <h2 className="mb-0">{campania?.titulo}</h2>
                <span className={`d-block text-center ${(campania?.estadoid) === 1 ? 'text-success' : 'text-danger'}`}>
                    {campania?.estadoid === 1 ? 'Activa' : 'Finalizada'}
                </span>
                <p>{campania?.descripcion}</p>

                {/* Pestañas para cambiar entre vista de gráfica y estadísticas */}
                <div className={style.tabContainer}>
                    <button 
                        className={`${style.tabButton} ${activeTab === 'chart' ? style.active : ''}`}
                        onClick={() => setActiveTab('chart')}
                    >
                        📊 Vista Gráfica
                    </button>
                    <button 
                        className={`${style.tabButton} ${activeTab === 'stats' ? style.active : ''}`}
                        onClick={() => setActiveTab('stats')}
                    >
                        📈 Estadísticas
                    </button>
                </div>

                {/* Vista de Gráfica Circular */}
                {activeTab === 'chart' && (
                    <div className={style.pieChartSection}>
                        <h3 className={style.sectionTitle}>Distribución de Votos</h3>
                        <div className={style.pieChartContainer}>
                            <div className={style.pieChartSvgContainer}>
                                <svg className={style.pieChartSvg} viewBox="0 0 200 200">
                                    {totalVotos === 0 ? (
                                        <circle cx="100" cy="100" r="100" fill="#e0e0e0" />
                                    ) : votosCandidato.filter(c => c.numtotalvotos > 0).length === 1 ? (
                                        // Caso especial: solo un candidato con votos (100%)
                                        (() => {
                                            const candidato = votosCandidato.find(c => c.numtotalvotos > 0);
                                            const originalIndex = votosCandidato.findIndex(c => c.idcandidato === candidato?.idcandidato);
                                            const colors = getColorPalette(originalIndex);
                                            return <circle cx="100" cy="100" r="100" fill={colors[0]} />;
                                        })()
                                    ) : (
                                        // Caso normal: múltiples candidatos con votos
                                        votosCandidato.filter(c => c.numtotalvotos > 0).map((candidato, index, arr) => {
                                            const originalIndex = votosCandidato.findIndex(c => c.idcandidato === candidato.idcandidato);
                                            const colors = getColorPalette(originalIndex);
                                            
                                            // Calcular el ángulo de inicio y fin
                                            const startAngle = arr.slice(0, index).reduce((sum, c) => sum + (c.porcentajevotos * 3.6), 0);
                                            const endAngle = startAngle + (candidato.porcentajevotos * 3.6);
                                            
                                            // Convertir a coordenadas
                                            const startRad = (startAngle - 90) * Math.PI / 180;
                                            const endRad = (endAngle - 90) * Math.PI / 180;
                                            
                                            const x1 = 100 + 100 * Math.cos(startRad);
                                            const y1 = 100 + 100 * Math.sin(startRad);
                                            const x2 = 100 + 100 * Math.cos(endRad);
                                            const y2 = 100 + 100 * Math.sin(endRad);
                                            
                                            const largeArc = candidato.porcentajevotos > 50 ? 1 : 0;
                                            
                                            return (
                                                <path
                                                    key={candidato.idcandidato}
                                                    d={`M 100 100 L ${x1} ${y1} A 100 100 0 ${largeArc} 1 ${x2} ${y2} Z`}
                                                    fill={colors[0]}
                                                    stroke="white"
                                                    strokeWidth="2"
                                                />
                                            );
                                        })
                                    )}
                                </svg>
                                <div className={style.pieCenter}>
                                    <span className={style.totalVotes}>{totalVotos}</span>
                                    <span className={style.centerLabel}>Total Votos</span>
                                </div>
                            </div>
                            
                            <div className={style.legend}>
                                {votosCandidato.map((candidato, index) => {
                                    const colors = getColorPalette(index);
                                    return (
                                        <div key={candidato.idcandidato} className={style.legendItem}>
                                            <div 
                                                className={style.legendColor}
                                                style={{ backgroundColor: colors[0] }}
                                            ></div>
                                            <span className={style.legendName}>{candidato.nombrecandidato}</span>
                                            <span className={style.legendPercentage}>
                                                {Math.round(candidato.porcentajevotos)}%
                                            </span>
                                            <span className={style.legendVotes}>
                                                ({candidato.numtotalvotos} votos)
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* Vista de Estadísticas */}
                {activeTab === 'stats' && (
                    <div className={style.statsSection}>
                        <h3 className={style.sectionTitle}>Métricas de Votación</h3>
                        <div className={style.statsGrid}>
                            <div className={style.statCard}>
                                <div className={style.statIcon}>👥</div>
                                <div className={style.statContent}>
                                    <h4 className={style.statValue}>{totalVotos}</h4>
                                    <p className={style.statLabel}>Total de Votos Emitidos</p>
                                </div>
                            </div>
                            
                            <div className={style.statCard}>
                                <div className={style.statIcon}>🎯</div>
                                <div className={style.statContent}>
                                    <h4 className={style.statValue}>{votosCandidato.length}</h4>
                                    <p className={style.statLabel}>Candidatos Participando</p>
                                </div>
                            </div>
                            
                            <div className={style.statCard}>
                                <div className={style.statIcon}>⭐</div>
                                <div className={style.statContent}>
                                    <h4 className={style.statValue}>
                                        {votosCandidato.length > 0 ? votosCandidato[0].nombrecandidato : 'N/A'}
                                    </h4>
                                    <p className={style.statLabel}>Líder Actual</p>
                                </div>
                            </div>
                            
                            <div className={style.statCard}>
                                <div className={style.statIcon}>📈</div>
                                <div className={style.statContent}>
                                    <h4 className={style.statValue}>
                                        {votosCandidato.length > 0 ? Math.round(votosCandidato[0].porcentajevotos) : 0}%
                                    </h4>
                                    <p className={style.statLabel}>Porcentaje del Líder</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <section className={style['campaign-grid']}>
                    {candidatos.map((candidato) => (
                        <CandidatoCard
                            key={candidato.idcandidato}
                            candidatoId={candidato.idcandidato}
                            campaniaId={Number(candidato.idcampania)}
                            nombre={candidato.ingeniero}
                            descripcion={candidato.descripcion}
                            onVotoAgregar={fetchVotosCandidatos}
                        />
                    ))}
                </section>

                {/* Tarjetas de Resultados Alternativas */}
                <div className={style.candidateResults}>
                    <h3 className={style.resultsTitle}>Resultados por Candidato</h3>
                    <div className={style.resultsGrid}>
                        {votosCandidato.map((candidato, index) => {
                            const percentage = Math.round(candidato.porcentajevotos);
                            const colors = getColorPalette(index);
                            
                            return (
                                <div key={candidato.idcandidato} className={style.candidateResultCard}>
                                    <div className={style.resultHeader}>
                                        <div 
                                            className={style.candidateAvatar}
                                            style={{ 
                                                background: `linear-gradient(135deg, ${colors[0]}, ${colors[1]})` 
                                            }}
                                        >
                                            {candidato.nombrecandidato.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div className={style.candidateInfo}>
                                            <h4 className={style.resultName}>{candidato.nombrecandidato}</h4>
                                            <div className={style.rank}>Posición #{index + 1}</div>
                                        </div>
                                    </div>
                                    
                                    <div className={style.resultStats}>
                                        <div className={style.stat}>
                                            <div className={style.statNumber}>{candidato.numtotalvotos}</div>
                                            <div className={style.statLabel}>Votos</div>
                                        </div>
                                        <div className={style.stat}>
                                            <div className={style.statNumber}>{percentage}%</div>
                                            <div className={style.statLabel}>Del Total</div>
                                        </div>
                                    </div>
                                    
                                    <div className={style.progressWrapper}>
                                        <div 
                                            className={style.progressBar}
                                            style={{ 
                                                width: `${percentage}%`,
                                                background: `linear-gradient(90deg, ${colors[0]}, ${colors[1]})`
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </main>
        </div>
    )
}