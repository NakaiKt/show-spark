CREATE TABLE public.themes (
    id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    name_jp TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

SELECT setup_updated_at_trigger('themes');

ALTER TABLE public.themes ENABLE ROW LEVEL SECURITY;
-- ポリシー: 認証済みユーザーは参照のみ可
CREATE POLICY "Authenticated users can view themes"
    ON public.themes FOR SELECT
    USING (auth.uid() IS NOT NULL);