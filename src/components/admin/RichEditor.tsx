"use client";

import Link from "@tiptap/extension-link";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useState } from "react";

/** Basit zengin metin editörü; içeriği gizli bir form alanına HTML olarak yazar. */
export function RichEditor({ name, initialHtml }: { name: string; initialHtml: string }) {
  const [html, setHtml] = useState(initialHtml);
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3, 4] }, link: false }),
      Link.configure({ openOnClick: false, autolink: true, defaultProtocol: "https" }),
    ],
    content: initialHtml,
    immediatelyRender: false,
    editorProps: {
      attributes: { class: "prose-maarif min-h-72 px-4 py-3 focus:outline-none" },
    },
    onUpdate: ({ editor }) => setHtml(editor.isEmpty ? "" : editor.getHTML()),
  });

  const active = useEditorState({
    editor,
    selector: ({ editor }) =>
      editor
        ? {
            bold: editor.isActive("bold"),
            italic: editor.isActive("italic"),
            h2: editor.isActive("heading", { level: 2 }),
            h3: editor.isActive("heading", { level: 3 }),
            bullet: editor.isActive("bulletList"),
            ordered: editor.isActive("orderedList"),
            quote: editor.isActive("blockquote"),
            link: editor.isActive("link"),
          }
        : null,
  });

  const setLink = () => {
    if (!editor) return;
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Bağlantı adresi (boş bırakırsanız kaldırılır)", previous ?? "https://");
    if (url === null) return;
    if (url === "" || url === "https://") editor.chain().focus().unsetLink().run();
    else editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const buttons: { label: string; title: string; on?: boolean; run: () => void }[] = editor
    ? [
        { label: "B", title: "Kalın", on: active?.bold, run: () => editor.chain().focus().toggleBold().run() },
        { label: "İ", title: "İtalik", on: active?.italic, run: () => editor.chain().focus().toggleItalic().run() },
        { label: "H2", title: "Başlık", on: active?.h2, run: () => editor.chain().focus().toggleHeading({ level: 2 }).run() },
        { label: "H3", title: "Alt başlık", on: active?.h3, run: () => editor.chain().focus().toggleHeading({ level: 3 }).run() },
        { label: "• Liste", title: "Madde işaretli liste", on: active?.bullet, run: () => editor.chain().focus().toggleBulletList().run() },
        { label: "1. Liste", title: "Numaralı liste", on: active?.ordered, run: () => editor.chain().focus().toggleOrderedList().run() },
        { label: "Alıntı", title: "Alıntı", on: active?.quote, run: () => editor.chain().focus().toggleBlockquote().run() },
        { label: "Bağlantı", title: "Bağlantı ekle", on: active?.link, run: setLink },
        { label: "↶", title: "Geri al", run: () => editor.chain().focus().undo().run() },
        { label: "↷", title: "Yinele", run: () => editor.chain().focus().redo().run() },
      ]
    : [];

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-white focus-within:border-teal-500 focus-within:ring-2 focus-within:ring-teal-500/30">
      <div className="flex flex-wrap gap-1 border-b border-line bg-navy-50 p-1.5">
        {buttons.map((b) => (
          <button
            key={b.title}
            type="button"
            title={b.title}
            onClick={b.run}
            className={`rounded px-2.5 py-1 text-sm font-semibold ${b.on ? "bg-navy-700 text-white" : "text-navy-800 hover:bg-white"}`}
          >
            {b.label}
          </button>
        ))}
      </div>
      <EditorContent editor={editor} />
      <input type="hidden" name={name} value={html} />
    </div>
  );
}
