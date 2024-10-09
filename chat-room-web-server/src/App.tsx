import { LexicalComposer } from "./LexicalComposer";
import { ContentEditable } from "./LexicalContentEditable";
import LexicalErrorBoundary from "./LexicalErrorBoundary";
import { PlainTextPlugin } from "./PlainTextPlugin";

export default function App() {
  return (
    <div className="bg-slate-300 font-mono w-screen h-screen flex items-center justify-center">
      <div className="bg-white w-2/3 h-5/6">
        <LexicalComposer initialConfig={{ namespace: '', editable: true, onError: () => { console.log('init editor error') } }}>
          <PlainTextPlugin
            contentEditable={<ContentEditable  className="editor" style={{ minHeight: '100px', padding: '10px' }} />}
            placeholder={<div>Enter some text...</div>}
            ErrorBoundary={LexicalErrorBoundary}
          />
        </LexicalComposer>
      </div>
    </div>
  )
}