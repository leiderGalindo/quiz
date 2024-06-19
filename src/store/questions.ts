import { create } from 'zustand'
import { type Question } from '../types.d'
import confetti from 'canvas-confetti'
import { persist, devtools } from 'zustand/middleware'

interface State {
    questions: Question[]
    currentQuestion: number
    fetchQuestions: (limit: number) => void
    selectAnswer: (questionId: number, answerIndex: number) => void
    goNextQuestion: () => void
    goPreviousQuestion: () => void
    reset: () => void
}

// middleware
const logger = (config) => (set, get, api) => {
    return config(
        (...arg) => {
            // console.log(' applying', arg);
            set(...arg)
            // console.log(' new state', get())
        },
        get,
        api
    )
}

export const useQuestionsStore = create()(devtools(logger(persist((set, get) => {
    return {
        questions: [],
        currentQuestion: 0,

        fetchQuestions: async (limit: number) => {
            const res = await fetch('http://localhost:5173/data.json')
            const json = await res.json()

            // Ordenamos el json y limitamos su longitud dependiendo del limite enviado
            const questions = json.sort(() => Math.random() - 0.5).slice(0, limit)

            // Seteamos la data en el store
            set({ questions })
        },

        selectAnswer: async (questionId: number, answerIndex: number) => {
            const { questions } = get()
            // Usar el structuredClone para clonar el objeto
            const newQuestions = structuredClone(questions)
            // Encontramos el index de la pregunta
            const questionIndex = questions.findIndex(q => q.id === questionId)
            // Obtenemos la informacion de la pregunta
            const questionInfo = newQuestions[questionIndex]
            // Validamos si el usuario a seleccionado la respuesta correcta
            const isCorrectUserAnswer = questionInfo.correctAnswer === answerIndex
            // Cambiar esta informacion en la copia de la pregunta
            newQuestions[questionIndex] = {
                ...questionInfo,
                isCorrectUserAnswer,
                userSelectedAnswer: answerIndex
            }

            // Realiza efecto de confetti al seleccionar la respuesta correcta
            if(isCorrectUserAnswer) confetti()
                
            // actualizamos el estado
            set({ questions: newQuestions })

        },

        goNextQuestion: () => {
            const { currentQuestion, questions } = get()
            const nextQuestion = currentQuestion + 1

            if(nextQuestion <= questions.length)
                set({currentQuestion: nextQuestion})
        },
        
        goPreviousQuestion: () => {
            const { currentQuestion } = get()
            const previousQuestion = currentQuestion - 1

            if(previousQuestion >= 0)
                set({currentQuestion: previousQuestion})
        },

        reset: () => {
            set({questions: [],currentQuestion: 0})
        }
    }
},{
    name: 'questions'
}))))