type Stage = "first" | "second" | "third" | "postpartum";

export function PregnancyStageSelector({
  onStageChange,
}: {
  onStageChange: (stage: Stage) => void;
}) {

  const stages = [
    {id:"first", label:"First trimester"},
    {id:"second", label:"Second trimester"},
    {id:"third", label:"Third trimester"},
    {id:"postpartum", label:"After birth"},
  ];

  return (
    <div>
      <h3>Where are you in your pregnancy journey?</h3>

      {stages.map((stage)=>(
        <button
          key={stage.id}
          onClick={()=>onStageChange(stage.id as Stage)}
        >
          {stage.label}
        </button>
      ))}

    </div>
  );
}