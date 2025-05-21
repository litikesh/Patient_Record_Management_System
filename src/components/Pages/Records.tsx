import React, { useCallback, useEffect, useState } from "react";
import type { MedicalRecord, PatientData } from "../common/type";
import { useNavigate } from "react-router-dom";
import { useDatabaseContext } from "../Context/DatabaseContext";
import {
  executeQuery,
  getAllPatients,
  searchPatientsByName,
} from "../Services/DBServices";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Calendar,
  ChevronRight,
  PlusCircle,
  Search,
  UserRound,
  X,
} from "lucide-react";

const Records: React.FC = () => {
  const [patients, setPatients] = useState<PatientData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPatient, setSelectedPatient] = useState<PatientData | null>(
    null
  );
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [loadingRecords, setLoadingRecords] = useState(false);

  const navigate = useNavigate();
  const {
    isInitialized,
    isLoading: dbLoading,
    error: dbError,
    lastSyncAction,
  } = useDatabaseContext();

  const loadPatients = useCallback(async () => {
    if (!isInitialized) return;

    setLoading(true);
    try {
      let result;

      if (searchTerm.trim()) {
        result = await searchPatientsByName(searchTerm);
        setPatients(result);
      } else {
        result = await getAllPatients();
        setPatients(result || []);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const errorMsg = err?.message || "An unknown error occurred";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [isInitialized, searchTerm]);

  const loadPatientRecords = useCallback(
    async (patientId: number) => {
      if (!patientId || !isInitialized) return;

      setLoadingRecords(true);
      try {
        const query = `
          SELECT * FROM medical_records 
          WHERE patient_id = $1
          ORDER BY created_at DESC
        `;

        const params: number[] = [patientId];

        const result = await executeQuery(query, params);

        if (result.success) {
          setMedicalRecords((result.data as MedicalRecord[]) || []);
        } else {
          console.error("Failed to load medical records:", result.error);
          toast.error("Failed to load medical records");
        }
      } catch (err) {
        console.error("Error loading medical records:", err);
        toast.error("Error loading medical records");
      } finally {
        setLoadingRecords(false);
      }
    },
    [isInitialized]
  );

  useEffect(() => {
    if (isInitialized) {
      loadPatients();
    }
  }, [isInitialized, loadPatients]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isInitialized) {
        loadPatients();
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, isInitialized, loadPatients]);

  useEffect(() => {
    if (!lastSyncAction) return;

    if (
      lastSyncAction.type === "PATIENT_ADDED" ||
      lastSyncAction.type === "PATIENT_UPDATED"
    ) {
      loadPatients();
    }

    if (
      lastSyncAction.type === "MEDICAL_RECORD_ADDED" &&
      selectedPatient &&
      lastSyncAction.payload.patient_id === selectedPatient.id
    ) {
      loadPatientRecords(selectedPatient.id as number);
    }
  }, [lastSyncAction, loadPatients, loadPatientRecords, selectedPatient]);

  const handlePatientSelect = useCallback(
    (patient: PatientData) => {
      setSelectedPatient(patient);
      if (typeof patient.id === "number") {
        loadPatientRecords(patient.id);
      }
    },
    [loadPatientRecords]
  );

  const handleAddPatient = () => {
    navigate("/patients");
  };

  const calculateBMI = (height?: number, weight?: number): string => {
    if (!height || !weight) return "N/A";

    const heightInM = height / 100;
    if (isNaN(heightInM) || heightInM <= 0) return "N/A";

    const bmi = (weight / (heightInM * heightInM)).toFixed(1);
    return bmi;
  };

  const getBMIStatus = (bmi: string) => {
    if (bmi === "N/A") return { text: "N/A", color: "text-gray-500" };

    const bmiValue = parseFloat(bmi);
    if (bmiValue < 18.5) return { text: "Underweight", color: "text-blue-500" };
    if (bmiValue < 25) return { text: "Normal", color: "text-green-500" };
    if (bmiValue < 30) return { text: "Overweight", color: "text-yellow-500" };
    return { text: "Obese", color: "text-red-500" };
  };

  const handleBackToList = () => {
    setSelectedPatient(null);
    setMedicalRecords([]);
  };

  if (dbLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (dbError) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-xl font-bold text-red-700 mb-2">Database Error</h2>
        <p className="text-red-600">{dbError}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
        >
          Reload Page
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto">
      {selectedPatient ? (
        <div className="mx-auto">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={handleBackToList}
              className="flex items-center cursor-pointer gap-2 text-gray-900 hover:text-gray-600 transition"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Patient List</span>
            </button>
          </div>

          <div className="bg-white  rounded-lg overflow-hidden mb-6 border border-gray-200">
            <div className="bg-gradient-to-r from-gray-600 to-gray-800 px-6 py-4">
              <h3 className="text-xl font-semibold text-white">
                Patient Summary
              </h3>
            </div>

            <div className="p-6">
              <div className="flex flex-col md:flex-row justify-between">
                <div className="mb-4 md:mb-0">
                  <h2 className="text-2xl font-bold capitalize text-gray-800">
                    {selectedPatient.first_name} {selectedPatient.last_name}
                  </h2>
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-600">
                    <div>Phone: {selectedPatient.phone}</div>
                    <div className="flex items-center gap-2">
                      <Calendar className="text-blue-500 w-4 h-4" />
                      <span>
                        DOB:{" "}
                        {new Date(
                          selectedPatient.date_of_birth
                        ).toLocaleDateString()}
                      </span>
                    </div>

                    <div>Email: {selectedPatient.email}</div>
                    <div>Gender: {selectedPatient.gender}</div>

                    <div>Blood Group: {selectedPatient.blood_group}</div>

                    <div>Address: {selectedPatient.address}</div>
                  </div>
                </div>

                <div className="md:flex items-start hidden">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <UserRound className="text-gray-600 w-10 h-10" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-5 border-l-4 border-blue-500">
              <h4 className="text-gray-500 text-sm font-medium uppercase">
                Height
              </h4>
              <p className="text-2xl font-bold mt-2 text-gray-800">
                {selectedPatient.height || "N/A"}
                <span className="text-sm ml-1 font-normal text-gray-500">
                  cm
                </span>
              </p>
            </div>

            <div className="bg-white rounded-lg  p-5 border-l-4 border-green-500">
              <h4 className="text-gray-500 text-sm font-medium uppercase">
                Weight
              </h4>
              <p className="text-2xl font-bold mt-2 text-gray-800">
                {selectedPatient.weight || "N/A"}
                <span className="text-sm ml-1 font-normal text-gray-500">
                  kg
                </span>
              </p>
            </div>

            <div className="bg-white rounded-lg  p-5 border-l-4 border-purple-500">
              <h4 className="text-gray-500 text-sm font-medium uppercase">
                Blood Pressure
              </h4>
              <p className="text-2xl font-bold mt-2 text-gray-800">
                {selectedPatient.blood_pressure || "N/A"}
              </p>
            </div>

            <div className="bg-white rounded-lg  p-5 border-l-4 border-amber-500">
              <h4 className="text-gray-500 text-sm font-medium uppercase">
                BMI
              </h4>
              {(() => {
                const bmi = calculateBMI(
                  selectedPatient.height,
                  selectedPatient.weight
                );
                const status = getBMIStatus(bmi);
                return (
                  <>
                    <p className="text-2xl item-center justify-center mt-2 text-gray-800">
                      <span className="font-bold">{bmi}</span>{" "}
                      <span className={`text-sm  ${status.color}`}>
                        ({status.text})
                      </span>
                    </p>
                  </>
                );
              })()}
            </div>
          </div>

          <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-800">
                Medical History
              </h3>
            </div>

            {loadingRecords ? (
              <div className="flex justify-center items-center py-16">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600"></div>
              </div>
            ) : medicalRecords.length === 0 ? (
              <div className="text-center py-12 px-6">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Calendar  className="text-gray-400 w-6 h-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  No records found
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  This patient doesn't have any medical records yet.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Insurance Provider
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Insurance ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Notes
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {medicalRecords.map((record) => (
                      <tr key={record.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                            <span className="text-sm text-gray-900 font-medium">
                              {new Date(record.created_at).toLocaleDateString()}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.insurance_provider || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {record.insurance_id || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                          {record.medical_notes || "No notes available"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-0 mb-6 md:mb-8">
            <div className="text-left">
              <h1 className="text-3xl font-bold text-slate-900">
                Medical Records
              </h1>
              <p className="text-sm text-slate-600 mt-2">
                View and manage patient medical records
              </p>
            </div>

            <button
              onClick={handleAddPatient}
              className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white py-2 px-4 rounded-lg transition"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Add New Patient</span>
            </button>
          </div>

          <div className="bg-white rounded-lg p-4 mb-6 border border-gray-200">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 transition duration-150 ease-in-out sm:text-sm"
                placeholder="Search patients by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-800">Patient List</h3>
            </div>
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-600"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8 px-6">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
                  <X className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-red-900 mb-2">
                  Error Loading Patients
                </h3>
                <p className="text-red-500">{error}</p>
              </div>
            ) : patients.length === 0 ? (
              <div className="text-center py-12 px-6">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <UserRound className="text-gray-400 w-6 h-6" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-1">
                  {searchTerm
                    ? "No patients match your search"
                    : "No patients found"}
                </h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  {searchTerm
                    ? `We couldn't find any patients matching "${searchTerm}"`
                    : "Start by adding a new patient to the system"}
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200">
                {patients.map((patient) => (
                  <li
                    key={patient.id}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handlePatientSelect(patient)}
                  >
                    <div className="px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="bg-gray-100 rounded-full p-2 mr-4">
                          <UserRound className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {patient.first_name} {patient.last_name}
                          </h4>
                          <div className="text-sm text-gray-500 mt-1">
                            <div>{patient.email}</div>
                            <div className="mt-1">
                              Date of Birth:{" "}
                              {new Date(
                                patient.date_of_birth
                              ).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Records;
