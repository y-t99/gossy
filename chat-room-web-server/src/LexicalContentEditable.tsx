import { LexicalEditor } from "lexical";
import { forwardRef, Ref, useLayoutEffect, useState } from "react";
import { useLexicalComposerContext } from "./LexicalComposerContext";
import type { Props as ElementProps } from './LexicalContentEditableElement';
import { useCanShowPlaceholder } from "./useCanShowPlaceholder";
import { ContentEditableElement } from "./LexicalContentEditableElement";

export type Props = Omit<ElementProps, 'editor'> &
  (
    | {
      'aria-placeholder'?: void;
      placeholder?: null;
    }
    | {
      'aria-placeholder': string;
      placeholder:
      | ((isEditable: boolean) => null | JSX.Element)
      | JSX.Element;
    }
  );

export const ContentEditable = forwardRef(ContentEditableImpl);

function ContentEditableImpl(
  props: Props,
  ref: Ref<HTMLDivElement>,
): JSX.Element {
  const { placeholder, ...rest } = props;
  const [editor] = useLexicalComposerContext();
  return (
    <>
      <ContentEditableElement editor={editor} {...rest} ref={ref} />
      {placeholder != null && (
        <Placeholder editor={editor} content={placeholder} />
      )}
    </>
  );
}

function Placeholder({
  content,
  editor,
}: {
  editor: LexicalEditor;
  content: ((isEditable: boolean) => null | JSX.Element) | JSX.Element;
}): null | JSX.Element {
  const showPlaceholder = useCanShowPlaceholder(editor);

  const [isEditable, setEditable] = useState(editor.isEditable());
  useLayoutEffect(() => {
    setEditable(editor.isEditable());
    return editor.registerEditableListener((currentIsEditable) => {
      setEditable(currentIsEditable);
    });
  }, [editor]);

  if (!showPlaceholder) {
    return null;
  }

  let placeholder = null;
  if (typeof content === 'function') {
    placeholder = content(isEditable);
  } else if (content !== null) {
    placeholder = content;
  }

  if (placeholder === null) {
    return null;
  }
  return <div aria-hidden={true}>{placeholder}</div>;
}
