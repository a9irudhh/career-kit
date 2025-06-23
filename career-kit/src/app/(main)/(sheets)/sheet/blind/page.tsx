import React from 'react';
import { questions } from '../../blind';

const tagColors: Record<string, string> = {
  Array: "bg-cyan-100",
  "Hash Table": "bg-orange-100",
  "Dynamic Programming": "bg-purple-100",
  "Prefix Sum": "bg-green-100",
  "Divide and Conquer": "bg-pink-100",
};

const SheetPage = () => {
  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-center mb-8 text-2xl font-bold">LeetCode Blind 75 Coding Sheet</h1>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-3 px-4 text-left border-b-2 border-gray-200">#</th>
            <th className="py-3 px-4 text-left border-b-2 border-gray-200">Question</th>
            <th className="py-3 px-4 text-left border-b-2 border-gray-200">Tags</th>
            <th className="py-3 px-4 text-left border-b-2 border-gray-200">Difficulty</th>
          </tr>
        </thead>
        <tbody>
          {questions.map((q, idx) => (
            <tr key={q.title} className="border-b border-gray-100">
              <td className="py-3 px-4">{idx + 1}</td>
              <td className="py-3 px-4">
                <a
                  href={q.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 font-medium hover:underline"
                >
                  {q.title}
                </a>
              </td>
              <td className="py-3 px-4">
                {q.tags?.map((tag: string) => (
                  <span
                    key={tag}
                    className={`inline-block px-2 py-1 mr-2 mb-1 rounded text-xs font-semibold ${tagColors[tag] || "bg-gray-200"}`}
                  >
                    {tag}
                  </span>
                ))}
              </td>
              <td className="py-3 px-4">
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    q.difficulty === "Easy"
                      ? "bg-green-100 text-green-700"
                      : q.difficulty === "Medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {q.difficulty}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-8 text-center text-gray-500">
        <small>
          Inspired by Blind 75. Practice regularly for best results!
        </small>
      </div>
    </div>
  );
};

export default SheetPage;