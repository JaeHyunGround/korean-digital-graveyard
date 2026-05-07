"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Button,
  Input,
  Textarea,
  Select,
  Divider,
} from "@/components/ui";
import { getSupabase } from "@/lib/supabase";
import { makeSlug, normalizeName, withRandomSuffix } from "@/lib/slug";
import {
  SERVICE_CATEGORIES,
  type ServiceCategory,
} from "@/lib/database.types";
import { CATEGORY_EMOJI } from "@/lib/format";

const NAME_MIN = 1;
const NAME_MAX = 50;
const DESC_MAX = 2000;
const YEAR_MIN = 1980;
const YEAR_MAX = new Date().getFullYear() + 1;

type FormState = {
  name: string;
  category: ServiceCategory;
  startYear: string;
  endYear: string;
  isAlive: boolean;
  description: string;
};

const INITIAL_STATE: FormState = {
  name: "",
  category: "SNS",
  startYear: "",
  endYear: "",
  isAlive: false,
  description: "",
};

export function SubmitForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [error, setError] = useState<string | null>(null);
  const [duplicateSlug, setDuplicateSlug] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const previewSlug = useMemo(
    () => (form.name.trim() ? makeSlug(form.name) : ""),
    [form.name]
  );

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate(): string | null {
    const name = form.name.trim();
    if (name.length < NAME_MIN) return "서비스명을 입력해주세요.";
    if (name.length > NAME_MAX) return `서비스명은 ${NAME_MAX}자 이내여야 합니다.`;

    const startYear = Number(form.startYear);
    if (!Number.isInteger(startYear) || startYear < YEAR_MIN || startYear > YEAR_MAX) {
      return `시작 연도는 ${YEAR_MIN}~${YEAR_MAX} 사이의 숫자여야 합니다.`;
    }

    if (!form.isAlive) {
      const endYear = Number(form.endYear);
      if (!form.endYear) return "종료 연도를 입력하거나 '현재 운영중'을 체크해주세요.";
      if (!Number.isInteger(endYear) || endYear < startYear || endYear > YEAR_MAX) {
        return `종료 연도는 시작 연도 이후, ${YEAR_MAX} 이하여야 합니다.`;
      }
    }

    if (form.description.length > DESC_MAX) {
      return `설명은 ${DESC_MAX}자 이내여야 합니다.`;
    }
    return null;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setDuplicateSlug(null);

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    try {
      const supabase = getSupabase();
      const baseSlug = makeSlug(form.name);
      const startYear = Number(form.startYear);
      const endYear = form.isAlive ? null : Number(form.endYear);

      // 사전 중복 검증: 정규화된 이름이 같은 묘비가 이미 있는지 확인
      const targetKey = normalizeName(form.name);
      const { data: existing, error: existingErr } = await supabase
        .from("services")
        .select("name, slug");
      if (existingErr) {
        setError(existingErr.message);
        return;
      }
      const dup = existing?.find((s) => normalizeName(s.name) === targetKey);
      if (dup) {
        setError(
          `"${dup.name}" 은(는) 이미 안치되어 있어요. 같은 묘비에 추억을 남겨주세요.`
        );
        setDuplicateSlug(dup.slug);
        return;
      }

      // unique_violation(23505) 발생 시 접미어 추가하여 최대 3회 재시도
      let attempt = 0;
      let slugToUse = baseSlug;
      while (attempt < 3) {
        const { data, error: insertErr } = await supabase
          .from("services")
          .insert({
            name: form.name.trim(),
            slug: slugToUse,
            category: form.category,
            start_year: startYear,
            end_year: endYear,
            description: form.description.trim(),
            vote_count: 0,
          })
          .select("slug")
          .single();

        if (!insertErr && data) {
          router.push(`/services/${encodeURIComponent(data.slug)}`);
          router.refresh();
          return;
        }

        if (insertErr?.code === "23505") {
          slugToUse = withRandomSuffix(baseSlug);
          attempt++;
          continue;
        }

        setError(insertErr?.message ?? "알 수 없는 오류가 발생했습니다.");
        return;
      }

      setError("같은 이름의 서비스가 이미 너무 많습니다. 다른 이름을 사용해주세요.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "제출 실패");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {/* 서비스명 */}
      <Field label="서비스명" required hint="예: 싸이월드, 네이트온">
        <Input
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          maxLength={NAME_MAX}
          placeholder="추모할 서비스의 이름을 입력하세요"
          required
          disabled={submitting}
        />
        {previewSlug && (
          <p className="mt-1 font-mono text-[10px] text-ink-soft">
            URL: /services/{previewSlug}
          </p>
        )}
      </Field>

      {/* 카테고리 */}
      <Field label="카테고리" required>
        <Select
          value={form.category}
          onChange={(e) => update("category", e.target.value as ServiceCategory)}
          disabled={submitting}
        >
          {SERVICE_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {CATEGORY_EMOJI[c]} {c}
            </option>
          ))}
        </Select>
      </Field>

      <Divider />

      {/* 운영기간 */}
      <Field label="운영기간" required>
        <div className="flex flex-wrap items-center gap-1.5 text-[12px]">
          <Input
            type="number"
            min={YEAR_MIN}
            max={YEAR_MAX}
            value={form.startYear}
            onChange={(e) => update("startYear", e.target.value)}
            placeholder="1999"
            className="!w-24"
            disabled={submitting}
            required
          />
          <span>년 부터</span>
          <Input
            type="number"
            min={YEAR_MIN}
            max={YEAR_MAX}
            value={form.endYear}
            onChange={(e) => update("endYear", e.target.value)}
            placeholder="2019"
            className="!w-24"
            disabled={submitting || form.isAlive}
            required={!form.isAlive}
          />
          <span>년 까지</span>
        </div>
        <label className="mt-1.5 flex cursor-pointer items-center gap-1.5 text-[12px]">
          <input
            type="checkbox"
            checked={form.isAlive}
            onChange={(e) => update("isAlive", e.target.checked)}
            disabled={submitting}
            className="h-3 w-3"
          />
          <span>현재 운영중 (종료 연도 없음)</span>
        </label>
      </Field>

      <Divider />

      {/* 설명 */}
      <Field
        label="설명"
        hint="선택사항. 어떤 서비스였는지, 어떤 특징이 있었는지 간단히 적어주세요."
      >
        <Textarea
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          maxLength={DESC_MAX}
          rows={5}
          placeholder="예: 미니홈피, 도토리, 일촌... 한국 SNS의 전설"
          disabled={submitting}
        />
        <div className="mt-0.5 text-right font-mono text-[10px] text-ink-soft">
          {form.description.length} / {DESC_MAX}
        </div>
      </Field>

      {error && (
        <div className="bg-paper bevel-input space-y-1 px-2 py-1.5 text-[12px] text-critical">
          <p>⚠ {error}</p>
          {duplicateSlug && (
            <Link
              href={`/services/${encodeURIComponent(duplicateSlug)}`}
              className="inline-block font-bold text-primary underline"
            >
              → 기존 묘비로 가기
            </Link>
          )}
        </div>
      )}

      <Divider />

      <div className="flex flex-wrap items-center gap-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? "제출중…" : "🪦 묘비 세우기"}
        </Button>
        <Link
          href="/"
          className="bg-surface bevel-out hover:bg-surface-muted active:bevel-in cursor-pointer px-3 py-[3px] text-[12px] font-bold text-ink"
        >
          취소
        </Link>
      </div>
    </form>
  );
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-[12px] font-bold">
        {label}
        {required && <span className="text-critical"> *</span>}
      </label>
      {children}
      {hint && <p className="mt-1 text-[11px] text-ink-soft">{hint}</p>}
    </div>
  );
}
