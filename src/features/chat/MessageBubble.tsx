type MessageBubbleProps = {
  role: "user" | "assistant";
  text: string;
};


export function MessageBubble({
  role,
  text,
}: MessageBubbleProps) {

  return (
    <div className={`message ${role}`}>

      <strong>
        {role === "user" ? "You" : "Assistant"}
      </strong>

      <p>
        {text}
      </p>

    </div>
  );
}
