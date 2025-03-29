import React, { useState, useCallback, useMemo } from 'react';

// Helper function to calculate Kelvin from different units
const calculateKelvin = (value, type) => {
    const num = parseFloat(value);
    if (isNaN(num)) return null; // Return null if parsing fails
    switch (type) {
        case 'fahrenheit':
            return ((num - 32) * 5) / 9 + 273.15;
        case 'celsius':
            return num + 273.15;
        case 'kelvin':
            return num;
        default:
            return null; // Should not happen
    }
};

// Helper function to calculate all temperatures from Kelvin
const calculateTemperatures = (kelvin) => {
    if (kelvin === null || isNaN(kelvin)) {
        return {
            fahrenheit: '',
            celsius: '',
            kelvin: '',
        };
    }
    return {
        fahrenheit: +(((kelvin - 273.15) * 9) / 5 + 32).toFixed(4),
        celsius: +(kelvin - 273.15).toFixed(4),
        kelvin: +kelvin.toFixed(4),
    };
};

function TemperatureConverter() {
    const initialDegrees = {
        fahrenheit: '',
        celsius: '',
        kelvin: '',
    };
    const [degrees, setDegrees] = useState(initialDegrees);

    // Memoize isEmpty calculation
    const isEmpty = useMemo(() => {
        return Object.values(degrees).every(
            (val) => val === '' || val === null,
        );
    }, [degrees]);

    // Handle input changes
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        // Allow only numbers and a single decimal point
        if (/^[0-9]*\.?[0-9]*$/.test(value) || value === '') {
            setDegrees((prevDegrees) => ({
                ...prevDegrees,
                [name]: value,
            }));
        }
    }, []);

    // Perform calculation
    const calculate = useCallback(() => {
        let sourceValue = null;
        let sourceType = null;

        // Find the first field that has a valid number
        for (const [type, value] of Object.entries(degrees)) {
            const parsedValue = parseFloat(value);
            if (!isNaN(parsedValue) && value !== '') {
                sourceValue = parsedValue;
                sourceType = type;
                break;
            }
        }

        if (sourceType !== null) {
            const kelvin = calculateKelvin(sourceValue, sourceType);
            const newTemperatures = calculateTemperatures(kelvin);
            setDegrees(newTemperatures);
        } else {
            // If no valid input found after trying to calculate, reset (optional)
            // Or handle as an error/warning
            console.warn('No valid input value found for calculation.');
        }
    }, [degrees]);

    // Reset all fields
    const reset = useCallback(() => {
        setDegrees(initialDegrees);
    }, [initialDegrees]);

    // Handle Enter key press for calculation
    const handleKeyDown = useCallback(
        (e) => {
            if (e.key === 'Enter') {
                calculate();
            }
        },
        [calculate],
    );

    return (
        <section>
            {/* Fahrenheit Input */}
            <label
                htmlFor="fahrenheit"
                className="block mb-4 text-gray-700 dark:text-gray-300"
            >
                Farenheito, °F
                <input
                    id="fahrenheit"
                    name="fahrenheit"
                    type="text" // Use text to allow empty string and better control parsing
                    inputMode="decimal" // Hint for mobile keyboards
                    step="0.0001"
                    className="input input-bordered w-full mt-1" // Using DaisyUI input class
                    onKeyDown={handleKeyDown}
                    onChange={handleChange}
                    value={degrees.fahrenheit}
                    placeholder="pvz., 32"
                />
            </label>

            {/* Celsius Input */}
            <label
                htmlFor="celsius"
                className="block mb-4 text-gray-700 dark:text-gray-300"
            >
                Celsijaus, °C
                <input
                    id="celsius"
                    name="celsius"
                    type="text"
                    inputMode="decimal"
                    step="0.0001"
                    className="input input-bordered w-full mt-1"
                    onKeyDown={handleKeyDown}
                    onChange={handleChange}
                    value={degrees.celsius}
                    placeholder="pvz., 0"
                />
            </label>

            {/* Kelvin Input */}
            <label
                htmlFor="kelvin"
                className="block mb-4 text-gray-700 dark:text-gray-300"
            >
                Kelvino, K
                <input
                    id="kelvin"
                    name="kelvin"
                    type="text"
                    inputMode="decimal"
                    step="0.0001"
                    className="input input-bordered w-full mt-1"
                    onKeyDown={handleKeyDown}
                    onChange={handleChange}
                    value={degrees.kelvin}
                    placeholder="pvz., 273.15"
                />
            </label>

            {/* Action Buttons */}
            <div className="mt-4 space-x-4">
                <button
                    className={`btn ${isEmpty ? 'btn-disabled' : 'btn-primary'}`} // DaisyUI button classes
                    onClick={calculate}
                    disabled={isEmpty}
                >
                    Skaičiuoti
                </button>
                <button
                    type="button" // Prevent form submission if wrapped in a form
                    className="btn btn-ghost" // DaisyUI ghost button
                    onClick={reset}
                >
                    Išvalyti
                </button>
            </div>
        </section>
    );
}

export default TemperatureConverter;
