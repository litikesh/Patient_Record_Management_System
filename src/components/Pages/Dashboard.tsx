import { Activity, Database, ScrollText, UserPlus, Users } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const Dashboard: React.FC = () => {
  return (
    <div className="mx-auto space-y-4">
      <section className="bg-white rounded-lg">
        <div className="p-6 md:p-8 border-b border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600 text-base">
            Welcome to the Patient Registration System. Register new patients
            and manage their records seamlessly.
          </p>
        </div>

        <div className="p-6 sm:p-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              to="/records"
              className="flex flex-col items-center p-6 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition"
            >
              <Users className="w-10 h-10 text-blue-600 mb-3" />
              <h3 className="text-lg font-medium text-gray-900">
                View Patient Records
              </h3>
              <p className="mt-1 text-sm text-gray-500 text-center">
                Browse and manage all patient records
              </p>
            </Link>

            <Link
              to="/patients"
              className="flex flex-col items-center p-6 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition"
            >
              <UserPlus className="w-10 h-10 text-green-600 mb-3" />
              <h3 className="text-lg font-medium text-gray-900">
                Add New Patient
              </h3>
              <p className="mt-1 text-sm text-gray-500 text-center">
                Register a new patient with the form
              </p>
            </Link>

            <Link
              to="/sql-interface"
              className="flex flex-col items-center p-6 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition"
            >
              <Database className="w-10 h-10 text-purple-600 mb-3" />
              <h3 className="text-lg font-medium text-gray-900">
                SQL Interface
              </h3>
              <p className="mt-1 text-sm text-gray-500 text-center">
                Run custom queries using raw SQL
              </p>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-white rounded-lg p-6 sm:p-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          What This App Does
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-start">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-100 text-blue-600">
              <Activity className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">
                Real-time Data Sync
              </h3>
              <p className="mt-2 text-gray-600 text-sm">
                Changes in one tab are instantly reflected across all tabs for a
                seamless experience.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-100 text-green-600">
              <UserPlus className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">
                Patient Registration
              </h3>
              <p className="mt-2 text-gray-600 text-sm">
                Use a simple form to add new patients to your local database
                quickly and efficiently.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-purple-100 text-purple-600">
              <ScrollText className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">
                Raw SQL Queries
              </h3>
              <p className="mt-2 text-gray-600 text-sm">
                Interact with your patient database directly using a built-in
                SQL editor powered by Pglite.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-red-100 text-red-600">
              <Database className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-gray-900">
                Persistent Storage
              </h3>
              <p className="mt-2 text-gray-600 text-sm">
                Data is saved locally using Pglite, ensuring persistence across
                sessions and reloads.
              </p>
            </div>
          </div>
        </div>
      </section>
      <footer className="text-center text-sm text-gray-600 mt-8">
        Created by&nbsp;
        <a href="https://github.com/rajesh-ranjan" className="hover:underline">
          Litikesh V
        </a>
      </footer>
    </div>
  );
};

export default Dashboard;
