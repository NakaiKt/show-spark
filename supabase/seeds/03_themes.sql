INSERT INTO public.themes (
    name,
    name_jp,
    created_at,
    updated_at
) VALUES (
    'light',
    'ライト',
    NOW(),
    NOW()
), (
    'dark',
    'ダーク',
    NOW(),
    NOW()
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    name_jp = EXCLUDED.name_jp,
    updated_at = NOW();