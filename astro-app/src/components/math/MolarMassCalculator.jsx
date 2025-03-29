import React, { useState, useMemo, useCallback } from 'react';

// Helper function to round to a specified number of decimal places
function round(value, decimals = 4) {
    if (typeof value !== 'number' || isNaN(value)) return '';
    return +value.toFixed(decimals);
}

function MolarMassCalculator() {
    const initialFormula = { n: '', m: '', M: '' };
    const [formula, setFormula] = useState(initialFormula);

    // Handle input changes
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        // Allow positive numbers and decimal point
        if (/^[0-9]*\.?[0-9]*$/.test(value) || value === '') {
            setFormula((prev) => ({ ...prev, [name]: value }));
        }
    }, []);

    // Memoize readiness check
    const isReady = useMemo(() => {
        // Check if exactly two fields have valid, non-empty numeric strings
        const filledValues = Object.values(formula).filter(
            (val) => val !== '' && !isNaN(parseFloat(val)),
        );
        return filledValues.length === 2;
    }, [formula]);

    // Reset function
    const reset = useCallback(() => {
        setFormula(initialFormula);
    }, [initialFormula]);

    // Calculation function
    const calculate = useCallback(() => {
        if (!isReady) return;

        const missingEntry = Object.entries(formula).find(
            ([, val]) => val === '' || val === null,
        );
        if (!missingEntry) return; // Should not happen if isReady is true

        const [missingKey] = missingEntry;
        const { n: nStr, m: mStr, M: MStr } = formula;

        // Parse the provided values
        const n = parseFloat(nStr);
        const m = parseFloat(mStr);
        const M = parseFloat(MStr);

        let calculatedValue = null;

        try {
            switch (missingKey) {
                case 'n':
                    if (!isNaN(m) && !isNaN(M) && M !== 0) {
                        calculatedValue = m / M;
                    } else {
                        console.error(
                            'Cannot calculate n: Invalid m or M (M cannot be zero).',
                        );
                        return; // Or set an error state
                    }
                    break;
                case 'm':
                    if (!isNaN(n) && !isNaN(M)) {
                        calculatedValue = n * M;
                    } else {
                        console.error('Cannot calculate m: Invalid n or M.');
                        return;
                    }
                    break;
                case 'M':
                    // Corrected formula: M = m / n
                    if (!isNaN(m) && !isNaN(n) && n !== 0) {
                        calculatedValue = m / n;
                    } else {
                        console.error(
                            'Cannot calculate M: Invalid m or n (n cannot be zero).',
                        );
                        return;
                    }
                    break;
                default:
                    console.error('Unknown missing key:', missingKey);
                    return;
            }
            // Update state with the rounded calculated value
            setFormula((prev) => ({
                ...prev,
                [missingKey]: round(calculatedValue),
            }));
        } catch (error) {
            console.error('Error during calculation:', error);
            // Optionally set an error message state to display to the user
        }
    }, [formula, isReady]);

    // Handle Enter key
    const handleKeyDown = useCallback(
        (e) => {
            if (e.key === 'Enter') {
                calculate();
            }
        },
        [calculate],
    );

    return (
        <div onKeyDown={handleKeyDown}>
            {' '}
            {/* Attach keydown listener to the container */}
            {/* Amount of Substance (n) Input */}
            <div className="form-control mb-4">
                <label className="label" htmlFor="input-n">
                    <span className="label-text">Atomų molių skaičius (n)</span>
                    <span className="label-text-alt">mol</span>
                </label>
                <input
                    id="input-n"
                    name="n"
                    type="text"
                    inputMode="decimal"
                    step="any"
                    className="input input-bordered w-full"
                    value={formula.n}
                    onChange={handleChange}
                    placeholder="pvz., 1"
                />
            </div>
            {/* Mass (m) Input */}
            <div className="form-control mb-4">
                <label className="label" htmlFor="input-m">
                    <span className="label-text">Elemento masė (m)</span>
                    <span className="label-text-alt">g</span>
                </label>
                <input
                    id="input-m"
                    name="m"
                    type="text"
                    inputMode="decimal"
                    step="any"
                    className="input input-bordered w-full"
                    value={formula.m}
                    onChange={handleChange}
                    placeholder="pvz., 18.015"
                />
            </div>
            {/* Molar Mass (M) Input */}
            <div className="form-control mb-4">
                <label className="label" htmlFor="input-M">
                    <span className="label-text">
                        Santykinė atominė masė (M)
                    </span>
                    <span className="label-text-alt">g/mol</span>
                </label>
                <input
                    id="input-M"
                    name="M"
                    type="text"
                    inputMode="decimal"
                    step="any"
                    className="input input-bordered w-full"
                    value={formula.M}
                    onChange={handleChange}
                    placeholder="pvz., 18.015"
                />
            </div>
            {/* Action Buttons */}
            <div className="mt-4 space-x-4">
                <button
                    className={`btn ${!isReady ? 'btn-disabled' : 'btn-primary'}`}
                    onClick={calculate}
                    disabled={!isReady}
                >
                    Skaičiuoti
                </button>
                <button type="button" className="btn btn-ghost" onClick={reset}>
                    Išvalyti
                </button>
            </div>
        </div>
    );
}

export default MolarMassCalculator;
