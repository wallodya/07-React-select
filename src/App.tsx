import { useState } from "react"
import { Select, SelectOption } from "./Select"

const options: SelectOption[] = [
	{ label: "First", value: 1 },
	{ label: "Second", value: 2 },
	{ label: "Third", value: 3 },
	{ label: "Fourth", value: 4 },
	{ label: "Fifth", value: 5 },
]

function App() {
	const [value, setValue] = useState<SelectOption | undefined>(options[0])
	const [valueMultiple, setValueMultiple] = useState<SelectOption[]>([options[0]])

	return (
        <>
            <Select
                options={options}
                value={value}
                onChange={option => {
                    setValue(option)
                }}
            />
            <br /><br />
            <Select
                isMultiple={true}
                options={options}
                value={valueMultiple}
                onChange={option => {
                    setValueMultiple(option)
                }}
            />
        </>
	)
}

export default App
