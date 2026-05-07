"use client";

import { useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Textarea } from "@/components/ui";
import { getSupabase } from "@/lib/supabase";

const NAME_MAX = 30;
const CONTENT_MAX = 500;

type Props = {
  serviceId: string;
};

export function MemoryForm({ serviceId }: Props) {
  const [name, setName] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [, startTransition] = useTransition();
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    const trimmedContent = content.trim();

    if (!trimmedName || !trimmedContent) {
      setError("닉네임과 내용을 모두 입력해주세요.");
      return;
    }
    if (trimmedName.length > NAME_MAX || trimmedContent.length > CONTENT_MAX) {
      setError("입력 길이를 확인해주세요.");
      return;
    }

    setSubmitting(true);
    try {
      const supabase = getSupabase();
      const { error: insertError } = await supabase.from("memories").insert({
        service_id: serviceId,
        author_name: trimmedName,
        content: trimmedContent,
      });

      if (insertError) {
        setError(insertError.message);
        return;
      }

      setName("");
      setContent("");
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
