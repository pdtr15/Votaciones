import { ChangeEvent, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllErrorMessages } from '../../core/helpers/getAllErrorMessages';
import { AlertaError } from '../../core/components/AlertaError';
import backendVotosApi from '../../api/backendVotosApi';
import styles from '../../assets/css/login.module.scss';

export const PagesRegister = () => {
    const [formData, setFormData] = useState({
        numeroColegiado: '',
        dpi: '',
        fechaNacimiento: '',
        nombreCompleto: '',
        email: '',
        password: ''
    });

    const [error, setError] = useState<Array<string>>();
    const navigate = useNavigate();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const respuesta = await backendVotosApi.post('/api/usuarios/registrarIngeniero', formData);

            console.log(respuesta.data);
            navigate('/login');
        } catch (error: any) {
            console.log(error)

            if (error.response.data.errors != null) {
                const mensajesErrores = getAllErrorMessages(error.response.data.errors);
                console.log(mensajesErrores);

                setError(mensajesErrores);
            } else {
                setError([error.response.data.msg]);
            }
        }
    };

    return (
        <div className={styles.registerContainer}>
            <div className={styles.registerBox}>
                <h2 className={styles.registerTitle}>Registro Ingeniero</h2>

                <form onSubmit={handleSubmit} className={styles.registerForm}>
                    <AlertaError error={error} />
                    
                    <div className={styles.registerFormGroup}>
                        <label>Número Colegiado</label>
                        <input 
                            type="text" 
                            name="numeroColegiado" 
                            value={formData.numeroColegiado} 
                            onChange={handleChange} 
                            placeholder="Ingrese su número de colegiado"
                            required 
                        />
                    </div>

                    <div className={styles.registerFormGroup}>
                        <label>DPI</label>
                        <input 
                            type="text" 
                            name="dpi" 
                            value={formData.dpi} 
                            onChange={handleChange} 
                            placeholder="Ingrese su DPI"
                            required 
                        />
                    </div>

                    <div className={styles.registerFormGroup}>
                        <label>Fecha de Nacimiento</label>
                        <input 
                            type="date" 
                            name="fechaNacimiento" 
                            value={formData.fechaNacimiento} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>

                    <div className={styles.registerFormGroup}>
                        <label>Nombre Completo</label>
                        <input 
                            type="text" 
                            name="nombreCompleto" 
                            value={formData.nombreCompleto} 
                            onChange={handleChange} 
                            placeholder="Ingrese su nombre completo"
                            required 
                        />
                    </div>

                    <div className={styles.registerFormGroup}>
                        <label>Correo Electrónico</label>
                        <input 
                            type="email" 
                            name="email" 
                            value={formData.email} 
                            onChange={handleChange} 
                            placeholder="correo@ejemplo.com"
                            required 
                        />
                    </div>

                    <div className={styles.registerFormGroup}>
                        <label>Contraseña</label>
                        <input 
                            type="password" 
                            name="password" 
                            value={formData.password} 
                            onChange={handleChange} 
                            placeholder="Ingrese su contraseña"
                            required 
                        />
                    </div>

                    <button type="submit" className={styles.registerButtonPrimary}>
                        Registrar
                    </button>

                    <button 
                        type="button" 
                        className={styles.registerButtonSecondary} 
                        onClick={() => { navigate('/login') }}
                    >
                        Ya tengo cuenta - Ir a Login
                    </button>
                </form>
            </div>
        </div>
    );
}