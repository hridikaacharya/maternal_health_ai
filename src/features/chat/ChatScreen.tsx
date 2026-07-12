import { useState } from "react";
import { MessageBubble } from "./MessageBubble";
import { chatToScreeningInput } from "./chatToScreening";


type Message = {
  role: "user" | "assistant";
  text: string;
};


export function ChatScreen() {

  const [messages,setMessages] = useState<Message[]>([
    {
      role:"assistant",
      text:
      "Hello. Tell me how you are feeling during your pregnancy."
    }
  ]);


  const [input,setInput] = useState("");


  function sendMessage(){

    if(!input.trim()) return;


    const screeningInput =
  chatToScreeningInput(input);


console.log(
  "Screening input:",
  screeningInput
);


    console.log(
      "Extracted symptoms:",
      symptoms
    );


    setMessages(prev=>[
      ...prev,

      {
        role:"user",
        text:input
      },

      {
        role:"assistant",
        text:
        "Thank you. I have recorded your symptoms. I will check for warning signs."
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
            (message,index)=>(
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

        onChange={(e)=>
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