import { useQuestionsStore } from "../store/questions"

export const useQuestionsData = () => {
    const questions = useQuestionsStore(state => state.questions)

    let correct = 0
    let incorrect = 0
    let unanswerd = 0

    questions.map(question => {
        console.log(question);
        
        const { userSelectedAnswer, correctAnswer } = question

        if (userSelectedAnswer == null) unanswerd++
        else if (userSelectedAnswer === correctAnswer) correct++
        else incorrect++
    })

    return {correct, incorrect, unanswerd}
}