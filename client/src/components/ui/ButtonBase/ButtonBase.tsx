import { ButtonHTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';
import s from "./ButtonBase.module.scss";
import classNames from "classnames";


interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    startIcon?: ReactNode;
    endIcon?: ReactNode;
}

export const ButtonBase = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
    const { type, disabled, className, onClick, startIcon, endIcon, children } = props;

    return (
        <button
            ref={ref}
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={classNames(s.btn, className)}
        >
            {startIcon && <span className={s.startIcon}>{startIcon}</span>}
            {children}
            {endIcon && <span className={s.endIcon}>{endIcon}</span>}
        </button>
    );
});