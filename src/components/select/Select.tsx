import {FC, Suspense, useMemo, useRef} from "react";
import * as classNames from "classnames";
// custom hooks
import {useSelect} from "../../hooks/select.hook.ts";
// styles
import "./select.scss";


interface ISelectProps {
    options: string[];
    label: string
}
const Select: FC<ISelectProps> = ({options, label}) => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const optionsWrapperRef = useRef<HTMLUListElement | null>(null);
    const optionElemsRefs = useRef<HTMLLIElement[]>([]);
    const {
        value,
        actualOptions,
        isOpenList,
        onChange,
        onClick,
        onFocus,
        onBlur,
        onInput,
        onKeyDown
    } = useSelect(containerRef, optionsWrapperRef, optionElemsRefs, inputRef, options);

    const setLiElemRef = (el: HTMLLIElement) => {
        if (!el || optionElemsRefs.current.includes(el)) {
            return;
        }

        optionElemsRefs.current.push(el);
    }

    const listOptions = useMemo(() => {
        if (actualOptions.length === 0) {
            return <></>
        }

        return actualOptions.map((str, index, thisArr) => (
            <li
                ref={setLiElemRef}
                key={str}
                tabIndex={0}
                className="list-options__el"
                onClick={() => onChange(str)}
                onKeyDown={(e) => onKeyDown(
                    e,
                    index - 1 >= 0 ? index - 1 : -1,
                    thisArr.length === index + 1 ? index : index + 1
                )}
            >{str}</li>
        ))
    }, [actualOptions, onChange, onKeyDown])

    return (
        <div
            ref={containerRef}
            className={classNames("select", isOpenList && "select_active")}
            onClick={onClick}
            onBlur={onBlur}
        >
            <label
                htmlFor="select-input"
                className={classNames("select__label", (isOpenList || value) && "select__label_active")}
            >{label}</label>

            <input
                ref={inputRef}
                id="select-input"
                className="select__input"
                type="text"
                value={value}
                onInput={onInput}
                onKeyDown={(e) => onKeyDown(e, -1, 0)}
                onFocus={onFocus}
                onBlur={(e) => onChange(e.target.value)}
            />

            <ul
                ref={optionsWrapperRef}
                onKeyDown={(e) => {e.preventDefault()}}
                className={classNames("select__list-options", "list-options", !isOpenList && "list-options_hidden")}
            >
                <Suspense fallback={"Loading..."}>
                    {listOptions}
                </Suspense>
            </ul>
        </div>
    );
};

export default Select;