import {FocusEventHandler, MouseEventHandler, RefObject, useCallback, useDeferredValue, useMemo, useState} from "react";


const useSelect = (
    containerRef: RefObject<HTMLDivElement>,
    optionsWrapperRef: RefObject<HTMLUListElement>,
    optionElemsRefs: RefObject<HTMLLIElement[]>,
    inputRef: RefObject<HTMLInputElement>,
    options: string[]) => {
    const [value, setValue] = useState<string>("");
    const [isOpenList, setIsOpenList] = useState<boolean>(false);
    const deferredValue = useDeferredValue(value);

    const actualOptions: string[] = useMemo(() => {
        if (!deferredValue) {
            return options;
        }

        return options.filter(str =>
            str.toLowerCase().includes(deferredValue.toLowerCase())
        );
    }, [options, deferredValue])

    const onInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.currentTarget.value);
    }, [options])

    const onChange = useCallback((value: string) => {
        if (!value) {
            return;
        }
        else if (!options.includes(value)) {
            setValue("");
        }
        else {
            setValue(value);
        }

        setIsOpenList(false);
    }, [value, options])

    const onClickOrFocus = useCallback((target: Element | EventTarget | null, toTarget?: Element) => {
        if (toTarget === inputRef.current) {
            setIsOpenList(true);
            return;
        }
        if (
            optionElemsRefs.current
            && target instanceof HTMLLIElement
            && optionElemsRefs.current.includes(target)
        ) {
            setIsOpenList(false);
            return;
        }
        setIsOpenList(true);
    }, [])

    const onFocus: FocusEventHandler<HTMLInputElement> = useCallback((e) => {
        onClickOrFocus(e.relatedTarget, e.target);
    }, [])

    const onClick: MouseEventHandler<HTMLDivElement> = useCallback((e) => {
        inputRef.current?.focus();
        onClickOrFocus(e.target);
    }, [])

    const onBlur: FocusEventHandler<HTMLDivElement> = useCallback((e) => {
        if (e.relatedTarget) {
            if (e.relatedTarget === optionsWrapperRef.current || e.relatedTarget === containerRef.current) {
                return;
            }
            else if (
                optionElemsRefs.current
                && e.relatedTarget instanceof HTMLLIElement
                && optionElemsRefs.current.includes(e.relatedTarget)
            ) {
                return;
            }
        }

        if (!options.includes(value)) {
            setValue("");
        }
        setIsOpenList(false);
    }, [options, value])

    const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement | HTMLLIElement>, indexPrevLi: number, indexNextLi: number) => {
        console.log("KEY DOWN: ", e, indexNextLi)
        if (e.code !== "ArrowDown" && e.code !== "ArrowUp" || !optionElemsRefs.current) {
            return;
        }
        else if (e.code === "ArrowUp") {
            if (indexPrevLi === -1) {
                inputRef.current?.focus();
                return;
            }
            optionElemsRefs.current[indexPrevLi].focus();
            return;
        }

        optionElemsRefs.current[indexNextLi].focus()
    }, [actualOptions])

    return {value, isOpenList, onChange, onClick, onFocus, onBlur, onInput, onKeyDown, actualOptions}
}

export {useSelect};