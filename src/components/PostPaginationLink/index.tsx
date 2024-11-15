import React from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { BlogPost } from "../../types/BlogTypes";

interface PostPaginationLinkProps {
  post: BlogPost;
  direction: "prev" | "next";
}

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + "...";
};

const PostPaginationLink: React.FC<PostPaginationLinkProps> = ({
  post,
  direction,
}) => (
  <a
    href={post.url}
    className={`flex items-center p-4 border rounded-lg hover:bg-gray-100 transition-colors w-full group no-underline ${
      direction === "prev" ? "flex-row" : "flex-row-reverse"
    }`}
  >
    <div className={`flex-shrink-0 ${direction === "prev" ? "mr-4" : "ml-4"}`}>
      {direction === "prev" ? (
        <ArrowLeft className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition-colors" />
      ) : (
        <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-blue-600 transition-colors" />
      )}
    </div>
    <div
      className={`flex flex-col ${direction === "prev" ? "items-start" : "items-end"}`}
    >
      <span className="text-sm text-gray-500 mb-1">
        {direction === "prev" ? "Previous Post" : "Next Post"}
      </span>
      <span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
        {truncateText(post.data.title, 50)}
      </span>
    </div>
  </a>
);

export default PostPaginationLink;
