"use client";
import Image from "next/image";
import f1GPTLogo from "./assests/formula_1-logo-brandlogos.net_-512x512.png";
import { useChat } from "ai/react";
import Bubble from "./components/Bubble";
import PromptSuggestionsRow from "./components/PromptSuggestionsRow";
import LoadingBubble from "./components/LoadingBubble";

const Home = () => {
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    append,
  } = useChat({
    api: "/api/chat",
  });

  const noMessages = !messages || messages.length === 0;

  const handlePrompt = (promptText) => {
    append({
      id: crypto.randomUUID(),
      content: promptText,
      role: "user",
    });
  };

  return (
    <main>
      <Image src={f1GPTLogo} width="250" alt="F1GPT Logo" />
      <section className={noMessages ? "" : "populated"}>
        {noMessages ? (
          <>
            <p className="starter-text">
              Your personal race engineer is here!
              Ask F1GPT anything about F1 and it will come back to you with the latest answers.
              Lights out and away we go now!
            </p>
            <PromptSuggestionsRow onPromptClick={handlePrompt} />
          </>
        ) : (
          <>
            {messages.map((message, index) => (
              <Bubble key={`message-${index}`} message={message} />
            ))}
            {isLoading && <LoadingBubble />}
          </>
        )}
      </section>
      <form onSubmit={handleSubmit}>
        <input
          className="question-box"
          onChange={handleInputChange}
          value={input}
          placeholder="Ask me something..."
        />
        <input type="submit" />
      </form>
    </main>
  );
};

export default Home;
