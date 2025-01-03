import { Paperclip, Plus } from "lucide-react";
import { LexicalComposer } from "./LexicalComposer";
import { ContentEditable } from "./LexicalContentEditable";
import LexicalErrorBoundary from "./LexicalErrorBoundary";
import { PlainTextPlugin } from "./PlainTextPlugin";
import { useLayoutEffect, useRef, useState } from "react";

export default function App() {
  const [isFocused, setIsFocused] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  const handleFocus = () => {
    setIsFocused(true);
  }

  const handleBlur = () => {
    setIsFocused(false);
  }
  
  useLayoutEffect(() => {
    if (isFocused && editorRef.current) {
      editorRef.current.focus();
    }
  }, [isFocused]);

  return (
    <div className="bg-slate-300 font-mono w-screen min-w-[700px] h-screen flex items-center justify-center">
      <div className="bg-white w-[700px] min-w-[700px] h-5/6 flex flex-col justify-between">
        <div></div>
        {
          !isFocused ? (
            <div id='close-mode' className="h-[60px] p-[10px] transition-all duration-300">
              <div className="bg-zinc-100 h-[40px] p-[5px] rounded-lg">
                <div className="flex items-center justify-start">
                  <div className="h-[30px] w-[30px] flex items-center justify-center cursor-pointer hover:bg-zinc-200 rounded-lg ">
                    <Paperclip className="w-[20px] h-[20px] text-zinc-400 stroke-[2px]" />
                  </div>
                  <div className="h-[30px] w-full" onClick={handleFocus}></div>
                </div>
              </div>
            </div>
          ) : (
            <div id='open-mode' className="h-[120px] p-[10px] transition-all duration-300" onBlur={handleBlur}>
              <div className="bg-zinc-100 h-[100px] p-[5px] rounded-lg">
                <div className="h-[50px] max-h-[50px] px-[5px] overflow-y-auto">
                  <LexicalComposer initialConfig={{ namespace: '', editable: true, onError: () => { console.log('init editor error') } }}>
                    <PlainTextPlugin
                      contentEditable={<ContentEditable className="focus:outline-none focus:ring-0 focus:border-none h-[50px] p-[2px] text-sm" ref={editorRef} />}
                      placeholder={<div>Enter some text...</div>}
                      ErrorBoundary={LexicalErrorBoundary}
                    />
                  </LexicalComposer>
                </div>
                <div className="h-[40px] p-[5px] flex justify-between">
                  <div className="flex space-x-2">
                    <div className="bg-white rounded-lg h-[30px] w-[30px] flex items-center justify-center cursor-pointer shadow-md">
                      <Plus className="w-[15px] h-[15px] text-zinc-400 stroke-[3px]" />
                    </div>
                    <div className="h-[30px] w-[30px] flex items-center justify-center cursor-pointer hover:bg-zinc-200 rounded-lg ">
                      <Paperclip className="w-[20px] h-[20px] text-zinc-400 stroke-[2px]" />
                    </div>
                  </div>
                  <div className="w-[100px] bg-zinc-950 rounded-lg flex items-center justify-center text-white text-sm cursor-pointer">
                    Send Now
                  </div>
                </div>
              </div>
            </div>)
        }
      </div>
    </div>
  )
}