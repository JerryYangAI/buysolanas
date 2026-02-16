'use client';

import { useState } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

type QuizProps = {
  question: string;
  options: string | string[];
  correctIndex: number;
  explanation: string;
};

export default function Quiz({
  question,
  options: rawOptions,
  correctIndex,
  explanation,
}: QuizProps) {
  // Handle both array and JSON-string formats from MDX
  const options: string[] = Array.isArray(rawOptions)
    ? rawOptions
    : typeof rawOptions === 'string'
      ? JSON.parse(rawOptions)
      : [];
  const [selected, setSelected] = useState<number | null>(null);
  const answered = selected !== null;
  const isCorrect = selected === correctIndex;

  return (
    <div className="not-prose my-8 rounded-sm border border-foreground-tertiary/20 bg-background-secondary p-6">
      <p className="mb-1 text-xs font-medium uppercase tracking-wider text-accent-blue">
        Quiz
      </p>
      <p className="mb-4 text-lg font-medium">{question}</p>

      <div className="flex flex-col gap-2">
        {options.map((option, i) => {
          let style =
            'border-foreground-tertiary/20 hover:border-foreground-tertiary/40';
          if (answered) {
            if (i === correctIndex) style = 'border-emerald-500/60 bg-emerald-500/10';
            else if (i === selected) style = 'border-red-400/60 bg-red-400/10';
            else style = 'border-foreground-tertiary/10 opacity-50';
          }

          return (
            <button
              key={i}
              onClick={() => !answered && setSelected(i)}
              disabled={answered}
              className={`rounded-sm border px-4 py-3 text-left text-sm transition-colors ${style} ${
                !answered ? 'cursor-pointer' : 'cursor-default'
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>

      {answered && (
        <div
          className={`mt-4 flex items-start gap-3 rounded-sm px-4 py-3 text-sm ${
            isCorrect
              ? 'bg-emerald-500/10 text-emerald-300'
              : 'bg-red-400/10 text-red-300'
          }`}
        >
          {isCorrect ? (
            <CheckCircle size={18} className="mt-0.5 shrink-0" />
          ) : (
            <XCircle size={18} className="mt-0.5 shrink-0" />
          )}
          <p>{explanation}</p>
        </div>
      )}
    </div>
  );
}
