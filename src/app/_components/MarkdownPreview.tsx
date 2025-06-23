import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownPreviewProps {
  content: string;
}

const MarkdownPreview: React.FC<MarkdownPreviewProps> = ({ content }) => (
  <ReactMarkdown
    remarkPlugins={[remarkGfm]}
    components={{
      h1: ({node, ...props}) => <h1 className="text-2xl font-bold mt-4 mb-2" {...props} />,
      h2: ({node, ...props}) => <h2 className="text-xl font-semibold mt-3 mb-2" {...props} />,
      h3: ({node, ...props}) => <h3 className="text-lg font-semibold mt-3 mb-2" {...props} />,
      p: ({node, ...props}) => <p className="mb-2" {...props} />,
      ul: ({node, ...props}) => <ul className="list-disc ml-6 mb-2" {...props} />,
      ol: ({node, ...props}) => <ol className="list-decimal ml-6 mb-2" {...props} />,
      li: ({node, ...props}) => <li className="mb-1" {...props} />,
      code: ({node, ...props}) => <code className="bg-gray-200 rounded px-1 py-0.5 text-xs" {...props} />,
      pre: ({node, ...props}) => <pre className="bg-gray-100 rounded p-2 mb-2 overflow-x-auto" {...props} />,
      blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-2" {...props} />,
      a: ({node, ...props}) => <a className="text-blue-600 underline" target="_blank" rel="noopener noreferrer" {...props} />,
    }}
  >
    {content || "Nothing to preview yet."}
  </ReactMarkdown>
);

export default MarkdownPreview; 