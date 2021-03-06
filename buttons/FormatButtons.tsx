import { MouseEvent, useEffect, useState } from 'react';

import Code from '@mui/icons-material/Code';
import FormatBold from '@mui/icons-material/FormatBold';
import FormatItalic from '@mui/icons-material/FormatItalic';
import FormatStrikethrough from '@mui/icons-material/FormatStrikethrough';
import FormatUnderlined from '@mui/icons-material/FormatUnderlined';
import {
  ToggleButton,
  ToggleButtonGroup,
  ToggleButtonGroupProps
} from '@mui/material';
import { useTranslate } from '@specfocus/view-focus.i18n/translations/useTranslate';
import { Editor } from '@tiptap/react';
import { useTiptapEditor } from '../inputs/useTiptapEditor';

export const FormatButtons = (props: ToggleButtonGroupProps) => {
  const editor = useTiptapEditor();
  const translate = useTranslate();
  const [values, setValues] = useState<string[]>([]);

  const boldLabel = translate('tiptap.bold', {
    _: 'Bold',
  });

  const italicLabel = translate('tiptap.italic', {
    _: 'Italic',
  });

  const underlineLabel = translate('tiptap.underline', {
    _: 'Underline',
  });

  const strikeLabel = translate('tiptap.strike', {
    _: 'Strikethrough',
  });

  const codeLabel = translate('tiptap.code', {
    _: 'Code',
  });

  useEffect(() => {
    const handleUpdate = () => {
      setValues(() =>
        FormatValues.reduce((acc, value) => {
          if (editor && editor.isActive(value)) {
            acc.push(value);
          }
          return acc;
        }, [])
      );
    };

    if (editor) {
      editor.on('update', handleUpdate);
      editor.on('selectionUpdate', handleUpdate);
    }

    return () => {
      if (editor) {
        editor.off('update', handleUpdate);
        editor.off('selectionUpdate', handleUpdate);
      }
    };
  }, [editor]);

  const handleChange = (
    event: MouseEvent<HTMLElement>,
    newFormats: string[]
  ) => {
    FormatValues.forEach(format => {
      const shouldBeDeactivated =
        editor &&
        editor.isActive(format) &&
        !newFormats.includes(format);
      const shouldBeActivated =
        editor &&
        !editor.isActive(format) &&
        newFormats.includes(format);

      if (shouldBeDeactivated || shouldBeActivated) {
        FormatActions[format](editor);
      }
    });
  };

  return (
    <ToggleButtonGroup
      {...props}
      disabled={!editor?.isEditable}
      onChange={handleChange}
      value={values}
    >
      <ToggleButton value="bold" aria-label={boldLabel} title={boldLabel}>
        <FormatBold fontSize="inherit" />
      </ToggleButton>
      <ToggleButton
        value="italic"
        aria-label={italicLabel}
        title={italicLabel}
      >
        <FormatItalic fontSize="inherit" />
      </ToggleButton>
      <ToggleButton
        value="underline"
        aria-label={underlineLabel}
        title={underlineLabel}
      >
        <FormatUnderlined fontSize="inherit" />
      </ToggleButton>
      <ToggleButton
        value="strike"
        aria-label={strikeLabel}
        title={strikeLabel}
      >
        <FormatStrikethrough fontSize="inherit" />
      </ToggleButton>
      <ToggleButton value="code" aria-label={codeLabel} title={codeLabel}>
        <Code fontSize="inherit" />
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

const FormatValues = ['bold', 'italic', 'underline', 'strike', 'code'];

const FormatActions = {
  bold: (editor: Editor) => editor.chain().focus().toggleBold().run(),
  italic: (editor: Editor) => editor.chain().focus().toggleItalic().run(),
  underline: (editor: Editor) =>
    editor.chain().focus().toggleUnderline().run(),
  strike: (editor: Editor) => editor.chain().focus().toggleStrike().run(),
  code: (editor: Editor) => editor.chain().focus().toggleCode().run(),
};
