import OpenAI from "openai";

const {
  ASTRA_DB_NAMESPACE,
  ASTRA_DB_COLLECTION,
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
  OPENAI_API_KEY,
} = process.env;

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const latestMessage = messages[messages?.length - 1]?.content;

    let docContext = "";

    // Create embedding
    const embedding = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: latestMessage,
      encoding_format: "float",
    });

    try {
      // Call Astra REST API for vector search
      const response = await fetch(
        `${ASTRA_DB_API_ENDPOINT}/api/json/v1/${ASTRA_DB_NAMESPACE}/${ASTRA_DB_COLLECTION}?vector=true`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-cassandra-token": ASTRA_DB_APPLICATION_TOKEN,
          },
          body: JSON.stringify({
            vector: embedding.data[0].embedding,
            limit: 10,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Astra API error: ${response.statusText}`);
      }

      const json = await response.json();
      const docsMap = json?.data?.map((doc) => doc.document?.text);
      docContext = JSON.stringify(docsMap);
    } catch (err) {
      console.error("Error querying Astra REST API:", err);
      docContext = "";
    }

    const systemPrompt = {
      role: "system",
      content: `You are an AI assistant who knows everything about Formula One.
Use the below context to augment what you know about Formula One racing.
The context will provide you with the most recent page data from Wikipedia,
the official F1 website, and others.
If the context doesn't include the information you need, answer based on your
existing knowledge, and don't mention the source of your information or
what the context does or doesn't include.
Format responses using markdown where applicable and don't return images.

--------------------
START CONTEXT
${docContext}
END CONTEXT
--------------------
QUESTION: ${latestMessage}
--------------------
      `,
    };

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      stream: true,
      messages: [systemPrompt, ...messages],
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of completion) {
          const content = chunk.choices[0]?.delta?.content;
          if (content) {
            controller.enqueue(encoder.encode(content));
          }
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (err) {
    console.error("Error handling request:", err);
    return new Response("Internal Server Error", { status: 500 });
  }
}
