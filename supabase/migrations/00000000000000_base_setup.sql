-- 共通のupdated_at更新関数
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 各テーブルに updated_at トリガーを設定するヘルパー関数
-- 使い方: SELECT setup_updated_at_trigger('テーブル名');
CREATE OR REPLACE FUNCTION public.setup_updated_at_trigger(target_table TEXT)
RETURNS VOID AS $$
BEGIN
    EXECUTE format(
        'CREATE TRIGGER set_updated_at
         BEFORE UPDATE ON public.%I
         FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()',
        target_table
    );
END;
$$ LANGUAGE plpgsql;