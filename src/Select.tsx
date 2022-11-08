import React, { useEffect, useRef, useState } from "react"
import styles from "./select.module.css"

export type SelectOption = {
	label: string
	value: string | number
}

type MultipleSelectProps = {
    isMultiple: true
    value: SelectOption[]
    onChange: (value: SelectOption[]) => void 
}

type SingleSelectedProps = {
    isMultiple?: false
    value?: SelectOption | undefined
    onChange: (value: SelectOption | undefined) => void
} 

type SelectProps = {
	options: SelectOption[]
} & (SingleSelectedProps | MultipleSelectProps)

export const Select = ({isMultiple, value, onChange, options }: SelectProps) => {
    const [isOptionListShown, setIsOptionListShown] = useState<boolean>(false)
    const [highlightedIndex, setHighlightedIndex] = useState(0)
    const containerRef = useRef<HTMLDivElement>(null)

    const selectOption = (option: SelectOption) => {
        if (isMultiple) {
            if (value.includes(option)) {
                onChange(value.filter(o => o !== option))
            } else {
                onChange([...value, option])
            }
        } else {
            if (option !== value) onChange(option)
        }
    }

    const isOptionSelected = (option : SelectOption) => {
        return isMultiple ? value.includes(option) : option === value
    }

    useEffect(() => {
        isOptionListShown && setHighlightedIndex(0)
    }, [isOptionListShown])

    useEffect(() => {
        const handler = (event: KeyboardEvent ) => {
            if (event.target !== containerRef.current) return
            switch (event.code) {
                case "Enter" :
                    break
                case "Space" :
                    setIsOptionListShown(!isOptionListShown)
                    if (isOptionListShown) selectOption(options[highlightedIndex])
                    break 
                case "ArrowUp":

                    break
                case "ArrowDown": {
                    if (!isOptionListShown) {
                        setIsOptionListShown(true)
                        break
                    }
                    const newValue = highlightedIndex + 1
                    if (newValue >= 0 && newValue < options.length) {
                        setHighlightedIndex(newValue)
                        break
                    } else if (newValue === options.length) {
                        setHighlightedIndex(0)
                        break
                    }
                }
            }
        }
        containerRef.current?.addEventListener('keydown', (event) => handler(event))

        return () => {
            containerRef.current?.removeEventListener('keydown', (event) => handler(event))
        }
    }, [isOptionListShown, highlightedIndex, options])

	return (
		<div 
            ref={containerRef}
            tabIndex={0}
            className={styles.container}
            onClick={() => setIsOptionListShown(!isOptionListShown)}
            onBlur={() => setIsOptionListShown(false)}
        >
			<span className={styles.value}>
                {
                    isMultiple
                        ? value.map(o => (
                            <button
                                key={o.value}
                                onClick={event=>{
                                    event.stopPropagation()
                                    selectOption(o)
                                }}
                                className={styles["option-badge"]}
                            >
                                {o.label}
                                <span className={styles["btn-remove"]}>&times;</span>
                            </button>
                        ))
                        : value?.label
                }
            </span>
			<button
                tabIndex={1}
                className={styles["btn-clear"]}
                onClick={event => {
                    event.stopPropagation()
                    isMultiple ? onChange([]) : onChange(undefined) 
                }}
            >
				&times;
			</button>
			<div className={styles.divider}></div>
			<div className={styles.caret}></div>
			<ul className={`${styles.options} ${isOptionListShown ? styles.shown : ''}`}>
				{options.map((option, index) => (
					<li
                        key={option.value}
                        className={`
                            ${styles.option}
                            ${isOptionSelected(option) && highlightedIndex !== index ? styles.selected : ''}
                            ${highlightedIndex === index ? styles.highlighted : ''}
                            `}
                        onClick={() => {
                            selectOption(option)
                        }}
                        onMouseOver={() => {
                             setHighlightedIndex(index)
                        }}
                    >
						{option.label}
					</li>
				))}
			</ul>
		</div>
	)
}
