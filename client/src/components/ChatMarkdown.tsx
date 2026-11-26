import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const ChatMarkdown = ({ content }: { content: string }) => (
  <div className="max-w-[80%] min-w-0 rounded-2xl rounded-tl-sm bg-gray-100 dark:bg-gray-800 px-4 py-2.5 text-sm leading-6 text-gray-800 dark:text-gray-200 break-words [&_p]:my-2 first:[&_p]:mt-0 last:[&_p]:mb-0 [&_h1]:mt-4 [&_h1]:mb-2 [&_h1]:text-lg [&_h1]:font-bold [&_h2]:mt-4 [&_h2]:mb-2 [&_h2]:text-base [&_h2]:font-bold [&_h3]:mt-3 [&_h3]:mb-1 [&_h3]:font-semibold [&_ul]:my-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_li]:my-1 [&_strong]:font-semibold [&_a]:text-purple-700 [&_a]:underline dark:[&_a]:text-purple-300 [&_blockquote]:my-2 [&_blockquote]:border-l-2 [&_blockquote]:border-purple-400 [&_blockquote]:pl-3 [&_blockquote]:text-gray-600 dark:[&_blockquote]:text-gray-300 [&_table]:my-3 [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-gray-300 [&_th]:bg-gray-200 [&_th]:px-2 [&_th]:py-1 [&_th]:text-left dark:[&_th]:border-gray-600 dark:[&_th]:bg-gray-700 [&_td]:border [&_td]:border-gray-300 [&_td]:px-2 [&_td]:py-1 dark:[&_td]:border-gray-600 [&_pre]:my-2 [&_pre]:overflow-x-auto [&_pre]:rounded-lg [&_pre]:bg-gray-200 [&_pre]:p-3 dark:[&_pre]:bg-gray-900 [&_code]:rounded [&_code]:bg-gray-200 [&_code]:px-1 [&_code]:py-0.5 dark:[&_code]:bg-gray-900">
    <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
  </div>
);

export default ChatMarkdown;
