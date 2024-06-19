import { Card, IconButton, List, ListItem, ListItemButton, ListItemText, Stack, Typography } from "@mui/material"
import { useQuestionsStore } from "./store/questions"
import SyntaxHighlighter from "react-syntax-highlighter"
import { gradientDark } from 'react-syntax-highlighter/dist/esm/styles/hljs';
import { ArrowBackIosNew, ArrowForwardIos } from "@mui/icons-material";
import { type Question as QuestionType } from "./types"
import { Footer } from "./Footer";

const getBackgroundColor = (info: QuestionType, answerIndex: number) => () => {
    const { userSelectedAnswer, correctAnswer, isCorrectUserAnswer } = info
    
    const backgroundColor = (answerIndex === correctAnswer && userSelectedAnswer !== undefined) ? 'green' 
        : (answerIndex === userSelectedAnswer && !isCorrectUserAnswer) ? 'red' : 'transparent'

    return backgroundColor ?? 'transparent'
}

const Questions = ({ info }: {info: QuestionType}) => {
    const selectAnswer = useQuestionsStore(state => state.selectAnswer)

    const createHandelClick = (answerIndex: number) => () => {
        console.log(answerIndex);
        
        selectAnswer(info.id, answerIndex)
    }

    return (
        <Card variant="outlined" sx={{bgcolor: '#222', p: 2, textAlign: 'left', marginTop: 4 }}>
            <Typography variant="h5">
                {info.question}
            </Typography>

            <SyntaxHighlighter language='javascript' style={gradientDark}>
                {info.code}
            </SyntaxHighlighter>

            {/* Creamos la lista de las respuestas */}
            <List sx={{ bgcolor: '#333', textAlign: 'center' }} disablePadding>
                {info.answers.map((answer, index) => {
                    return <ListItem key={index} disablePadding divider>
                        <ListItemButton 
                            disabled={info.userSelectedAnswer != null}
                            onClick={createHandelClick(index)} 
                            sx={{ bgcolor: getBackgroundColor(info, index) }}
                        >
                            <ListItemText primary={answer} sx={{ textAlign: 'center', fontWeight: '700' }} />
                        </ListItemButton>
                    </ListItem>
                })}
            </List>
        </Card>
    )
}

export const Game = () => {
    const questions = useQuestionsStore(state => state.questions)
    const currentQuestion = useQuestionsStore(state => state.currentQuestion)
    const goNextQuestion = useQuestionsStore(state => state.goNextQuestion)
    const goPreviousQuestion = useQuestionsStore(state => state.goPreviousQuestion)

    const questioninfo = questions[currentQuestion]

    return (
        <>
            <Stack direction='row' gap={2} alignItems='center' justifyContent='center' sx={{marginTop: '1rem'}}>
                <IconButton onClick={goPreviousQuestion} disabled={currentQuestion === 0}>
                    <ArrowBackIosNew />
                </IconButton>

                {currentQuestion + 1} / {questions.length}

                <IconButton onClick={goNextQuestion} disabled={currentQuestion >= (questions.length - 1)}>
                    <ArrowForwardIos/>
                </IconButton>
            </Stack>
            <Questions info={questioninfo} />

            <Footer />
        </>
    )

}