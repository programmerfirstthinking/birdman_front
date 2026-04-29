"use client";

import React from "react";

type ToolbarProps = {
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

type BtnProps = {
  label: string;
  title: string;
  onClick: () => void;
  disabled?: boolean;
};

const ToolbarBtn: React.FC<BtnProps> = ({ label, title, onClick, disabled }) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    disabled={disabled}
    className="px-2 py-0.5 text-sm bg-white border border-blue-200 rounded hover:bg-blue-100 active:bg-blue-200 disabled:opacity-40 disabled:cursor-not-allowed transition"
  >
    {label}
  </button>
);

const Sep: React.FC = () => (
  <div className="w-px self-stretch bg-blue-200 mx-0.5" />
);

export const MarkdownToolbar: React.FC<ToolbarProps> = ({ textareaRef, value, onChange, disabled }) => {
  // 選択範囲を before/after で囲む。未選択時は placeholder を挿入してそれを選択状態にする
  const wrap = (before: string, after: string, placeholder: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const selected = value.slice(start, end) || placeholder;
    const newVal = value.slice(0, start) + before + selected + after + value.slice(end);
    onChange(newVal);
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(start + before.length, start + before.length + selected.length);
    });
  };

  // カーソル行の先頭に prefix を挿入する
  const prefixLine = (prefix: string) => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const lineStart = value.lastIndexOf("\n", start - 1) + 1;
    const newVal = value.slice(0, lineStart) + prefix + value.slice(lineStart);
    onChange(newVal);
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(start + prefix.length, start + prefix.length);
    });
  };

  const insertHR = () => {
    const ta = textareaRef.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const hr = "\n---\n";
    const newVal = value.slice(0, start) + hr + value.slice(start);
    onChange(newVal);
    requestAnimationFrame(() => {
      ta.focus();
      ta.setSelectionRange(start + hr.length, start + hr.length);
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-1 px-2 py-1.5 bg-blue-50 border border-blue-300 rounded-t-lg">
      <ToolbarBtn label="H1" title="見出し1 (# )" onClick={() => prefixLine("# ")} disabled={disabled} />
      <ToolbarBtn label="H2" title="見出し2 (## )" onClick={() => prefixLine("## ")} disabled={disabled} />
      <ToolbarBtn label="H3" title="見出し3 (### )" onClick={() => prefixLine("### ")} disabled={disabled} />
      <Sep />
      <ToolbarBtn label="太字" title="太字 (**テキスト**)" onClick={() => wrap("**", "**", "テキスト")} disabled={disabled} />
      <ToolbarBtn label="斜体" title="斜体 (*テキスト*)" onClick={() => wrap("*", "*", "テキスト")} disabled={disabled} />
      <ToolbarBtn label="打消" title="打ち消し線 (~~テキスト~~)" onClick={() => wrap("~~", "~~", "テキスト")} disabled={disabled} />
      <Sep />
      <ToolbarBtn label="`code`" title="インラインコード" onClick={() => wrap("`", "`", "コード")} disabled={disabled} />
      <ToolbarBtn label="```block" title="コードブロック" onClick={() => wrap("```\n", "\n```", "コード")} disabled={disabled} />
      <Sep />
      <ToolbarBtn label="• リスト" title="箇条書きリスト (- )" onClick={() => prefixLine("- ")} disabled={disabled} />
      <ToolbarBtn label="1. リスト" title="番号付きリスト (1. )" onClick={() => prefixLine("1. ")} disabled={disabled} />
      <Sep />
      <ToolbarBtn label="引用" title="引用 (> )" onClick={() => prefixLine("> ")} disabled={disabled} />
      <ToolbarBtn label="─" title="水平線 (---)" onClick={insertHR} disabled={disabled} />
      <ToolbarBtn label="🔗 リンク" title="リンク ([テキスト](URL))" onClick={() => wrap("[", "](https://)", "リンクテキスト")} disabled={disabled} />
    </div>
  );
};
