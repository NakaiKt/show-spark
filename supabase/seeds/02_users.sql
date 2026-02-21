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
            'https://www.istockphoto.com/illustrations/user-avatar-icon',
            'light',
            false,
            'Asia/Tokyo',
            NOW(),
            NOW()
        ),
        (
            '22222222-2222-2222-2222-222222222222'::uuid,
            '佐藤花子',
            'https://www.istockphoto.com/illustrations/user-avatar-icon',
            'dark',
            true,
            'Asia/Tokyo',
            NOW(),
            NOW()
        ),
        (
            '33333333-3333-3333-3333-333333333333'::uuid,
            '鈴木一郎',
            'https://www.istockphoto.com/illustrations/user-avatar-icon',
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
