import * as React from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useCompletion } from 'ai/react'
import { X, Loader, User, Frown, CornerDownLeft, Search, Wand } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'




export function SearchResult() {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState<string>('')

  const { complete, completion, isLoading, error } = useCompletion({
    api: '/api/vector-search',
  })

  React.useEffect(() => {
    if (completion) {
      console.log("検索結果:", completion);
    }
  }, [completion]);

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    console.log(query)
    complete(query)
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 py-4 text-slate-700">
          
          <div className="flex justify-center">
            {/* {query && (
              <div className="flex gap-4">
                <span className="bg-slate-100 dark:bg-slate-300 p-2 w-8 h-8 rounded-full text-center flex items-center justify-center">
                  <User width={18} />{' '}
                </span>
                <p className="mt-0.5 font-semibold text-slate-700 dark:text-slate-100">{query}</p>
              </div>
            )} */}
            
            {error && (
              <div className="flex items-center gap-4">
                <span className="bg-red-100 p-2 w-8 h-8 rounded-full text-center flex items-center justify-center">
                  <Frown width={18} />
                </span>
                <span className="text-slate-700 dark:text-slate-100">
                  検索できませんでした。もう一度お願いします。
                </span>
              </div>
            )}

            <div className="relative w-full max-w-md">
                {/* <MicroscopeIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /> */}
                <Search width={15} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />

                <Input
                  className="pl-10 pr-4 py-2 w-full rounded-md shadow-sm border border-gray-300"
                  placeholder="Search..."
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}  
                />
                <Button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2">検索</Button>
            </div>
          </div>
          <div className="flex justify-center text-xs text-gray-500 dark:text-gray-100">
            {/* Or try:{' '} */}
            <button
              type="button"
              className="mx-1 px-1.5 py-0.5
              bg-slate-50 dark:bg-gray-500
              hover:bg-slate-100 dark:hover:bg-gray-600
              rounded border border-slate-200 dark:border-slate-600
              transition-colors"
              onClick={(_) => setQuery('What are embeddings?')}
            >
              What are embeddings?
            </button>
            <button
              type="button"
              className="mx-1 px-1.5 py-0.5
              bg-slate-50 dark:bg-gray-500
              hover:bg-slate-100 dark:hover:bg-gray-600
              rounded border border-slate-200 dark:border-slate-600
              transition-colors"
              onClick={(_) => setQuery('第1四半期売上報告書')}
            >
              第1四半期売上報告書
            </button>
            <button
              type="button"
              className="mx-1 px-1.5 py-0.5
              bg-slate-50 dark:bg-gray-500
              hover:bg-slate-100 dark:hover:bg-gray-600
              rounded border border-slate-200 dark:border-slate-600
              transition-colors"
              onClick={(_) => setQuery('Airion株式会社って何？')}
            >
              Airion株式会社って何？
            </button>
          </div>
          <div className="flex justify-center">
            {isLoading && (
              <div className="animate-spin relative flex w-5 h-5 ml-2">
                <Loader />
              </div>
            )}
          </div>
        </div>
      </form>
      <Dialog open={open}>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4 text-slate-700">
            {/* {query && (
              <div className="flex gap-4">
                <span className="bg-slate-100 dark:bg-slate-300 p-2 w-8 h-8 rounded-full text-center flex items-center justify-center">
                  <User width={18} />{' '}
                </span>
                <p className="mt-0.5 font-semibold text-slate-700 dark:text-slate-100">{query}</p>
              </div>
            )}

            {isLoading && (
              <div className="animate-spin relative flex w-5 h-5 ml-2">
                <Loader />
              </div>
            )}

            {error && (
              <div className="flex items-center gap-4">
                <span className="bg-red-100 p-2 w-8 h-8 rounded-full text-center flex items-center justify-center">
                  <Frown width={18} />
                </span>
                <span className="text-slate-700 dark:text-slate-100">
                  検索できませんでした。もう一度お願いします。
                </span>
              </div>
            )} */}

            {/* <div className="relative">
              <Input
                placeholder="Ask a question..."
                name="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="col-span-3"
              />
              <CornerDownLeft
                className={`absolute top-3 right-5 h-4 w-4 text-gray-300 transition-opacity ${
                  query ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-100">
              Or try:{' '}
              <button
                type="button"
                className="px-1.5 py-0.5
                bg-slate-50 dark:bg-gray-500
                hover:bg-slate-100 dark:hover:bg-gray-600
                rounded border border-slate-200 dark:border-slate-600
                transition-colors"
                onClick={(_) => setQuery('What are embeddings?')}
              >
                What are embeddings?
              </button>
            </div>
            <DialogFooter>
              <Button type="submit" className="bg-red-500">
                Ask
              </Button>
            </DialogFooter> */}

            {completion && !error ? (
              <div className="flex items-center gap-4 dark:text-white">
                {/* <span className="bg-green-500 p-2 w-8 h-8 rounded-full text-center flex items-center justify-center">
                  <Wand width={18} className="text-white" />
                </span>
                <h3 className="font-semibold">Answer:</h3> */}
                {completion}
              </div>
            ) : null}

          </div>
        </form>

      </Dialog>
      <div className="space-y-4">
        <div className="flex flex-col bg-white shadow rounded-lg p-4">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">/documents/strategy/2023_plan.docx</span>
            <span className="text-sm text-gray-600">更新日: 2023-04-01</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Word</span>
            <span className="text-xs text-gray-500">1.2MB</span>
          </div>
          <p className="text-gray-700 mt-2">
            
          2023年度の戦略計画案。市場分析、目標設定、アクションプランを含む。
          
          業界のトレンド予測、顧客ニーズの変化、技術革新の影響を考慮し、それに基づいた戦略的方向性を定めている。
          
          また、目標達成のためのキーパフォーマンス指標(KPI)とそれを達成するためのステップバイステップのプランが詳細に描かれており、組織全体での取り組みが促されている。

          </p>
        </div>
        <div className="flex flex-col bg-white shadow rounded-lg p-4">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">/sales/reports/Q1_sales.xlsx</span>
            <span className="text-sm text-gray-600">更新日: 2023-04-10</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Excel</span>
            <span className="text-xs text-gray-500">780KB</span>
          </div>
          <p className="text-gray-700 mt-2">
            
          第1四半期の売上報告書。製品別、地域別の売上データと分析。
          
          各製品の市場でのパフォーマンスと地域ごとの販売動向を明確にし、今後のマーケティング戦略や製品開発において重要な意思決定を支援する。
          
          また、売上の増減に影響を与えた要因の詳細な分析を通じて、改善点や新たな機会の特定に役立つ洞察が得られるようになっています。

          </p>
        </div>
        <div className="flex flex-col bg-white shadow rounded-lg p-4">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">/marketing/presentations/new_product.pptx</span>
            <span className="text-sm text-gray-600">更新日: 2023-03-20</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">PowerPoint</span>
            <span className="text-xs text-gray-500">2.4MB</span>
          </div>
          <p className="text-gray-700 mt-2">
            新製品のマーケティングプレゼンテーション。特徴、ターゲット市場、販売戦略。
            
            内容は、製品が解決しようとしている具体的な問題と、それをどのようにして解決するのか。
            
            また、競合との比較分析を通じて、製品の競争優位性を強調し、販売チャネルやプロモーション戦略の詳細を通じて、市場浸透のロードマップを提供している。

          </p>
        </div>
        <div className="flex flex-col bg-white shadow rounded-lg p-4">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">/hr/policies/remote_work_policy.pdf</span>
            <span className="text-sm text-gray-600">更新日: 2023-02-15</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">PDF</span>
            <span className="text-xs text-gray-500">500KB</span>
          </div>
          <p className="text-gray-700 mt-2">
            リモートワークポリシーの詳細。在宅勤務のガイドライン、システム要件、セキュリティポリシー。
            
            リモートワークが円滑に行われるようにするための基準を設定している。
            
            従業員が自宅で効率的かつ安全に仕事を進めることができるようにするためのガイドを提供しています。

          </p>
        </div>
      </div>
    </div>
  )
}

function MicroscopeIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 18h8" />
      <path d="M3 22h18" />
      <path d="M14 22a7 7 0 1 0 0-14h-1" />
      <path d="M9 14h2" />
      <path d="M9 12a2 2 0 0 1-2-2V6h6v4a2 2 0 0 1-2 2Z" />
      <path d="M12 6V3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3" />
    </svg>
  )
}
