import { create } from "zustand";


type UserMode =
  | "guest"
  | "registered";


interface ConversationState {

  userMode: UserMode;

  userId: string | null;

  collectedData: Record<string, unknown>;

  messages: {
    role: "user" | "assistant";
    text: string;
  }[];

  setUser:
  (
    mode: UserMode,
    id?: string
  ) => void;


  updateData:
  (
    data: Record<string, unknown>
  ) => void;


  addMessage:
  (
    message:{
      role:"user"|"assistant";
      text:string;
    }
  ) => void;


  clearData:()=>void;

}



export const useConversationStore =
create<ConversationState>((set)=>({

  userMode:"guest",

  userId:null,

  collectedData:{},

  messages:[],


  setUser:
  (mode,id=null)=>
    set({
      userMode:mode,
      userId:id
    }),


  updateData:
  (data)=>
    set(state=>({
      collectedData:{
        ...state.collectedData,
        ...data
      }
    })),


  addMessage:
  (message)=>
    set(state=>({
      messages:[
        ...state.messages,
        message
      ]
    })),


  clearData:
  ()=>set({
    collectedData:{},
    messages:[]
  })

}));