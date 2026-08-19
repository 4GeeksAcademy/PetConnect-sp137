import React, { useState } from "react";

const AdoptionSurvey = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [showResult, setShowResult] = useState(false);
    const [result, setResult] = useState([]);
    const [breedImages, setBreedImages] = useState({});

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
            question: "¿Cuánto ejercicio puedes ofrecerle diariamente?",
            options: [
                "Paseos tranquilos 🚶",
                "Entre 1 y 2 horas de actividad 🏃",
                "Más de 2 horas de actividad 🏃‍♀️"
            ]
        },
        {
            question: "¿Qué tamaño de perro prefieres?",
            options: [
                "Pequeño 🐶",
                "Mediano 🐕",
                "Grande 🐕‍🦺",
                "Me da igual ❤️"
            ]
        },
        {
            question: "¿Qué personalidad buscas en tu compañero?",
            options: [
                "Tranquilo y cariñoso ❤️",
                "Juguetón y activo ⚽",
                "Independiente 🐾",
                "Protector 🏡",
                "Me da igual ❤️"
            ]
        },
        {
            question: "¿Cuántas horas estaría solo durante un día normal?",
            options: [
                "Menos de 2 horas 🏡",
                "Entre 2 y 5 horas 🕐",
                "Más de 5 horas ⏰"
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
            question: "¿Hay niños en casa?",
            options: [
                "Sí 👶",
                "No 👤"
            ]
        },
        {
            question: "¿Tienes otras mascotas en casa?",
            options: [
                "Sí, perros 🐶",
                "Sí, gatos 🐱",
                "Sí, otras mascotas 🐾",
                "No ❤️"
            ]
        }
    ];

    const dogBreeds = [
        {
            name: "Chihuahua",
            apiName: "chihuahua",
            size: "small",
            energy: "medium",
            personality: "active",
            apartment: true,
            children: true,
            otherPets: true
        },
        {
            name: "Shih Tzu",
            apiName: "shihtzu",
            size: "small",
            energy: "low",
            personality: "calm",
            apartment: true,
            children: true,
            otherPets: true
        },
        {
            name: "Pomeranian",
            apiName: "pomeranian",
            size: "small",
            energy: "medium",
            personality: "active",
            apartment: true,
            children: true,
            otherPets: true
        },
        {
            name: "Beagle",
            apiName: "beagle",
            size: "medium",
            energy: "high",
            personality: "active",
            apartment: false,
            children: true,
            otherPets: true
        },
        {
            name: "Cocker Spaniel",
            apiName: "spaniel/cocker",
            size: "medium",
            energy: "high",
            personality: "active",
            apartment: true,
            children: true,
            otherPets: true
        },
        {
            name: "French Bulldog",
            apiName: "bulldog/french",
            size: "small",
            energy: "low",
            personality: "calm",
            apartment: true,
            children: true,
            otherPets: true
        },
        {
            name: "Poodle",
            apiName: "poodle",
            size: "medium",
            energy: "medium",
            personality: "active",
            apartment: true,
            children: true,
            otherPets: true
        },
        {
            name: "Labrador Retriever",
            apiName: "labrador",
            size: "large",
            energy: "high",
            personality: "active",
            apartment: false,
            children: true,
            otherPets: true
        },
        {
            name: "Golden Retriever",
            apiName: "retriever/golden",
            size: "large",
            energy: "high",
            personality: "active",
            apartment: false,
            children: true,
            otherPets: true
        },
        {
            name: "Border Collie",
            apiName: "collie/border",
            size: "medium",
            energy: "very-high",
            personality: "active",
            apartment: false,
            children: true,
            otherPets: true
        },
        {
            name: "Husky",
            apiName: "husky",
            size: "large",
            energy: "very-high",
            personality: "active",
            apartment: false,
            children: true,
            otherPets: true
        },
        {
            name: "Dachshund",
            apiName: "dachshund",
            size: "small",
            energy: "medium",
            personality: "active",
            apartment: true,
            children: true,
            otherPets: true
        },
        {
            name: "Yorkshire Terrier",
            apiName: "terrier/yorkshire",
            size: "small",
            energy: "medium",
            personality: "active",
            apartment: true,
            children: true,
            otherPets: true
        },
        {
            name: "Maltese",
            apiName: "maltese",
            size: "small",
            energy: "low",
            personality: "calm",
            apartment: true,
            children: true,
            otherPets: true
        },
        {
            name: "Pug",
            apiName: "pug",
            size: "small",
            energy: "low",
            personality: "calm",
            apartment: true,
            children: true,
            otherPets: true
        },
        {
            name: "Corgi",
            apiName: "corgi/pembroke",
            size: "small",
            energy: "medium",
            personality: "active",
            apartment: true,
            children: true,
            otherPets: true
        },
        {
            name: "Dalmatian",
            apiName: "dalmatian",
            size: "large",
            energy: "very-high",
            personality: "active",
            apartment: false,
            children: true,
            otherPets: true
        },
        {
            name: "Boxer",
            apiName: "boxer",
            size: "large",
            energy: "high",
            personality: "active",
            apartment: false,
            children: true,
            otherPets: true
        },
        {
            name: "German Shepherd",
            apiName: "german/shepherd",
            size: "large",
            energy: "high",
            personality: "active",
            apartment: false,
            children: true,
            otherPets: true
        },
        {
            name: "Rottweiler",
            apiName: "rottweiler",
            size: "large",
            energy: "high",
            personality: "calm",
            apartment: false,
            children: true,
            otherPets: true
        },
        {
            name: "Great Dane",
            apiName: "dane/great",
            size: "large",
            energy: "medium",
            personality: "calm",
            apartment: false,
            children: true,
            otherPets: true
        },
        {
            name: "Bernese Mountain Dog",
            apiName: "mountain/bernese",
            size: "large",
            energy: "medium",
            personality: "calm",
            apartment: false,
            children: true,
            otherPets: true
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

        const motivation = surveyAnswers[0];
        const home = surveyAnswers[1];
        const time = surveyAnswers[2];
        const exercise = surveyAnswers[3];
        const size = surveyAnswers[4];
        const personality = surveyAnswers[5];
        const aloneTime = surveyAnswers[6];
        const experience = surveyAnswers[7];
        const children = surveyAnswers[8];
        const otherPets = surveyAnswers[9];

        const scoredBreeds = dogBreeds.map((breed) => {
            let score = 0;
            const reasons = [];

            if (motivation === "Busco compañía 🏡") {
                if (
                    breed.personality === "calm" ||
                    breed.personality === "independent"
                ) {
                    score += 5;
                    reasons.push("Buena opción como compañero");
                }
            } else if (motivation === "Quiero ampliar mi familia 👨‍👩‍👧") {
                if (breed.children) {
                    score += 5;
                    reasons.push("Puede encajar bien en un entorno familiar");
                }
            } else if (motivation === "Quiero darle un hogar a un animal que lo necesita ❤️") {
                score += 5;
                reasons.push("Puede ser un buen compañero para adopción");
            } else if (motivation === "Quiero ayudar a un animal 🐾") {
                score += 5;
                reasons.push("Puede adaptarse a diferentes estilos de vida");
            }

            if (home === "Apartamento 🏢") {
                if (breed.apartment) {
                    score += 15;
                    reasons.push("Se adapta bien a un apartamento");
                }
            } else {
                score += 15;
                reasons.push("Puede adaptarse bien a una vivienda amplia");
            }

            if (time === "Menos de 2 horas ⏰") {
                if (breed.energy === "low") {
                    score += 15;
                    reasons.push("Su nivel de actividad es bajo");
                } else if (breed.energy === "medium") {
                    score += 8;
                }
            } else if (time === "Entre 2 y 5 horas 🕐") {
                if (
                    breed.energy === "low" ||
                    breed.energy === "medium"
                ) {
                    score += 15;
                    reasons.push("Encaja con un nivel de dedicación moderado");
                } else if (breed.energy === "high") {
                    score += 8;
                }
            } else if (time === "Más de 5 horas ❤️") {
                score += 15;
                reasons.push("Puedes dedicarle bastante tiempo");
            }

            if (exercise === "Paseos tranquilos 🚶") {
                if (breed.energy === "low") {
                    score += 20;
                    reasons.push("Tiene unas necesidades de ejercicio moderadas");
                } else if (breed.energy === "medium") {
                    score += 10;
                }
            } else if (exercise === "Entre 1 y 2 horas de actividad 🏃") {
                if (breed.energy === "medium") {
                    score += 20;
                    reasons.push("Encaja con un nivel de actividad medio");
                } else if (breed.energy === "high") {
                    score += 15;
                } else if (breed.energy === "low") {
                    score += 10;
                }
            } else if (exercise === "Más de 2 horas de actividad 🏃‍♀️") {
                if (breed.energy === "very-high") {
                    score += 20;
                    reasons.push("Ideal para una persona muy activa");
                } else if (breed.energy === "high") {
                    score += 18;
                    reasons.push("Puede acompañarte en actividades físicas");
                } else if (breed.energy === "medium") {
                    score += 10;
                }
            }

            if (size === "Me da igual ❤️") {
                score += 15;
            } else if (
                (size === "Pequeño 🐶" && breed.size === "small") ||
                (size === "Mediano 🐕" && breed.size === "medium") ||
                (size === "Grande 🐕‍🦺" && breed.size === "large")
            ) {
                score += 15;
                reasons.push("Coincide con el tamaño que prefieres");
            }

            if (personality === "Me da igual ❤️") {
                score += 15;
            } else if (
                personality === "Tranquilo y cariñoso ❤️" &&
                breed.personality === "calm"
            ) {
                score += 15;
                reasons.push("Su personalidad puede encajar con lo que buscas");
            } else if (
                personality === "Juguetón y activo ⚽" &&
                breed.personality === "active"
            ) {
                score += 15;
                reasons.push("Es una raza activa y juguetona");
            } else if (
                personality === "Independiente 🐾" &&
                breed.personality === "independent"
            ) {
                score += 15;
                reasons.push("Tiene un carácter más independiente");
            } else if (
                personality === "Protector 🏡" &&
                breed.personality === "active"
            ) {
                score += 10;
                reasons.push("Puede ofrecer un perfil activo y atento");
            }

            if (aloneTime === "Menos de 2 horas 🏡") {
                score += 10;
                reasons.push("Pasaría poco tiempo solo");
            } else if (aloneTime === "Entre 2 y 5 horas 🕐") {
                if (breed.energy !== "very-high") {
                    score += 10;
                } else {
                    score += 5;
                }
            } else if (aloneTime === "Más de 5 horas ⏰") {
                if (breed.energy === "low") {
                    score += 10;
                    reasons.push("Su nivel de actividad puede adaptarse mejor a periodos tranquilos");
                } else {
                    score += 3;
                }
            }

            if (experience === "No, sería mi primera mascota 🐶") {
                if (
                    breed.energy === "low" ||
                    breed.energy === "medium"
                ) {
                    score += 3;
                    reasons.push("Puede ser una opción para una primera mascota");
                }
            } else {
                score += 3;
            }

            if (children === "Sí 👶") {
                if (breed.children) {
                    score += 4;
                    reasons.push("Puede encajar en un hogar con niños");
                }
            } else {
                score += 4;
            }

            if (otherPets === "No ❤️") {
                score += 3;
            } else if (breed.otherPets) {
                score += 3;
                reasons.push("Puede convivir con otras mascotas");
            }

            return {
                ...breed,
                percentage: score,
                reasons: [...new Set(reasons)].slice(0, 4)
            };
        });

        const recommendations = scoredBreeds
            .sort((a, b) => b.percentage - a.percentage)
            .slice(0, 3);

        getBreedImages(recommendations);

        setResult(recommendations);
        setShowResult(true);
    };

    const getBreedImages = async (recommendations) => {
        try {
            const images = {};

            for (const breed of recommendations) {
                const response = await fetch(
                    `/api/dog-breeds/${breed.apiName}/image`
                );

                if (!response.ok) {
                    continue;
                }

                const data = await response.json();

                images[breed.apiName] = data.image;
            }

            setBreedImages(images);

        } catch (error) {
            console.error("Error getting breed images:", error);
        }
    };

    const restartSurvey = () => {
        setCurrentQuestion(0);
        setAnswers({});
        setResult([]);
        setShowResult(false);
    };

    if (showResult) {
        return (
            <div className="container mt-5">
                <div className="text-center">
                    <h1>🐾 Tus mejores coincidencias</h1>

                    <p className="text-muted mt-3">
                        Hemos analizado tus respuestas y encontramos las razas
                        que mejor encajan con tu estilo de vida.
                    </p>

                    <div className="row justify-content-center mt-4">
                        {result.map((breed, index) => (
                            <div
                                className="col-md-4 mb-4"
                                key={breed.apiName}
                            >
                                <div className="card shadow h-100 border-0" style={{ borderRadius: "15px", overflow: "hidden" }}>
                                    <div className="card-body">
                                        <h2 className="mb-3">
                                            {index === 0 && "🥇"}
                                            {index === 1 && "🥈"}
                                            {index === 2 && "🥉"}
                                        </h2>

                                        <h3 className="card-title">
                                            {breed.name}
                                        </h3>

                                        {breedImages[breed.apiName] && (
                                            <img
                                                src={breedImages[breed.apiName]}
                                                alt={breed.name}
                                                className="img-fluid rounded mb-3"
                                                style={{
                                                    width: "100%",
                                                    height: "220px",
                                                    objectFit: "cover"
                                                }}
                                            />
                                        )}

                                        <div className="mb-3">
                                            <span className="badge bg-success fs-6">
                                                {breed.percentage}% compatible
                                            </span>
                                        </div>

                                        <div
                                            className="progress mb-3"
                                            style={{ height: "10px" }}
                                        >
                                            <div
                                                className="progress-bar"
                                                role="progressbar"
                                                style={{
                                                    width: `${breed.percentage}%`
                                                }}
                                            ></div>
                                        </div>

                                        <ul className="text-start small text-muted ps-3 mb-0">
                                            {breed.reasons.map((reason, rIdx) => (
                                                <li key={rIdx}>{reason}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    {/*<button
                                        className="btn btn-primary w-100 py-2 fw-bold"
                                        style={{
                                            borderRadius: "0 0 15px 15px",
                                            borderTopLeftRadius: "0",
                                            borderTopRightRadius: "0"
                                        }}
                                        onClick={() => alert(`¡Gracias por tu interés en adoptar un ${breed.name}! ❤️`)}
                                    >
                                        Adoptar 🐾
                                    </button>*/}
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        className="btn btn-outline-secondary mt-3 mb-5"
                        onClick={restartSurvey}
                    >
                        Volver a realizar el test 🔄
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card shadow">
                        <div className="card-body p-4">
                            <h4 className="card-title text-center mb-4">
                                Pregunta {currentQuestion + 1} de {questions.length}
                            </h4>
                            <h5 className="mb-3">{questions[currentQuestion].question}</h5>

                            <div className="d-grid gap-2">
                                {questions[currentQuestion].options.map((option, index) => (
                                    <button
                                        key={index}
                                        className={`btn ${
                                            answers[currentQuestion] === option
                                                ? "btn-primary"
                                                : "btn-outline-primary"
                                        } text-start p-3`}
                                        onClick={() => handleAnswer(option)}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>

                            <div className="d-flex justify-content-between mt-4">
                                <button
                                    className="btn btn-secondary"
                                    onClick={previousQuestion}
                                    disabled={currentQuestion === 0}
                                >
                                    Anterior
                                </button>
                                <button
                                    className="btn btn-success"
                                    onClick={nextQuestion}
                                >
                                    {currentQuestion === questions.length - 1
                                        ? "Ver Resultados"
                                        : "Siguiente"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdoptionSurvey;