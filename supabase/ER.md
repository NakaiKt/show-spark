# 前提

基本的にNotNull, 必須
defaultはdと省略

# ER図

```mermaid
erDiagram
    Users ||--o{ UserSeasonLinks : ""
    Users ||--o{ Seasons: ""
    UserSeasonLinks ||--|| Seasons: ""
    Seasons ||--o{ Contents: ""

    Users {
        uuid id PK
        string name
        string avatar_url "supabaseのstrage url"
        string theme "light | dark | system, d=system"
        boolean display_user_info "d = false"
        string timezone "d = Asia/Tokyo"
        timestamp created_at
        timestamp updated_at
    }
    Seasons {
        uuid id PK
        string title
        uuid owner_id FK
        timestamp created_at
        timestamp updated_at
    }
    UserSeasonLinks {
        uuid id PK
        uuid user_id FK
        uuid season_id FK
    }
    Contents {
        uuid id PK
        uuid season_id FK
        string title
        string thumbnail_url "supabaseのstrage url"
        string description
        string memo
        string broadcaster
        integer bloadcast_day_of_week_id
    }
```
