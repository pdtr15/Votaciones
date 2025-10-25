import React, { useState } from 'react';
import backendVotosApi from '../../../api/backendVotosApi';
import style from "../../../assets/css/pagesCampania.module.scss";

interface CampaniaAgregarModalProps {
    onFetchCampanias: () => void;
}

export const CampaniaAgregarModal = ({ onFetchCampanias }: CampaniaAgregarModalProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({
        titulo: '',
        descripcion: ''
    });

    const handleOpenModal = () => {
        setIsModalOpen(true);
        setTitulo('');
        setDescripcion('');
        setErrors({ titulo: '', descripcion: '' });
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const validateForm = () => {
        const newErrors = {
            titulo: '',
            descripcion: ''
        };

        if (!titulo.trim()) {
            newErrors.titulo = 'El título es obligatorio';
        } else if (titulo.length > 150) {
            newErrors.titulo = 'El título debe tener menos de 150 caracteres';
        }

        if (!descripcion.trim()) {
            newErrors.descripcion = 'La descripción es obligatoria';
        } else if (descripcion.length > 500) {
            newErrors.descripcion = 'La descripción debe tener menos de 500 caracteres';
        }

        setErrors(newErrors);
        return !newErrors.titulo && !newErrors.descripcion;
    };

    const handleAgregarCampania = async () => {
        if (!validateForm()) return;

        setIsLoading(true);

        try {
            const response = await backendVotosApi.post('/api/campanias/registrar', {
                titulo,
                descripcion
            });

            // Éxito
            setIsModalOpen(false);
            onFetchCampanias();
            
            // Mostrar mensaje de éxito
            alert('Campaña registrada exitosamente');
            
            console.log('Respuesta del servidor:', response.data);
        } catch (err) {
            // Error
            alert('Hubo un problema al registrar la campaña. Inténtalo de nuevo.');
            console.error('Error al registrar campaña:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRellenarCampos = () => {
        setTitulo('Campaña por Defecto');
        setDescripcion('Descripción por Defecto de la campaña');
    };

    return (
        <>
            <div 
                className={`${style['campaign-card']} ${style['new-campaign']}`} 
                onClick={handleOpenModal}
            >
                <div className="add-icon">+</div>
                <p>Crear Nueva Campaña</p>
            </div>

            {isModalOpen && (
                <div className={style.modalOverlay}>
                    <div className={style.modalContent}>
                        <div className={style.modalHeader}>
                            <h1 className={style.mainTitle}>Agrégar Nueva Campaña</h1>
                            <button 
                                className={style.closeButton}
                                onClick={handleCloseModal}
                            >
                                &times;
                            </button>
                        </div>

                        <div className={style.modalBody}>
                            <div className={style.formGroup}>
                                <label htmlFor="titulo" className={style.sectionLabel}>Título:</label>
                                <input
                                    id="titulo"
                                    type="text"
                                    className={`${style.formControl} ${errors.titulo ? style.error : ''}`}
                                    placeholder="Título de la campaña"
                                    value={titulo}
                                    onChange={(e) => setTitulo(e.target.value)}
                                />
                                {errors.titulo && (
                                    <span className={style.errorText}>{errors.titulo}</span>
                                )}
                            </div>

                            <div className={style.formGroup}>
                                <label htmlFor="descripcion" className={style.sectionLabel}>Descripción:</label>
                                <textarea
                                    id="descripcion"
                                    className={`${style.formControl} ${style.textarea} ${errors.descripcion ? style.error : ''}`}
                                    placeholder="Descripción de la campaña"
                                    value={descripcion}
                                    onChange={(e) => setDescripcion(e.target.value)}
                                    rows={4}
                                />
                                {errors.descripcion && (
                                    <span className={style.errorText}>{errors.descripcion}</span>
                                )}
                                <div className={style.charCount}>
                                    {descripcion.length}/500 caracteres
                                </div>
                            </div>
                        </div>

                        <div className={style.modalFooter}>
                            <div className={style.buttonGroup}>
                                <button
                                    type="button"
                                    className={style.cancelButton}
                                    onClick={handleCloseModal}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    className={style.secondaryButton}
                                    onClick={handleRellenarCampos}
                                >
                                    Rellenar Campos
                                </button>
                                <button
                                    type="button"
                                    className={style.primaryButton}
                                    onClick={handleAgregarCampania}
                                    disabled={isLoading}
                                >
                                    {isLoading ? 'Agregando...' : 'Agrégar Campaña'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};