import Button from "@mui/material/Button"
import { useQuestionsData } from "./hooks/useQuestionsData"
import { useQuestionsStore } from "./store/questions"

export const Footer = () => {
    const {correct, incorrect, unanswerd} = useQuestionsData()
    const reset = useQuestionsStore(state => state.reset)
    
    return (
        <footer style={{marginTop: '2rem'}}>
            <strong>
                {
                    `
                    ✅ ${correct} correctas -
                    ❌ ${incorrect} incorrectas -
                    ❓ ${unanswerd} sin responder
                    `
                }
            </strong>

            <div style={{marginTop: '1rem'}}>
                <Button onClick={() => reset()}>
                    Resetear juego
                </Button>
            </div>
        </footer>
    )
}