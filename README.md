# 起動方法

## 設定

1. [.env.example](file:///Users/atobeyugo/Projects/airion/expo_demo_202402/sagasu/.env.example#1%2C1-1%2C1)をコピーして[.env](file:///Users/atobeyugo/Projects/airion/expo_demo_202402/sagasu/.env#1%2C1-1%2C1)ファイルを作成します。
   ```bash
   cp .env.example .env
   ```

2. 新しく作成した`.env`ファイルに`OPENAI_KEY`を設定します。

3. `NEXT_PUBLIC_SUPABASE_ANON_KEY`と`SUPABASE_SERVICE_ROLE_KEY`を設定します。
   > 注意: キーを取得するためにはSupabaseを実行する必要があります。

## Supabaseの起動

Dockerがローカルにインストールされ、実行されていることを確認してください。その後、以下のコマンドを実行します。

```bash
supabase start
```

`NEXT_PUBLIC_SUPABASE_ANON_KEY`と`SUPABASE_SERVICE_ROLE_KEY`を取得するには、以下のコマンドを実行します。

```bash
supabase status
```

## Next.jsアプリケーションの起動

新しいターミナルウィンドウで、以下のコマンドを実行します。

```bash
pnpm dev
```

## カスタム.mdxドキュメントの使用

1. デフォルトでは、ドキュメントは`.mdx`形式である必要があります。既存の（または互換性のある）マークダウン`.md`ファイルの名前を変更することで実現できます。

2. `pnpm run embeddings`を実行して、埋め込みを再生成します。
   > 注意: Supabaseが実行されていることを確認してください。確認するには、`supabase status`を実行します。実行されていない場合は、`supabase start`を実行してください。

3. `pnpm dev`を再度実行して、NextJSのlocalhost:3000でレンダリングされたページを更新します。
