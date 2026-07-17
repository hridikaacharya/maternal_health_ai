import { useState } from "react";
import { MessageBubble } from "./MessageBubble";
import { chatToScreeningInput } from "./chatToScreening";
import { assistantResponse } from "@/lib/assistant/assistantEngine";
import { runScreening } from "@/lib/rule-engine/ruleEngine";
import {

buildAssistantResponse

} from "@/lib/assistant/responsePlanner";
import { extractClinicalEntities } from "@/lib/assistant/entityExtractor";
import { useConversationStore } from "@/lib/assistant/conversationStore";
import { getEducationResponse } from "@/lib/assistant/educationEngine";

type Message = {
  role: "user" | "assistant";
  text: string;
};


export function ChatScreen() {
  const {
  collectedData,
  updateData
} = useConversationStore();

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text:
        "Hello. Tell me how you are feeling during your pregnancy."
    }
  ]);


  const [input, setInput] = useState("");


  function sendMessage() {

    if (!input.trim()) return;


    const intentResponse = assistantResponse(input);


    const newInput =
  chatToScreeningInput(input);


const clinicalEntities =
  extractClinicalEntities(input);


const extractedData = {
  ...newInput,
  ...clinicalEntities
};


const screeningInput = {
  ...collectedData,
  ...extractedData
};


updateData(extractedData);


    console.log(
      "Assistant intent:",
      intentResponse.type
    );


    console.log(
      "Screening input:",
      screeningInput
    );


    const result = runScreening(screeningInput);
    const educationResponse =
  getEducationResponse(input);

    console.log(
      "Rule engine matched:",
      result.matched
    );


    console.log(
      "Rule engine primary:",
      result.primary
    );


 let assistantText =
  "I can help with pregnancy health information.";


// Highest priority: emergency / screening rules
if (result.primary) {

  const planned =
    buildAssistantResponse(
      result.primary,
      screeningInput
    );

  assistantText =
    planned.text;

}

else if (educationResponse) {

  assistantText =
`${educationResponse.topic}

${educationResponse.explanation}

Things to watch for:
${educationResponse.warning_signs.join(", ")}

${educationResponse.advice}`;

}

else {

  assistantText =
    "I did not detect any warning signs from your message. Could you tell me more about your symptoms?";

}


setMessages(prev => [
  ...prev,

  {
    role: "user",
    text: input
  },

  {
    role: "assistant",
    text: assistantText
  }

]);


setInput("");

}

  return (

    <section className="panel">

      <h2>
        Pregnancy Health Assistant
      </h2>


      <div>

        {
          messages.map(
            (message, index) => (

              <MessageBubble
                key={index}
                role={message.role}
                text={message.text}
              />

            )
          )
        }

      </div>


      <input

        value={input}

        onChange={(e) =>
          setInput(e.target.value)
        }

        placeholder="Describe symptoms..."

      />


      <button
        onClick={sendMessage}
      >
        Send
      </button>


    </section>

  );
}