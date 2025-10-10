import { useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownRendererProps {
  children: string
}

// Utility to inject line breaks before markdown tokens in a single-line string
function formatMarkdown(raw: string): string {
  return (
    raw
      // Ensure headings start on new lines
      .replace(/(#{1,6})\s*/g, '\n\n$1 ')
      // Ensure list items (starting with - or numbered) start on new lines
      .replace(/(^|-\s+)/gm, (match: string) =>
        match.trim() === '-' ? '\n- ' : match
      )
      .replace(/(^|\s)(\d+)\.\s+/gm, (match: string) => '\n' + match.trim())
      // Ensure blockquotes
      .replace(/(^>\s+)/gm, '\n> ')
      // Ensure HTML lists start on new lines
      .replace(/(<ul>|<ol>)/g, '\n$1')
      .replace(/(<\/ul>|<\/ol>)/g, '$1\n')
      .replace(/(<li>)/g, '\n$1')
      .replace(/(<\/li>)/g, '$1\n')
      // Ensure other HTML elements start on new lines
      .replace(/(<div>|<p>|<blockquote>|<pre>|<code>)/g, '\n$1')
      .replace(/(<\/div>|<\/p>|<\/blockquote>|<\/pre>|<\/code>)/g, '$1\n')
      // Collapse multiple newlines
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  )
}

export default function MarkdownRenderer({ children }: MarkdownRendererProps) {
  // Format incoming markdown string on each render
  const formatted = useMemo(() => formatMarkdown(children), [children])

  return (
    <article className='prose max-w-none'>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className='mb-3 mt-4 text-xl font-bold'>{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className='mb-3 mt-4 text-xl font-bold'>{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className='mb-3 mt-4 text-xl font-bold'>{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className='mb-1 mt-1 text-sm font-bold'>{children}</h4>
          ),
          h5: ({ children }) => (
            <h5 className='mb-1 mt-1 text-sm font-bold'>{children}</h5>
          ),
          h6: ({ children }) => (
            <h6 className='mb-1 mt-1 text-sm font-bold'>{children}</h6>
          ),
          ul: ({ children }) => (
            <ul className='mb-4 mt-4 list-disc pl-6'>{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className='mb-4 mt-4 list-decimal pl-6'>{children}</ol>
          ),
          li: ({ children }) => <li className='mb-1'>{children}</li>,
          p: ({ children }) => (
            <p className='mb-3 leading-relaxed'>{children}</p>
          ),
          blockquote: ({ children }) => (
            <blockquote className='mb-4 border-l-4 border-gray-300 pl-4 italic'>
              {children}
            </blockquote>
          ),
          code: ({ children, className }) => {
            const isInline = !className
            return isInline ? (
              <code className='rounded bg-gray-100 px-1 py-0.5 text-sm dark:bg-gray-800'>
                {children}
              </code>
            ) : (
              <code className='block rounded bg-gray-100 p-4 text-sm dark:bg-gray-800'>
                {children}
              </code>
            )
          },
          pre: ({ children }) => (
            <pre className='mb-4 overflow-x-auto rounded bg-gray-100 p-4 dark:bg-gray-800'>
              {children}
            </pre>
          ),
        }}
      >
        {formatted}
      </ReactMarkdown>
    </article>
  )
}
