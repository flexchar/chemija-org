import React, { useState, useMemo, useCallback } from 'react';

// Helper function to round to a specified number of decimal places
function round(value, decimals = 4) {
    if (typeof value !== 'number' || isNaN(value)) return '';
    return +value.toFixed(decimals);
}

function ConcentrationCalculator() {
    const initialFormula = { c: '', n: '', v: '' };
    const [formula, setFormula] = useState(initialFormula);
    const [error, setError] = useState(''); // State for error messages

    // Handle input changes
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        // Allow positive numbers and decimal point
        if (/^[0-9]*\.?[0-9]*$/.test(value) || value === '') {
            setFormula((prev) => ({ ...prev, [name]: value }));
            setError(''); // Clear error on input change
        }
    }, []);

    // Memoize readiness check
    const isReady = useMemo(() => {
        const filledValues = Object.values(formula).filter(
            (val) =>
                val !== '' && !isNaN(parseFloat(val)) && parseFloat(val) >= 0,
        );
        return filledValues.length === 2;
    }, [formula]);

    // Reset function
    const reset = useCallback(() => {
        setFormula(initialFormula);
        setError('');
    }, [initialFormula]);

    // Calculation function
    const calculate = useCallback(() => {
        setError(''); // Clear previous errors
        if (!isReady) return;

        const missingEntry = Object.entries(formula).find(
            ([, val]) => val === '' || val === null,
        );
        if (!missingEntry) return;

        const [missingKey] = missingEntry;
        const { c: cStr, n: nStr, v: vStr } = formula;

        const c = parseFloat(cStr);
        const n = parseFloat(nStr);
        const v = parseFloat(vStr);

        let calculatedValue = null;

        try {
            switch (missingKey) {
                case 'c':
                    if (isNaN(n) || isNaN(v)) {
                        setError('Trūksta n arba v reikšmių.');
                        return;
                    }
                    if (v === 0) {
                        setError('Tūris (v) negali būti nulis.');
                        return;
                    }
                    calculatedValue = n / v;
                    break;
                case 'n':
                    if (isNaN(c) || isNaN(v)) {
                        setError('Trūksta c arba v reikšmių.');
                        return;
                    }
                    calculatedValue = c * v;
                    break;
                case 'v':
                    if (isNaN(n) || isNaN(c)) {
                        setError('Trūksta n arba c reikšmių.');
                        return;
                    }
                    if (c === 0) {
                        // Technically possible if n=0, but likely an error if n>0.
                        // If n > 0 and c = 0, volume would be infinite. Handle as error.
                        if (n > 0) {
                            setError(
                                'Koncentracija (c) negali būti nulis, jei kiekis (n) > 0.',
                            );
                            return;
                        } else {
                            calculatedValue = 0; // If n=0, any volume results in c=0.
                        }
                    } else {
                        calculatedValue = n / c;
                    }
                    break;
                default:
                    setError('Nežinoma klaida.');
                    return;
            }

            if (calculatedValue < 0) {
                setError('Rezultatas negali būti neigiamas.');
                return;
            }

            setFormula((prev) => ({
                ...prev,
                [missingKey]: round(calculatedValue),
            }));
        } catch (error) {
            console.error('Error during calculation:', error);
            setError('Skaičiavimo klaida.');
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
            {/* Concentration (c) Input */}
            <div className="form-control mb-4">
                <label className="label" htmlFor="input-c">
                    <span className="label-text">Koncentracija (c)</span>
                    <span className="label-text-alt">mol/l</span>
                </label>
                <input
                    id="input-c"
                    name="c"
                    type="text"
                    inputMode="decimal"
                    step="any"
                    className="input input-bordered w-full"
                    value={formula.c}
                    onChange={handleChange}
                    placeholder="pvz., 0.1"
                    aria-invalid={error && formula.c === '' ? 'true' : 'false'}
                />
            </div>

            {/* Amount (n) Input */}
            <div className="form-control mb-4">
                <label className="label" htmlFor="input-n">
                    <span className="label-text">Kiekis moliais (n)</span>
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
                    placeholder="pvz., 0.5"
                    aria-invalid={error && formula.n === '' ? 'true' : 'false'}
                />
            </div>

            {/* Volume (v) Input */}
            <div className="form-control mb-4">
                <label className="label" htmlFor="input-v">
                    <span className="label-text">Tūris (V)</span>
                    <span className="label-text-alt">
                        l (dm<sup>3</sup>)
                    </span>
                </label>
                <input
                    id="input-v"
                    name="v"
                    type="text"
                    inputMode="decimal"
                    step="any"
                    className="input input-bordered w-full"
                    value={formula.v}
                    onChange={handleChange}
                    placeholder="pvz., 5"
                    aria-invalid={error && formula.v === '' ? 'true' : 'false'}
                />
            </div>

            {/* Error Message */}
            {error && (
                <div role="alert" className="alert alert-error mb-4">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="stroke-current shrink-0 h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <span>{error}</span>
                </div>
            )}

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

export default ConcentrationCalculator;
