import Swal from 'sweetalert2';
import backendVotosApi from '../../../api/backendVotosApi';
import style from "../../../assets/css/campaniaCard.module.scss";

interface CampaniaCardProps {
    campaniaId: number;
    onCandidatoAgregado: () => void;
}

export const CandidatoAgregarModal = ({ campaniaId, onCandidatoAgregado }: CampaniaCardProps) => {

    const handleAgregarCandidato = async (campaniaId: number) => {
        let ingenieroId: number | null = null;

        const { value: formValues } = await Swal.fire({
            title: '<h2 style="color: #2c3e50; margin: 0; font-size: 1.5rem; font-weight: 700;">Agregar Nuevo Candidato</h2>',
            html: `
                <div style="text-align: left; margin-top: 1.5rem;">
                    <label style="display: block; font-weight: 600; color: #2c3e50; margin-bottom: 0.5rem;">Número de Colegiado:</label>
                    <div style="display: flex; gap: 0.75rem;">
                        <input 
                            id="swal-input-colegiado" 
                            class="swal2-input" 
                            placeholder="Número de colegiado"
                            style="flex: 1; margin: 0; padding: 0.75rem; border: 1px solid #e1e8ed; border-radius: 4px;"
                        />
                        <button 
                            id="buscar-colegiado" 
                            type="button"
                            style="background-color: #3498db; color: white; border: none; border-radius: 4px; padding: 0.75rem; cursor: pointer; transition: background-color 0.2s; display: flex; align-items: center; justify-content: center; min-width: 50px;"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" 
                                    stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </div>
                <div id="colegiado-info" style="display: none; text-align: left; margin-top: 1.5rem;">
                    <div style="background-color: #f8f9fa; border-radius: 6px; padding: 1rem; border-left: 4px solid #3498db;">
                        <div style="margin-bottom: 0.75rem;">
                            <strong style="display: block; color: #2c3e50; font-size: 0.9rem;">Nombre Completo:</strong>
                            <span id="colegiado-nombre" style="color: #7f8c8d; font-size: 1rem;"></span>
                        </div>
                        <div style="margin-bottom: 0.75rem;">
                            <strong style="display: block; color: #2c3e50; font-size: 0.9rem;">DPI:</strong>
                            <span id="colegiado-dpi" style="color: #7f8c8d; font-size: 1rem;"></span>
                        </div>
                    </div>
                    <div style="margin-top: 1.5rem;">
                        <label style="display: block; font-weight: 600; color: #2c3e50; margin-bottom: 0.5rem;">Descripción:</label>
                        <textarea 
                            id="swal-input-descripcion" 
                            class="swal2-textarea" 
                            placeholder="Descripción del candidato"
                            style="margin: 0; min-height: 100px;"
                        ></textarea>
                    </div>
                </div>
            `,
            focusConfirm: false,
            showCloseButton: true,
            showCancelButton: true,
            confirmButtonText: `Agregar Candidato`,
            cancelButtonText: 'Cancelar',
            confirmButtonColor: "#2c3e50",
            cancelButtonColor: "#7f8c8d",
            showLoaderOnConfirm: true,
            preConfirm: () => {
                const descripcion = (document.getElementById('swal-input-descripcion') as HTMLTextAreaElement)?.value;

                if (!ingenieroId) {
                    Swal.showValidationMessage('Debes buscar y seleccionar un colegiado válido');
                    return false;
                }

                if (!descripcion) {
                    Swal.showValidationMessage('Debes ingresar una descripción para el candidato');
                    return false;
                }

                return { ingenieroId, descripcion };
            },
            didOpen: () => {
                const buscarBtn = document.getElementById('buscar-colegiado');
                const colegiadoInput = document.getElementById('swal-input-colegiado') as HTMLInputElement;
                const originalButtonHTML = buscarBtn!.innerHTML;

                buscarBtn?.addEventListener('click', async () => {
                    const colegiadoValue = colegiadoInput.value.trim();
                    if (!colegiadoValue) {
                        Swal.showValidationMessage('Debes ingresar un número de colegiado');
                        return;
                    }

                    buscarBtn.innerHTML = '<div style="width: 16px; height: 16px; border: 2px solid transparent; border-top: 2px solid white; border-radius: 50%; animation: spin 1s linear infinite;"></div>';
                    buscarBtn.setAttribute('disabled', 'true');

                    try {
                        const response = await backendVotosApi.get(`/api/candidatos/buscarColegiado/${colegiadoValue}`);
                        const { idingeniero, nombrecompleto, dpi } = response.data;

                        if (!idingeniero) {
                            Swal.showValidationMessage('No se encontró al colegiado');
                            return;
                        }

                        ingenieroId = idingeniero;

                        const colegiadoInfoDiv = document.getElementById('colegiado-info');
                        const nombreSpan = document.getElementById('colegiado-nombre');
                        const dpiSpan = document.getElementById('colegiado-dpi');

                        if (nombreSpan && dpiSpan && colegiadoInfoDiv) {
                            nombreSpan.textContent = nombrecompleto;
                            dpiSpan.textContent = dpi;
                            colegiadoInfoDiv.style.display = 'block';
                        }

                        Swal.resetValidationMessage();
                    } catch (error) {
                        console.error('Error al buscar colegiado:', error);
                        Swal.showValidationMessage('No se encontró al colegiado o el servidor no respondió correctamente');
                    } finally {
                        buscarBtn.innerHTML = originalButtonHTML;
                        buscarBtn.removeAttribute('disabled');
                    }
                });

                // Estilo del spinner
                const styleEl = document.createElement('style');
                styleEl.textContent = `
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `;
                document.head.appendChild(styleEl);
            },
        });

        if (formValues) {
            try {
                const response = await backendVotosApi.post('/api/candidatos/registrar', {
                    campaniaId,
                    ingenieroId: formValues.ingenieroId,
                    descripcion: formValues.descripcion
                });

                onCandidatoAgregado();

                Swal.fire({
                    title: 'Candidato agregado',
                    text: 'El candidato ha sido agregado exitosamente.',
                    icon: 'success',
                    confirmButtonColor: "#2c3e50",
                });
            } catch (err: any) {
                console.error('Error al agregar candidato:', err);

                Swal.fire({
                    title: 'Error',
                    text: err.response?.data?.msg || 'Ocurrió un error al registrar el candidato.',
                    icon: 'error',
                    confirmButtonColor: "#2c3e50",
                });
            }
        }
    };

    return (
        <button className={style['add-candidate-btn']} onClick={() => { handleAgregarCandidato(campaniaId) }}>
            Agregar Candidato
        </button>
    );
};
