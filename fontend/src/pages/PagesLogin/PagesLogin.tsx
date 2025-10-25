import { ChangeEvent, FormEvent, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GlobalContext } from "../../contexts/globalContext";
import { GlobalContextType } from "../../@types/GlobalContextType";
import backendVotosApi from "../../api/backendVotosApi";
import style from '../../assets/css/login.module.scss'

export const PagesLogin = () => {
    const [formData, setFormData] = useState({
        numeroColegiado: '',
        dpi: '',
        fechaNacimiento: '',
        password: ''
    });

    const [error, setError] = useState<string>('');
    const context = useContext<GlobalContextType | undefined>(GlobalContext);
    const navigate = useNavigate();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const respuesta = await backendVotosApi.post('/api/usuarios/loginIngeniero', formData);
            localStorage.setItem('ProyectoFinal-Token', respuesta.data.token);

            context?.setGlobal((prevGlobal) => ({
                ...prevGlobal,
                rolid: respuesta.data.usuario.rolid,
                autorizado: true,
            }));

            navigate('/Campanias');
        } catch (error: any) {
            setError(error.response?.data?.msg || "Error en el inicio de sesión");
        }
    };

    return (
       <div className={style['login-container']}>
    {/* Parte izquierda: Carrusel */}
    <div className={style['login-left']}>
        <img src="/images/pexels-mikhail-nilov-8846632.jpg" className={style['carousel-image']} alt="Imagen 1" />
        <img src="/images/pexels-sora-shimazaki-5926262.jpg" className={style['carousel-image']} alt="Imagen 2" />
        <img src="/images/pexels-tara-winstead-8850831.jpg" className={style['carousel-image']} alt="Imagen 3" />
        <img src="/images/pexels-edmond-dantes-7103088.jpg" className={style['carousel-image']} alt="Imagen 4" />
    </div>

            {/* Parte derecha: Formulario */}
            <div className={style['login-right']}>
                <div className={style['login-form-wrapper']}>
                    <h2>Acceso al Sistema Ingenieros</h2>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <form onSubmit={handleSubmit}>
                        <div className={style['form-group']}>
                            <label>Numero Colegiado</label>
                            <input type="text" name="numeroColegiado" className="form-control" value={formData.numeroColegiado} onChange={handleChange} required />
                        </div>
                        <div className={style['form-group']}>
                            <label>DPI</label>
                            <input type="text" name="dpi" className="form-control" value={formData.dpi} onChange={handleChange} required />
                        </div>
                        <div className={style['form-group']}>
                            <label>Fecha Nacimiento</label>
                            <input type="date" name="fechaNacimiento" className="form-control" value={formData.fechaNacimiento} onChange={handleChange} required />
                        </div>
                        <div className={style['form-group']}>
                            <label>Contraseña</label>
                            <input type="password" name="password" className="form-control" value={formData.password} onChange={handleChange} required />
                        </div>
                        <button type="submit" className={`btn btn-primary ${style['button-blue']}`}>Iniciar sesión</button>
                        <button type="button" className="btn btn-secondary mt-2" onClick={() => { navigate('/register') }}>Registrar</button>
                    </form>
                </div>
            </div>
        </div>
    );
}
