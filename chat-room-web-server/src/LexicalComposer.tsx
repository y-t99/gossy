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
import {useLayoutEffect, useMemo} from "react";
import {LexicalComposerContextType, LexicalComposerContext} from "./LexicalComposerContext";
import {CAN_USE_DOM} from "./helper";

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

      const context: LexicalComposerContextType = {
        getTheme: () => theme
      };

      const editor = createEditor({
        editable: initialConfig.editable,
        html,
        namespace,
        nodes,
        onError: (error) => onError(error, editor),
        theme,
      });
      initializeEditor(editor, initialEditorState);

      return [editor, context];
    }, [],
  );

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