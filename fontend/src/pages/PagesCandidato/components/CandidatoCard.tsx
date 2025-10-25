import Swal from "sweetalert2";
import backendVotosApi from "../../../api/backendVotosApi";
import style from "../../../assets/css/campaniaCard.module.scss";
import { useState } from "react";

interface CandidatoCardProps {
    candidatoId: number;
    campaniaId: number;
    nombre: string;
    descripcion: string;
    onVotoAgregar: () => void;
}

export const CandidatoCard = ({ candidatoId, campaniaId, nombre, descripcion, onVotoAgregar }: CandidatoCardProps) => {
    const [isLoading, setIsLoading] = useState(false);

    const onClickVotar = async () => {
        setIsLoading(true);
        try {
            await backendVotosApi.post('/api/votos/registrar', { candidatoId, campaniaId });
            onVotoAgregar();

            Swal.fire({
                text: 'Voto registrado exitosamente.',
                icon: 'success',
                confirmButtonText: 'OK',
                timer: 3000,
                confirmButtonColor: "#2c3e50"
            });
        } catch (error: any) {
            console.error('Error al votar:', error);
            Swal.fire({
                title: 'Error',
                text: error.response?.data?.msg || 'Ha ocurrido un error al votar.',
                icon: 'error',
                confirmButtonText: 'OK',
                timer: 2000,
                confirmButtonColor: "#2c3e50"
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={style.candidateCard}>
            <div className={style.cardHeader}>
                <h2 className={style.candidateName}>{nombre}</h2>
            </div>
            <div className={style.cardBody}>
                <p className={style.candidateDescription}>{descripcion}</p>
            </div>
            <div className={style.cardFooter}>
                <button 
                    onClick={onClickVotar} 
                    className={style.voteButton}
                    disabled={isLoading}
                >
                    {isLoading ? 'Votando...' : 'Votar'}
                </button>
            </div>
        </div>
    );
};