import Swal from "sweetalert2";
import backendVotosApi from "../../../api/backendVotosApi";
import { useContext } from "react";
import { GlobalContextType } from "../../../@types/GlobalContextType";
import { GlobalContext } from "../../../contexts/globalContext";
import style from "../../../assets/css/campaniaCard.module.scss"

interface CampaniaCardListCandidatoProps {
    idCandidato: number;
    nombre: string;
    onCandidatoEliminado: (id: number) => void;
}

export const CampaniaCardListCandidato = ({ 
    idCandidato, 
    nombre, 
    onCandidatoEliminado 
}: CampaniaCardListCandidatoProps) => {
    const context = useContext<GlobalContextType | undefined>(GlobalContext);

    const onClickEliminarCandidato = async () => {
        const confirmacion = await Swal.fire({
            title: '¿Eliminar candidato?',
            html: `
                <div style="text-align: center;">
                    <p style="margin-bottom: 10px;">¿Estás seguro de eliminar al candidato?</p>
                    <strong style="color: #e74c3c;">${nombre}</strong>
                </div>
            `,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#e74c3c',
            cancelButtonColor: '#7f8c8d',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            background: '#fff',
            customClass: {
                popup: 'custom-swal-popup'
            }
        });

        if (confirmacion.isConfirmed) {
            try {
                await backendVotosApi.delete(`/api/candidatos/eliminar/${idCandidato}`);

                Swal.fire({
                    title: 'Eliminado',
                    text: `El candidato ${nombre} ha sido eliminado.`,
                    icon: 'success',
                    timer: 2000,
                    confirmButtonColor: '#27ae60'
                });

                onCandidatoEliminado(idCandidato);
            } catch (error: any) {
                console.error('Error al eliminar el candidato:', error);

                Swal.fire({
                    title: 'Error',
                    text: error.response?.data?.msg || 'Error al eliminar el candidato',
                    icon: 'error',
                    confirmButtonColor: '#e74c3c'
                });
            }
        }
    };

    return (
        <li className={style['candidate-item']}>
            <span className={style['candidate-name']}>{nombre}</span>
            
            {context?.global.rolid == 1 && (
                <button 
                    className={style['remove-candidate-btn']}
                    onClick={onClickEliminarCandidato}
                    title="Eliminar candidato"
                >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                </button>
            )}
        </li>
    )
}