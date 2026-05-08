"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Textarea } from "@/components/ui";
import { submitMemoryAction } from "@/lib/actions";

const NAME_MAX = 30;
const CONTENT_MAX = 500;

type Props = {
  serviceId: string;
  serviceSlug: string;
};

export function MemoryForm({ serviceId, serviceSlug }: Props) {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [, startTransition] = useTransition();
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    setSubmitting(true);
    try {
      const result = await submitMemoryAction({
        serviceId,
        serviceSlug,
        authorName: name,
        content,
      });

      if (!result.ok) {
        setError(result.errorMessage);
        return;
      }

      setName("");
      setContent("");
      // server action 의 revalidatePath 와 클라이언트 라우터 캐시 동기화
      startTransition(() => router.refresh());
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-1.5">
      <div>
        <label className="mb-0.5 block text-[11px] font-bold">닉네임</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="추억을 남길 이름/닉네임"
          maxLength={NAME_MAX}
          disabled={submitting}
          required
        />
      </div>
      <div>
        <label className="mb-0.5 block text-[11px] font-bold">추억</label>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="이 서비스에 대한 추억을 남겨주세요…"
          maxLength={CONTENT_MAX}
          rows={3}
          disabled={submitting}
          required
        />
        <div className="mt-0.5 text-right font-mono text-[10px] text-ink-soft">
          {content.length} / {CONTENT_MAX}
        </div>
      </div>
      {error && (
        <p className="bg-paper bevel-input px-1.5 py-1 text-[11px] text-critical">
          ⚠ {error}
        </p>
      )}
      <Button type="submit" block disabled={submitting}>
        {submitting ? "전송중…" : "📝 추억 남기기"}
      </Button>
    </form>
  );
}
