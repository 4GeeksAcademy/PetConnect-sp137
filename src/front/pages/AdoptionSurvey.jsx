import React, { useState } from "react";

const AdoptionSurvey = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [showResult, setShowResult] = useState(false);
    const [result, setResult] = useState("");

    const questions = [
        {
            question: "¿Por qué quieres adoptar?",
            options: [
                "Quiero darle un hogar a un animal que lo necesita ❤️",
                "Busco compañía 🏡",
                "Quiero ampliar mi familia 👨‍👩‍👧",
                "Quiero ayudar a un animal 🐾"
            ]
        },
        {
            question: "¿Qué mascota te gustaría adoptar?",
            options: [
                "Perro 🐶",
                "Gato 🐱",
                "Me da igual ❤️"
            ]
        },
        {
            question: "¿Dónde vivirá tu futuro compañero?",
            options: [
                "Apartamento 🏢",
                "Casa 🏠",
                "Casa con jardín 🌳"
            ]
        },
        {
            question: "¿Cuánto tiempo puedes dedicarle cada día?",
            options: [
                "Menos de 2 horas ⏰",
                "Entre 2 y 5 horas 🕐",
                "Más de 5 horas ❤️"
            ]
        },
        {
            question: "¿Has tenido mascotas anteriormente?",
            options: [
                "Sí, tengo experiencia 🐾",
                "Sí, pero hace tiempo",
                "No, sería mi primera mascota 🐶"
            ]
        },
        {
            question: "¿Qué esperas de tu futuro compañero?",
            options: [
                "Un compañero para hacerme compañía ❤️",
                "Un compañero para toda la familia 👨‍👩‍👧",
                "Quiero ayudar a un animal que necesita un hogar 🏡",
                "No tengo una preferencia concreta 🐾"
            ]
        }
    ];

    const handleAnswer = (answer) => {
        const updatedAnswers = {
            ...answers,
            [currentQuestion]: answer
        };

        setAnswers(updatedAnswers);

        if (currentQuestion < questions.length - 1) {
            setTimeout(() => {
                setCurrentQuestion(currentQuestion + 1);
            }, 300);
        } else {
            calculateResult(updatedAnswers);
        }
    };

    const nextQuestion = () => {
        if (!answers[currentQuestion]) {
            alert("Por favor, selecciona una opción");
            return;
        }

        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
        }
    };

    const previousQuestion = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
        }
    };

    const calculateResult = (surveyAnswers = answers) => {
        if (!surveyAnswers[currentQuestion]) {
            alert("Por favor, selecciona una opción");
            return;
        }

        const petPreference = surveyAnswers[1];
        const home = surveyAnswers[2];
        const time = surveyAnswers[3];

        let recommendation = "";

        // Si la persona tiene una preferencia clara
        if (petPreference === "Perro 🐶") {
            recommendation = "🐶 Un perro podría ser tu compañero ideal";
        } else if (petPreference === "Gato 🐱") {
            recommendation = "🐱 Un gato podría ser tu compañero ideal";
        } else {
            // Si le da igual, calculamos según su estilo de vida
            if (home === "Casa con jardín 🌳" && time === "Más de 5 horas ❤️") {
                recommendation = "🐶 Un perro podría ser tu compañero ideal";
            } else if (home === "Casa 🏠" && time === "Más de 5 horas ❤️") {
                recommendation = "🐶 Un perro podría ser tu compañero ideal";
            } else {
                recommendation = "🐱 Un gato podría ser tu compañero ideal";
            }
        }

        setResult(recommendation);
        setShowResult(true);
    };

    const restartSurvey = () => {
        setCurrentQuestion(0);
        setAnswers({});
        setResult("");
        setShowResult(false);
    };

    if (showResult) {
        return (
            <div className="container mt-5">
                <div className="text-center">

                    <h1>🐾 Tu compañero ideal</h1>

                    <p className="text-muted mt-3">
                        Hemos analizado tus respuestas
                    </p>

                    <div className="card shadow mt-4 p-5">

                        <h2 className="mb-4">
                            {result}
                        </h2>

                        <p>
                            Gracias por completar nuestra encuesta de adopción.
                            ❤️
                        </p>

                        <p>
                            Esta recomendación se basa en tus preferencias
                            y en tu estilo de vida.
                        </p>

                        <button
                            className="btn btn-primary mt-4"
                            onClick={restartSurvey}
                        >
                            🔄 Realizar encuesta de nuevo
                        </button>

                    </div>

                </div>
            </div>
        );
    }

    const question = questions[currentQuestion];

    return (
        <div className="container mt-5">
            <div className="text-center">

                <h1>🐾 Encuentra a tu compañero ideal</h1>

                <p className="text-muted">
                    Queremos conocerte un poquito mejor
                </p>

                <p>
                    Pregunta {currentQuestion + 1} de {questions.length}
                </p>

                <div className="progress mb-4">
                    <div
                        className="progress-bar"
                        role="progressbar"
                        style={{
                            width: `${((currentQuestion + 1) / questions.length) * 100}% `
                        }}
                    >
                    </div>
                </div>

                <h2 className="mb-4">
                    {question.question}
                </h2>

                <div className="d-flex flex-column gap-3">

                    {question.options.map((option) => (
                        <button
                            key={option}
                            className={`btn ${answers[currentQuestion] === option
                                ? "btn-primary"
                                : "btn-outline-primary"
                                } `}
                            onClick={() => handleAnswer(option)}
                        >
                            {option}
                        </button>
                    ))}

                </div>

                <div className="d-flex justify-content-start mt-5">

                    <button
                        className="btn btn-secondary"
                        onClick={previousQuestion}
                        disabled={currentQuestion === 0}
                    >
                        ← Anterior
                    </button>

                </div>
            </div>
        </div>
    );
};

export default AdoptionSurvey;