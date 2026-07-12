export type Stage =
  | "first"
  | "second"
  | "third"
  | "postpartum";

export const educationModules = [
  {
    id: "danger-signs",
    title: "Danger Signs During Pregnancy",
    category: "Safety",

    stages: ["first", "second", "third", "postpartum"] as Stage[],
    priority: "high",

    lessons: [
      {
        type: "text",
        title: "Why danger signs matter",
        content:
          "Some symptoms during pregnancy require immediate medical attention."
      },
      {
        type: "checklist",
        title: "Remember these signs",
        items: [
          "Vaginal bleeding",
          "Severe headache",
          "Convulsions",
          "Difficulty breathing"
        ]
      }
    ],

    actions: [
      "Identify your nearest health facility",
      "Prepare emergency transport"
    ],

    resources: []
  },


  {
    id: "nutrition",
    title: "Nutrition During Pregnancy",
    category: "Nutrition",
    stages: ["first", "second", "third"],

    lessons: [
      {
        type: "text",
        title: "Eating for two",
        content:
          "A balanced diet supports both mother and baby's health."
      }
    ],

    actions: [
      "Eat diverse foods",
      "Take supplements as prescribed"
    ],

    resources: []
  }
];