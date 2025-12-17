    -- テスト用ユーザーデータ
    -- 注意: auth.users と public.users の両方にデータを挿入する必要があります

    -- auth.users にテストユーザーを挿入（Supabase Auth の内部テーブル）
    -- 実際の運用では Supabase Auth を通じてユーザーを作成しますが、
    -- 開発・テスト用として seed.sql で直接挿入します

    -- ユーザー1: 田中太郎
    INSERT INTO auth.users (
        id,
        instance_id,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    ) VALUES (
        '11111111-1111-1111-1111-111111111111'::uuid,
        '00000000-0000-0000-0000-000000000000'::uuid,
        'tanaka@example.com',
        crypt('password', gen_salt('bf')),
        NOW(),
        '{"provider": "email", "providers": ["email"]}',
        '{"name": "田中太郎", "avatar_url": "https://i.pravatar.cc/150?img=1"}',
        NOW(),
        NOW(),
        '',
        '',
        '',
        ''
    ) ON CONFLICT (id) DO NOTHING;

    -- ユーザー2: 佐藤花子
    INSERT INTO auth.users (
        id,
        instance_id,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    ) VALUES (
        '22222222-2222-2222-2222-222222222222'::uuid,
        '00000000-0000-0000-0000-000000000000'::uuid,
        'sato@example.com',
        crypt('password', gen_salt('bf')),
        NOW(),
        '{"provider": "email", "providers": ["email"]}',
        '{"name": "佐藤花子", "avatar_url": "https://i.pravatar.cc/150?img=2"}',
        NOW(),
        NOW(),
        '',
        '',
        '',
        ''
    ) ON CONFLICT (id) DO NOTHING;

    -- ユーザー3: 鈴木一郎
    INSERT INTO auth.users (
        id,
        instance_id,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        confirmation_token,
        email_change,
        email_change_token_new,
        recovery_token
    ) VALUES (
        '33333333-3333-3333-3333-333333333333'::uuid,
        '00000000-0000-0000-0000-000000000000'::uuid,
        'suzuki@example.com',
        crypt('password', gen_salt('bf')),
        NOW(),
        '{"provider": "email", "providers": ["email"]}',
        '{"name": "鈴木一郎", "avatar_url": "https://i.pravatar.cc/150?img=3"}',
        NOW(),
        NOW(),
        '',
        '',
        '',
        ''
    ) ON CONFLICT (id) DO NOTHING;

    -- public.users にプロフィールデータを挿入
    -- 注意: handle_new_user トリガーが動作する場合、重複エラーになる可能性があるため
    -- ON CONFLICT で処理します

    INSERT INTO public.users (
        id,
        name,
        avatar_url,
        theme,
        display_user_info,
        timezone,
        created_at,
        updated_at
    ) VALUES
        (
            '11111111-1111-1111-1111-111111111111'::uuid,
            '田中太郎',
            'https://i.pravatar.cc/150?img=1',
            'light',
            false,
            'Asia/Tokyo',
            NOW(),
            NOW()
        ),
        (
            '22222222-2222-2222-2222-222222222222'::uuid,
            '佐藤花子',
            'https://i.pravatar.cc/150?img=2',
            'dark',
            true,
            'Asia/Tokyo',
            NOW(),
            NOW()
        ),
        (
            '33333333-3333-3333-3333-333333333333'::uuid,
            '鈴木一郎',
            'https://i.pravatar.cc/150?img=3',
            'system',
            false,
            'Asia/Tokyo',
            NOW(),
            NOW()
        )
    ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        avatar_url = EXCLUDED.avatar_url,
        theme = EXCLUDED.theme,
        display_user_info = EXCLUDED.display_user_info,
        timezone = EXCLUDED.timezone,
        updated_at = NOW();
