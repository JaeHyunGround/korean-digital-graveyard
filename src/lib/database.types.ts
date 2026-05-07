/**
 * Supabase 스키마 타입 정의
 * 변경 시 supabase/migrations/001_initial_schema.sql 와 동기화 필요.
 */

export type ServiceCategory =
  | "SNS"
  | "메신저"
  | "커뮤니티"
  | "게임"
  | "음악영상"
  | "기타";

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  "SNS",
  "메신저",
  "커뮤니티",
  "게임",
  "음악영상",
  "기타",
];

export type Service = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  category: ServiceCategory;
  start_year: number;
  end_year: number | null;
  description: string;
  vote_count: number;
  created_at: string;
};

export type ServiceInsert = {
  name: string;
  slug: string;
  category: ServiceCategory;
  start_year: number;
  end_year?: number | null;
  description?: string;
  logo_url?: string | null;
  /** 클라이언트에서는 항상 0이어야 함 (RLS check) */
  vote_count?: 0;
};

export type Memory = {
  id: string;
  service_id: string;
  author_name: string;
  content: string;
  created_at: string;
};

export type MemoryInsert = {
  service_id: string;
  author_name: string;
  content: string;
};

export type Vote = {
  id: string;
  service_id: string;
  fingerprint: string;
  created_at: string;
};

export type VoteRpcArgs = {
  p_slug: string;
  p_fingerprint: string;
};

export type VoteRpcResult = {
  success: boolean;
  vote_count: number;
};

/**
 * supabase-js Database 인터페이스 — RPC/테이블 호출 시 타입 안전성 제공.
 * supabase-js v2는 Tables/Views/Functions/Enums/CompositeTypes 와
 * 각 테이블의 Relationships 필드까지 모두 정의되어야 정상 추론된다.
 */
export type Database = {
  public: {
    Tables: {
      services: {
        Row: Service;
        Insert: ServiceInsert;
        Update: Partial<ServiceInsert>;
        Relationships: [];
      };
      memories: {
        Row: Memory;
        Insert: MemoryInsert;
        Update: Partial<MemoryInsert>;
        Relationships: [
          {
            foreignKeyName: "memories_service_id_fkey";
            columns: ["service_id"];
            isOneToOne: false;
            referencedRelation: "services";
            referencedColumns: ["id"];
          }
        ];
      };
      votes: {
        Row: Vote;
        Insert: { service_id: string; fingerprint: string };
        Update: never;
        Relationships: [
          {
            foreignKeyName: "votes_service_id_fkey";
            columns: ["service_id"];
            isOneToOne: false;
            referencedRelation: "services";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: {
      vote_for_service: {
        Args: VoteRpcArgs;
        Returns: VoteRpcResult[];
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
