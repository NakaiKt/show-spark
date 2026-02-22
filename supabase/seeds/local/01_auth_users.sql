
    -- auth.users にテストユーザーを挿入（Supabase Auth の内部テーブル）
    -- 実際の運用では Supabase Auth を通じてユーザーを作成しますが、
    -- 開発・テスト用として seed.sql で直接挿入します

    -- ユーザー1: 田中太郎
    INSERT INTO auth.users (
        id,
        instance_id,
        aud,
        role,
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
        'authenticated',
        'authenticated',
        'katsh1618+showspark@gmail.com',
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
        aud,
        role,
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
        'authenticated',
        'authenticated',
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
        aud,
        role,
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
        'authenticated',
        'authenticated',
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

    -- auth.identities テーブルにも挿入（Supabase Auth v2で必要）
    -- signInWithOtp 等で既存ユーザーを認識するために必要

    -- ユーザー1の identity
    INSERT INTO auth.identities (
        id,
        provider_id,
        user_id,
        identity_data,
        provider,
        last_sign_in_at,
        created_at,
        updated_at
    ) VALUES (
        '11111111-1111-1111-1111-111111111111'::uuid,
        'katsh1618+showspark@gmail.com',
        '11111111-1111-1111-1111-111111111111'::uuid,
        '{"sub": "11111111-1111-1111-1111-111111111111", "email": "katsh1618+showspark@gmail.com", "email_verified": true}',
        'email',
        NOW(),
        NOW(),
        NOW()
    ) ON CONFLICT (provider_id, provider) DO NOTHING;

    -- ユーザー2の identity
    INSERT INTO auth.identities (
        id,
        provider_id,
        user_id,
        identity_data,
        provider,
        last_sign_in_at,
        created_at,
        updated_at
    ) VALUES (
        '22222222-2222-2222-2222-222222222222'::uuid,
        'sato@example.com',
        '22222222-2222-2222-2222-222222222222'::uuid,
        '{"sub": "22222222-2222-2222-2222-222222222222", "email": "sato@example.com", "email_verified": true}',
        'email',
        NOW(),
        NOW(),
        NOW()
    ) ON CONFLICT (provider_id, provider) DO NOTHING;

    -- ユーザー3の identity
    INSERT INTO auth.identities (
        id,
        provider_id,
        user_id,
        identity_data,
        provider,
        last_sign_in_at,
        created_at,
        updated_at
    ) VALUES (
        '33333333-3333-3333-3333-333333333333'::uuid,
        'suzuki@example.com',
        '33333333-3333-3333-3333-333333333333'::uuid,
        '{"sub": "33333333-3333-3333-3333-333333333333", "email": "suzuki@example.com", "email_verified": true}',
        'email',
        NOW(),
        NOW(),
        NOW()
    ) ON CONFLICT (provider_id, provider) DO NOTHING;
