import PromptSuggestionButton from "./PromptSuggestionButton"

const PromptSuggestionsRow = ({onPromptClick}) => {
    const prompts = [
        "Who is head of racing for McLaren's F1 team?",
        "Who is the highest paid F1 driver?",
        "Who is the current Formula one World Driver's Champion?",
        "Who will be the newest driver for Racing Bulls?"
    ]
    return (
        <div className="prompt-suggestion-row">
            {prompts.map((prompt, index) => 
                <PromptSuggestionButton
                    key={`suggestion-${index}`}
                    text={prompt}
                    onClick={() => onPromptClick(prompt)}
            />)}
        </div>
    )

}

export default PromptSuggestionsRow