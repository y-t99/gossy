import {
  $createParagraphNode,
  $getRoot, $getSelection,
  createEditor,
  EditorState,
  EditorThemeClasses,
  HTMLConfig,
  Klass,
  LexicalEditor,
  LexicalNode,
  LexicalNodeReplacement
} from "lexical";
import {useMemo} from "react";
import {LexicalComposerContextType, LexicalComposerContext, createLexicalComposerContext} from "./LexicalComposerContext";
import {CAN_USE_DOM} from "./helper";
import useLayoutEffect from "./useLayoutEffect";

export type InitialEditorStateType =
  | null
  | string
  | EditorState
  | ((editor: LexicalEditor) => void);

export type InitialConfigType = Readonly<{
  namespace: string;
  nodes?: ReadonlyArray<Klass<LexicalNode> | LexicalNodeReplacement>;
  onError: (error: Error, editor: LexicalEditor) => void;
  editable?: boolean;
  theme?: EditorThemeClasses;
  editorState?: InitialEditorStateType;
  html?: HTMLConfig;
}>;

type Props = React.PropsWithChildren<{
  initialConfig: InitialConfigType;
}>;

/**
 * support a editor instant context.
 *
 * @param initialConfig
 * @param children
 * @constructor
 */
export function LexicalComposer({initialConfig, children}: Props): JSX.Element {

  const composerContext: [LexicalEditor, LexicalComposerContextType] = useMemo(
    () => {
      const {
        theme,
        namespace,
        nodes,
        onError,
        editorState: initialEditorState,
        html,
      } = initialConfig;

      const context: LexicalComposerContextType = createLexicalComposerContext(null, theme)
      
      /*
       * Editor instances are the core thing that wires everything together. 
       * You can attach a contenteditable DOM element to editor instances, and also register listeners and commands. 
       * Most importantly, the editor allows for updates to its EditorState.
       */
      const editor = createEditor({
        editable: initialConfig.editable,
        html,
        namespace,
        nodes,
        onError: (error) => onError(error, editor),
        theme,
      });
      
      /**
       * An Editor State is the underlying data model that represents what you want to show on the DOM. 
       * Editor States are immutable once created, You can retrieve the current editor state using `editor.getEditorState()`.
       * 
       * Editor states have two phases:
       * - During an update they can be thought of as "mutable".
       * - After an update, the editor state is then locked and deemed immutable from there on. 
       * > This editor state can therefore be thought of as a "snapshot".
       * 
       * Editor States contain two parts:
       * - a Lexical node tree
       * - a Lexical selection object
       * 
       * Editor States are also fully serializable to JSON and can easily be serialized back into the editor using `editor.parseEditorState()`.
       */
      initializeEditor(editor, initialEditorState);

      return [editor, context];
    }, [],
  );

  // execute once
  useLayoutEffect(() => {
    const isEditable = initialConfig.editable;
    const [editor] = composerContext;
    editor.setEditable(isEditable !== undefined ? isEditable : true);
  }, []);


  return (
    <LexicalComposerContext.Provider value={composerContext}>
      {children}
    </LexicalComposerContext.Provider>
  );
}

const HISTORY_MERGE_OPTIONS = {tag: 'history-merge'};

/**
 * The most common way to update the editor is to use editor.update(). 
 * Calling this function requires a function to be passed in that will provide access to mutate the underlying editor state. 
 * When starting a fresh update, the current editor state is cloned and used as the starting point. 
 * From a technical perspective, this means that Lexical leverages a technique called double-buffering during updates. 
 * There's the "current" frozen editor state to represent what was most recently reconciled to the DOM, and another work-in-progress "pending" editor state that represents future changes for the next reconciliation.
 * 
 * Reconciling an update is typically an async process that allows Lexical to batch multiple synchronous updates of the editor state together in a single update to the DOM – improving performance. 
 * When Lexical is ready to commit the update to the DOM, the underlying mutations and changes in the update batch will form a new immutable editor state. 
 * Calling `editor.getEditorState()` will then return the latest editor state based on the changes from the update.
 * 
 * @param editor 
 * @param initialEditorState 
 * @returns 
 */
function initializeEditor(
  editor: LexicalEditor,
  initialEditorState?: InitialEditorStateType,
): void {
  if (initialEditorState === null) {
    return;
  } else if (initialEditorState === undefined) {
    editor.update(() => {
      const root = $getRoot();
      if (root.isEmpty()) {
        const paragraph = $createParagraphNode();
        root.append(paragraph);
        const activeElement = CAN_USE_DOM ? document.activeElement : null;
        if (
          $getSelection() !== null ||
          (activeElement !== null && activeElement === editor.getRootElement())
        ) {
          paragraph.select();
        }
      }
    }, HISTORY_MERGE_OPTIONS);
  } else if (initialEditorState !== null) {
    switch (typeof initialEditorState) {
      case 'string': {
        const parsedEditorState = editor.parseEditorState(initialEditorState);
        editor.setEditorState(parsedEditorState, HISTORY_MERGE_OPTIONS);
        break;
      }
      case 'object': {
        editor.setEditorState(initialEditorState, HISTORY_MERGE_OPTIONS);
        break;
      }
      case 'function': {
        editor.update(() => {
          const root = $getRoot();
          if (root.isEmpty()) {
            initialEditorState(editor);
          }
        }, HISTORY_MERGE_OPTIONS);
        break;
      }
    }
  }
}