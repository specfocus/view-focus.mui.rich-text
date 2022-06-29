import FormatAlignCenter from '@mui/icons-material/FormatAlignCenter';
import FormatAlignJustify from '@mui/icons-material/FormatAlignJustify';
import FormatAlignLeft from '@mui/icons-material/FormatAlignLeft';
import FormatAlignRight from '@mui/icons-material/FormatAlignRight';
import {
  ToggleButton,
  ToggleButtonGroup,
  ToggleButtonGroupProps
} from '@mui/material';
import { useTranslate } from '@specfocus/view-focus.i18n/translations/useTranslate';
import { Editor } from '@tiptap/react';
import { MouseEvent, useEffect, useState } from 'react';
import { useTiptapEditor } from '../inputs/useTiptapEditor';

export const AlignmentButtons = (props: ToggleButtonGroupProps) => {
  const editor = useTiptapEditor();
  const translate = useTranslate();
  const [value, setValue] = useState<string>('left');

  const leftLabel = translate('tiptap.align_left', { _: 'Align left' });
  const rightLabel = translate('tiptap.align_right', { _: 'Align right' });
  const centerLabel = translate('tiptap.align_center', { _: 'Center' });
  const justifyLabel = translate('tiptap.align_justify', { _: 'Justify' });

  useEffect(() => {
    const handleUpdate = () => {
      setValue(currentValue =>
        AlignmentValues.reduce((acc, value) => {
          if (editor && editor.isActive({ textAlign: value })) {
            return value;
          }
          return acc;
        }, currentValue)
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
    newFormat: string
  ) => {
    if (AlignmentActions[newFormat]) {
      AlignmentActions[newFormat](editor);
    }
  };

  return (
    <ToggleButtonGroup
      {...props}
      disabled={!editor?.isEditable}
      exclusive
      onChange={handleChange}
      value={value}
    >
      <ToggleButton value="left" aria-label={leftLabel} title={leftLabel}>
        <FormatAlignLeft fontSize="inherit" />
      </ToggleButton>
      <ToggleButton
        value="center"
        aria-label={centerLabel}
        title={centerLabel}
      >
        <FormatAlignCenter fontSize="inherit" />
      </ToggleButton>
      <ToggleButton
        value="right"
        aria-label={rightLabel}
        title={rightLabel}
      >
        <FormatAlignRight fontSize="inherit" />
      </ToggleButton>
      <ToggleButton
        value="justify"
        aria-label={justifyLabel}
        title={justifyLabel}
      >
        <FormatAlignJustify fontSize="inherit" />
      </ToggleButton>
    </ToggleButtonGroup>
  );
};

const AlignmentValues = ['left', 'center', 'right', 'justify', 'code'];

const AlignmentActions = {
  left: (editor: Editor) => editor.chain().focus().setTextAlign('left').run(),
  center: (editor: Editor) =>
    editor.chain().focus().setTextAlign('center').run(),
  right: (editor: Editor) =>
    editor.chain().focus().setTextAlign('right').run(),
  justify: (editor: Editor) =>
    editor.chain().focus().setTextAlign('justify').run(),
};
