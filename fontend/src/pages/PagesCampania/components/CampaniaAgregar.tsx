import React, { useState } from 'react';
import { FormularioCampania } from '../../../@types/types';
import backendVotosApi from '../../../api/backendVotosApi';
import { getAllErrorMessages } from '../../../core/helpers/getAllErrorMessages';
import { AlertaError } from '../../../core/components/AlertaError';
import Swal from 'sweetalert2';
import styles from '../../../assets/css/pagesCampania.module.scss';

export const CampaniaAgregar = () => {
    const [formData, setFormData] = useState<FormularioCampania>({ titulo: '', descripcion: '' });
    const [error, setError] = useState<Array<string> | undefined>();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(undefined);

        if (!formData.titulo || !formData.descripcion) {
            setError(['Todos los campos son obligatorios']);
            return;
        }

        try {
            await backendVotosApi.post('/api/campanias/registrar', formData);

            Swal.fire({
                text: 'Campaña registrada exitosamente.',
                icon: 'success',
                confirmButtonText: 'OK',
                timer: 3000
            });

            setFormData({ titulo: '', descripcion: '' });
        } catch (error: any) {
            console.error(error);

            if (error.response?.data?.errors != null) {
                const mensajesErrores = getAllErrorMessages(error.response.data.errors);
                console.log(mensajesErrores);
                setError(mensajesErrores);
            } else {
                setError([error.response?.data?.msg]);
            }
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContainer}>
                <div className={styles.modalHeader}>
                    <h2>Agregar Nueva Campaña</h2>
                    <button className={styles.closeButton} type="button" aria-label="Cerrar">
                        ×
                    </button>
                </div>
                
                <div className={styles.modalBody}>
                    <form onSubmit={handleSubmit}>
                        <AlertaError error={error} />
                        
                        <div className={styles.formGroup}>
                            <label htmlFor="titulo" className={styles.formLabel}>
                                Título
                            </label>
                            <input
                                type="text"
                                className={styles.formInput}
                                id="titulo"
                                name="titulo"
                                value={formData.titulo}
                                onChange={handleChange}
                                placeholder="Título de la campaña"
                            />
                        </div>
                        
                        <div className={styles.formGroup}>
                            <label htmlFor="descripcion" className={styles.formLabel}>
                                Descripción
                            </label>
                            <textarea
                                className={styles.formTextarea}
                                id="descripcion"
                                name="descripcion"
                                value={formData.descripcion}
                                onChange={handleChange}
                                placeholder="Descripción de la campaña"
                            />
                        </div>

                        <button type="submit" className={styles.submitButton}>
                            Agregar Campaña
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};