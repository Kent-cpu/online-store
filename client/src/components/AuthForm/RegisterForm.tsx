import React, {useState, FC, SyntheticEvent, useRef} from 'react';
import {IErrorRegistration} from '../../types/IErrorRegistration';
import {handleChange} from '../../utils/helpers';
import TextField from '../ui/TextField/TextField';
import s from "./Auth.module.scss";
import useActions from "../../hooks/useActions";
import Title from "../ui/Title/Title";
import {Link} from "react-router-dom";
import {HOME_ROUTE} from "../../utils/constants/url";
import {IRegistrationData} from "../../types/IRegistrationData";
import useTogglePassword from "../../hooks/useTogglePassword";
import PasswordIcon from "../PasswordIcon/PasswordIcon";


const RegistrationForm: FC = () => {
    const {registration} = useActions();
    const [error, setError] = useState({} as IErrorRegistration);
    const [userData, setUserData] = useState<IRegistrationData>({
        email: "",
        nickname: "",
        password: "",
    });
    const {isVisible, type, changePassword} = useTogglePassword();
    const inputRef = useRef<HTMLInputElement>(null);

    const submit = (e: SyntheticEvent) => {
        e.preventDefault();
        registration(userData, setError);
    }


    return (
        <div className={s["wrapper"]}>
            <div className={s["form-wrapper"]}>
                <div className={s["header"]}>
                    <Title>Create account</Title>
                </div>

                <form onSubmit={submit}>
                    <div className={s["text-field-wrapper"]}>
                        <TextField
                            label="Nickname"
                            nameInput="nickname"
                            style={s["text-field"]}
                            value={userData.nickname}
                            errorMessage={error?.nickname}
                            onChange={(e) => handleChange<IRegistrationData>(e, setUserData)}
                        />
                    </div>

                    <div className={s["text-field-wrapper"]}>
                        <TextField
                            label="Email"
                            nameInput="email"
                            style={s["text-field"]}
                            value={userData.email}
                            errorMessage={error?.email}
                            onChange={(e) => handleChange<IRegistrationData>(e, setUserData)}
                        />
                    </div>

                    <div className={s["text-field-wrapper"]}>
                        <TextField
                            ref={inputRef}
                            label="Password"
                            nameInput="password"
                            style={s["text-field"]}
                            value={userData.password}
                            typeInput={type}
                            errorMessage={error?.password}
                            endIcon={<PasswordIcon isVisible={isVisible} changePassword={changePassword}/>}
                            onChange={(e) => handleChange<IRegistrationData>(e, setUserData)}
                        />
                    </div>

                    <button type="submit" className={s["submit"]}>Create</button>
                    <span>Already have an account? <Link to={HOME_ROUTE}> Sign-In</Link></span>
                </form>
            </div>
        </div>
    );
}

export default RegistrationForm;