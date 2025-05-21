import { ArrowRight, Download } from "lucide-react";
import React, { useState } from "react";
import { useDatabaseContext } from "../Context/DatabaseContext";
import { executeQuery } from "../Services/DBServices";

const SQLInterface: React.FC = () => {
  const [query, setQuery] = useState("SELECT * FROM patients LIMIT 10");
  const [isExecuting, setIsExecuting] = useState(false);
  type QueryResultRow = Record<string, string | number | boolean | null>;
  const [results, setResults] = useState<QueryResultRow[]>([]);
  const [error, setError] = useState("");
  const { isInitialized } = useDatabaseContext();

  const handleExecuteQuery = async () => {
    if (!isInitialized) {
      setError("Database is not initialized. Please wait or refresh the page.");
      return;
    }

    const trimmedQuery = query.trim().toUpperCase();
    if (!trimmedQuery.startsWith("SELECT")) {
      setError("Only SELECT queries are allowed for security reasons.");
      return;
    }

    setIsExecuting(true);
    setError("");

    try {
      const result = await executeQuery(query);

      if (result.success) {
        setResults((result.data as QueryResultRow[]) || []);
      } else {
        setError(result.error || "An unknown error occurred");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.message || "Failed to execute query");
    } finally {
      setIsExecuting(false);
    }
  };

  const handleDownloadResults = () => {
    if (results.length === 0) return;

    try {
      const headers = Object.keys(results[0]);

      let csvContent = headers.join(",") + "\n";

      results.forEach((row) => {
        const values = headers.map((header) => {
          const value = row[header];
          const formattedValue =
            value === null || value === undefined
              ? ""
              : typeof value === "string"
              ? `"${value.replace(/"/g, '""')}"`
              : String(value);
          return formattedValue;
        });
        csvContent += values.join(",") + "\n";
      });

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `query-results-${new Date().toISOString().slice(0, 10)}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Error generating CSV:", err);
      setError("Failed to generate CSV file");
    }
  };

  const renderResults = () => {
    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mt-4">
          <p className="font-medium">Error:</p>
          <p className="mt-1">{error}</p>
        </div>
      );
    }

    if (results.length === 0) {
      return null;
    }

    const headers = Object.keys(results[0]);

    return (
      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Results ({results.length} rows)
          </h3>
          <button
            onClick={handleDownloadResults}
            className="px-3 py-1 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition-colors flex items-center text-sm"
          >
            <Download className="w-4 h-4 mr-1" />
            Download CSV
          </button>
        </div>

        <div className="overflow-x-auto border border-gray-300 rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-200">
              <tr>
                {headers.map((header, index) => (
                  <th
                    key={index}
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {results.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className={rowIndex % 2 === 0 ? "bg-white" : "bg-gray-100"}
                >
                  {headers.map((header, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                    >
                      {row[header] !== null && row[header] !== undefined ? (
                        String(row[header])
                      ) : (
                        <span className="text-gray-500 italic">null</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className=" mx-auto">
      <div className="mb-6 md:mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          SQL Query Interface
        </h1>
        <p className="text-sm text-gray-700 mt-2">
          The SQL Query Interface allows you to execute SQL queries directly on
          the database.
        </p>
      </div>

      <div className="mb-6 bg-white p-6 border border-gray-200 rounded-lg">
        <p className="text-gray-700 mb-4">
          Note: Use this interface to run SQL queries against the patient
          database. Only SELECT queries are allowed for security reasons.
        </p>

        <div className="space-y-2">
          <label
            htmlFor="sql-query"
            className="block text-sm font-medium text-gray-900"
          >
            SQL Query
          </label>
          <div className="mt-1 relative rounded-md">
            <textarea
              id="sql-query"
              rows={5}
              className="block w-full rounded-md border-gray-300 bg-gray-50 focus:border-gray-800 focus:ring-gray-800 border p-3 font-mono text-sm text-gray-900"
              placeholder="SELECT * FROM patients LIMIT 10"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            ></textarea>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={handleExecuteQuery}
            disabled={isExecuting}
            className="px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2 transition-colors flex items-center disabled:bg-gray-400"
          >
            {isExecuting ? (
              <>
                <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                <span>Executing...</span>
              </>
            ) : (
              <>
                <ArrowRight className="w-5 h-5 mr-1" />
                <span>Execute Query</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="bg-white p-6 border border-gray-200 rounded-lg">
        {renderResults()}
        {!error && results.length === 0 && (
          <div className="text-center text-gray-600 py-12">
            <p>Execute a query to see results here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SQLInterface;
