import { CampaniaCardListCandidato } from './CampaniaCardListCandidato'
import { CandidatoAgregarModal } from '../../PagesCandidato/components/CandidatoAgregarModal'
import style from "../../../assets/css/campaniaCard.module.scss"
import { Campania, Candidato } from '../../../@types/types';
import { useContext } from 'react';
import { GlobalContextType } from '../../../@types/GlobalContextType';
import { GlobalContext } from '../../../contexts/globalContext';

interface CampaniaCardDetailsProps {
    campania: Campania;
    candidatos: Candidato[];
    estadoCampania: number;
    fetchCandidatos: () => void;
    eliminarCandidato: (id: number) => void;
    toggleEstadoCampania: () => void;
}

export const CampaniaCardDetails = ({ 
    campania, 
    candidatos, 
    estadoCampania, 
    fetchCandidatos, 
    eliminarCandidato, 
    toggleEstadoCampania 
}: CampaniaCardDetailsProps) => {
    const context = useContext<GlobalContextType | undefined>(GlobalContext);

    return (
        <div className={style.details}>
            {context?.global.rolid == 1 && (
                <div className={style['toggle-section']}>
                    <label className={style['toggle-label']}>
                        <span>Habilitar Votación</span>
                        <div className={style['toggle-container']}>
                            <input
                                type="checkbox"
                                className={style['toggle-input']}
                                id={`habilitar-${campania.idcampania}`}
                                checked={estadoCampania === 1}
                                onChange={toggleEstadoCampania}
                            />
                            <span className={style['toggle-slider']}></span>
                        </div>
                    </label>
                </div>
            )}
            
            <div className={style.candidates}>
                <h3 className={style['candidates-title']}>Lista de Candidatos</h3>
                
                {candidatos.length > 0 ? (
                    <ul className={style['candidates-list']}>
                        {candidatos.map((candidato) => (
                            <CampaniaCardListCandidato
                                key={candidato.idcandidato}
                                idCandidato={candidato.idcandidato}
                                nombre={candidato.ingeniero}
                                onCandidatoEliminado={eliminarCandidato}
                            />
                        ))}
                    </ul>
                ) : (
                    <div className={style['no-candidates']}>
                        No hay candidatos registrados
                    </div>
                )}

                {context?.global.rolid == 1 && (
                    <div className={style['add-candidate-section']}>
                        <CandidatoAgregarModal 
                            campaniaId={campania.idcampania} 
                            onCandidatoAgregado={fetchCandidatos} 
                        />
                    </div>
                )}
            </div>
        </div>
    )
}