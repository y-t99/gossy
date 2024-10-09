import { LexicalEditor } from "lexical";
import { ErrorBoundaryType, useDecorators } from "./helper";
import { useLexicalComposerContext } from "./LexicalComposerContext";
import useLayoutEffect from "./useLayoutEffect";
import { mergeRegister } from "@lexical/utils";
import { registerPlainText } from "@lexical/plain-text";
import { registerDragonSupport } from "@lexical/dragon";

export function PlainTextPlugin({
  contentEditable,
  ErrorBoundary,
}: {
  contentEditable: JSX.Element;
  placeholder?:
    | ((isEditable: boolean) => null | JSX.Element)
    | null
    | JSX.Element;
  ErrorBoundary: ErrorBoundaryType;
}): JSX.Element {
  const [editor] = useLexicalComposerContext();
  const decorators = useDecorators(editor, ErrorBoundary);
  usePlainTextSetup(editor);

  return (
    <>
      {contentEditable}
      {decorators}
    </>
  );
}

export function usePlainTextSetup(editor: LexicalEditor): void {
  useLayoutEffect(() => {
    return mergeRegister(
      registerPlainText(editor),
      registerDragonSupport(editor),
    );

    // We only do this for init
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);
}