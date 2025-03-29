import React, { useState, useCallback } from 'react';
// Assuming the balancer logic exists and is compatible/ported to JS/TS
import { balance, getRandom } from './chemicalEquationBalancer';

function ChemicalBalancer() {
    const [equation, setEquation] = useState('');
    const [result, setResult] = useState('');

    // Function to balance the equation
    const handleBalance = useCallback(() => {
        if (!equation.trim()) return; // Don't balance if input is empty
        try {
            // The balance function is expected to return an HTML string or handle errors
            const balancedResult = balance(equation);
            setResult(balancedResult);
        } catch (error) {
            console.error('Error balancing equation:', error);
            // Display error message to the user, assuming balance might throw or return error indication
            setResult(
                `<p class="text-error">Klaida: ${error.message || 'Nepavyko subalansuoti lygties.'}</p>`,
            );
        }
    }, [equation]);

    // Function to show a random example
    const handleProvideRandom = useCallback(() => {
        const randomEquation = getRandom();
        setEquation(randomEquation);
        // Automatically balance the random equation
        try {
            const balancedResult = balance(randomEquation);
            setResult(balancedResult);
        } catch (error) {
            console.error('Error balancing random equation:', error);
            setResult(
                `<p class="text-error">Klaida: ${error.message || 'Nepavyko subalansuoti pavyzdinės lygties.'}</p>`,
            );
        }
    }, []);

    // Function to clear the input and result
    const handleClear = useCallback(() => {
        setEquation('');
        setResult('');
    }, []);

    // Handle input change
    const handleChange = (e) => {
        setEquation(e.target.value);
    };

    // Handle Enter key press in input
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleBalance();
        }
    };

    return (
        <div>
            {/* Equation Input */}
            <label htmlFor="equationInput" className="block mb-4">
                <span className="sr-only">Cheminė lygtis</span>{' '}
                {/* Added for accessibility */}
                <input
                    id="equationInput"
                    type="text"
                    className="input input-bordered w-full" // DaisyUI input class
                    placeholder="pvz., Na + H2O2 = NaOH"
                    value={equation}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                />
            </label>

            {/* Result Display */}
            {/* Using dangerouslySetInnerHTML because the original balance function likely returns HTML */}
            <div
                className="px-2 min-h-[2em]" // Added min-height for layout consistency
                dangerouslySetInnerHTML={{ __html: result }}
            />

            {/* Action Buttons */}
            <div className="mt-4 space-x-2 md:space-x-4">
                {' '}
                {/* Added spacing */}
                <button
                    className={`btn ${!equation.trim() ? 'btn-disabled' : 'btn-primary'}`} // DaisyUI button classes
                    onClick={handleBalance}
                    disabled={!equation.trim()}
                >
                    Lyginti
                </button>
                <button
                    type="button"
                    className="btn btn-ghost" // DaisyUI ghost button
                    onClick={handleProvideRandom}
                >
                    Rodyti pavyzdį
                </button>
                <button
                    type="button"
                    className="btn btn-ghost" // DaisyUI ghost button
                    onClick={handleClear}
                >
                    Išvalyti
                </button>
            </div>
        </div>
    );
}

export default ChemicalBalancer;
