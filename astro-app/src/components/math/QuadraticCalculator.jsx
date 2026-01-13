import React, { useState, useMemo, useCallback } from 'react';

// Helper function to round to two decimal places
function round(num) {
    if (typeof num !== 'number' || isNaN(num)) {
        return ''; // Return empty string or handle as needed for non-numeric/NaN
    }
    return parseFloat(Math.round(num * 100) / 100);
}

function QuadraticCalculator({ initialA, initialB, initialC }) {
    const initialFormula = {
        a: initialA || '',
        b: initialB || '',
        c: initialC || ''
    };
    const initialResults = {
        answer1: null,
        answer2: null,
        answer3: null,
        answer4: null,
        answer5: null,
        discriminant: null,
        discriminantRoot: null,
    };

    const [formula, setFormula] = useState(initialFormula);
    const [results, setResults] = useState(initialResults);
    const [showResults, setShowResults] = useState(false); // Control visibility of results

    // Handle input changes
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        // Allow numbers, decimal point, and negative sign at the start
        if (/^-?[0-9]*\.?[0-9]*$/.test(value) || value === '') {
            setFormula((prev) => ({ ...prev, [name]: value }));
            setShowResults(false); // Hide old results on new input
        }
    }, []);

    // Memoize parsed numeric values and readiness check
    const { valA, valB, valC, isReady, isQuadratic } = useMemo(() => {
        const a = parseFloat(formula.a);
        const b = parseFloat(formula.b);
        const c = parseFloat(formula.c);
        const ready =
            !isNaN(a) &&
            !isNaN(b) &&
            !isNaN(c) &&
            formula.a !== '' &&
            formula.b !== '' &&
            formula.c !== '';
        const quadratic = ready && a !== 0;
        return {
            valA: a,
            valB: b,
            valC: c,
            isReady: ready,
            isQuadratic: quadratic,
        };
    }, [formula]);

    // Memoize calculations based on numeric values
    const calculatedValues = useMemo(() => {
        if (!isReady)
            return {
                discriminant: null,
                discriminantRoot: null,
                x1: null,
                x2: null,
            };

        const discriminant = valB * valB - 4 * valA * valC;
        const discriminantRoot =
            discriminant >= 0 ? Math.sqrt(discriminant) : null;
        let x1 = null,
            x2 = null;

        if (valA !== 0 && discriminant >= 0) {
            // Calculate roots only if quadratic and real roots exist
            x1 = (-valB + discriminantRoot) / (2 * valA);
            x2 = (-valB - discriminantRoot) / (2 * valA);
        } else if (valA === 0 && valB !== 0) {
            // Linear equation case
            x1 = -valC / valB;
        }

        return { discriminant, discriminantRoot, x1, x2 };
    }, [isReady, valA, valB, valC]);

    // Function to perform calculations and update results state
    const calculate = useCallback(() => {
        if (!isReady) return;

        setShowResults(true); // Show results section
        const { discriminant, discriminantRoot, x1, x2 } = calculatedValues;
        let newResults = { ...initialResults, discriminant, discriminantRoot }; // Start with discriminant info

        if (!isQuadratic) {
            if (valA === 0 && valB !== 0) {
                newResults.answer1 = `Tiesinė lygtis. Sprendinys: x = ${round(x1)}`;
            } else if (valA === 0 && valB === 0 && valC !== 0) {
                newResults.answer1 =
                    'Lygtis neturi sprendinių (0 = c, c != 0).';
            } else if (valA === 0 && valB === 0 && valC === 0) {
                newResults.answer1 = 'Lygtis turi begalę sprendinių (0 = 0).';
            } else {
                newResults.answer1 =
                    'Įvestos reikšmės nesudaro kvadratinės lygties.';
            }
        } else {
            // Proceed with quadratic calculations
            const roundedX1 = round(x1);
            const roundedX2 = round(x2);

            // Derivative and vertex calculations
            const sec_dx = -valB / (2 * valA);
            const sec_dy = valA * sec_dx * sec_dx + valB * sec_dx + valC;
            const rounded_sec_dx = round(sec_dx);
            const rounded_sec_dy = round(sec_dy);

            if (discriminant > 0) {
                newResults.answer1 = `Kreivė kerta x ašį ties x = ${roundedX1} ir x = ${roundedX2}`;
                // Integral calculation (simplified)
                const ing1 =
                    (valA * x1 * x1 * x1) / 3 +
                    (valB * x1 * x1) / 2 +
                    valC * x1;
                const ing2 =
                    (valA * x2 * x2 * x2) / 3 +
                    (valB * x2 * x2) / 2 +
                    valC * x2;
                let inte = ing1 - ing2;
                newResults.answer2 = `Plotas: ${round(Math.abs(inte))}`; // Simplified area message
            } else if (discriminant === 0) {
                newResults.answer1 = `Kreivė liečia x ašį ties x = ${roundedX1}`;
                newResults.answer2 = 'N/A';
            } else {
                // discriminant < 0
                newResults.answer1 =
                    'Kreivė nekerta x ašies (neturi realių šaknų).';
                newResults.answer2 = 'N/A';
            }

            newResults.answer3 = `Kreivės nuolydis: ${2 * valA}x + ${valB}`;
            const extremeType = valA > 0 ? 'Mažiausia' : 'Didžiausia';
            newResults.answer4 = `${extremeType} kreivės vertė yra ${rounded_sec_dy}`; // Combined vertex info
            newResults.answer5 = `Viršūnės koordinatės: (${rounded_sec_dx}, ${rounded_sec_dy})`;
        }

        setResults(newResults);
    }, [
        isReady,
        isQuadratic,
        valA,
        valB,
        valC,
        calculatedValues,
        initialResults,
    ]);

    // Reset function
    const reset = useCallback(() => {
        setFormula(initialFormula);
        setResults(initialResults);
        setShowResults(false);
    }, [initialFormula, initialResults]);

    // Handle Enter key
    const handleKeyDown = useCallback(
        (e) => {
            if (e.key === 'Enter') {
                calculate();
            }
        },
        [calculate],
    );

    // Equation JSX
    const equationJSX = useMemo(
        () => (
            <span>
                {formula.a || 'a'}x<sup>2</sup> + {formula.b || 'b'}x +{' '}
                {formula.c || 'c'} = 0
            </span>
        ),
        [formula],
    );

    return (
        <div>
            {/* Input Fields */}
            <div className="grid grid-cols-1 gap-4 mb-4">
                {['a', 'b', 'c'].map((term) => (
                    <div key={term} className="form-control">
                        <label className="label" htmlFor={`input-${term}`}>
                            <span className="label-text font-bold uppercase">
                                {term}
                            </span>
                        </label>
                        <input
                            id={`input-${term}`}
                            name={term}
                            type="text" // Use text for better control over input
                            inputMode="decimal"
                            step="any" // Allow any step for decimals
                            className={`input input-bordered w-full ${term === 'a' && formula.a === '0' ? 'input-error' : ''}`}
                            value={formula[term]}
                            onChange={handleChange}
                            onKeyDown={handleKeyDown}
                            placeholder={term}
                        />
                        {term === 'a' && formula.a === '0' && (
                            <label className="label">
                                <span className="label-text-alt text-error">
                                    Jei A = 0, tai nėra kvadratinė lygtis.
                                </span>
                            </label>
                        )}
                    </div>
                ))}
            </div>

            {/* Results Section */}
            {showResults && (
                <div className="prose prose-sm dark:prose-invert max-w-none mb-4">
                    <h4>Rezultatai:</h4>
                    <p>
                        <strong>Lygtis:</strong> {equationJSX}
                    </p>
                    {results.discriminant !== null && (
                        <p>Diskriminantas (D): {round(results.discriminant)}</p>
                    )}
                    {results.discriminantRoot !== null && (
                        <p>
                            Diskriminanto šaknis (√D):{' '}
                            {round(results.discriminantRoot)}
                        </p>
                    )}
                    {results.discriminant !== null &&
                        results.discriminant < 0 && (
                            <p className="text-warning">
                                D &lt; 0, realiujų šaknų nėra.
                            </p>
                        )}

                    <p>{results.answer1}</p>
                    {results.answer2 && <p>{results.answer2}</p>}
                    {results.answer3 && <p>{results.answer3}</p>}
                    {results.answer4 && <p>{results.answer4}</p>}
                    {results.answer5 && <p>{results.answer5}</p>}
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

export default QuadraticCalculator;
