import { useEffect, useState } from "react";
import { Campania, Candidato } from "../../../@types/types";
import backendVotosApi from "../../../api/backendVotosApi";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import style from "../../../assets/css/campaniaCard.module.scss"
import { CampaniaCardDetails } from "./CampaniaCardDetails";

interface CampaniaCardProps {
    campania: Campania;
}

export const CampaniaCard = ({ campania }: CampaniaCardProps) => {
    const [candidatos, setCandidatos] = useState<Candidato[]>([]);
    const [estadoCampania, setEstadoCampania] = useState<number>(campania.estadoid);
    const [isLoading, setIsLoading] = useState(false);

    const fetchCandidatos = async () => {
        try {
            const response = await backendVotosApi.get(`/api/candidatos/${campania.idcampania}`);
            setCandidatos(response.data);
        } catch (error) {
            console.log(error)
        }
    };

    useEffect(() => {
        fetchCandidatos();
    }, []);

    const eliminarCandidato = (id: number) => {
        setCandidatos(candidatos.filter(c => c.idcandidato !== id));
    };

    const toggleEstadoCampania = async () => {
        setIsLoading(true);
        try {
            const response = await backendVotosApi.put(`/api/campanias/toggleEstado/${campania.idcampania}`);
            setEstadoCampania(response.data.estadoid);
        } catch (error) {
            console.error("Error al cambiar el estado de la campaña:", error);
            Swal.fire({
                title: "Error",
                text: "Hubo un problema al cambiar el estado de la campaña.",
                icon: "error",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={style['campaign-card']}>
            <div className={style['card-header']}>
                <h2 className={style['campaign-title']}>{campania.titulo}</h2>
                <span className={`${style.status} ${estadoCampania === 1 ? style.active : style.finished}`}>
                    {estadoCampania === 1 ? '● Activa' : '● Finalizada'}
                </span>
            </div>

            <p className={style['campaign-description']}>{campania.descripcion}</p>

            <div className={style['candidates-preview']}>
                <div className={style['candidates-count']}>
                    <span className={style['count-badge']}>{candidatos.length}</span>
                    Candidato{candidatos.length !== 1 ? 's' : ''}
                </div>
                {candidatos.length > 0 && (
                    <div className={style['preview-names']}>
                        {candidatos.slice(0, 2).map((candidato, index) => (
                            <span key={index} className={style['candidate-preview']}>
                                {candidato.ingeniero}
                            </span>
                        ))}
                        {candidatos.length > 2 && (
                            <span className={style['more-candidates']}>
                                +{candidatos.length - 2} más
                            </span>
                        )}
                    </div>
                )}
            </div>

            <CampaniaCardDetails
                campania={campania}
                candidatos={candidatos}
                estadoCampania={estadoCampania}
                fetchCandidatos={fetchCandidatos}
                eliminarCandidato={eliminarCandidato}
                toggleEstadoCampania={toggleEstadoCampania}
            />

            <Link className={style['view-details-btn']} to={`/Campanias/${campania.idcampania}`}>
                Ver Detalles Completos
            </Link>
        </div>
    );
}